const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const getBaseProductName = (fullName) => {
  if (!fullName) return '';
  return fullName.replace(/\d+(\/\d+)?\s*(inch|mm|sq\s*mm|”|")?/gi, '').trim();
};

// Paths for local JSON database
const dbFilePath = path.join(__dirname, 'db.json');

// MongoDB config
let mongoClient = null;
let db = null;
const mongoUri = process.env.MONGO_URI || null;
const dbName = process.env.MONGO_DB_NAME || 'sri_kedareswara_db';

// Ensure the local JSON file exists with empty arrays if not present
function initLocalDb() {
  if (!fs.existsSync(dbFilePath)) {
    const defaultData = {
      items: [],
      orders: []
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

// Helper to read local database
function readLocalDb() {
  initLocalDb();
  try {
    const raw = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading local DB file, returning empty structure:", err);
    return { items: [], orders: [] };
  }
}

// Helper to write local database
function writeLocalDb(data) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing local DB file:", err);
  }
}

// Connect to MongoDB if MONGO_URI is set
async function connectDb() {
  if (mongoUri) {
    try {
      if (!mongoClient || !db) {
        console.log("Connecting to MongoDB Atlas...");
        mongoClient = new MongoClient(mongoUri);
        await mongoClient.connect();
        
        // Resolve database name: use MONGO_DB_NAME env var, or parse from MONGO_URI, or default to 'sri_kedareswara_db'
        if (process.env.MONGO_DB_NAME) {
          db = mongoClient.db(process.env.MONGO_DB_NAME);
          console.log("Successfully connected to MongoDB using env DB name:", process.env.MONGO_DB_NAME);
        } else {
          // Parse database name from URI, e.g., mongodb+srv://host/dbname?options
          const urlPattern = /^mongodb(?:\+srv)?:\/\/[^\/]+\/([^?#]+)/;
          const match = mongoUri.match(urlPattern);
          const uriDbName = match ? match[1] : null;
          
          if (uriDbName) {
            db = mongoClient.db(uriDbName);
            console.log(`Successfully connected to MongoDB using URI DB name: "${uriDbName}"`);
          } else {
            db = mongoClient.db('sri_kedareswara_db');
            console.log('Successfully connected to MongoDB using default DB name: "sri_kedareswara_db"');
          }
        }
      } else {
        // Ping to verify connection is still alive
        try {
          await db.command({ ping: 1 });
        } catch (pingErr) {
          console.log("MongoDB connection lost, reconnecting...");
          mongoClient = new MongoClient(mongoUri);
          await mongoClient.connect();
          
          if (process.env.MONGO_DB_NAME) {
            db = mongoClient.db(process.env.MONGO_DB_NAME);
          } else {
            const urlPattern = /^mongodb(?:\+srv)?:\/\/[^\/]+\/([^?#]+)/;
            const match = mongoUri.match(urlPattern);
            const uriDbName = match ? match[1] : null;
            db = uriDbName ? mongoClient.db(uriDbName) : mongoClient.db('sri_kedareswara_db');
          }
          console.log("Reconnected to MongoDB successfully.");
        }
      }
      return { type: 'mongodb', db };
    } catch (err) {
      console.error("Failed to connect to MongoDB, falling back to Local JSON DB:", err);
      mongoClient = null;
      db = null;
      return { type: 'json' };
    }
  } else {
    initLocalDb();
    return { type: 'json' };
  }
}

// Helper to convert cost & profit to selling price
function calculateSellingPrice(item) {
  const cost = parseFloat(item.cost_price) || 0;
  const margin = parseFloat(item.profit_percentage) || 0;
  return Number((cost + (cost * margin / 100)).toFixed(2));
}

// --- DATABASE API ---

// 1. ITEMS (Inventory Catalog)

async function getItems() {
  const conn = await connectDb();
  if (conn.type === 'mongodb') {
    const items = await conn.db.collection('items').find({}).toArray();
    return items.map(item => {
      const computedPrice = calculateSellingPrice(item);
      return { 
        ...item, 
        id: item._id.toString(),
        selling_price: item.selling_price !== undefined ? item.selling_price : computedPrice
      };
    });
  } else {
    const data = readLocalDb();
    return data.items.map(item => ({
      ...item,
      selling_price: item.selling_price !== undefined ? item.selling_price : calculateSellingPrice(item)
    }));
  }
}

async function getItemById(id) {
  const conn = await connectDb();
  if (conn.type === 'mongodb') {
    const item = await conn.db.collection('items').findOne({ _id: new ObjectId(id) });
    if (!item) return null;
    const computedPrice = calculateSellingPrice(item);
    return { 
      ...item, 
      id: item._id.toString(),
      selling_price: item.selling_price !== undefined ? item.selling_price : computedPrice
    };
  } else {
    const data = readLocalDb();
    const item = data.items.find(item => item.id === id) || null;
    if (!item) return null;
    return {
      ...item,
      selling_price: item.selling_price !== undefined ? item.selling_price : calculateSellingPrice(item)
    };
  }
}

async function addItem(itemData) {
  const conn = await connectDb();
  
  let imageUrl = itemData.image_url || '';
  
  // Inherit existing image if empty
  if (!imageUrl && itemData.name) {
    const baseName = getBaseProductName(itemData.name);
    if (conn.type === 'mongodb') {
      const itemsCol = conn.db.collection('items');
      const siblings = await itemsCol.find({
        category: itemData.category || 'Plumbing',
        subcategory: itemData.subcategory || 'General',
        image_url: { $ne: '' }
      }).toArray();
      const sibling = siblings.find(sib => getBaseProductName(sib.name).toLowerCase() === baseName.toLowerCase());
      if (sibling) {
        imageUrl = sibling.image_url;
      }
    } else {
      const data = readLocalDb();
      const sibling = data.items.find(sib => 
        sib.category === (itemData.category || 'Plumbing') &&
        sib.subcategory === (itemData.subcategory || 'General') &&
        getBaseProductName(sib.name).toLowerCase() === baseName.toLowerCase() &&
        sib.image_url
      );
      if (sibling) {
        imageUrl = sibling.image_url;
      }
    }
  }
  
  const newItem = {
    name: itemData.name || 'Unnamed Item',
    category: itemData.category || 'Plumbing',
    subcategory: itemData.subcategory || 'General',
    item_type: itemData.item_type || 'Standard',
    size: itemData.size || 'N/A',
    image_url: imageUrl,
    cost_price: parseFloat(itemData.cost_price) || 0,
    profit_percentage: parseFloat(itemData.profit_percentage) || 0,
    stock_quantity: parseInt(itemData.stock_quantity, 10) || 0,
    available: itemData.available !== undefined ? !!itemData.available : true,
  };
  
  newItem.selling_price = calculateSellingPrice(newItem);

  if (conn.type === 'mongodb') {
    const result = await conn.db.collection('items').insertOne(newItem);
    return { ...newItem, id: result.insertedId.toString() };
  } else {
    const data = readLocalDb();
    newItem.id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    data.items.push(newItem);
    writeLocalDb(data);
    return newItem;
  }
}

async function updateItem(id, itemUpdates) {
  const conn = await connectDb();
  
  // Clean up updates
  const cleanedUpdates = {};
  const fields = ['name', 'category', 'subcategory', 'item_type', 'size', 'image_url', 'cost_price', 'profit_percentage', 'stock_quantity', 'available'];
  
  fields.forEach(field => {
    if (itemUpdates[field] !== undefined) {
      if (field === 'cost_price' || field === 'profit_percentage') {
        cleanedUpdates[field] = parseFloat(itemUpdates[field]);
      } else if (field === 'stock_quantity') {
        cleanedUpdates[field] = parseInt(itemUpdates[field], 10);
      } else if (field === 'available') {
        cleanedUpdates[field] = !!itemUpdates[field];
      } else {
        cleanedUpdates[field] = itemUpdates[field];
      }
    }
  });

  if (conn.type === 'mongodb') {
    // We need the existing item to calculate new selling price if cost/profit changed
    const existing = await conn.db.collection('items').findOne({ _id: new ObjectId(id) });
    if (!existing) return null;
    
    const merged = { ...existing, ...cleanedUpdates };
    cleanedUpdates.selling_price = calculateSellingPrice(merged);

    await conn.db.collection('items').updateOne(
      { _id: new ObjectId(id) },
      { $set: cleanedUpdates }
    );

    // Propagate image_url updates to all sibling items
    if (cleanedUpdates.image_url !== undefined) {
      const baseName = getBaseProductName(existing.name);
      const siblings = await conn.db.collection('items').find({
        category: existing.category,
        subcategory: existing.subcategory
      }).toArray();
      const siblingIds = siblings
        .filter(sib => getBaseProductName(sib.name).toLowerCase() === baseName.toLowerCase() && sib._id.toString() !== id)
        .map(sib => sib._id);
      if (siblingIds.length > 0) {
        await conn.db.collection('items').updateMany(
          { _id: { $in: siblingIds } },
          { $set: { image_url: cleanedUpdates.image_url } }
        );
      }
    }

    return { ...merged, id: id };
  } else {
    const data = readLocalDb();
    const index = data.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    const merged = { ...data.items[index], ...cleanedUpdates };
    merged.selling_price = calculateSellingPrice(merged);
    
    data.items[index] = merged;

    // Propagate image_url updates to all sibling items locally
    if (cleanedUpdates.image_url !== undefined) {
      const existingName = data.items[index].name;
      const baseName = getBaseProductName(existingName);
      data.items.forEach(item => {
        if (item.category === merged.category &&
            item.subcategory === merged.subcategory &&
            getBaseProductName(item.name).toLowerCase() === baseName.toLowerCase() &&
            item.id !== id) {
          item.image_url = cleanedUpdates.image_url;
        }
      });
    }

    writeLocalDb(data);
    return merged;
  }
}

async function deleteItem(id) {
  const conn = await connectDb();
  if (conn.type === 'mongodb') {
    const result = await conn.db.collection('items').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } else {
    const data = readLocalDb();
    const initialLength = data.items.length;
    data.items = data.items.filter(item => item.id !== id);
    writeLocalDb(data);
    return data.items.length < initialLength;
  }
}

// 2. ORDERS (Customer Enquiries)

async function getOrders() {
  const conn = await connectDb();
  if (conn.type === 'mongodb') {
    const orders = await conn.db.collection('orders').find({}).sort({ created_at: -1 }).toArray();
    return orders.map(order => ({ ...order, id: order._id.toString() }));
  } else {
    const data = readLocalDb();
    return [...data.orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

async function getOrderById(id) {
  const conn = await connectDb();
  if (conn.type === 'mongodb') {
    const order = await conn.db.collection('orders').findOne({ _id: new ObjectId(id) });
    return order ? { ...order, id: order._id.toString() } : null;
  } else {
    const data = readLocalDb();
    return data.orders.find(order => order.id === id) || null;
  }
}

async function addOrder(orderData) {
  const conn = await connectDb();
  
  // Calculate raw subtotal from submitted items
  let subtotal = 0;
  const items = (orderData.items || []).map(item => {
    const price = parseFloat(item.selling_price) || 0;
    const qty = parseInt(item.quantity || item.requested_quantity, 10) || 0;
    subtotal += price * qty;
    
    return {
      item_id: item.item_id || item.id,
      item_name: item.item_name || item.name,
      size: item.size || 'N/A',
      requested_quantity: qty,
      approved_quantity: qty, // Default to matching requested, admin will verify manually
      selling_price: price,
      available_in_stock: true // Default
    };
  });

  const timestamp = new Date().toISOString();
  
  // Generate nice human readable ID (e.g. SKE-YYYYMMDD-XXXX)
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  const enquiry_id = `SKE-${dateStr}-${rand}`;

  const newOrder = {
    enquiry_id,
    customer_name: orderData.customer_name || 'Anonymous Customer',
    customer_phone: orderData.customer_phone || '',
    customer_address: orderData.customer_address || '',
    delivery_type: orderData.delivery_type || 'Pickup',
    status: 'Pending', // Pending -> Verified -> Cancelled
    payment_status: 'Unpaid', // Unpaid -> Paid
    created_at: timestamp,
    items: items,
    subtotal_amount: Number(subtotal.toFixed(2)),
    discount_amount: 0.00,
    total_amount: Number(subtotal.toFixed(2))
  };

  if (conn.type === 'mongodb') {
    const result = await conn.db.collection('orders').insertOne(newOrder);
    return { ...newOrder, id: result.insertedId.toString() };
  } else {
    const data = readLocalDb();
    newOrder.id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    data.orders.push(newOrder);
    writeLocalDb(data);
    return newOrder;
  }
}

async function updateOrder(id, orderUpdates) {
  const conn = await connectDb();
  
  // Fields to allow updating
  const cleanedUpdates = {};
  const fields = ['status', 'payment_status', 'discount_amount', 'items', 'customer_name', 'customer_phone', 'customer_address', 'delivery_type'];
  
  fields.forEach(field => {
    if (orderUpdates[field] !== undefined) {
      if (field === 'discount_amount') {
        cleanedUpdates[field] = parseFloat(orderUpdates[field]) || 0;
      } else {
        cleanedUpdates[field] = orderUpdates[field];
      }
    }
  });

  if (conn.type === 'mongodb') {
    const existing = await conn.db.collection('orders').findOne({ _id: new ObjectId(id) });
    if (!existing) return null;
    
    const merged = { ...existing, ...cleanedUpdates };
    
    // Recompute subtotal and total based on item changes
    let subtotal = 0;
    merged.items.forEach(item => {
      // In mongodb it might be available_in_stock
      if (item.available_in_stock !== false) {
        subtotal += (item.selling_price * (parseInt(item.approved_quantity, 10) || 0));
      }
    });
    
    merged.subtotal_amount = Number(subtotal.toFixed(2));
    merged.total_amount = Number((subtotal - (merged.discount_amount || 0)).toFixed(2));
    
    await conn.db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { $set: merged }
    );
    return { ...merged, id: id };
  } else {
    const data = readLocalDb();
    const index = data.orders.findIndex(ord => ord.id === id);
    if (index === -1) return null;
    
    const merged = { ...data.orders[index], ...cleanedUpdates };
    
    // Recompute subtotal and total
    let subtotal = 0;
    merged.items.forEach(item => {
      if (item.available_in_stock !== false) {
        subtotal += (item.selling_price * (parseInt(item.approved_quantity, 10) || 0));
      }
    });
    
    merged.subtotal_amount = Number(subtotal.toFixed(2));
    merged.total_amount = Number((subtotal - (merged.discount_amount || 0)).toFixed(2));
    
    data.orders[index] = merged;
    writeLocalDb(data);
    return merged;
  }
}

// 3. SETTINGS
async function getSettings() {
  const conn = await connectDb();
  const defaultSettings = {
    shop_name: "SRIKEDARESWARA ENTERPRICES",
    shop_address: "DOOR NO: 13-12-5, RAMA SCOIETY STREET, KOVVUR",
    proprietor_info: "PROP: N. Rajyalakshmi      PH NO: 7997696636",
    bank_name: "SBI, KOVVURU",
    bank_account: "AC.NO: 36444436717",
    bank_ifsc: "IFSC CODE: SBIN0000860",
    left_logo: "",
    right_logo: ""
  };
  
  if (conn.type === 'mongodb') {
    const settings = await conn.db.collection('settings').findOne({ key: 'billing' });
    return settings ? { ...defaultSettings, ...settings } : defaultSettings;
  } else {
    const data = readLocalDb();
    if (!data.settings) {
      data.settings = defaultSettings;
      writeLocalDb(data);
    }
    return { ...defaultSettings, ...data.settings };
  }
}

async function saveSettings(settingsData) {
  const conn = await connectDb();
  
  const cleanedSettings = {
    key: 'billing',
    shop_name: settingsData.shop_name || "SRIKEDARESWARA ENTERPRICES",
    shop_address: settingsData.shop_address || "DOOR NO: 13-12-5, RAMA SCOIETY STREET, KOVVUR",
    proprietor_info: settingsData.proprietor_info || "PROP: N. Rajyalakshmi      PH NO: 7997696636",
    bank_name: settingsData.bank_name || "SBI, KOVVURU",
    bank_account: settingsData.bank_account || "AC.NO: 36444436717",
    bank_ifsc: settingsData.bank_ifsc || "IFSC CODE: SBIN0000860",
    left_logo: settingsData.left_logo || "",
    right_logo: settingsData.right_logo || ""
  };

  if (conn.type === 'mongodb') {
    await conn.db.collection('settings').updateOne(
      { key: 'billing' },
      { $set: cleanedSettings },
      { upsert: true }
    );
    return cleanedSettings;
  } else {
    const data = readLocalDb();
    data.settings = cleanedSettings;
    writeLocalDb(data);
    return cleanedSettings;
  }
}

// 4. ITEM REQUESTS (customer-submitted)
async function getItemRequests() {
  const conn = await connectDb();
  if (conn.type === 'mongodb') {
    return await conn.db.collection('item_requests').find({}).sort({ created_at: -1 }).toArray();
  } else {
    const data = readLocalDb();
    return (data.item_requests || []).slice().reverse();
  }
}

async function addItemRequest(reqData) {
  const conn = await connectDb();
  const id = Date.now().toString();
  const newReq = {
    id,
    customer_name: reqData.customer_name || 'Anonymous',
    customer_phone: reqData.customer_phone || '',
    item_description: reqData.item_description || '',
    created_at: new Date().toISOString(),
    status: 'pending'
  };
  if (conn.type === 'mongodb') {
    try {
      // Use auto-generated ObjectId (no custom _id)
      await conn.db.collection('item_requests').insertOne({ ...newReq });
      console.log('Item request saved to Atlas:', newReq.item_description);
    } catch (err) {
      console.error('Error saving item request to Atlas:', err.message);
      throw err;
    }
  } else {
    const data = readLocalDb();
    if (!data.item_requests) data.item_requests = [];
    data.item_requests.push(newReq);
    writeLocalDb(data);
  }
  return newReq;
}

async function deleteItemRequest(id) {
  const conn = await connectDb();
  if (conn.type === 'mongodb') {
    const result = await conn.db.collection('item_requests').deleteOne({ id });
    return result.deletedCount > 0;
  } else {
    const data = readLocalDb();
    if (!data.item_requests) return false;
    const before = data.item_requests.length;
    data.item_requests = data.item_requests.filter(r => r.id !== id);
    writeLocalDb(data);
    return data.item_requests.length < before;
  }
}

module.exports = {
  getItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
  getOrders,
  getOrderById,
  addOrder,
  updateOrder,
  getSettings,
  saveSettings,
  getItemRequests,
  addItemRequest,
  deleteItemRequest
};
