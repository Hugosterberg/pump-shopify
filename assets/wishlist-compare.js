(function () {
  const WISHLIST_KEY = 'pump_wishlist';
  const COMPARE_KEY = 'pump_compare';
  const RECENT_KEY = 'pump_recently_viewed';
  const MAX_COMPARE = 4;

  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
      return [];
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function fetchProduct(handle) {
    return fetch('/products/' + encodeURIComponent(handle) + '.js')
      .then(function (res) { return res.ok ? res.json() : null; })
      .catch(function () { return null; });
  }

  function formatPrice(cents) {
    return (cents / 100).toLocaleString('sv-SE') + ' kr';
  }

  function updateBadges() {
    const wishlist = read(WISHLIST_KEY);
    const compare = read(COMPARE_KEY);

    document.querySelectorAll('[data-wishlist-count]').forEach(function (el) {
      el.textContent = wishlist.length;
      el.hidden = wishlist.length === 0;
    });

    document.querySelectorAll('[data-compare-count]').forEach(function (el) {
      el.textContent = compare.length;
      el.hidden = compare.length === 0 && !el.closest('[data-compare-drawer]');
    });
  }

  function renderWishlist() {
    const drawer = document.querySelector('[data-wishlist-drawer]');
    if (!drawer) return;

    const list = drawer.querySelector('[data-wishlist-list]');
    const empty = drawer.querySelector('[data-wishlist-empty]');
    const handles = read(WISHLIST_KEY);

    if (!handles.length) {
      list.hidden = true;
      empty.hidden = false;
      list.innerHTML = '';
      return;
    }

    Promise.all(handles.map(fetchProduct)).then(function (products) {
      const valid = products.filter(Boolean);
      if (!valid.length) {
        list.hidden = true;
        empty.hidden = false;
        return;
      }

      empty.hidden = true;
      list.hidden = false;
      list.innerHTML = valid
        .map(function (product) {
          const img = product.featured_image || (product.images && product.images[0]) || '';
          return (
            '<li class="pp-drawer__item">' +
            (img ? '<img src="' + img + '" alt="" width="72" height="72">' : '<span></span>') +
            '<div class="pp-drawer__item-info">' +
            '<a href="' + product.url + '">' + product.title + '</a>' +
            '<p class="pp-drawer__item-price">' + formatPrice(product.price) + '</p>' +
            '</div>' +
            '<button type="button" class="pp-drawer__item-remove" data-wishlist-remove="' + product.handle + '" aria-label="Ta bort">' +
            '×</button></li>'
          );
        })
        .join('');
    });
  }

  function renderCompare() {
    const drawer = document.querySelector('[data-compare-drawer]');
    if (!drawer) return;

    const tbody = drawer.querySelector('[data-compare-tbody]');
    const empty = drawer.querySelector('[data-compare-empty]');
    const wrap = drawer.querySelector('[data-compare-table-wrap]');
    const handles = read(COMPARE_KEY);

    if (!handles.length) {
      wrap.hidden = true;
      empty.hidden = false;
      tbody.innerHTML = '';
      return;
    }

    Promise.all(handles.map(fetchProduct)).then(function (products) {
      const valid = products.filter(Boolean);
      if (!valid.length) {
        wrap.hidden = true;
        empty.hidden = false;
        return;
      }

      empty.hidden = true;
      wrap.hidden = false;

      const rows = [
        { label: 'Produkt', render: function (p) { return '<a href="' + p.url + '">' + p.title + '</a>'; } },
        {
          label: 'Bild',
          render: function (p) {
            const img = p.featured_image || (p.images && p.images[0]);
            return img ? '<img src="' + img + '" alt="">' : '—';
          },
        },
        { label: 'Pris', render: function (p) { return formatPrice(p.price); } },
        { label: 'Typ', render: function (p) { return p.type || '—'; } },
        {
          label: 'Beskrivning',
          render: function (p) {
            const text = (p.description || '').replace(/<[^>]+>/g, ' ').trim();
            return text.slice(0, 120) + (text.length > 120 ? '…' : '') || '—';
          },
        },
      ];

      tbody.innerHTML = rows
        .map(function (row) {
          return (
            '<tr><th scope="row">' +
            row.label +
            '</th>' +
            valid.map(function (p) { return '<td>' + row.render(p) + '</td>'; }).join('') +
            '</tr>'
          );
        })
        .join('');
    });
  }

  function openDrawer(selector) {
    const drawer = document.querySelector(selector);
    if (!drawer) return;
    drawer.hidden = false;
    document.body.style.overflow = 'hidden';
    const panel = drawer.querySelector('.pp-drawer__panel');
    if (panel) panel.focus();
  }

  function closeDrawer(selector) {
    const drawer = document.querySelector(selector);
    if (!drawer) return;
    drawer.hidden = true;
    if (!document.querySelector('.pp-drawer:not([hidden])')) {
      document.body.style.overflow = '';
    }
  }

  function toggleWishlist(handle) {
    let list = read(WISHLIST_KEY);
    if (list.indexOf(handle) !== -1) {
      list = list.filter(function (h) { return h !== handle; });
    } else {
      list.unshift(handle);
    }
    write(WISHLIST_KEY, list);
    updateBadges();
    renderWishlist();
    syncProductButtons(handle);
  }

  function toggleCompare(handle) {
    let list = read(COMPARE_KEY);
    if (list.indexOf(handle) !== -1) {
      list = list.filter(function (h) { return h !== handle; });
    } else {
      if (list.length >= MAX_COMPARE) {
        list.pop();
      }
      list.unshift(handle);
    }
    write(COMPARE_KEY, list);
    updateBadges();
    renderCompare();
    syncProductButtons(handle);
  }

  function syncProductButtons(handle) {
    const wishlist = read(WISHLIST_KEY);
    const compare = read(COMPARE_KEY);

    document.querySelectorAll('[data-wishlist-toggle="' + handle + '"]').forEach(function (btn) {
      btn.classList.toggle('is-active', wishlist.indexOf(handle) !== -1);
      btn.setAttribute('aria-pressed', wishlist.indexOf(handle) !== -1 ? 'true' : 'false');
    });

    document.querySelectorAll('[data-compare-toggle="' + handle + '"]').forEach(function (btn) {
      btn.classList.toggle('is-active', compare.indexOf(handle) !== -1);
      btn.setAttribute('aria-pressed', compare.indexOf(handle) !== -1 ? 'true' : 'false');
    });
  }

  function trackRecentlyViewed() {
    const path = window.location.pathname;
    if (path.indexOf('/products/') === -1) return;

    const handle = path.split('/products/')[1].split('/')[0].split('?')[0];
    if (!handle) return;

    let recent = read(RECENT_KEY);
    recent = recent.filter(function (h) { return h !== handle; });
    recent.unshift(handle);
    write(RECENT_KEY, recent.slice(0, 12));
  }

  document.addEventListener('click', function (event) {
    const wishlistOpen = event.target.closest('[data-wishlist-open]');
    if (wishlistOpen) {
      event.preventDefault();
      renderWishlist();
      openDrawer('[data-wishlist-drawer]');
      return;
    }

    const compareOpen = event.target.closest('[data-compare-open]');
    if (compareOpen) {
      event.preventDefault();
      renderCompare();
      openDrawer('[data-compare-drawer]');
      return;
    }

    const wishlistClose = event.target.closest('[data-wishlist-close]');
    if (wishlistClose) {
      closeDrawer('[data-wishlist-drawer]');
      return;
    }

    const compareClose = event.target.closest('[data-compare-close]');
    if (compareClose) {
      closeDrawer('[data-compare-drawer]');
      return;
    }

    const wishlistToggle = event.target.closest('[data-wishlist-toggle]');
    if (wishlistToggle) {
      toggleWishlist(wishlistToggle.dataset.wishlistToggle);
      return;
    }

    const compareToggle = event.target.closest('[data-compare-toggle]');
    if (compareToggle) {
      toggleCompare(compareToggle.dataset.compareToggle);
      return;
    }

    const wishlistRemove = event.target.closest('[data-wishlist-remove]');
    if (wishlistRemove) {
      toggleWishlist(wishlistRemove.dataset.wishlistRemove);
      renderWishlist();
      return;
    }

    const compareClear = event.target.closest('[data-compare-clear]');
    if (compareClear) {
      write(COMPARE_KEY, []);
      updateBadges();
      renderCompare();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    closeDrawer('[data-wishlist-drawer]');
    closeDrawer('[data-compare-drawer]');
  });

  trackRecentlyViewed();
  updateBadges();

  const productHandle = document.querySelector('[data-product-handle]');
  if (productHandle) {
    syncProductButtons(productHandle.dataset.productHandle);
  }
})();
