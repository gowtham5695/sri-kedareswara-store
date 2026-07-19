require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const dbFilePath = path.join(__dirname, 'db.json');
const seedFilePath = path.join(__dirname, 'items_seed.json');

async function run() {
  console.log("Starting image URL removal process...");

  // 1. Update local db.json
  if (fs.existsSync(dbFilePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
      if (data.items && Array.isArray(data.items)) {
        data.items.forEach(item => {
          item.image_url = "";
        });
        fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Updated ${data.items.length} items in local db.json.`);
      }
    } catch (err) {
      console.error("Error updating local db.json:", err);
    }
  }

  // 2. Update local items_seed.json
  if (fs.existsSync(seedFilePath)) {
    try {
      const seedData = JSON.parse(fs.readFileSync(seedFilePath, 'utf8'));
      if (Array.isArray(seedData)) {
        seedData.forEach(item => {
          item.image_url = "";
        });
        fs.writeFileSync(seedFilePath, JSON.stringify(seedData, null, 2), 'utf8');
        console.log(`Updated ${seedData.length} items in local items_seed.json.`);
      }
    } catch (err) {
      console.error("Error updating local items_seed.json:", err);
    }
  }

  // 3. Update MongoDB database if MONGO_URI is configured
  const mongoUri = process.env.MONGO_URI || null;
  const dbName = process.env.MONGO_DB_NAME || 'sri_kedareswara_db';
  if (mongoUri) {
    console.log("Connecting to MongoDB Atlas to update remote collection...");
    let client;
    try {
      client = new MongoClient(mongoUri);
      await client.connect();
      const database = client.db(dbName);
      const collection = database.collection('items');
      
      const result = await collection.updateMany(
        {},
        { $set: { image_url: "" } }
      );
      console.log(`Successfully updated ${result.modifiedCount} items in MongoDB collection 'items'.`);
    } catch (err) {
      console.error("Error updating MongoDB:", err);
    } finally {
      if (client) {
        await client.close();
      }
    }
  } else {
    console.log("No MONGO_URI configured in environment. Skipping MongoDB update.");
  }

  console.log("Image URL removal process completed successfully.");
}

run().catch(console.dir);
