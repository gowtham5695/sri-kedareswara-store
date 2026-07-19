# Sri Kedareswara Enterprises

An elegant, full-stack web application designed for **Sri Kedareswara Enterprises** (Electrical & Plumbing Materials Merchants in Kovvur). Customers can browse catalog items categorized by types and sizes, add items to their cart, and submit enquiry requests. Shop administrators can verify stock availability, adjust quantities and prices, apply billing discounts, track payment status, manage catalog inventory, and print bills modeled exactly on the shop's physical billing structure.

---

## 🚀 How to Run Locally

### 1. Prerequisite
Ensure you have **Node.js** (v16+) installed.

### 2. Quick Start
1. Open your terminal in the project root directory (`d:\Sri kedareswara enterprises`).
2. Run the concurrent developer script:
   ```bash
   npm run dev
   ```
   *Note: This command starts both the Express backend (on port 5000) and the React frontend (on port 5173).*
3. Open your browser and navigate to:
   *   **Customer Catalog & Storefront:** [http://localhost:5173](http://localhost:5173)
   *   **Admin Dashboard:** [http://localhost:5173](http://localhost:5173) (Click the **Admin Panel** button at the top right)

---

## 💻 Technical Design Details

### 1. Dual-Mode Database (JSON + MongoDB)
*   **Offline / Development Mode (Default):** The application runs on a local JSON file (`backend/db.json`). This requires zero database configuration, zero network calls, and launches instantly on any computer.
*   **Production Mode:** If you set the `MONGO_URI` environment variable, the backend will automatically connect to your cloud database (like MongoDB Atlas) and store all data there securely.

### 2. Pricing Logic
*   **Cost Price & Profit Margin:** The admin inputs the **Cost Price** and **Profit Percentage** for each item. The system calculates the selling price automatically:
    $$\text{Selling Price} = \text{Cost Price} \times \left(1 + \frac{\text{Profit Percentage}}{100}\right)$$
*   **Customer Shield:** The customer storefront only displays the final calculated selling price, keeping your profit margins private.

### 3. Verification & Stock Checks
*   When a customer requests items (e.g., 20 CPVC elbows), the Admin checks stock availability. If you only have 10, you can edit the **Approved Qty** to 10 in the admin order list.
*   Upon verifying the order, the system automatically decrements the approved quantities from your inventory stock.

### 4. Custom PDF Bill Generator
*   Generates a professional bill modeled on your pre-printed pad.
*   It includes a **31-row padded grid**, your red title layout, and bank detail/authorized signature footers.

---

## ☁️ Deployment Instructions (Free Tier)

### Step 1: Deploy Database (MongoDB Atlas)
1. Sign up for a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (M0) and copy your connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.abc.mongodb.net/sri_kedareswara_db`).

### Step 2: Deploy Backend (Render)
1. Sign up on [Render](https://render.com).
2. Connect your Git repository.
3. Choose **Web Service**, set the runtime to **Node**, build command to `npm install`, and start command to `node backend/server.js`.
4. In the Environment section, add:
   *   `MONGO_URI` = *Your MongoDB Atlas connection string*
   *   `PORT` = `5000`

### Step 3: Deploy Frontend (Vercel)
1. Sign up on [Vercel](https://vercel.com).
2. Import your repository, select the `frontend` subfolder.
3. Click deploy. Vercel will host your static single-page React app completely free.
