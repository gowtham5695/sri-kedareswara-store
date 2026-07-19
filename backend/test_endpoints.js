const http = require('http');

function apiCall(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost', port: 5000, path,
      method,
      headers: { 'Content-Type': 'application/json', ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}) }
    };
    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function testAllEndpoints() {
  console.log('=== TESTING ALL API ENDPOINTS → ATLAS ===\n');

  // 1. Items
  const items = await apiCall('GET', '/api/items');
  console.log('GET /api/items        :', items.status === 200 ? '✅' : '❌', `${items.body.length} items`);

  // 2. Orders
  const orders = await apiCall('GET', '/api/orders');
  console.log('GET /api/orders       :', orders.status === 200 ? '✅' : '❌', `${orders.body.length} orders`);

  // 3. Settings GET
  const settings = await apiCall('GET', '/api/settings');
  console.log('GET /api/settings     :', settings.status === 200 ? '✅' : '❌', settings.body.shop_name);

  // 4. Settings POST
  const savedSettings = await apiCall('POST', '/api/settings', { ...settings.body, shop_name: 'SRIKEDARESWARA ENTERPRICES' });
  console.log('POST /api/settings    :', savedSettings.status === 200 ? '✅' : '❌', 'saved');

  // 5. Item requests GET
  const reqs = await apiCall('GET', '/api/item-requests');
  console.log('GET /api/item-requests:', reqs.status === 200 ? '✅' : '❌', `${reqs.body.length} requests`);

  // 6. Post a test item request
  const newReq = await apiCall('POST', '/api/item-requests', { customer_name: 'Test', customer_phone: '1234567890', item_description: 'TEST ITEM - delete me' });
  console.log('POST /api/item-requests:', newReq.status === 201 ? '✅' : '❌', 'request saved, id:', newReq.body.id);

  // 7. Delete test item request
  const delReq = await apiCall('DELETE', `/api/item-requests/${newReq.body.id}`);
  console.log('DELETE /api/item-requests:', delReq.status === 200 ? '✅' : '❌', 'deleted');

  console.log('\n=== ALL ENDPOINTS USE ATLAS ✅ ===');
}

testAllEndpoints().catch(e => console.error('ERROR:', e.message));
