(function () {
  var STORAGE_KEY = 'pump_recently_viewed';
  var path = window.location.pathname;
  if (path.indexOf('/products/') === -1) return;

  var handle = path.split('/products/')[1].split('/')[0].split('?')[0];
  if (!handle) return;

  var recent = [];
  try {
    recent = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    recent = [];
  }

  recent = recent.filter(function (h) {
    return h !== handle;
  });
  recent.unshift(handle);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(0, 12)));
})();
