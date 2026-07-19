require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support base64 image uploads up to 10MB

// Serve static images from frontend public folder as a backup
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// Seed Database if empty on startup
async function seedDatabaseIfEmpty() {
  try {
    const items = await db.getItems();
    if (items.length === 0) {
      console.log("Database is empty. Seeding default items...");
      const seedPath = path.join(__dirname, 'items_seed.json');
      if (fs.existsSync(seedPath)) {
        const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
        for (const item of seedData) {
          await db.addItem(item);
        }
        console.log(`Successfully seeded ${seedData.length} items.`);
      } else {
        console.warn("No seed file found at:", seedPath);
      }
    }
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

// --- API ROUTES ---

// Admin Authentication Route
app.post('/api/admin/verify', (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = (process.env.ADMIN_PASSWORD || 'admin123').trim();
    if (password === adminPassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  } catch (err) {
    console.error("Error in admin verification:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 1. Catalog Items
app.get('/api/items', async (req, res) => {
  try {
    const items = await db.getItems();
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const newItem = await db.addItem(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ error: "Failed to create item" });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const updated = await db.updateItem(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ error: "Failed to update item" });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const success = await db.deleteItem(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Item not found or already deleted" });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// 2. Orders / Enquiries
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    // Validate request items
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ error: "Cart cannot be empty" });
    }
    const newOrder = await db.addOrder(req.body);
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const updated = await db.updateOrder(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // If order was verified, update inventory stock quantities
    if (req.body.status === 'Verified') {
      for (const item of updated.items) {
        if (item.available_in_stock !== false) {
          const invItem = await db.getItemById(item.item_id);
          if (invItem) {
            // Subtract approved quantity from current stock, preventing negative stock
            const newStock = Math.max(0, invItem.stock_quantity - (parseInt(item.approved_quantity, 10) || 0));
            await db.updateItem(item.item_id, { stock_quantity: newStock });
          }
        }
      }
    }
    
    res.json(updated);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// 3. Billing Settings
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await db.getSettings();
    res.json(settings);
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const saved = await db.saveSettings(req.body);
    res.json(saved);
  } catch (err) {
    console.error("Error saving settings:", err);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

// 4. Item Requests
app.get('/api/item-requests', async (req, res) => {
  try {
    const requests = await db.getItemRequests();
    res.json(requests);
  } catch (err) {
    console.error("Error fetching item requests:", err);
    res.status(500).json({ error: "Failed to fetch item requests" });
  }
});

app.post('/api/item-requests', async (req, res) => {
  try {
    const { item_description } = req.body;
    if (!item_description || item_description.trim().length < 2) {
      return res.status(400).json({ error: "Please describe the item you need." });
    }
    const newReq = await db.addItemRequest(req.body);
    res.status(201).json(newReq);
  } catch (err) {
    console.error("Error creating item request:", err);
    res.status(500).json({ error: "Failed to submit item request" });
  }
});

app.delete('/api/item-requests/:id', async (req, res) => {
  try {
    const success = await db.deleteItemRequest(req.params.id);
    if (!success) return res.status(404).json({ error: "Request not found" });
    res.json({ message: "Request deleted" });
  } catch (err) {
    console.error("Error deleting item request:", err);
    res.status(500).json({ error: "Failed to delete item request" });
  }
});

// 4. Docs / Knowledge Base Router
app.get('/docs/:tag_link/:article_link', async (req, res) => {
  const { tag_link, article_link } = req.params;
  const db_conn = await db.connectDb();
  if (db_conn.type === 'mongodb') {
    try {
      const article = await db_conn.db.collection('items').findOne({ link: article_link });
      if (!article) {
        return res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
      }
      
      // Load public index.html template and inject metadata
      const indexPath = path.join(__dirname, '../frontend/dist/index.html');
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf8');
        
        // Inject SEO tags
        const titleTag = `<title>${article.title || 'Sri Kedareswara Enterprises'}</title>`;
        const metaDesc = `<meta name="description" content="${article.synopsis || ''}">`;
        
        html = html.replace(/<title>.*?<\/title>/g, titleTag);
        html = html.replace('</head>', `${metaDesc}\n</head>`);
        
        return res.send(html);
      }
    } catch (e) {
      console.error("Error serving SEO article:", e);
    }
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.get('/docs/:tag_link', async (req, res) => {
  const { tag_link } = req.params;
  const db_conn = await db.connectDb();
  if (db_conn.type === 'mongodb') {
    try {
      const categoryItem = await db_conn.db.collection('items').findOne({ tag_link: tag_link });
      if (!categoryItem) {
        return res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
      }
      
      const indexPath = path.join(__dirname, '../frontend/dist/index.html');
      if (fs.existsSync(indexPath)) {
        let html = fs.readFileSync(indexPath, 'utf8');
        
        // Inject SEO tags
        const titleTag = `<title>${categoryItem.category || 'Sri Kedareswara Enterprises'}</title>`;
        const metaDesc = `<meta name="description" content="Explore items in ${categoryItem.category || ''} category at Sri Kedareswara Enterprises.">`;
        
        html = html.replace(/<title>.*?<\/title>/g, titleTag);
        html = html.replace('</head>', `${metaDesc}\n</head>`);
        
        return res.send(html);
      }
    } catch (e) {
      console.error("Error serving SEO category:", e);
    }
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Friendly message for the root API endpoint
app.get('/', (req, res) => {
  res.json({ message: "Sri Kedareswara Enterprises API is running successfully." });
});

// Fallback all other client-side routes to index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: "Route not found" });
  }
});

// Export the app for serverless deployment
module.exports = app;

// Start Server & Seed Database
if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // await seedDatabaseIfEmpty();
  });
}
