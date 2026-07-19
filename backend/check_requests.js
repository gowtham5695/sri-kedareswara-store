require('dotenv').config();
const { MongoClient } = require('mongodb');

async function liveInsertTest() {
  console.log('=== LIVE INSERT TEST ===');
  console.log('URI:', process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@'));

  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();

  // Force use same db name as app
  const dbName = process.env.MONGO_DB_NAME || 'sri_kedareswara_db';
  const db = client.db(dbName);
  console.log('Database name:', dbName);

  // Check BEFORE
  const before = await db.collection('item_requests').countDocuments();
  console.log('\nitem_requests BEFORE insert:', before);

  // Insert directly
  const testDoc = {
    id: Date.now().toString(),
    customer_name: 'TestUser',
    customer_phone: '9999999999',
    item_description: 'DIRECT TEST ITEM - ' + new Date().toISOString(),
    created_at: new Date().toISOString(),
    status: 'pending'
  };

  const result = await db.collection('item_requests').insertOne(testDoc);
  console.log('Insert result:', result.acknowledged ? '✅ acknowledged' : '❌ NOT acknowledged');
  console.log('Inserted _id:', result.insertedId);

  // Check AFTER
  const after = await db.collection('item_requests').countDocuments();
  console.log('\nitem_requests AFTER insert:', after);

  const found = await db.collection('item_requests').findOne({ id: testDoc.id });
  console.log('Doc found back:', found ? '✅ YES - ' + found.item_description : '❌ NO');

  // List all collections
  const cols = await db.listCollections().toArray();
  console.log('\nAll collections in', dbName + ':', cols.map(c => c.name));

  await client.close();
  console.log('\n=== TEST COMPLETE ===');
}

liveInsertTest().catch(e => console.error('FATAL ERROR:', e.message));
