require('dotenv').config();
const { MongoClient } = require('mongodb');

async function test() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db('sri_kedareswara_db');

  // Force save settings to Atlas
  await db.collection('settings').updateOne(
    { key: 'billing' },
    { $set: {
        key: 'billing',
        shop_name: 'SRIKEDARESWARA ENTERPRICES',
        shop_address: 'DOOR NO: 13-12-5, RAMA SCOIETY STREET, KOVVUR',
        proprietor_info: 'PROP: N. Rajyalakshmi PH NO: 7997696636',
        bank_name: 'SBI, KOVVURU',
        bank_account: 'AC.NO: 36444436717',
        bank_ifsc: 'IFSC CODE: SBIN0000860',
        left_logo: '',
        right_logo: ''
      }
    },
    { upsert: true }
  );

  const cols = await db.listCollections().toArray();
  console.log('Collections now in Atlas:', cols.map(c => c.name));

  const saved = await db.collection('settings').findOne({ key: 'billing' });
  console.log('Settings saved to Atlas:', saved ? 'YES - ' + saved.shop_name : 'NO');

  await client.close();
}
test().catch(e => console.error('ERROR:', e.message));
