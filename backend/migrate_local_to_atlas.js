require('dotenv').config();
const { MongoClient } = require('mongodb');

async function migrateFromLocalToAtlas() {
  console.log('=== MIGRATING LOCAL MONGODB → ATLAS ===\n');

  // Connect to LOCAL mongodb
  const localClient = new MongoClient('mongodb://localhost:27017');
  await localClient.connect();
  const localDb = localClient.db('sri_kedareswara_db');
  console.log('✅ Connected to local MongoDB (localhost:27017)');

  // Connect to ATLAS
  const atlasClient = new MongoClient(process.env.MONGO_URI);
  await atlasClient.connect();
  const atlasDb = atlasClient.db('sri_kedareswara_db');
  console.log('✅ Connected to MongoDB Atlas\n');

  const collections = ['items', 'orders', 'settings', 'item_requests'];

  for (const colName of collections) {
    const localDocs = await localDb.collection(colName).find({}).toArray();
    const atlasCount = await atlasDb.collection(colName).countDocuments();

    console.log(`--- ${colName} ---`);
    console.log(`  Local: ${localDocs.length} docs | Atlas: ${atlasCount} docs`);

    if (localDocs.length > 0 && atlasCount < localDocs.length) {
      // Clear atlas and re-insert fresh from local
      await atlasDb.collection(colName).deleteMany({});
      await atlasDb.collection(colName).insertMany(localDocs);
      const newCount = await atlasDb.collection(colName).countDocuments();
      console.log(`  ✅ Migrated ${newCount} docs to Atlas`);
    } else if (atlasCount >= localDocs.length && atlasCount > 0) {
      console.log(`  ✅ Already in Atlas (${atlasCount} docs) - skipped`);
    } else {
      console.log(`  ⚠️  No local data to migrate`);
    }
  }

  // Final verification
  console.log('\n=== FINAL ATLAS STATE ===');
  for (const colName of collections) {
    const count = await atlasDb.collection(colName).countDocuments();
    console.log(`  ${colName}: ${count} docs ${count > 0 ? '✅' : '(empty)'}`);
  }

  await localClient.close();
  await atlasClient.close();
  console.log('\n✅ Migration complete! All data is now in Atlas.');
}

migrateFromLocalToAtlas().catch(e => {
  if (e.message.includes('ECONNREFUSED')) {
    console.log('⚠️  Local MongoDB not running - nothing to migrate from localhost');
    console.log('   All data should already be in Atlas.');
  } else {
    console.error('ERROR:', e.message);
  }
});
