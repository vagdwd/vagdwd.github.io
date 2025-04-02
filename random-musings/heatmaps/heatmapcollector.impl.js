let db;
const request = indexedDB.open('heatmapDB', 1);

request.onerror = (event) => {
  console.error('Database error:', event.target.error);
};

request.onupgradeneeded = (event) => {
  db = event.target.result;
  if (!db.objectStoreNames.contains('clickdata')) {
    const store = db.createObjectStore('clickdata', { autoIncrement: true });
    store.createIndex('url', 'url', { unique: false });
  }
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log('Database opened successfully');
};

HeatMapCollector.init(function(data) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction(['clickdata'], 'readwrite');
  const store = transaction.objectStore('clickdata');

  const clickData = {
    url: location.href,
    x: data.x,
    y: data.y,
    r: data.r
  };

  const request = store.add(clickData);

  request.onerror = (event) => {
    console.error('Error saving click data:', event.target.error);
  };

  request.onsuccess = () => {
    console.log('Click data saved successfully');
  };
});