import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Settings, 
  Search, 
  Filter, 
  Check, 
  X, 
  Plus, 
  Minus, 
  Printer, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  Layers, 
  Phone, 
  MapPin, 
  Percent, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Menu,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import { generateInvoicePDF } from './pdfGenerator';
import BrandLogo from './components/BrandLogo';
import './App.css';

const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? 'http://localhost:5000' 
  : (import.meta.env.VITE_API_BASE || '');

const UI_TRANSLATIONS = {
  // Navigation / Tabs
  "Storefront": "స్టోర్‌ఫ్రంట్",
  "Admin Panel": "అడ్మిన్ ప్యానెల్",
  "Orders Enquiries": "ఆర్డర్లు ఎంక్వైరీలు",
  "Inventory Management": "ఇన్వెంటరీ మేనేజ్‌మెంట్",
  
  // Hero / Intro
  "Request Your Materials Online": "మీ మెటీరియల్స్ ఆన్‌లైన్‌లో రిక్వెస్ట్ చేసుకోండి",
  "Add electrical and plumbing items to your cart, submit your request, and collect them ready-billed at our shop!": "కార్ట్‌కు ఎలక్ట్రికల్ మరియు ప్లంబింగ్ వస్తువులను జోడించండి, మీ రిక్వెస్ట్‌ను సమర్పించండి మరియు మా షాప్‌లో బిల్లు సిద్ధంగా ఉన్నప్పుడు వాటిని సేకరించండి!",
  
  // Filters
  "Search pipes, wires, nipples, elbows...": "పైపులు, వైర్లు, నిప్పల్స్, ఎల్బోలను వెతకండి...",
  "All": "అన్నీ",
  "Electrical": "ఎలక్ట్రికల్",
  "Plumbing": "ప్లంబింగ్",
  
  // Actions
  "Add": "జోడించు",
  "Cancel": "రద్దు చేయి",
  "Apply": "వర్తింపజేయి",
  "Save Product": "ఉత్పత్తిని సేవ్ చేయి",
  "Add Product Item": "కొత్త ఉత్పత్తిని జోడించు",
  "Edit Product Item": "ఉత్పత్తిని సవరించు",
  
  // Cart / Checkout Modal
  "Shopping Cart": "షాపింగ్ కార్ట్",
  "Subtotal:": "ఉప మొత్తము:",
  "Proceed to Request Enquiry": "ఎంక్వైరీ రిక్వెస్ట్ కోసం కొనసాగండి",
  "Submit Enquiry Request": "ఎంక్వైరీ రిక్వెస్ట్‌ను సమర్పించండి",
  "Customer Name *": "కస్టమర్ పేరు *",
  "Customer Name": "కస్టమర్ పేరు",
  "Phone Number *": "ఫోన్ నంబర్ *",
  "Address / Location *": "చిరునామా / ప్రాంతం *",
  "Delivery Preference": "డెలివరీ ప్రాధాన్యత",
  "Pickup at Shop": "షాప్ వద్ద పికప్",
  "Home Delivery": "ఇంటికి డెలివరీ",
  "Submit Enquiry": "ఎంక్వైరీని సమర్పించు",
  "Enquiry Submitted Successfully!": "ఎంక్వైరీ విజయవంతంగా సమర్పించబడింది!",
  "Your Enquiry ID is": "మీ ఎంక్వైరీ ఐడి",
  "Shop Admin has been notified. They will verify items availability and prepare your bill.": "షాప్ అడ్మిన్‌కు సమాచారం అందించబడింది. వారు వస్తువుల లభ్యతను ధృవీకరించి మీ బిల్లును సిద్ధం చేస్తారు.",
  "Back to Catalog": "క్యాటలాగ్‌కు తిరిగి వెళ్ళు",
  "Back": "వెనుకకు",
  "*Note: Final bill will be verified by the admin based on shop stock.": "*గమనిక: షాప్ స్టాక్ ఆధారంగా అడ్మిన్ ద్వారా చివరి బిల్లు ధృవీకరించబడుతుంది.",
  "Failed to submit enquiry.": "ఎంక్వైరీ సమర్పించడంలో విఫలమైంది.",
  
  // Admin Orders Tab
  "Incoming Enquiries": "వచ్చిన ఎంక్వైరీలు",
  "No order enquiries placed yet.": "ఇంకా ఎలాంటి ఆర్డర్ ఎంక్వైరీలు రాలేదు.",
  "Select an enquiry order from the sidebar to verify availability and print bills.": "లభ్యతను ధృవీకరించడానికి మరియు బిల్లులను ప్రింట్ చేయడానికి సైడ్‌బార్ నుండి ఒక ఎంక్వైరీ ఆర్డర్‌ను ఎంచుకోండి.",
  "Verify Order:": "ఆర్డర్‌ను ధృవీకరించండి:",
  "Print Bill PDF": "బిల్లు PDF ప్రింట్ చేయి",
  "Customer details": "కస్టమర్ వివరాలు",
  "Contact Phone": "సంప్రదించవలసిన ఫోన్",
  "Address": "చిరునామా",
  "Delivery preference": "డెలివరీ ప్రాధాన్యత",
  "Verify Items Availability & Quantities": "వస్తువుల లభ్యత & పరిమాణాలను ధృవీకరించండి",
  "Item Name & Size": "వస్తువు పేరు & పరిమాణం",
  "Requested Qty": "కోరిన పరిమాణం",
  "Approved Qty": "ఆమోదించిన పరిమాణం",
  "Selling Price": "అమ్మకపు ధర",
  "Total": "మొత్తం",
  "Available?": "అందుబాటులో ఉందా?",
  "Add Bill Discount": "బిల్లు డిస్కౌంట్ జోడించండి",
  "Flat Discount (₹)": "ఫ్లాట్ డిస్కౌంట్ (₹)",
  "Percentage Discount (%)": "శాతం డిస్కౌంట్ (%)",
  "Discount Applied:": "వర్తింపజేసిన డిస్కౌంట్:",
  "GRAND TOTAL:": "గ్రాండ్ టోటల్:",
  "Payment Status:": "చెల్లింపు స్థితి:",
  "Paid (Click to Toggle)": "చెల్లించబడింది (మార్చడానికి క్లిక్ చేయండి)",
  "Unpaid (Click to Mark Paid)": "చెల్లించబడలేదు (చెల్లించినట్లుగా గుర్తించడానికి క్లిక్ చేయండి)",
  "Confirm & Verify Stock Levels": "స్టాక్ స్థాయిలను నిర్ధారించండి & ధృవీకరించండి",
  "Order verified. Inventory stock counts updated.": "ఆర్డర్ ధృవీకరించబడింది. ఇన్వెంటరీ స్టాక్ కౌంట్లు అప్‌డేట్ చేయబడ్డాయి.",
  
  // Admin Inventory Tab
  "Catalog Inventory": "క్యాటలాగ్ ఇన్వెంటరీ",
  "Products": "ఉత్పత్తులు",
  "Search product name, category, subcategory...": "ఉత్పత్తి పేరు, వర్గం, ఉపవర్గాన్ని వెతకండి...",
  "Image": "చిత్రం",
  "Product Name": "ఉత్పత్తి పేరు",
  "Category": "వర్గం",
  "Subcategory": "ఉపవర్గం",
  "Size": "పరిమాణం",
  "Cost Price": "కొనుగోలు ధర",
  "Margin (%)": "మార్జిన్ (%)",
  "Actions": "చర్యలు",
  
  // Admin Add/Edit Form
  "Item Name *": "వస్తువు పేరు *",
  "Category *": "వర్గం *",
  "Subcategory *": "ఉపవర్గం *",
  "Item Type *": "వస్తువు రకం *",
  "Size / Dimension *": "పరిమాణం / కొలత *",
  "Cost Price (₹) *": "కొనుగోలు ధర (₹) *",
  "Profit Percentage (%) *": "లాభ శాతం (%) *",
  "Auto-Calculated Selling Price:": "స్వయంచాలకంగా లెక్కించబడిన అమ్మకపు ధర:",
  "Product Photo": "ఉత్పత్తి ఫోటో",
  "Upload Product Photo": "ఉత్పత్తి ఫోటోను అప్‌లోడ్ చేయి",
  "Drag & drop or click to upload": "అప్‌లోడ్ చేయడానికి డ్రాగ్ & డ్రాప్ లేదా క్లిక్ చేయండి",
  "Supports JPG, PNG, WebP": "JPG, PNG, WebP ఫైళ్ళకు సపోర్ట్ చేస్తుంది",
  "Change Photo": "ఫోటోను మార్చండి",
  "Remove Photo": "ఫోటోను తొలగించండి",
  
  // Extra Notifications
  "Loading shop inventory...": "షాప్ ఇన్వెంటరీ లోడ్ అవుతోంది...",
  "No products found matching your search. Please check again or contact us directly.": "మీరు వెతికిన ఉత్పత్తులు ఏవీ లభించలేదు. దయచేసి మళ్లీ సరిచూసుకోండి లేదా మమ్మల్ని నేరుగా సంప్రదించండి.",
  "Are you sure you want to delete this product from the inventory?": "ఈ ఉత్పత్తిని ఇన్వెంటరీ నుండి తొలగించాలనుకుంటున్నారా?",
  "Failed to save item.": "ఉత్పత్తిని సేవ్ చేయడంలో విఫలమైంది.",
  "Failed to delete item.": "ఉత్పత్తిని తొలగించడంలో విఫలమైంది.",
  "Order verified successfully! Stock levels updated.": "ఆర్డర్ విజయవంతంగా ధృవీకరించబడింది! స్టాక్ స్థాయిలు అప్‌డేట్ చేయబడ్డాయి.",
  "Unpaid": "చెల్లించబడలేదు",
  "Paid": "చెల్లించబడింది",
  "Pending": "పెండింగ్",
  "Verified": "ధృవీకరించబడింది",
  "Cancelled": "రద్దు చేయబడింది",
  "Pickup": "షాప్ పికప్",
  "Delivery": "ఇంటికి డెలివరీ",
  
  // Subcategories
  "UPVC Fittings": "యు.పి.వి.సి ఫిట్టింగ్స్",
  "UPVC Reducing Fittings": "యు.పి.వి.సి రెడ్యూసింగ్ ఫిట్టింగ్స్",
  "UPVC Pipes": "యు.పి.వి.సి పైపులు",
  "CPVC Pipes": "సి.пи.వి.సి పైపులు",
  "Metal Fittings": "మెటల్ ఫిట్టింగ్స్",
  "Cables & Wires": "కేబుల్స్ & వైర్లు",
  "Switches & Sockets": "స్విచ్‌లు & సాకెట్లు",
  "N/A": "లభ్యం కాదు",
  "Standard": "సాధారణ"
};

const WORD_TRANSLATIONS = {
  "COUPLER": "కప్లర్",
  "ELBOW": "エルボ", // Wait, let's write Telugu Unicode: "ఎల్బో"
  "TEE": "టీ",
  "PIPE": "పైప్",
  "PIPES": "పైపులు",
  "UNION": "యూనియన్",
  "ENDCAP": "ఎండ్ క్యాప్",
  "END": "ఎండ్",
  "CAP": "క్యాప్",
  "MTA": "ఎంటిఎ",
  "FTA": "ఎఫ్టిఎ",
  "VALVE": "వాల్వ్",
  "VALL": "వాల్వ్",
  "VALVES": "వాల్వ్స్",
  "NIPPLE": "నిప్పల్",
  "CONNECTOR": "కనెక్టర్",
  "BEND": "బెండ్",
  "TRAP": "ట్రాప్",
  "REDUCER": "రెడ్యూసర్",
  "BUSH": "బుష్",
  "CLAMP": "క్లాంప్",
  "ADAPTER": "అడాప్టర్",
  "FLANGE": "ఫ్లాంజ్",
  "SOCKET": "సాకెట్",
  "REDUCING": "రెడ్యూసింగ్",
  "EQUAL": "ఈక్వల్",
  "THREADED": "త్రెడెడ్",
  "THREDED": "త్రెడెడ్",
  "METAL": "మెటల్",
  "HEAVY": "హెవీ",
  "PRESTIGE": "ప్రెస్టీజ్",
  "CONCEAL": "కన్సీల్డ్",
  "CONCEALED": "కన్సీల్డ్",
  "LW": "ఎల్.డబ్ల్యు",
  "HY": "హెచ్.వై",
  "SINGLE": "సింగిల్",
  "DOUBLE": "డబుల్",
  "DOOR": "డోర్",
  "CLEANSING": "క్లెన్సింగ్",
  "WALL": "వాల్",
  "MIXER": "మిక్సర్",
  "NOMINAL": "నామినల్",
  "SIZE": "సైజ్",
  "RATES": "ధరలు",
  "PER": "ఒక్కోదానికి",
  "PC": "పీస్",
  "CPVC": "సి.పి.వి.సి",
  "UPVC": "యు.పి.వి.సి",
  "SWR": "ఎస్.డబ్ల్యు.ఆర్",
  "AGRI": "అగ్రి",
  "FINOLEX": "ఫినోలెక్స్",
  "ANCHOR": "యాంకర్",
  "ASHIRVAD": "ఆశీర్వాద్",
  "FLOWGUARD": "ఫ్లోగార్డ్",
  "EASYFIT": "ఈజీఫిట్",
  "AQUALIFE": "ఆక్వాలైఫ్",
  "AQUAGOLD": "ఆక్వాగోల్డ్",
  "GOLD": "గోల్డ్",
  "ROMA": "రోమా",
  "HOUSEWIRE": "హౌస్‌వైర్",
  "FLEXIBLE": "ఫ్లెక్సిబుల్",
  "TAPE": "టేప్",
  "M-SEAL": "ఎమ్-సీల్",
  "WIRE": "వైరు",
  "SWITCH": "స్విచ్",
  "REGULATOR": "రెగ్యులేటర్",
  "BOARD": "బోర్డు",
  "BOX": "బాక్స్",
  "MODULAR": "మాడ్యులర్",
  "S-TRAP": "ఎస్-ట్రాప్",
  "NAHANI": "నహాని",
  "GULLY": "గల్లీ",
  "BELL": "బెల్",
  "MOUTH": "మౌత్",
  "SWEPT": "స్వెప్ట్",
  "STEP": "స్టెప్",
  "OVER": "ఓవర్",
  "MOD": "మోడ్",
  "WITHOUT": "లేకుండా",
  "WITH": "తో",
  "JALI": "జాలి",
  "MTRS": "మీటర్లు"
};

// Replace Japanese elbow literal from my thought typo above
WORD_TRANSLATIONS["ELBOW"] = "ఎల్బో";

const t = (text) => {
  if (!text) return "";
  const clean = text.trim();
  const telugu = UI_TRANSLATIONS[clean];
  if (telugu) {
    return `${clean} / ${telugu}`;
  }
  return clean;
};

const tName = (name) => {
  if (!name) return "";
  
  // Split the name by whitespace to translate word-by-word
  const words = name.split(/\s+/);
  const translatedWords = words.map(word => {
    // Extract alphabetic characters and keep punctuation/numbers
    const cleanWord = word.replace(/[^a-zA-Z\-]/g, '').toUpperCase();
    const translation = WORD_TRANSLATIONS[cleanWord];
    
    if (translation) {
      // Re-attach numbers or symbols that were in the original word
      return word.toUpperCase().replace(cleanWord, translation);
    }
    return word;
  });


  
  const teluguName = translatedWords.join(" ");
  if (teluguName.toLowerCase() !== name.toLowerCase()) {
    return `${name} / ${teluguName}`;
  }
  return name;
};

function App() {
  // Billing Config state
  const [billingSettings, setBillingSettings] = useState({
    shop_name: "SRI KEDARESWARA ENTERPRISES",
    shop_address: "DOOR NO: 13-12-5, RAMA SCOIETY STREET, KOVVUR",
    proprietor_info: "PROP: N. Rajyalakshmi      PH NO: 7997696636",
    bank_name: "SBI, KOVVURU",
    bank_account: "AC.NO: 36444436717",
    bank_ifsc: "IFSC CODE: SBIN0000860",
    left_logo: "",
    right_logo: ""
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'admin'
  const [adminSubTab, setAdminSubTab] = useState('orders'); // 'orders' | 'inventory'
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [inventoryViewMode, setInventoryViewMode] = useState('list'); // 'list' | 'matrix'
  const [hoveredCell, setHoveredCell] = useState({ rowIndex: null, colIndex: null });
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return sessionStorage.getItem('isAdminUnlocked') === 'true';
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin') || params.get('mode') === 'admin') {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('isAdminUnlocked', 'true');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // --- ADMIN AUTH STATE & HANDLERS ---
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    if (!adminPassword) return;
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await fetch(`${API_BASE}/api/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setAdminPassword('');
        setLoginError('');
      } else {
        setLoginError(data.error || 'Invalid password.');
      }
    } catch (err) {
      console.error("Login verification error:", err);
      setLoginError('Error connecting to authentication server.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminUnlocked(false);
    sessionStorage.removeItem('isAdminAuthenticated');
    sessionStorage.removeItem('isAdminUnlocked');
    setActiveTab('store');
  };

  // --- STATE ---
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All'); // 'All' | 'Electrical' | 'Plumbing'
  const [subcategoryFilter, setSubcategoryFilter] = useState('All');
  
  // Cart state: { [itemId]: quantity }
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Checkout details
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryType: 'Pickup'
  });
  const [submittedOrder, setSubmittedOrder] = useState(null);

  // Admin states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [inventorySearch, setInventorySearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('All');
  const [adminSubcategoryFilter, setAdminSubcategoryFilter] = useState('All');
  const [discountType, setDiscountType] = useState('flat');
  const [discountVal, setDiscountVal] = useState(0);

  // Item Requests state
  const [itemRequests, setItemRequests] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [itemRequestForm, setItemRequestForm] = useState({ customer_name: '', customer_phone: '', item_description: '' });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSubmitSuccess, setRequestSubmitSuccess] = useState(false);

  // Item form state
  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'Plumbing',
    subcategory: '',
    item_type: '',
    size: '',
    cost_price: '',
    profit_percentage: '',
    stock_quantity: '',
    image_url: ''
  });

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const itemsRes = await fetch(`${API_BASE}/api/items`);
      const itemsData = await itemsRes.json();
      setItems(itemsData);

      const ordersRes = await fetch(`${API_BASE}/api/orders`);
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      // Load billing settings
      const settingsRes = await fetch(`${API_BASE}/api/settings`);
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setBillingSettings(settingsData);
      }

      // Load item requests
      const reqRes = await fetch(`${API_BASE}/api/item-requests`);
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setItemRequests(reqData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- CART FUNCTIONS ---
  const addToCart = (itemId) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    setCart(prev => {
      const currentQty = prev[itemId] || 0;
      return {
        ...prev,
        [itemId]: currentQty + 1
      };
    });
  };

  const updateCartQty = (itemId, qty) => {
    if (qty <= 0) {
      setCart(prev => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    } else {
      setCart(prev => ({
        ...prev,
        [itemId]: qty
      }));
    }
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, qty]) => {
      const item = items.find(i => i.id === itemId);
      return total + (item ? item.selling_price * qty : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  // Submit Order Enquiry
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (getCartItemCount() === 0) return;

    const orderPayload = {
      customer_name: customerDetails.name,
      customer_phone: customerDetails.phone,
      customer_address: customerDetails.address,
      delivery_type: customerDetails.deliveryType,
      items: Object.entries(cart).map(([itemId, qty]) => {
        const item = items.find(i => i.id === itemId);
        return {
          item_id: item.id,
          item_name: item.name,
          size: item.size,
          selling_price: item.selling_price,
          quantity: qty
        };
      })
    };

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      
      if (res.ok) {
        setSubmittedOrder(data);
        setCart({}); // clear cart
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        fetchData(); // reload orders
      } else {
        alert(data.error || t("Failed to submit enquiry."));
      }
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("Error submitting order enquiry.");
    }
  };

  // --- ADMIN INVENTORY CRUD ---
  const handleItemFormChange = (e) => {
    const { name, value } = e.target;
    setItemForm(prev => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
  };

  // Base64 file uploader helper
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemForm(prev => ({
          ...prev,
          image_url: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setItemForm(prev => ({
      ...prev,
      image_url: ''
    }));
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    const payload = {
      name: itemForm.name,
      category: itemForm.category,
      subcategory: itemForm.subcategory || 'General',
      item_type: itemForm.item_type || 'Standard',
      size: itemForm.size || 'N/A',
      cost_price: parseFloat(itemForm.cost_price) || 0,
      profit_percentage: parseFloat(itemForm.profit_percentage) || 0,
      stock_quantity: 9999,
      image_url: itemForm.image_url
    };

    try {
      let res;
      if (editingItem) {
        res = await fetch(`${API_BASE}/api/items/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE}/api/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setIsAddItemOpen(false);
        setEditingItem(null);
        setItemForm({
          name: '',
          category: 'Plumbing',
          subcategory: '',
          item_type: '',
          size: '',
          cost_price: '',
          profit_percentage: '',
          stock_quantity: '',
          image_url: ''
        });
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || t("Failed to save item."));
      }
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm(t("Are you sure you want to delete this product from the inventory?"))) return;
    try {
      const res = await fetch(`${API_BASE}/api/items/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert(t("Failed to delete item."));
      }
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const startEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      item_type: item.item_type,
      size: item.size,
      cost_price: item.cost_price,
      profit_percentage: item.profit_percentage,
      stock_quantity: item.stock_quantity,
      image_url: item.image_url || ''
    });
    setIsAddItemOpen(true);
  };

  // --- ADMIN ORDER VERIFICATION ---
  const handleOrderItemQtyChange = (index, val) => {
    if (!selectedOrder) return;
    const itemsCopy = [...selectedOrder.items];
    itemsCopy[index].approved_quantity = Math.max(0, parseInt(val, 10) || 0);
    
    // Recalculate totals locally in admin view
    let subtotal = 0;
    itemsCopy.forEach(item => {
      if (item.available_in_stock !== false) {
        subtotal += item.selling_price * item.approved_quantity;
      }
    });

    let discount = selectedOrder.discount_amount || 0;
    if (discountType === 'percentage') {
      discount = subtotal * (discountVal / 100);
    } else {
      discount = discountVal;
    }

    setSelectedOrder(prev => ({
      ...prev,
      items: itemsCopy,
      subtotal_amount: subtotal,
      total_amount: Math.max(0, subtotal - discount)
    }));
  };

  const handleOrderItemAvailabilityChange = (index, isAvailable) => {
    if (!selectedOrder) return;
    const itemsCopy = [...selectedOrder.items];
    itemsCopy[index].available_in_stock = isAvailable;

    // Recalculate totals
    let subtotal = 0;
    itemsCopy.forEach(item => {
      if (item.available_in_stock !== false) {
        subtotal += item.selling_price * item.approved_quantity;
      }
    });

    let discount = selectedOrder.discount_amount || 0;
    if (discountType === 'percentage') {
      discount = subtotal * (discountVal / 100);
    } else {
      discount = discountVal;
    }

    setSelectedOrder(prev => ({
      ...prev,
      items: itemsCopy,
      subtotal_amount: subtotal,
      total_amount: Math.max(0, subtotal - discount)
    }));
  };

  const handleApplyDiscount = () => {
    if (!selectedOrder) return;
    const subtotal = selectedOrder.subtotal_amount;
    let discAmt = 0;
    if (discountType === 'percentage') {
      discAmt = subtotal * (parseFloat(discountVal) / 100);
    } else {
      discAmt = parseFloat(discountVal) || 0;
    }

    setSelectedOrder(prev => ({
      ...prev,
      discount_amount: discAmt,
      total_amount: Math.max(0, subtotal - discAmt)
    }));
  };

  const handleVerifyOrder = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`${API_BASE}/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Verified',
          items: selectedOrder.items,
          discount_amount: selectedOrder.discount_amount,
          subtotal_amount: selectedOrder.subtotal_amount,
          total_amount: selectedOrder.total_amount
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedOrder(data);
        fetchData();
        alert(t("Order verified successfully! Stock levels updated."));
      } else {
        alert(data.error || "Failed to verify order.");
      }
    } catch (err) {
      console.error("Error verifying order:", err);
    }
  };

  const handleTogglePayment = async () => {
    if (!selectedOrder) return;
    const nextPayStatus = selectedOrder.payment_status === 'Paid' ? 'Unpaid' : 'Paid';
    try {
      const res = await fetch(`${API_BASE}/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_status: nextPayStatus
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedOrder(data);
        fetchData();
      }
    } catch (err) {
      console.error("Error updating payment status:", err);
    }
  };

  const handlePrintBill = () => {
    if (!selectedOrder) return;
    generateInvoicePDF(selectedOrder, billingSettings);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccess('');
    setSettingsError('');
    try {
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billingSettings)
      });
      const data = await res.json();
      if (res.ok) {
        setBillingSettings(data);
        setSettingsSuccess(t('Settings saved successfully!'));
      } else {
        setSettingsError(data.error || t('Failed to save settings.'));
      }
    } catch (err) {
      setSettingsError(t('Error connecting to server.'));
    } finally {
      setIsSavingSettings(false);
      setTimeout(() => { setSettingsSuccess(''); setSettingsError(''); }, 3000);
    }
  };

  const handleLogoUpload = (side, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setBillingSettings(prev => ({ ...prev, [side]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitItemRequest = async (e) => {
    e.preventDefault();
    if (!itemRequestForm.item_description.trim()) return;
    setIsSubmittingRequest(true);
    try {
      const res = await fetch(`${API_BASE}/api/item-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemRequestForm)
      });
      if (res.ok) {
        setRequestSubmitSuccess(true);
        setItemRequestForm({ customer_name: '', customer_phone: '', item_description: '' });
        setTimeout(() => {
          setRequestSubmitSuccess(false);
          setIsRequestModalOpen(false);
        }, 2500);
      }
    } catch (err) {
      console.error('Error submitting item request:', err);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleDeleteItemRequest = async (id) => {
    if (!confirm('Remove this item request?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/item-requests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItemRequests(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Error deleting item request:', err);
    }
  };

  const handleQuickAddFromRequest = (req) => {
    setEditingItem(null);
    setItemForm(prev => ({ ...prev, name: req.item_description, subcategory: '', item_type: '', size: '', cost_price: '', profit_percentage: '' }));
    setIsAddItemOpen(true);
  };

  // --- RENDER HELPERS ---
  // Subcategories logic
  const getSubcategories = () => {
    const relevantItems = items.filter(item => {
      if (categoryFilter === 'All') return true;
      return item.category === categoryFilter;
    });
    const subs = [...new Set(relevantItems.map(item => item.subcategory).filter(Boolean))];
    return ['All', ...subs];
  };

  const getAdminSubcategories = () => {
    const relevantItems = items.filter(item => {
      if (adminCategoryFilter === 'All') return true;
      return item.category === adminCategoryFilter;
    });
    const subs = [...new Set(relevantItems.map(item => item.subcategory).filter(Boolean))];
    return ['All', ...subs];
  };

  const getFilteredItemsForAdmin = () => {
    return items.filter(item => {
      const searchLower = inventorySearch.toLowerCase();
      const matchesSearch = !inventorySearch || 
                            ((item.name || '').toLowerCase().includes(searchLower)) ||
                            ((item.category || '').toLowerCase().includes(searchLower)) ||
                            ((item.subcategory || '').toLowerCase().includes(searchLower)) ||
                            ((item.item_type || '').toLowerCase().includes(searchLower)) ||
                            ((item.size || '').toLowerCase().includes(searchLower));
      
      const matchesCategory = adminCategoryFilter === 'All' || item.category === adminCategoryFilter;
      const matchesSubcategory = adminSubcategoryFilter === 'All' || item.subcategory === adminSubcategoryFilter;
      
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  };

  const getFilteredGroupedItemsForAdmin = () => {
    const filtered = getFilteredItemsForAdmin();
    const groups = {};
    filtered.forEach(item => {
      const baseName = item.name.replace(/\d+(\/\d+)?\s*(inch|mm|sq\s*mm|”|")?/gi, '').trim();
      const groupKey = `${item.category}_${item.subcategory}_${item.item_type}_${baseName}`;
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          groupKey,
          name: baseName || item.name,
          category: item.category,
          subcategory: item.subcategory,
          item_type: item.item_type,
          image_url: item.image_url || '',
          sizes: []
        };
      }
      groups[groupKey].sizes.push(item);
      if (item.image_url && !groups[groupKey].image_url) {
        groups[groupKey].image_url = item.image_url;
      }
    });

    const list = Object.values(groups);
    list.forEach(g => {
      g.sizes.sort((a, b) => {
        const valA = parseFloat(a.size) || 0;
        const valB = parseFloat(b.size) || 0;
        return valA - valB || a.size.localeCompare(b.size);
      });
    });
    return list;
  };

  const startAddVariant = (group) => {
    setEditingItem(null);
    setItemForm({
      name: group.name,
      category: group.category,
      subcategory: group.subcategory,
      item_type: group.item_type,
      size: '',
      cost_price: 0,
      profit_percentage: 0,
      stock_quantity: 0,
      available: true,
      image_url: group.image_url || ''
    });
    setIsAddItemOpen(true);
  };

  const getMatrixData = () => {
    const filtered = items.filter(item => {
      return item.category === adminCategoryFilter && item.subcategory === adminSubcategoryFilter;
    });

    const columns = [...new Set(filtered.map(item => item.item_type).filter(Boolean))].sort();

    const rowsMap = {};
    filtered.forEach(item => {
      let rowName = item.name || '';
      const brand = item.item_type || '';
      if (brand && rowName.startsWith(brand)) {
        rowName = rowName.substring(brand.length).trim();
      }
      
      if (!rowsMap[rowName]) {
        rowsMap[rowName] = {
          rowName,
          cells: {}
        };
      }
      rowsMap[rowName].cells[item.item_type] = item;
    });

    const rows = Object.values(rowsMap).sort((a, b) => a.rowName.localeCompare(b.rowName));
    return { columns, rows };
  };

  const handleCreateMatrixCell = (rowName, brand) => {
    setEditingItem(null);
    setItemForm({
      name: rowName,
      category: adminCategoryFilter,
      subcategory: adminSubcategoryFilter,
      item_type: brand,
      size: '1 Module',
      cost_price: 0,
      profit_percentage: 0,
      stock_quantity: 0,
      available: true,
      image_url: ''
    });
    setIsAddItemOpen(true);
  };

  const handleAddNewBrandColumn = () => {
    const brandName = prompt(t("Enter Brand/Series Name (e.g. GM Air, Savio, Cuba):"));
    if (brandName && brandName.trim()) {
      setEditingItem(null);
      setItemForm({
        name: '',
        category: adminCategoryFilter,
        subcategory: adminSubcategoryFilter,
        item_type: brandName.trim(),
        size: '1 Module',
        cost_price: 0,
        profit_percentage: 0,
        stock_quantity: 0,
        available: true,
        image_url: ''
      });
      setIsAddItemOpen(true);
    }
  };

  const handleAddNewProductRow = () => {
    const prodName = prompt(t("Enter Product Name (e.g. 1 Way Switch, 2 Way Switch, 6A Skt):"));
    if (prodName && prodName.trim()) {
      const { columns } = getMatrixData();
      const firstBrand = columns[0] || 'General';
      setEditingItem(null);
      setItemForm({
        name: prodName.trim(),
        category: adminCategoryFilter,
        subcategory: adminSubcategoryFilter,
        item_type: firstBrand,
        size: '1 Module',
        cost_price: 0,
        profit_percentage: 0,
        stock_quantity: 0,
        available: true,
        image_url: ''
      });
      setIsAddItemOpen(true);
    }
  };

  // Products grouping (group by type/name so we group multiple sizes of same CPVC pipe)
  const getFilteredGroupedItems = () => {
    let filtered = items.filter(item => {
      const matchesSearch = ((item.name || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
                            ((item.subcategory || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
                            ((item.item_type || '').toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'All' ? true : item.category === categoryFilter;
      const matchesSub = subcategoryFilter === 'All' ? true : item.subcategory === subcategoryFilter;

      return matchesSearch && matchesCategory && matchesSub && item.available;
    });

    // Grouping by "base product name" or "name" (without size)
    // To keep it simple, we group items that share: Category + Subcategory + Item_Type + base name
    // (excluding size)
    const groups = {};
    filtered.forEach(item => {
      // Group key: Category_Subcategory_Type_Name (we extract base name)
      // e.g. "CPVC Pipe" vs "PVC Elbow"
      const baseName = item.name.replace(/\d+(\/\d+)?\s*(inch|mm|sq\s*mm|”|")?/gi, '').trim();
      const groupKey = `${item.category}_${item.subcategory}_${item.item_type}_${baseName}`;
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          name: baseName || item.name,
          category: item.category,
          subcategory: item.subcategory,
          item_type: item.item_type,
          image_url: item.image_url || '',
          sizes: []
        };
      }
      // If it doesn't already contain this size, push it
      groups[groupKey].sizes.push(item);
      if (item.image_url && !groups[groupKey].image_url) {
        groups[groupKey].image_url = item.image_url;
      }
    });

    return Object.values(groups);
  };

  const subcategories = getSubcategories();
  const groupedProducts = getFilteredGroupedItems();

  // Price calculations helper
  const liveCalculatedSellingPrice = () => {
    const cost = parseFloat(itemForm.cost_price) || 0;
    const profit = parseFloat(itemForm.profit_percentage) || 0;
    return (cost + (cost * profit / 100)).toFixed(2);
  };

  return (
    <div className="app-container">
      {/* --- HEADER NAVBAR --- */}
      <header className="compact-header glass-header">
        <div className="header-brand-wrapper">
          <div className="header-brand">
            <BrandLogo variant="horizontal" size="md" />
          </div>

          <button 
            type="button"
            className="mobile-nav-toggle luxury-hamburger"
            onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
            aria-expanded={isNavMenuOpen}
            aria-label="Toggle navigation menu"
            aria-controls="header-navigation-menu"
          >
            {isNavMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div 
          id="header-navigation-menu"
          className={`header-navigation ${isNavMenuOpen ? 'mobile-show' : ''}`}
        >
          <button 
            type="button"
            className={`btn ${activeTab === 'store' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setActiveTab('store');
              setIsNavMenuOpen(false);
            }}
          >
            <ShoppingBag size={18} /> {t("Storefront")}
          </button>

          <button
            className="btn btn-secondary request-item-nav-btn"
            onClick={() => {
              setIsRequestModalOpen(true);
              setIsNavMenuOpen(false);
            }}
          >
            📝 {t("Request an Item")}
          </button>
          
          {isAdminUnlocked && (
            <button 
              type="button"
              className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setActiveTab('admin');
                fetchData();
                setIsNavMenuOpen(false);
              }}
            >
              <Settings size={18} /> {t("Admin Panel")}
            </button>
          )}
        </div>
      </header>

      {/* --- STOREFRONT SCREEN --- */}
      {activeTab === 'store' && (
        <main className="container fade-in">
          {submittedOrder && (
            <div className="success-banner glass-panel fade-in">
              <CheckCircle2 size={40} className="text-success" />
              <div>
                <h2>{t("Enquiry Submitted Successfully!")}</h2>
                <p>{t("Your Enquiry ID is")} <strong>{submittedOrder.enquiry_id}</strong>.</p>
                <p>{t("Shop Admin has been notified. They will verify items availability and prepare your bill.")}</p>
                <button className="btn btn-secondary" onClick={() => setSubmittedOrder(null)}>{t("Back to Catalog")}</button>
              </div>
            </div>
          )}

          {/* --- REFINED HERO CONTAINER --- */}
          <section className="refined-hero-card glass-panel fade-in">
            {/* 1. ONE Search Bar */}
            <div className="single-hero-search-wrapper">
              <Search size={20} className="hero-search-icon" />
              <input 
                type="text" 
                className="hero-search-input"
                placeholder={t("Search pipes, fittings, wires, switches...")} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && <X size={20} className="hero-clear-icon" onClick={() => setSearchTerm('')} />}
            </div>

            {/* 2. Equal Width & Equal Height Category Cards */}
            <div className="hero-equal-category-grid">
              <div 
                className={`equal-cat-card card-plumbing ${categoryFilter === 'Plumbing' && subcategoryFilter === 'All' ? 'active' : ''}`}
                onClick={() => {
                  setCategoryFilter('Plumbing');
                  setSubcategoryFilter('All');
                }}
              >
                <div className="cat-icon-circle bg-blue">🚰</div>
                <div className="cat-card-text">
                  <strong>{t("Plumbing")}</strong>
                  <span className="te-subtext">ప్లంబింగ్</span>
                  <span className="desc-subtext">Pipes • Fittings • Valves</span>
                </div>
                <div className="cat-arrow-badge bg-blue-arrow">›</div>
              </div>

              <div 
                className={`equal-cat-card card-electrical ${categoryFilter === 'Electrical' && subcategoryFilter === 'All' ? 'active' : ''}`}
                onClick={() => {
                  setCategoryFilter('Electrical');
                  setSubcategoryFilter('All');
                }}
              >
                <div className="cat-icon-circle bg-amber">⚡</div>
                <div className="cat-card-text">
                  <strong>{t("Electrical")}</strong>
                  <span className="te-subtext">ఎలక్ట్రికల్</span>
                  <span className="desc-subtext">Wires • Switches • MCB</span>
                </div>
                <div className="cat-arrow-badge bg-amber-arrow">›</div>
              </div>
            </div>

            {/* 3. Equal Height & Equal Width Action Buttons */}
            <div className="hero-equal-actions-row">
              <button 
                className="btn-hero-action primary-action"
                onClick={() => {
                  const catalogElem = document.getElementById('catalog-products-list');
                  if (catalogElem) catalogElem.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Browse Products →
              </button>

              <a href="tel:7997696636" className="btn-hero-action secondary-action">
                📞 Contact Us
              </a>
            </div>

            {/* 4. Trust Bar */}
            <div className="hero-trust-indicators-row">
              <span className="trust-item"><CheckCircle2 size={16} className="check-icon" /> Genuine Products</span>
              <span className="trust-item"><CheckCircle2 size={16} className="check-icon" /> Best Prices</span>
              <span className="trust-item"><CheckCircle2 size={16} className="check-icon" /> Expert Support</span>
            </div>
          </section>

          <div id="catalog-products-list"></div>

          {/* Products Catalog Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t("Loading shop inventory...")}</p>
            </div>
          ) : groupedProducts.length === 0 ? (
            <div className="empty-catalog glass-panel">
              <AlertCircle size={32} />
              <p>{t("No products found matching your search. Please check again or contact us directly.")}</p>
            </div>
          ) : (
            <div className="products-grid">
              {groupedProducts.map((group, idx) => (
                <div key={idx} className="product-card glass-panel fade-in">
                  <div className="product-image">
                    {group.image_url ? (
                      <img src={group.image_url} alt={tName(group.name)} />
                    ) : (
                      <div className="image-placeholder">
                        <ImageIcon size={32} />
                        <span>{t(group.category)}</span>
                      </div>
                    )}
                    <span className="category-tag">{t(group.category)}</span>
                  </div>

                  <div className="product-details">
                    <h3>{tName(group.name)}</h3>
                    <p className="item-meta">{t(group.subcategory)} | {group.item_type}</p>
                    
                    {/* Sizes listing grid inside the card */}
                    {group.sizes.length === 1 && (group.sizes[0].size === 'N/A' || group.sizes[0].size === 'Standard' || !group.sizes[0].size) ? (
                      // Single item layout without nested size container
                      <div className="single-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)' }}>
                        <span className="price-tag">₹{group.sizes[0].selling_price.toFixed(2)} / {t(group.sizes[0].unit || 'pc')}</span>
                        <div className="single-item-actions">
                          {(cart[group.sizes[0].id] || 0) > 0 ? (
                            <div className="qty-picker">
                              <button onClick={() => updateCartQty(group.sizes[0].id, (cart[group.sizes[0].id] || 0) - 1)}><Minus size={14} /></button>
                              <input 
                                type="number" 
                                value={cart[group.sizes[0].id] || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  updateCartQty(group.sizes[0].id, isNaN(val) ? 0 : val);
                                }}
                                onBlur={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (isNaN(val) || val <= 0) updateCartQty(group.sizes[0].id, 0);
                                }}
                              />
                              <button onClick={() => addToCart(group.sizes[0].id)}><Plus size={14} /></button>
                            </div>
                          ) : (
                            <button 
                              className="btn btn-secondary btn-sm"
                              onClick={() => addToCart(group.sizes[0].id)}
                            >
                              {t("Add")}
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Multiple sizes list container
                      <div className="sizes-container">
                        {group.sizes.map(sizeItem => {
                          const cartQty = cart[sizeItem.id] || 0;
                          return (
                            <div key={sizeItem.id} className="size-row">
                              <div className="size-info">
                                <span className="size-label">{t(sizeItem.size)}</span>
                                <span className="price-tag">₹{sizeItem.selling_price.toFixed(2)} / {t(sizeItem.unit || 'pc')}</span>
                              </div>

                              <div className="size-actions">
                                {cartQty > 0 ? (
                                  <div className="qty-picker">
                                    <button onClick={() => updateCartQty(sizeItem.id, cartQty - 1)}><Minus size={14} /></button>
                                    <input 
                                      type="number" 
                                      value={cartQty}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        updateCartQty(sizeItem.id, isNaN(val) ? 0 : val);
                                      }}
                                      onBlur={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        if (isNaN(val) || val <= 0) updateCartQty(sizeItem.id, 0);
                                      }}
                                    />
                                    <button onClick={() => addToCart(sizeItem.id)}>
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <button 
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => addToCart(sizeItem.id)}
                                  >
                                    {t("Add")}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Floating Cart Button */}
          {getCartItemCount() > 0 && (
            <button className="floating-cart-btn" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={24} />
              <span className="cart-badge">{getCartItemCount()}</span>
              <span className="cart-price">₹{getCartTotal().toFixed(2)}</span>
            </button>
          )}

          {/* --- CART DRAWER OVERLAY --- */}
          {isCartOpen && (
            <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
              <div className="drawer-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                  <h2>{t("Shopping Cart")} ({getCartItemCount()})</h2>
                  <button className="btn-close" onClick={() => setIsCartOpen(false)}><X size={20} /></button>
                </div>

                <div className="drawer-body">
                  {Object.entries(cart).map(([itemId, qty]) => {
                    const item = items.find(i => i.id === itemId);
                    if (!item) return null;
                    return (
                      <div key={itemId} className="cart-item glass-panel">
                        <div className="cart-item-info">
                          <h4>{tName(item.name)}</h4>
                          <p>{t("Size")}: {t(item.size)} | {t("Category")}: {t(item.category)}</p>
                          <span className="item-price">₹{item.selling_price.toFixed(2)} {t("each")}</span>
                        </div>

                        <div className="cart-item-actions">
                          <div className="qty-picker">
                            <button onClick={() => updateCartQty(item.id, qty - 1)}><Minus size={14} /></button>
                            <input 
                              type="number" 
                              value={qty}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                updateCartQty(item.id, isNaN(val) ? 0 : val);
                              }}
                              onBlur={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (isNaN(val) || val <= 0) updateCartQty(item.id, 0);
                              }}
                            />
                            <button onClick={() => updateCartQty(item.id, qty + 1)}><Plus size={14} /></button>
                          </div>
                          <span className="item-subtotal">₹{(item.selling_price * qty).toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="drawer-footer">
                  <div className="subtotal-row">
                    <span>{t("Subtotal:")}</span>
                    <span>₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <p className="footer-notice">{t("*Note: Final bill will be verified by the admin based on shop stock.")}</p>
                  <button className="btn btn-primary btn-block" onClick={() => setIsCheckoutOpen(true)}>
                    {t("Proceed to Request Enquiry")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- CHECKOUT FORM MODAL --- */}
          {isCheckoutOpen && (
            <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
              <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{t("Submit Enquiry Request")}</h2>
                  <button className="btn-close" onClick={() => setIsCheckoutOpen(false)}><X size={20} /></button>
                </div>
                <form onSubmit={handleCheckoutSubmit}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label className="form-label">{t("Customer Name *")}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        required 
                        value={customerDetails.name}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Ramesh Kumar"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t("Phone Number *")}</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        required 
                        value={customerDetails.phone}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="e.g. 9876543210"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t("Address / Location *")}</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        required 
                        value={customerDetails.address}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="e.g. Kovvuru"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t("Delivery Preference")}</label>
                      <select 
                        className="form-select"
                        value={customerDetails.deliveryType}
                        onChange={(e) => setCustomerDetails(prev => ({ ...prev, deliveryType: e.target.value }))}
                      >
                        <option value="Pickup">{t("Pickup at Shop")}</option>
                        <option value="Delivery">{t("Home Delivery")}</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsCheckoutOpen(false)}>{t("Cancel")}</button>
                    <button type="submit" className="btn btn-primary">{t("Submit Enquiry")}</button>
                  </div>
                </form>
              </div>
            </div>
          )}


          {/* Customer Item Request Modal */}
          {isRequestModalOpen && (
            <div className="modal-overlay" onClick={() => setIsRequestModalOpen(false)}>
              <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                <div className="modal-header">
                  <h2>📝 {t("Request an Item")}</h2>
                  <button className="btn-close" onClick={() => setIsRequestModalOpen(false)}><X size={20} /></button>
                </div>
                {requestSubmitSuccess ? (
                  <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
                    <CheckCircle2 size={48} style={{ color: '#10b981', marginBottom: '1rem' }} />
                    <h3 style={{ color: '#10b981' }}>{t("Request Submitted!")}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{t("The shop admin will review your request and add the item if possible.")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitItemRequest}>
                    <div className="modal-body">
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {t("Can't find what you're looking for? Let us know and we'll try to stock it!")}
                      </p>
                      <div className="form-group">
                        <label className="form-label">{t("Your Name")}</label>
                        <input className="form-input" placeholder={t("e.g. Ravi Kumar")} value={itemRequestForm.customer_name} onChange={e => setItemRequestForm(p => ({ ...p, customer_name: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t("Phone Number")}</label>
                        <input className="form-input" type="tel" placeholder="9876543210" value={itemRequestForm.customer_phone} onChange={e => setItemRequestForm(p => ({ ...p, customer_phone: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t("Describe the Item Needed *")}</label>
                        <textarea
                          className="form-input"
                          rows={3}
                          required
                          placeholder={t("e.g. CPVC 1 inch elbow, LED 9W bulb, GI pipe 1/2 inch...")}
                          value={itemRequestForm.item_description}
                          onChange={e => setItemRequestForm(p => ({ ...p, item_description: e.target.value }))}
                          style={{ resize: 'vertical' }}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setIsRequestModalOpen(false)}>{t("Cancel")}</button>
                      <button type="submit" className="btn btn-primary" disabled={isSubmittingRequest}>
                        {isSubmittingRequest ? t("Submitting...") : t("Submit Request")}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Customer Item Request Modal */}
          {isRequestModalOpen && (
            <div className="modal-overlay" onClick={() => setIsRequestModalOpen(false)}>
              <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                <div className="modal-header">
                  <h2>📝 {t("Request an Item")}</h2>
                  <button className="btn-close" onClick={() => setIsRequestModalOpen(false)}><X size={20} /></button>
                </div>
                {requestSubmitSuccess ? (
                  <div className="modal-body" style={{ textAlign: 'center', padding: '2rem' }}>
                    <CheckCircle2 size={48} style={{ color: '#10b981', marginBottom: '1rem' }} />
                    <h3 style={{ color: '#10b981' }}>{t("Request Submitted!")}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{t("The shop admin will review your request and add the item if possible.")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitItemRequest}>
                    <div className="modal-body">
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {t("Can't find what you're looking for? Let us know and we'll try to stock it!")}
                      </p>
                      <div className="form-group">
                        <label className="form-label">{t("Your Name")}</label>
                        <input className="form-input" placeholder={t("e.g. Ravi Kumar")} value={itemRequestForm.customer_name} onChange={e => setItemRequestForm(p => ({ ...p, customer_name: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t("Phone Number")}</label>
                        <input className="form-input" type="tel" placeholder="9876543210" value={itemRequestForm.customer_phone} onChange={e => setItemRequestForm(p => ({ ...p, customer_phone: e.target.value }))} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">{t("Describe the Item Needed *")}</label>
                        <textarea
                          className="form-input"
                          rows={3}
                          required
                          placeholder={t("e.g. CPVC 1 inch elbow, LED 9W bulb, GI pipe 1/2 inch...")}
                          value={itemRequestForm.item_description}
                          onChange={e => setItemRequestForm(p => ({ ...p, item_description: e.target.value }))}
                          style={{ resize: 'vertical' }}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setIsRequestModalOpen(false)}>{t("Cancel")}</button>
                      <button type="submit" className="btn btn-primary" disabled={isSubmittingRequest}>
                        {isSubmittingRequest ? t("Submitting...") : t("Submit Request")}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </main>
      )}

      {/* --- ADMIN PANEL SCREEN --- */}
      {activeTab === 'admin' && (
        <main className="container fade-in">
          {!isAdminAuthenticated ? (
            <div className="admin-login-wrapper">
              <div className="admin-login-card glass-panel fade-in">
                <div className="login-header">
                  <div className="lock-icon-container">
                    <Lock size={32} />
                  </div>
                  <h2>{t("Admin Panel Authentication")} / అడ్మిన్ లాగిన్</h2>
                  <p>Please enter your password to manage orders and catalog inventory.</p>
                </div>
                
                <form onSubmit={handleAdminLoginSubmit}>
                  <div className="form-group">
                    <label className="form-label">{t("Password")} / పాస్‌వర్డ్</label>
                    <div className="password-input-wrapper">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="form-input"
                        placeholder="••••••••"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                      />
                      <button 
                        type="button" 
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="login-error-msg fade-in">
                      <AlertCircle size={16} />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="login-actions">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setActiveTab('store')}
                    >
                      {t("Back to Store")}
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <>
                          <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', display: 'inline-block' }}></div>
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <span>{t("Login")}</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              {/* Admin Header Tabs */}
              <div className="admin-tabs glass-panel">
                <div className="admin-tabs-nav">
                  <button 
                    className={`admin-tab-btn ${adminSubTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setAdminSubTab('orders')}
                  >
                    📋 {t("Orders Enquiries")}
                  </button>
                  <button 
                    className={`admin-tab-btn ${adminSubTab === 'inventory' ? 'active' : ''}`}
                    onClick={() => setAdminSubTab('inventory')}
                  >
                    📦 {t("Inventory Management")}
                  </button>
                  <button 
                    className={`admin-tab-btn ${adminSubTab === 'billing' ? 'active' : ''}`}
                    onClick={() => setAdminSubTab('billing')}
                  >
                    🧾 {t("Billing Settings")}
                  </button>
                </div>
                
                <button 
                  type="button"
                  className="btn btn-danger btn-sm admin-logout-btn"
                  onClick={handleAdminLogout}
                >
                  Logout / లాగ్అవుట్
                </button>
              </div>

          {/* --- ADMIN ORDERS SUBTAB --- */}
          {adminSubTab === 'orders' && (
            <div className={`admin-orders-layout ${selectedOrder ? 'has-selected' : ''}`}>
              {/* Orders List */}
              <div className="orders-sidebar glass-panel">
                <h3>{t("Incoming Enquiries")}</h3>
                {orders.length === 0 ? (
                  <p className="empty-text">{t("No order enquiries placed yet.")}</p>
                ) : (
                  <div className="orders-list-group">
                    {orders.map(order => (
                      <div 
                        key={order.id} 
                        className={`order-list-card ${selectedOrder?.id === order.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedOrder(order);
                          setDiscountVal(0);
                        }}
                      >
                        <div className="order-card-header">
                          <span className="enquiry-id">{order.enquiry_id}</span>
                          <span className="order-date">{new Date(order.created_at).toLocaleDateString('en-GB')}</span>
                        </div>
                        <h4>{order.customer_name}</h4>
                        <div className="order-card-footer">
                          <span className={`badge ${order.status === 'Verified' ? 'badge-success' : 'badge-warning'}`}>
                            {t(order.status)}
                          </span>
                          <span className={`badge ${order.payment_status === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                            {t(order.payment_status)}
                          </span>
                          <strong className="order-amount">₹{order.total_amount.toFixed(2)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Verification Workspace */}
              <div className="order-workspace">
                {selectedOrder ? (
                  <div className="order-detail-view glass-panel fade-in">
                    <div className="workspace-header">
                      <div className="workspace-header-title">
                        <button 
                          type="button"
                          className="btn btn-secondary mobile-back-btn" 
                          onClick={() => setSelectedOrder(null)}
                        >
                          ← {t("Back")}
                        </button>
                        <div>
                          <h2 className="verify-order-heading">
                            <span>{t("Verify Order:")}</span> 
                            <span className="order-id-tag">{selectedOrder.enquiry_id}</span>
                          </h2>
                          <p className="order-date">Received: {new Date(selectedOrder.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="workspace-actions">
                        <button className="btn btn-secondary" onClick={handlePrintBill}>
                          <Printer size={16} /> {t("Print Bill PDF")}
                        </button>
                      </div>
                    </div>

                    {/* Customer Info Card */}
                    <div className="customer-info-box glass-panel">
                      <h3>{t("Customer details")}</h3>
                      <div className="info-grid">
                        <div>
                          <span className="info-label">{t("Customer Name")}</span>
                          <span className="info-value">{selectedOrder.customer_name}</span>
                        </div>
                        <div>
                          <span className="info-label"><Phone size={12} /> {t("Contact Phone")}</span>
                          <span className="info-value">{selectedOrder.customer_phone}</span>
                        </div>
                        <div>
                          <span className="info-label"><MapPin size={12} /> {t("Address")}</span>
                          <span className="info-value">{selectedOrder.customer_address}</span>
                        </div>
                        <div>
                          <span className="info-label">{t("Delivery preference")}</span>
                          <span className="info-value badge badge-primary">{t(selectedOrder.delivery_type)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Table / Cards of items with availability toggle & qty checks */}
                    <div className="order-items-verification">
                      <h3>{t("Verify Items Availability & Quantities")}</h3>
                      
                      {/* Desktop Table View */}
                      <table className="verify-table desktop-only-table">
                        <thead>
                          <tr>
                            <th>{t("Item Name & Size")}</th>
                            <th>{t("Requested Qty")}</th>
                            <th>{t("Approved Qty")}</th>
                            <th>{t("Selling Price")}</th>
                            <th>{t("Total")}</th>
                            <th>{t("Available?")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, idx) => {
                            return (
                              <tr key={idx} className={item.available_in_stock === false ? 'row-disabled' : ''}>
                                <td>
                                  <div className="item-name-cell">
                                    <strong>{tName(item.item_name)}</strong>
                                    <span className="size-label">{t(item.size)}</span>
                                  </div>
                                </td>
                                <td>{item.requested_quantity}</td>
                                <td>
                                  <input 
                                    type="number" 
                                    className="form-input verify-qty-input"
                                    value={item.approved_quantity}
                                    disabled={item.available_in_stock === false || selectedOrder.status === 'Verified'}
                                    onChange={(e) => handleOrderItemQtyChange(idx, e.target.value)}
                                  />
                                </td>
                                <td>
                                  ₹{item.selling_price.toFixed(2)}
                                </td>
                                <td>
                                  ₹{(item.selling_price * item.approved_quantity).toFixed(2)}
                                </td>
                                <td>
                                  <input 
                                    type="checkbox" 
                                    className="verify-checkbox"
                                    checked={item.available_in_stock !== false}
                                    disabled={selectedOrder.status === 'Verified'}
                                    onChange={(e) => handleOrderItemAvailabilityChange(idx, e.target.checked)}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {/* Mobile Cards View */}
                      <div className="verify-items-mobile-list mobile-only-list">
                        {selectedOrder.items.map((item, idx) => (
                          <div 
                            key={idx} 
                            className={`verify-item-card glass-panel ${item.available_in_stock === false ? 'item-disabled' : ''}`}
                          >
                            <div className="verify-card-header">
                              <div>
                                <strong className="verify-item-name">{tName(item.item_name)}</strong>
                                <span className="size-label">{t(item.size)}</span>
                              </div>
                              <label className="availability-toggle-label">
                                <span>{t("In Stock?")}</span>
                                <input 
                                  type="checkbox" 
                                  className="verify-checkbox"
                                  checked={item.available_in_stock !== false}
                                  disabled={selectedOrder.status === 'Verified'}
                                  onChange={(e) => handleOrderItemAvailabilityChange(idx, e.target.checked)}
                                />
                              </label>
                            </div>

                            <div className="verify-card-body">
                              <div className="verify-card-row">
                                <span className="v-label">{t("Requested Qty")}</span>
                                <span className="v-value">{item.requested_quantity}</span>
                              </div>
                              <div className="verify-card-row">
                                <span className="v-label">{t("Approved Qty")}</span>
                                <input 
                                  type="number" 
                                  className="form-input verify-qty-input-mobile"
                                  value={item.approved_quantity}
                                  disabled={item.available_in_stock === false || selectedOrder.status === 'Verified'}
                                  onChange={(e) => handleOrderItemQtyChange(idx, e.target.value)}
                                />
                              </div>
                              <div className="verify-card-row">
                                <span className="v-label">{t("Selling Price")}</span>
                                <span className="v-value">₹{item.selling_price.toFixed(2)}</span>
                              </div>
                              <div className="verify-card-row total-highlight-row">
                                <span className="v-label">{t("Total")}</span>
                                <strong className="v-total-price">₹{(item.selling_price * item.approved_quantity).toFixed(2)}</strong>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Billing Summary & Actions */}
                    <div className="bill-calculations-box glass-panel">
                      <div className="discount-manager">
                        <h4>{t("Add Bill Discount")}</h4>
                        <div className="discount-inputs">
                          <select 
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value)}
                            className="form-select"
                            disabled={selectedOrder.status === 'Verified'}
                          >
                            <option value="flat">{t("Flat Discount (₹)")}</option>
                            <option value="percentage">{t("Percentage Discount (%)")}</option>
                          </select>
                          <input 
                            type="number" 
                            className="form-input" 
                            placeholder="0"
                            value={discountVal}
                            disabled={selectedOrder.status === 'Verified'}
                            onChange={(e) => setDiscountVal(parseFloat(e.target.value) || 0)}
                          />
                          <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handleApplyDiscount}
                            disabled={selectedOrder.status === 'Verified'}
                          >
                            {t("Apply")}
                          </button>
                        </div>
                      </div>

                      <div className="summary-math">
                        <div className="summary-row">
                          <span>{t("Subtotal:")}</span>
                          <span>₹{selectedOrder.subtotal_amount.toFixed(2)}</span>
                        </div>
                        <div className="summary-row text-danger">
                          <span>{t("Discount Applied:")}</span>
                          <span>-₹{(selectedOrder.discount_amount || 0).toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="summary-row grand-total-row">
                          <span>{t("GRAND TOTAL:")}</span>
                          <span>₹{selectedOrder.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Final Actions */}
                    <div className="workspace-footer">
                      <div className="payment-controls">
                        <span className="label">{t("Payment Status:")}</span>
                        <button 
                          onClick={handleTogglePayment}
                          className={`btn ${selectedOrder.payment_status === 'Paid' ? 'btn-primary' : 'btn-danger'}`}
                        >
                          {selectedOrder.payment_status === 'Paid' ? t('Paid (Click to Toggle)') : t('Unpaid (Click to Mark Paid)')}
                        </button>
                      </div>

                      {selectedOrder.status === 'Pending' ? (
                        <button className="btn btn-primary" onClick={handleVerifyOrder}>
                          {t("Confirm & Verify Stock Levels")}
                        </button>
                      ) : (
                        <div className="verified-success">
                          <CheckCircle2 size={18} className="text-success" />
                          <span>{t("Order verified. Inventory stock counts updated.")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="workspace-empty glass-panel">
                    <Database size={48} />
                    <p>{t("Select an enquiry order from the sidebar to verify availability and print bills.")}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- ADMIN INVENTORY SUBTAB --- */}
          {adminSubTab === 'inventory' && (
            <div className="inventory-workspace fade-in">

              {/* Customer Item Requests Panel */}
              {itemRequests.length > 0 && (
                <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📩 {t("Customer Item Requests")}
                    <span style={{ background: '#e11d48', color: '#fff', borderRadius: '999px', fontSize: '0.72rem', padding: '2px 8px', fontWeight: 700 }}>{itemRequests.length}</span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {itemRequests.map(req => (
                      <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '0.75rem 1rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '180px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{req.item_description}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>
                            {req.customer_name && <span>👤 {req.customer_name}</span>}
                            {req.customer_phone && <span style={{ marginLeft: '0.75rem' }}>📞 {req.customer_phone}</span>}
                            <span style={{ marginLeft: '0.75rem' }}>🕐 {new Date(req.created_at).toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleQuickAddFromRequest(req)}
                            title="Add this item to catalog"
                          >
                            <Plus size={14} /> {t("Add to Catalog")}
                          </button>
                          <button
                            className="btn btn-danger btn-sm icon-btn"
                            onClick={() => handleDeleteItemRequest(req.id)}
                            title="Dismiss request"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="inventory-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0 }}>{t("Catalog Inventory")} ({getFilteredGroupedItemsForAdmin().reduce((acc, g) => acc + g.sizes.length, 0)} {t("Products")})</h2>
                {adminCategoryFilter === 'Electrical' && (
                  <div className="view-mode-toggle" style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
                    <button 
                      type="button" 
                      className={`btn btn-sm ${inventoryViewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setInventoryViewMode('list')}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', margin: 0, border: 'none' }}
                    >
                      📋 {t("List View")}
                    </button>
                    <button 
                      type="button" 
                      className={`btn btn-sm ${inventoryViewMode === 'matrix' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setInventoryViewMode('matrix')}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', margin: 0, border: 'none' }}
                    >
                      📊 {t("Ledger Grid")}
                    </button>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div className="search-box admin-search-inventory" style={{ margin: 0 }}>
                    <Search size={18} className="search-icon" />
                    <input 
                      type="text" 
                      placeholder={t("Search name, type, size...")} 
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                    />
                    {inventorySearch && <X size={18} className="clear-icon" onClick={() => setInventorySearch('')} />}
                  </div>
                  <button className="btn btn-primary" onClick={() => { setEditingItem(null); setIsAddItemOpen(true); }} style={{ margin: 0 }}>
                    <Plus size={16} /> {t("Add Product Item")}
                  </button>
                </div>
              </div>

              {/* Category selector chips */}
              <div className="catalog-controls glass-panel" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>{t("Filter Category:")}</span>
                  <button 
                    type="button"
                    className={`filter-chip ${adminCategoryFilter === 'All' ? 'active' : ''}`}
                    onClick={() => { setAdminCategoryFilter('All'); setAdminSubcategoryFilter('All'); }}
                  >
                    {t("All")}
                  </button>
                  <button 
                    type="button"
                    className={`filter-chip ${adminCategoryFilter === 'Electrical' ? 'active' : ''}`}
                    onClick={() => { setAdminCategoryFilter('Electrical'); setAdminSubcategoryFilter('All'); }}
                  >
                    ⚡ {t("Electrical")}
                  </button>
                  <button 
                    type="button"
                    className={`filter-chip ${adminCategoryFilter === 'Plumbing' ? 'active' : ''}`}
                    onClick={() => { setAdminCategoryFilter('Plumbing'); setAdminSubcategoryFilter('All'); }}
                  >
                    🚰 {t("Plumbing")}
                  </button>
                </div>

                {/* Subcategories selector chips */}
                {getAdminSubcategories().length > 1 && (
                  <div className="subcategory-chips fade-in" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem', width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                    {getAdminSubcategories().map(sub => (
                      <button
                        key={sub}
                        type="button"
                        className={`sub-chip ${adminSubcategoryFilter === sub ? 'active' : ''}`}
                        onClick={() => setAdminSubcategoryFilter(sub)}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                      >
                        {t(sub)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Conditional Ledger Matrix / Grouped List UI */}
              {inventoryViewMode === 'matrix' ? (
                adminSubcategoryFilter === 'All' ? (
                  <div className="glass-panel fade-in" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-md)' }}>
                    <Database size={48} style={{ color: 'var(--accent-primary)', opacity: 0.8 }} />
                    <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.2rem' }}>{t("Select an Electrical Subcategory")}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1rem' }}>
                      {t("To display the ledger matrix price list, please select a specific subcategory filter below:")}
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {getAdminSubcategories().filter(sub => sub !== 'All').map(sub => (
                        <button
                          key={sub}
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setAdminSubcategoryFilter(sub)}
                          style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem', margin: 0 }}
                        >
                          {t(sub)}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive glass-panel fade-in" style={{ overflowX: 'auto' }}>
                    <table className="ledger-table">
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', minWidth: '180px', position: 'sticky', left: 0, zIndex: 3, backgroundColor: 'var(--bg-tertiary)' }}>
                            {t("Product Description")}
                          </th>
                          {getMatrixData().columns.map((col, colIdx) => (
                            <th 
                              key={col} 
                              className={hoveredCell.colIndex === colIdx ? 'ledger-crosshair-col' : ''}
                              style={{ minWidth: '120px' }}
                            >
                              {t(col)}
                            </th>
                          ))}
                          <th style={{ width: '100px', backgroundColor: 'var(--bg-tertiary)' }}>
                            <button 
                              className="btn btn-secondary btn-sm" 
                              onClick={handleAddNewBrandColumn}
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '0.2rem', minHeight: 'auto', minWidth: 'auto' }}
                            >
                              <Plus size={10} /> {t("Brand")}
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getMatrixData().rows.map((row, rowIdx) => (
                          <tr key={row.rowName}>
                            <td 
                              className={`row-header ${hoveredCell.rowIndex === rowIdx ? 'ledger-crosshair-row' : ''}`}
                              style={{ position: 'sticky', left: 0, zIndex: 2 }}
                            >
                              {tName(row.rowName)}
                            </td>
                            {getMatrixData().columns.map((col, colIdx) => {
                              const item = row.cells[col];
                              const isHoveredRow = hoveredCell.rowIndex === rowIdx;
                              const isHoveredCol = hoveredCell.colIndex === colIdx;
                              const cellClass = item 
                                ? `ledger-cell-active ${isHoveredRow && isHoveredCol ? 'ledger-crosshair-intersect' : isHoveredRow ? 'ledger-crosshair-row' : isHoveredCol ? 'ledger-crosshair-col' : ''}`
                                : `ledger-cell-empty ${isHoveredRow && isHoveredCol ? 'ledger-crosshair-intersect' : isHoveredRow ? 'ledger-crosshair-row' : isHoveredCol ? 'ledger-crosshair-col' : ''}`;

                              return (
                                <td
                                  key={col}
                                  className={cellClass}
                                  onMouseEnter={() => setHoveredCell({ rowIndex: rowIdx, colIndex: colIdx })}
                                  onMouseLeave={() => setHoveredCell({ rowIndex: null, colIndex: null })}
                                  onClick={() => item ? startEditItem(item) : handleCreateMatrixCell(row.rowName, col)}
                                >
                                  {item ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                      <strong style={{ fontSize: '0.85rem', color: 'var(--success)' }}>₹${item.selling_price.toFixed(2)}</strong>
                                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                        {t("Stock")}: <strong style={{ color: item.stock_quantity === 0 ? '#e11d48' : 'var(--text-primary)' }}>{item.stock_quantity}</strong>
                                      </span>
                                    </div>
                                  ) : (
                                    <button className="ledger-add-cell-btn" style={{ minWidth: 'auto', minHeight: 'auto' }}>
                                      <Plus size={12} />
                                    </button>
                                  )}
                                </td>
                              );
                            })}
                            <td style={{ backgroundColor: 'var(--bg-secondary)' }}></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-start', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                      <button 
                        className="btn btn-secondary" 
                        onClick={handleAddNewProductRow}
                        style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', minHeight: 'auto' }}
                      >
                        <Plus size={14} /> {t("Add New Product Row")}
                      </button>
                    </div>
                  </div>
                )
              ) : (
              /* Grouped Inventory table */
              <div className="table-responsive glass-panel">
                <table className="inventory-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>{t("Image")}</th>
                      <th style={{ width: '250px' }}>{t("Product / Details")}</th>
                      <th>{t("Sizes, Pricing & Stock Levels")}</th>
                      <th style={{ width: '130px' }}>{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredGroupedItemsForAdmin().map(group => (
                      <tr key={group.groupKey}>
                        <td>
                          {group.image_url ? (
                            <img src={group.image_url} alt={tName(group.name)} className="inventory-img-thumbnail" />
                          ) : (
                            <div className="inventory-img-thumbnail-placeholder"><ImageIcon size={16} /></div>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <strong style={{ fontSize: '0.95rem' }}>{tName(group.name)}</strong>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span className="type-badge" style={{ margin: 0 }}>{group.item_type}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                {t(group.category)} / {t(group.subcategory)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {group.sizes.map(variant => (
                              <div 
                                key={variant.id} 
                                style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center', 
                                  background: 'var(--bg-tertiary)', 
                                  padding: '0.4rem 0.8rem', 
                                  borderRadius: '6px', 
                                  fontSize: '0.8rem', 
                                  border: '1px solid var(--border-color)',
                                  opacity: variant.available ? 1 : 0.6
                                }}
                              >
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                  <span className="size-badge" style={{ fontWeight: '700', padding: '0.2rem 0.5rem', background: 'var(--primary-bg)', color: 'var(--primary-color)' }}>
                                    {t(variant.size)}
                                  </span>
                                  <span>Cost: <strong>₹{variant.cost_price.toFixed(2)}</strong></span>
                                  <span>Selling Price: <strong className="text-success">₹{variant.selling_price.toFixed(2)}</strong> ({variant.profit_percentage}%)</span>
                                  <span>Stock: <strong style={{ color: variant.stock_quantity === 0 ? '#e11d48' : 'var(--text-primary)' }}>{variant.stock_quantity} pcs</strong></span>
                                  {!variant.available && <span style={{ color: '#e11d48', fontSize: '0.75rem', fontWeight: 600 }}>({t("Inactive")})</span>}
                                </div>
                                <div className="action-buttons" style={{ gap: '0.2rem', margin: 0 }}>
                                  <button className="btn btn-secondary btn-sm icon-btn" onClick={() => startEditItem(variant)} title={t("Edit Variant")}>
                                    <Edit size={12} />
                                  </button>
                                  <button className="btn btn-danger btn-sm icon-btn" onClick={() => handleDeleteItem(variant.id)} title={t("Delete Variant")}>
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <button 
                            className="btn btn-primary btn-sm" 
                            onClick={() => startAddVariant(group)} 
                            style={{ 
                              fontSize: '0.75rem', 
                              padding: '0.4rem 0.8rem', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.25rem',
                              width: '100%',
                              justifyContent: 'center',
                              margin: 0
                            }}
                          >
                            <Plus size={12} /> {t("Add Size")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>


              )}

              {/* Add/Edit Modal */}
              {isAddItemOpen && (
                <div className="modal-overlay" onClick={() => setIsAddItemOpen(false)}>
                  <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h2>{editingItem ? t('Edit Product Item') : t('Add Product Item')}</h2>
                      <button className="btn-close" onClick={() => setIsAddItemOpen(false)}><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSaveItem}>
                      <div className="modal-body modal-grid-scroll">
                        <div className="form-group">
                          <label className="form-label">{t("Item Name *")}</label>
                          <input 
                            type="text" 
                            name="name"
                            className="form-input" 
                            required 
                            value={itemForm.name}
                            onChange={handleItemFormChange}
                            placeholder={t("e.g. CPVC Elbow")}
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">{t("Category *")}</label>
                            <select 
                              name="category"
                              className="form-select"
                              value={itemForm.category}
                              onChange={handleItemFormChange}
                            >
                              <option value="Plumbing">{t("Plumbing")}</option>
                              <option value="Electrical">{t("Electrical")}</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label">{t("Subcategory *")}</label>
                            <input 
                              type="text" 
                              name="subcategory"
                              className="form-input" 
                              required 
                              value={itemForm.subcategory}
                              onChange={handleItemFormChange}
                              placeholder="e.g. Pipes & Fittings"
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">{t("Item Type *")}</label>
                            <input 
                              type="text" 
                              name="item_type"
                              className="form-input" 
                              required 
                              value={itemForm.item_type}
                              onChange={handleItemFormChange}
                              placeholder="e.g. CPVC"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">{t("Size / Dimension *")}</label>
                            <input 
                              type="text" 
                              name="size"
                              className="form-input" 
                              required 
                              value={itemForm.size}
                              onChange={handleItemFormChange}
                              placeholder="e.g. 1 inch, 1.5 mm"
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">{t("Cost Price (₹) *")}</label>
                            <input 
                              type="number" 
                              step="0.01"
                              name="cost_price"
                              className="form-input" 
                              required 
                              value={itemForm.cost_price}
                              onChange={handleItemFormChange}
                              placeholder="0.00"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">{t("Profit Percentage (%) *")}</label>
                            <input 
                              type="number" 
                              step="0.01"
                              name="profit_percentage"
                              className="form-input" 
                              required 
                              value={itemForm.profit_percentage}
                              onChange={handleItemFormChange}
                              placeholder="e.g. 15"
                            />
                          </div>
                        </div>

                        <div className="pricing-preview glass-panel">
                          <span>{t("Auto-Calculated Selling Price:")}</span>
                          <strong>₹{liveCalculatedSellingPrice()}</strong>
                        </div>

                        {/* Stock quantity field removed as manual shelf checks are preferred */}

                        {/* Unified Uploader Zone */}
                        <div className="form-group">
                          <label className="form-label">{t("Product Photo")}</label>
                          
                          {itemForm.image_url ? (
                            <div className="photo-upload-preview-container glass-panel">
                              <img src={itemForm.image_url} alt="Product Preview" className="photo-preview-img" />
                              <div className="photo-preview-overlay">
                                <div className="photo-action-btn-wrapper">
                                  <label className="btn btn-secondary btn-sm photo-upload-btn-label">
                                    <Upload size={14} /> {t("Change Photo")}
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      onChange={handleImageUpload}
                                      className="file-input-hide"
                                    />
                                  </label>
                                  <button 
                                    type="button" 
                                    className="btn btn-danger btn-sm"
                                    onClick={handleRemovePhoto}
                                  >
                                    <Trash2 size={14} /> {t("Remove Photo")}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="photo-upload-dropzone">
                              <Upload size={32} className="upload-icon-pulse" />
                              <span className="upload-title">{t("Upload Product Photo")}</span>
                              <span className="upload-subtitle">{t("Drag & drop or click to upload")}</span>
                              <span className="upload-constraints">{t("Supports JPG, PNG, WebP")}</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload}
                                className="file-input-hide"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsAddItemOpen(false)}>{t("Cancel")}</button>
                        <button type="submit" className="btn btn-primary">{t("Save Product")}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- ADMIN BILLING SETTINGS SUBTAB --- */}
          {adminSubTab === 'billing' && (
            <div className="admin-billing-panel glass-panel">
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 700 }}>
                🧾 {t("Billing & Invoice Settings")}
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                {t("These details appear on printed invoices / bills.")}
              </p>

              <form onSubmit={handleSaveSettings}>
                {/* Shop Details */}
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  {t("Shop Details")}
                </h4>
                <div className="admin-billing-grid">
                  <div className="form-group">
                    <label className="form-label">{t("Shop Name")}</label>
                    <input className="form-input" value={billingSettings.shop_name} onChange={e => setBillingSettings(p => ({ ...p, shop_name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("Shop Address")}</label>
                    <input className="form-input" value={billingSettings.shop_address} onChange={e => setBillingSettings(p => ({ ...p, shop_address: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("Proprietor Info (name, phone)")}</label>
                    <input className="form-input" value={billingSettings.proprietor_info} onChange={e => setBillingSettings(p => ({ ...p, proprietor_info: e.target.value }))} />
                  </div>
                </div>

                {/* Bank Details */}
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  {t("Bank Details")}
                </h4>
                <div className="admin-billing-grid">
                  <div className="form-group">
                    <label className="form-label">{t("Bank Name")}</label>
                    <input className="form-input" value={billingSettings.bank_name} onChange={e => setBillingSettings(p => ({ ...p, bank_name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("Account Number")}</label>
                    <input className="form-input" value={billingSettings.bank_account} onChange={e => setBillingSettings(p => ({ ...p, bank_account: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t("IFSC Code")}</label>
                    <input className="form-input" value={billingSettings.bank_ifsc} onChange={e => setBillingSettings(p => ({ ...p, bank_ifsc: e.target.value }))} />
                  </div>
                </div>

                {/* Logo Uploaders */}
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  {t("Invoice Header Logos")}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {t("Left logo (e.g. Lakshmi) and right logo (e.g. Ganesha) appear in the top corners of the printed invoice.")}
                </p>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  {/* Left Logo */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '80px', height: '80px', border: '2px dashed var(--border-color)', borderRadius: 'var(--border-radius-sm)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                      {billingSettings.left_logo
                        ? <img src={billingSettings.left_logo} alt="Left Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>Left<br />Logo</span>
                      }
                    </div>
                    <label className="form-label" style={{ marginBottom: 0 }}>{t("Left Logo")}</label>
                    <input type="file" accept="image/*" onChange={e => handleLogoUpload('left_logo', e)} style={{ fontSize: '0.75rem', maxWidth: '120px' }} />
                    {billingSettings.left_logo && (
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => setBillingSettings(p => ({ ...p, left_logo: '' }))}>
                        {t("Remove")}
                      </button>
                    )}
                  </div>

                  {/* Right Logo */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '80px', height: '80px', border: '2px dashed var(--border-color)', borderRadius: 'var(--border-radius-sm)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)' }}>
                      {billingSettings.right_logo
                        ? <img src={billingSettings.right_logo} alt="Right Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>Right<br />Logo</span>
                      }
                    </div>
                    <label className="form-label" style={{ marginBottom: 0 }}>{t("Right Logo")}</label>
                    <input type="file" accept="image/*" onChange={e => handleLogoUpload('right_logo', e)} style={{ fontSize: '0.75rem', maxWidth: '120px' }} />
                    {billingSettings.right_logo && (
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => setBillingSettings(p => ({ ...p, right_logo: '' }))}>
                        {t("Remove")}
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Messages */}
                {settingsSuccess && (
                  <div style={{ background: 'var(--success-bg)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--border-radius-sm)', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    ✅ {settingsSuccess}
                  </div>
                )}
                {settingsError && (
                  <div style={{ background: 'var(--danger-bg)', color: '#e11d48', border: '1px solid rgba(244,63,94,0.2)', borderRadius: 'var(--border-radius-sm)', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    ⚠️ {settingsError}
                  </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={isSavingSettings} style={{ minWidth: '160px' }}>
                  {isSavingSettings ? t("Saving...") : t("Save Settings")}
                </button>
              </form>
            </div>
          )}
            </>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
