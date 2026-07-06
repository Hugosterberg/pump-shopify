(function () {
  if (window.PumpCartDrawer) return;

  const config = window.PumpCart || {};
  const root = document.querySelector('[data-cart-drawer]');
  if (!root) return;

  const body = root.querySelector('[data-cart-drawer-body]');
  const footer = root.querySelector('[data-cart-drawer-footer]');
  const countLabel = root.querySelector('[data-cart-drawer-count]');
  const subtotalEl = root.querySelector('[data-cart-drawer-subtotal]');
  const shippingWrap = root.querySelector('[data-cart-drawer-shipping]');
  const liveRegion = root.querySelector('[data-cart-live-region]');
  const panel = root.querySelector('.cart-drawer__panel');
  const checkoutLink = root.querySelector('[data-cart-checkout]');

  let isOpen = false;
  let isBusy = false;

  function shopifyRoot() {
    if (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) {
      return window.Shopify.routes.root;
    }
    return '/';
  }

  function formatMoney(cents) {
    if (typeof Shopify !== 'undefined' && typeof Shopify.formatMoney === 'function') {
      return Shopify.formatMoney(cents, config.moneyFormat);
    }
    return (cents / 100).toFixed(0) + ' kr';
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function updateHeaderCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      if (count > 0) {
        el.hidden = false;
      } else {
        el.hidden = true;
      }
    });
  }

  function pulseCartIcon() {
    document.querySelectorAll('.site-header__cart').forEach(function (el) {
      el.classList.remove('is-updated');
      void el.offsetWidth;
      el.classList.add('is-updated');
    });
  }

  function announce(message) {
    if (liveRegion) liveRegion.textContent = message;
  }

  function renderShippingBar(cart) {
    if (!shippingWrap) return;
    const threshold = Number(config.freeShippingThreshold || 99900);
    if (threshold <= 0) {
      shippingWrap.innerHTML = '';
      return;
    }

    const remaining = threshold - cart.total_price;
    const progress = Math.min(100, Math.round((cart.total_price * 100) / threshold));

    if (remaining > 0) {
      shippingWrap.innerHTML =
        '<div class="cart-drawer__shipping" data-free-shipping-bar>' +
        '<p class="cart-drawer__shipping__text">Lägg till <strong>' +
        escapeHtml(formatMoney(remaining)) +
        '</strong> till för fri frakt</p>' +
        '<div class="cart-drawer__shipping__track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
        progress +
        '"><span class="cart-drawer__shipping__fill" style="width:' +
        progress +
        '%;"></span></div></div>';
    } else {
      shippingWrap.innerHTML =
        '<div class="cart-drawer__shipping" data-free-shipping-bar>' +
        '<p class="cart-drawer__shipping__text cart-drawer__shipping__text--complete">Du har uppnått fri frakt</p>' +
        '<div class="cart-drawer__shipping__track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">' +
        '<span class="cart-drawer__shipping__fill" style="width:100%;"></span></div></div>';
    }
  }

  function renderUpsell(cart) {
    const upsellWrap = root.querySelector('[data-cart-drawer-upsell]');
    if (!upsellWrap || !config.upsellProducts) return;

    const handles = cart.items.map(function (item) {
      return item.handle;
    });

    if (!handles.length || handles.indexOf('the-perfect-combo-portabel-dusch-vikbar-hink-1') !== -1) {
      upsellWrap.hidden = true;
      upsellWrap.innerHTML = '';
      return;
    }

    let product = null;
    let label = '';
    let badge = 'Rekommenderat';

    if (handles.indexOf('portabel-dusch') !== -1 && handles.indexOf('portabel-hink') !== -1) {
      product = config.upsellProducts.combo;
      label = 'Uppgradera till Perfect Combo';
      badge = 'Spara mer';
    } else if (handles.indexOf('portabel-dusch') !== -1) {
      product = config.upsellProducts.bucket;
      label = product.label;
      badge = product.badge || badge;
    } else if (handles.indexOf('portabel-hink') !== -1) {
      product = config.upsellProducts.shower;
      label = product.label;
      badge = product.badge || badge;
    } else {
      product = config.upsellProducts.combo;
      label = product.label;
      badge = product.badge || 'Bästsäljare';
    }

    if (!product || !product.variantId) {
      upsellWrap.hidden = true;
      upsellWrap.innerHTML = '';
      return;
    }

    const image = product.image
      ? '<a class="cart-upsell__image" href="/products/' +
        escapeHtml(product.handle) +
        '"><img src="' +
        escapeHtml(product.image) +
        '" alt="" loading="lazy" width="64" height="64"></a>'
      : '';

    const compare =
      product.compareAtPrice && product.compareAtPrice > product.price
        ? '<s class="cart-upsell__compare">' + escapeHtml(formatMoney(product.compareAtPrice)) + '</s>'
        : '';

    upsellWrap.hidden = false;
    upsellWrap.innerHTML =
      '<div class="cart-upsell__header"><span class="cart-upsell__spark" aria-hidden="true">✦</span>' +
      '<p class="cart-upsell__label">' +
      escapeHtml(label) +
      '</p></div>' +
      '<div class="cart-upsell__card">' +
      '<span class="cart-upsell__badge">' +
      escapeHtml(badge) +
      '</span>' +
      image +
      '<div class="cart-upsell__info">' +
      '<a class="cart-upsell__title" href="/products/' +
      escapeHtml(product.handle) +
      '">' +
      escapeHtml(product.title) +
      '</a>' +
      '<div class="cart-upsell__prices">' +
      compare +
      '<span class="cart-upsell__price">' +
      escapeHtml(formatMoney(product.price)) +
      '</span></div></div>' +
      '<button type="button" class="cart-upsell__add" data-cart-upsell-add data-variant-id="' +
      product.variantId +
      '" aria-label="Lägg till ' +
      escapeHtml(product.title) +
      '"><span aria-hidden="true">+</span> Lägg till</button></div>';
  }

  function renderCart(cart) {
    updateHeaderCount(cart.item_count);

    if (countLabel) {
      countLabel.textContent = '(' + cart.item_count + ')';
    }

    if (subtotalEl) {
      subtotalEl.textContent = formatMoney(cart.total_price);
    }

    if (footer) {
      footer.hidden = cart.item_count === 0;
    }

    renderShippingBar(cart);

    if (!body) return;

    if (!cart.items.length) {
      const featured = config.featuredProduct;
      let featuredHtml = '';
      if (featured && featured.handle) {
        const img = featured.image
          ? '<img src="' + escapeHtml(featured.image) + '" alt="" loading="lazy" width="64" height="64">'
          : '';
        featuredHtml =
          '<a class="cart-drawer__empty-featured" href="' +
          escapeHtml(featured.url || '/products/' + featured.handle) +
          '">' +
          img +
          '<span class="cart-drawer__empty-featured-info"><strong>' +
          escapeHtml(featured.title) +
          '</strong><span>' +
          escapeHtml(formatMoney(featured.price)) +
          '</span></span></a>';
      }

      body.innerHTML =
        '<div class="cart-drawer__empty" data-cart-drawer-empty>' +
        '<span class="cart-drawer__empty-icon" aria-hidden="true"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg></span>' +
        '<p class="cart-drawer__empty-title">' +
        escapeHtml(config.strings.empty) +
        '</p>' +
        '<p class="cart-drawer__empty-text">' +
        escapeHtml(config.strings.emptyText || '') +
        '</p>' +
        featuredHtml +
        '<a class="cart-drawer__continue" href="' +
        shopifyRoot() +
        'collections/all">' +
        escapeHtml(config.strings.continue) +
        '</a></div>';
      renderUpsell(cart);
      return;
    }

    const itemsHtml = cart.items
      .map(function (item, index) {
        const image = item.image
          ? '<img src="' + escapeHtml(item.image) + '" alt="" loading="lazy" width="72" height="72">'
          : '';
        const variant =
          item.variant_title && item.variant_title !== 'Default Title'
            ? '<p class="cart-drawer__variant">' + escapeHtml(item.variant_title) + '</p>'
            : '';

        return (
          '<li class="cart-drawer__item" data-cart-line="' +
          escapeHtml(item.key) +
          '">' +
          '<a class="cart-drawer__image" href="' +
          escapeHtml(item.url) +
          '">' +
          image +
          '</a>' +
          '<div class="cart-drawer__details">' +
          '<a class="cart-drawer__name" href="' +
          escapeHtml(item.url) +
          '">' +
          escapeHtml(item.product_title) +
          '</a>' +
          variant +
          '<p class="cart-drawer__price">' +
          escapeHtml(formatMoney(item.final_line_price)) +
          '</p>' +
          '<div class="cart-drawer__qty">' +
          '<label class="visually-hidden" for="CartDrawerQtyJs-' +
          index +
          '">Antal</label>' +
          '<button type="button" class="cart-drawer__qty-btn" data-cart-qty-change data-line="' +
          escapeHtml(item.key) +
          '" data-quantity="' +
          (item.quantity - 1) +
          '" aria-label="Minska antal">−</button>' +
          '<input id="CartDrawerQtyJs-' +
          index +
          '" class="cart-drawer__qty-input" type="number" min="0" value="' +
          item.quantity +
          '" data-cart-qty-input data-line="' +
          escapeHtml(item.key) +
          '" aria-label="Antal">' +
          '<button type="button" class="cart-drawer__qty-btn" data-cart-qty-change data-line="' +
          escapeHtml(item.key) +
          '" data-quantity="' +
          (item.quantity + 1) +
          '" aria-label="Öka antal">+</button>' +
          '</div></div>' +
          '<button type="button" class="cart-drawer__remove" data-cart-remove data-line="' +
          escapeHtml(item.key) +
          '" aria-label="' +
          escapeHtml(config.strings.remove) +
          ' ' +
          escapeHtml(item.product_title) +
          '">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></svg>' +
          '</button></li>'
        );
      })
      .join('');

    body.innerHTML = '<ul class="cart-drawer__items" role="list" data-cart-drawer-items>' + itemsHtml + '</ul>';
    renderUpsell(cart);
  }

  function fetchCart() {
    return fetch(shopifyRoot() + 'cart.js', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    }).then(function (response) {
      if (!response.ok) throw new Error('cart fetch failed');
      return response.json();
    });
  }

  function refreshCart() {
    return fetchCart()
      .then(renderCart)
      .catch(function () {
        announce(config.strings.error);
      });
  }

  function changeLine(line, quantity) {
    if (isBusy) return Promise.resolve();
    isBusy = true;
    root.classList.add('is-busy');

    return fetch(shopifyRoot() + 'cart/change.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: line, quantity: quantity }),
    })
      .then(function (response) {
        if (!response.ok) throw new Error('change failed');
        return response.json();
      })
      .then(function (cart) {
        renderCart(cart);
        return cart;
      })
      .catch(function () {
        announce(config.strings.error);
      })
      .finally(function () {
        isBusy = false;
        root.classList.remove('is-busy');
      });
  }

  function addItems(items) {
    if (isBusy) return Promise.resolve();
    isBusy = true;
    root.classList.add('is-busy');

    return fetch(shopifyRoot() + 'cart/add.js', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: items }),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) {
            const message = (data && data.description) || config.strings.error;
            throw new Error(message);
          }
          return data;
        });
      })
      .then(function () {
        return fetchCart();
      })
      .then(function (cart) {
        renderCart(cart);
        pulseCartIcon();
        announce(config.strings.added);
        document.dispatchEvent(new CustomEvent('pump:cart-add'));
        openDrawer();
        return cart;
      })
      .catch(function (error) {
        announce(error.message || config.strings.error);
      })
      .finally(function () {
        isBusy = false;
        root.classList.remove('is-busy');
      });
  }

  function getFormItems(form) {
    const formData = new FormData(form);
    const id = formData.get('id');
    const quantity = Number(formData.get('quantity') || 1);
    if (!id) return null;
    return [{ id: Number(id), quantity: quantity > 0 ? quantity : 1 }];
  }

  function openDrawer() {
    if (isOpen) return;
    isOpen = true;
    root.hidden = false;
    root.setAttribute('aria-hidden', 'false');
    root.classList.add('is-open');
    document.body.classList.add('cart-drawer-open');
    window.requestAnimationFrame(function () {
      if (panel) panel.focus();
    });
  }

  function closeDrawer() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-drawer-open');
    window.setTimeout(function () {
      if (!isOpen) root.hidden = true;
    }, 250);
  }

  function shouldUseAjaxForForm(form, submitter) {
    if (!form.matches('.ajax-cart-form')) return false;
    if (submitter && submitter.name === 'checkout') return false;
    if (submitter && submitter.closest && submitter.closest('.shopify-payment-button')) return false;
    return true;
  }

  document.addEventListener('click', function (event) {
    const openTrigger = event.target.closest('[data-cart-open]');
    if (openTrigger) {
      event.preventDefault();
      refreshCart().then(openDrawer);
      return;
    }

    const closeTrigger = event.target.closest('[data-cart-close]');
    if (closeTrigger && root.contains(closeTrigger)) {
      closeDrawer();
      return;
    }

    const qtyBtn = event.target.closest('[data-cart-qty-change]');
    if (qtyBtn && root.contains(qtyBtn)) {
      changeLine(qtyBtn.dataset.line, Number(qtyBtn.dataset.quantity));
      return;
    }

    const removeBtn = event.target.closest('[data-cart-remove]');
    if (removeBtn && root.contains(removeBtn)) {
      changeLine(removeBtn.dataset.line, 0);
      return;
    }

    const upsellBtn = event.target.closest('[data-cart-upsell-add]');
    if (upsellBtn && root.contains(upsellBtn)) {
      const variantId = Number(upsellBtn.dataset.variantId);
      if (!variantId) return;
      upsellBtn.disabled = true;
      addItems([{ id: variantId, quantity: 1 }]).finally(function () {
        upsellBtn.disabled = false;
      });
    }
  });

  document.addEventListener('change', function (event) {
    const input = event.target.closest('[data-cart-qty-input]');
    if (!input || !root.contains(input)) return;
    changeLine(input.dataset.line, Number(input.value));
  });

  document.addEventListener('submit', function (event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!shouldUseAjaxForForm(form, event.submitter)) return;

    event.preventDefault();
    const items = getFormItems(form);
    if (!items) return;

    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      if (!submitBtn.dataset.defaultLabel) {
        submitBtn.dataset.defaultLabel = submitBtn.textContent.trim();
      }
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      submitBtn.textContent = 'Lägger till…';
    }

    addItems(items).finally(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
        submitBtn.textContent = submitBtn.dataset.defaultLabel || 'Lägg i varukorg';
      }
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen) closeDrawer();
  });

  if (checkoutLink) {
    checkoutLink.addEventListener('click', function (event) {
      event.preventDefault();
      window.location.href = shopifyRoot() + 'checkout';
    });
  }

  window.PumpCartDrawer = {
    open: function () {
      refreshCart().then(openDrawer);
    },
    close: closeDrawer,
    refresh: refreshCart,
    addItems: addItems,
    addFromForm: function (form) {
      const items = getFormItems(form);
      if (!items) return Promise.resolve();
      return addItems(items);
    },
  };
})();
