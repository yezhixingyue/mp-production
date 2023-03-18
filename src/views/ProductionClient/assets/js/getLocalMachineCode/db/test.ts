const result = indexedDB.open('mp-production-client-indexedDB', 1);

result.onsuccess = () => {
  const db = result.result;

  // 烫金 value:"3c9f80ca-b4b4-4f3d-bc5c-7ebc630b6bd7"
  // 大版类 02630a10-3adc-41fa-83ee-2facb85af032
  db.transaction(['local-machine-code-store'], 'readwrite')
    .objectStore('local-machine-code-store')
    .put({ key: 'local-machine-code', value: '3c9f80ca-b4b4-4f3d-bc5c-7ebc630b6bd7', id: 1 });
};
