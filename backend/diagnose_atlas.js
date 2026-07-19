require('dotenv').config();
const { MongoClient } = require('mongodb');

async function fullDiagnostic() {
  console.log('=== MONGODB ATLAS DIAGNOSTIC ===\n');
  console.log('URI:', process.env.MONGO_URI ? 'SET ✅' : 'MISSING ❌');

  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db('sri_kedareswara_db');

  const cols = await db.listCollections().toArray();
  console.log('\nCollections in Atlas:', cols.map(c => c.name));

  const counts = {};
  for (const col of cols) {
    counts[col.name] = await db.collection(col.name).countDocuments();
  }

  console.log('\n--- Data Counts ---');
  console.log('items         :', counts['items']         || 0, counts['items'] >= 906 ? '✅' : '❌ MISSING');
  console.log('orders        :', counts['orders']        || 0, '(grows when customers order)');
  console.log('settings      :', counts['settings']      || 0, counts['settings'] > 0 ? '✅' : '❌ MISSING');
  console.log('item_requests :', counts['item_requests'] || 0, '(grows when customers request)');

  // Check items sample
  const sampleItem = await db.collection('items').findOne({});
  console.log('\n--- Sample Item in Atlas ---');
  if (sampleItem) {
    console.log('name:', sampleItem.name);
    console.log('category:', sampleItem.category);
    console.log('cost_price:', sampleItem.cost_price);
    console.log('✅ Items data confirmed in Atlas');
  } else {
    console.log('❌ No items found in Atlas!');
  }

  // Check settings
  const settings = await db.collection('settings').findOne({ key: 'billing' });
  console.log('\n--- Settings in Atlas ---');
  if (settings) {
    console.log('shop_name:', settings.shop_name);
    console.log('✅ Settings confirmed in Atlas');
  } else {
    console.log('❌ No settings found in Atlas!');
  }

  // Check if local db.json has extra data not in Atlas
  const fs = require('fs');
  const path = require('path');
  const localDbPath = path.join(__dirname, 'db.json');
  if (fs.existsSync(localDbPath)) {
    const localData = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
    console.log('\n--- Local db.json ---');
    console.log('items  :', localData.items?.length || 0);
    console.log('orders :', localData.orders?.length || 0);
    console.log('settings:', localData.settings ? 'exists' : 'none');
    console.log('item_requests:', localData.item_requests?.length || 0);

    // Sync orders if any in local but not in Atlas
    if (localData.orders && localData.orders.length > 0 && (counts['orders'] || 0) === 0) {
      console.log('\n⚠️  Orders found in local but NOT in Atlas. Migrating...');
      await db.collection('orders').insertMany(localData.orders);
      console.log('✅ Migrated', localData.orders.length, 'orders to Atlas');
    }

    // Sync item_requests if any in local but not in Atlas
    if (localData.item_requests && localData.item_requests.length > 0 && (counts['item_requests'] || 0) === 0) {
      console.log('\n⚠️  Item requests found in local but NOT in Atlas. Migrating...');
      await db.collection('item_requests').insertMany(localData.item_requests);
      console.log('✅ Migrated', localData.item_requests.length, 'item requests to Atlas');
    }
  }

  await client.close();
  console.log('\n=== DIAGNOSTIC COMPLETE ===');
}

fullDiagnostic().catch(e => console.error('ERROR:', e.message));
