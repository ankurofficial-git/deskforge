import React, { useState, useEffect, useMemo } from "react";

// ============================================================================
// SUPABASE CONFIGURATION (ALREADY CONNECTED TO YOUR PROJECT)
// ============================================================================
const SUPABASE_URL = "https://wyuswtofjeorqxpyuibo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_UUxiieV_TLTKBkHIrLU55w_soHKGgOk";

let supabaseInstance = null;
let supabaseLoadPromise = null;

async function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;
  if (!window.supabase) {
    if (!supabaseLoadPromise) {
      supabaseLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Supabase SDK"));
        document.head.appendChild(script);
      });
    }
    await supabaseLoadPromise;
  }
  supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseInstance;
}

const DEFAULT_SETTINGS = {
  id: 1,
  store_name: "DESKFORGE",
  tagline: "Precision Tactile Hardware for Devs & Gearheads",
  announcement_text: "FREE SHIPPING ON ORDERS ABOVE ₹999 • DIRECT UPI & WHATSAPP CHECKOUT",
  whatsapp_number: "919876543210",
  upi_id: "deskforge@upi",
  free_shipping_threshold: 999,
};

const FALLBACK_PRODUCTS = [
  {
    id: "prod-1",
    title: "C/C++ & Git Terminal Desk Mat (900x400mm)",
    category: "Desk Mats",
    price: 899,
    cost: 410,
    stock: 14,
    badge: "Bestseller",
    art_type: "terminal",
    image_url: "",
    specs: "900 × 400 × 4mm • Micro-weave cloth • Anti-fray stitched edges • Natural rubber base",
    description:
      "Matte obsidian extended desk mat featuring low-contrast C++ memory pointer diagrams, Big-O complexity tables, and Git command cheat-sheets.",
  },
  {
    id: "prod-2",
    title: "65W Retro-Console GaN Charger Skin",
    category: "Charger Skins",
    price: 249,
    cost: 75,
    stock: 22,
    badge: "New Drop",
    art_type: "retro",
    image_url: "",
    specs: "3M Cast Matte Vinyl • Zero-residue adhesive • Precision laser die-cut for 33W–65W bricks",
    description:
      "Transform plain white charging bricks into a tactile retro handheld console with custom button decals and industrial warning typography.",
  },
  {
    id: "prod-3",
    title: "Turbo Telemetry Blueprint Desk Mat",
    category: "Desk Mats",
    price: 949,
    cost: 430,
    stock: 8,
    badge: "Limited Run",
    art_type: "telemetry",
    image_url: "",
    specs: "900 × 400 × 4mm • Water-repellent coating • High-DPI monochrome schematic print",
    description:
      "Technical CAD wireframe of a twin-scroll turbocharger assembly, boost pressure curves, and firing order specs in crisp silver-on-slate.",
  },
  {
    id: "prod-4",
    title: "GT Spoiler Layered Acrylic Headphone Stand",
    category: "Acrylic Stands",
    price: 699,
    cost: 280,
    stock: 6,
    badge: "Low Stock",
    art_type: "spoiler",
    image_url: "",
    specs: "5mm Cast Matte Black & Signal Orange Acrylic • Slot-fit assembly (no glue needed)",
    description:
      "Aerodynamic rear-wing inspired desktop headphone dock laser-cut from heavy-duty matte black acrylic with translucent neon edge accents.",
  },
  {
    id: "prod-5",
    title: "Topographic EDC Vegan Leather Valet Tray",
    category: "Organizers",
    price: 449,
    cost: 175,
    stock: 18,
    badge: "Hostel Essential",
    art_type: "tray",
    image_url: "",
    specs: "200 × 200mm flat • Brass corner snaps • Debossed topographic contour lines",
    description:
      "Ships completely flat and snaps together in 2 seconds to keep your earphones, pen drives, keys, and coins organized on messy study desks.",
  },
];

const ORDER_STATUSES = [
  "Pending UPI Verification",
  "Paid & In Production",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// ============================================================================
// CUSTOM SVG PRODUCT ARTWORK (SHOWN WHEN NO UPLOADED PHOTO IS SET)
// ============================================================================
function ProductVisual({ product, className = "h-52" }) {
  if (product.image_url) {
    return (
      <div className={`relative w-full ${className} overflow-hidden bg-zinc-950`}>
        <img
          src={product.image_url}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  const art = product.art_type || "terminal";

  return (
    <div
      className={`relative w-full ${className} overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center p-4 border-b border-zinc-800/80`}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />

      {art === "terminal" && (
        <svg viewBox="0 0 320 160" className="w-full h-full max-w-[270px] drop-shadow-2xl">
          <rect x="10" y="16" width="300" height="128" rx="10" fill="#09090b" stroke="#27272a" strokeWidth="2.5" />
          <rect x="16" y="22" width="288" height="116" rx="7" fill="none" stroke="#3f3f46" strokeDasharray="4 3" strokeWidth="1" />
          <text x="28" y="45" fill="#f97316" fontSize="10" fontFamily="monospace" fontWeight="bold">
            $ g++ -O3 main.cpp -o forge
          </text>
          <text x="28" y="64" fill="#a1a1aa" fontSize="9" fontFamily="monospace">
            0x7ffee4b2: [PTR] -&gt; *heap_alloc
          </text>
          <text x="28" y="82" fill="#71717a" fontSize="8.5" fontFamily="monospace">
            O(1) Hash | O(log n) Binary | O(n log n)
          </text>
          <line x1="28" y1="95" x2="290" y2="95" stroke="#27272a" strokeWidth="1" />
          <text x="28" y="114" fill="#10b981" fontSize="9" fontFamily="monospace">
            git rebase -i HEAD~3 // clean tree
          </text>
          <circle cx="282" cy="41" r="4" fill="#f97316" />
        </svg>
      )}

      {art === "retro" && (
        <svg viewBox="0 0 220 160" className="w-full h-full max-w-[200px] drop-shadow-2xl">
          <rect x="58" y="12" width="104" height="136" rx="14" fill="#18181b" stroke="#f97316" strokeWidth="2" />
          <rect x="70" y="24" width="80" height="52" rx="6" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
          <text x="80" y="46" fill="#22c55e" fontSize="10" fontFamily="monospace" fontWeight="bold">
            65W GaN PD
          </text>
          <text x="80" y="62" fill="#a1a1aa" fontSize="8" fontFamily="monospace">
            VOLT: 20.0V/3.25A
          </text>
          <path d="M84 96 h10 v-10 h8 v10 h10 v8 h-10 v10 h-8 v-10 h-10 z" fill="#3f3f46" />
          <circle cx="136" cy="95" r="6" fill="#f97316" />
          <circle cx="124" cy="108" r="6" fill="#ef4444" />
          <rect x="85" y="128" width="50" height="5" rx="2.5" fill="#27272a" />
        </svg>
      )}

      {art === "telemetry" && (
        <svg viewBox="0 0 320 160" className="w-full h-full max-w-[270px] drop-shadow-2xl">
          <rect x="10" y="16" width="300" height="128" rx="10" fill="#0c0a09" stroke="#3f3f46" strokeWidth="2" />
          <circle cx="95" cy="80" r="42" fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="5 3" />
          <circle cx="95" cy="80" r="24" fill="none" stroke="#f97316" strokeWidth="2" />
          <circle cx="95" cy="80" r="8" fill="#f97316" />
          <path d="M95 38 L185 38 L215 62 L215 112 L155 112" fill="none" stroke="#71717a" strokeWidth="1.5" />
          <text x="165" y="56" fill="#e4e4e7" fontSize="9" fontFamily="monospace" fontWeight="bold">
            BOOST: 1.85 BAR
          </text>
          <text x="165" y="73" fill="#a1a1aa" fontSize="8" fontFamily="monospace">
            AFR 11.8:1 // EGT 840°C
          </text>
          <text x="165" y="90" fill="#f97316" fontSize="8" fontFamily="monospace">
            FIRING: 1-3-4-2
          </text>
        </svg>
      )}

      {art === "spoiler" && (
        <svg viewBox="0 0 260 160" className="w-full h-full max-w-[230px] drop-shadow-2xl">
          <path d="M35 42 Q130 22 225 42 L215 54 Q130 36 45 54 Z" fill="#18181b" stroke="#f97316" strokeWidth="2" />
          <polygon points="32,32 46,36 42,64 28,58" fill="#09090b" stroke="#f97316" strokeWidth="1.5" />
          <polygon points="228,32 214,36 218,64 232,58" fill="#09090b" stroke="#f97316" strokeWidth="1.5" />
          <path d="M85 48 L75 130 L95 130 L102 48 Z" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
          <path d="M175 48 L185 130 L165 130 L158 48 Z" fill="#18181b" stroke="#52525b" strokeWidth="1.5" />
          <rect x="52" y="130" width="156" height="10" rx="4" fill="#09090b" stroke="#f97316" strokeWidth="1.5" />
        </svg>
      )}

      {art === "tray" && (
        <svg viewBox="0 0 260 160" className="w-full h-full max-w-[220px] drop-shadow-2xl">
          <polygon points="50,35 210,35 230,125 30,125" fill="#18181b" stroke="#52525b" strokeWidth="2" />
          <polygon points="62,46 198,46 212,114 48,114" fill="#09090b" stroke="#3f3f46" strokeWidth="1.2" />
          <path d="M70 75 Q110 55 145 78 T195 72" fill="none" stroke="#f97316" strokeWidth="1.2" opacity="0.8" />
          <path d="M62 92 Q115 72 155 95 T202 88" fill="none" stroke="#71717a" strokeWidth="1" />
          <circle cx="56" cy="41" r="3.5" fill="#eab308" />
          <circle cx="204" cy="41" r="3.5" fill="#eab308" />
          <circle cx="42" cy="119" r="3.5" fill="#eab308" />
          <circle cx="218" cy="119" r="3.5" fill="#eab308" />
        </svg>
      )}
    </div>
  );
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================
export default function App() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState("");

  // Storefront UI state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [trackInput, setTrackInput] = useState("");
  const [trackedOrders, setTrackedOrders] = useState([]);
  const [trackSearched, setTrackSearched] = useState(false);

  // Checkout state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState("Courier");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // Admin & Auth state
  const [session, setSession] = useState(null);
  const [adminViewOpen, setAdminViewOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [adminTab, setAdminTab] = useState("orders");

  // Admin Product Form state
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: "",
    category: "Desk Mats",
    price: "",
    cost: "",
    stock: "",
    badge: "",
    art_type: "terminal",
    image_url: "",
    specs: "",
    description: "",
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Load initial data & auth session from Supabase
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const sb = await getSupabaseClient();

        const { data: authData } = await sb.auth.getSession();
        if (mounted && authData?.session) {
          setSession(authData.session);
        }

        sb.auth.onAuthStateChange((_event, newSession) => {
          if (mounted) {
            setSession(newSession);
            if (!newSession) setAdminViewOpen(false);
          }
        });

        const [prodRes, setRes] = await Promise.all([
          sb.from("products").select("*").order("created_at", { ascending: true }),
          sb.from("store_settings").select("*").eq("id", 1).maybeSingle(),
        ]);

        if (mounted) {
          if (prodRes.data && prodRes.data.length > 0) {
            setProducts(prodRes.data);
          }
          if (setRes.data) {
            setSettings(setRes.data);
          }
        }
      } catch (err) {
        if (mounted) {
          setDbError("Running in offline fallback mode. Check Supabase connection.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch all orders whenever Admin Dashboard is opened
  useEffect(() => {
    if (!session || !adminViewOpen) return;
    loadOrders();
  }, [session, adminViewOpen]);

  async function loadOrders() {
    try {
      const sb = await getSupabaseClient();
      const { data, error } = await sb
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Derived storefront lists
  const categories = useMemo(() => {
    const cats = new Set(["All", ...products.map((p) => p.category || "Gear")]);
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart calculations
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.qty, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
    [cart]
  );
  const cartTotalCost = useMemo(
    () => cart.reduce((acc, item) => acc + Number(item.cost || 0) * item.qty, 0),
    [cart]
  );
  const freeShipRemaining = Math.max(0, Number(settings.free_shipping_threshold || 999) - cartSubtotal);

  function addToCart(product) {
    if (Number(product.stock) <= 0) {
      showToast("This item is currently out of stock.");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        if (existing.qty >= Number(product.stock)) {
          showToast(`Only ${product.stock} units available in stock.`);
          return prev;
        }
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`Added "${product.title}" to bag`);
  }

  function updateCartQty(id, delta) {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const nextQty = item.qty + delta;
          if (nextQty <= 0) return null;
          if (nextQty > Number(item.stock)) {
            showToast(`Max stock (${item.stock}) reached`);
            return item;
          }
          return { ...item, qty: nextQty };
        })
        .filter(Boolean)
    );
  }

  // Place Order -> Save to Supabase -> Deduct Stock -> Open WhatsApp
  async function handleWhatsAppCheckout(e) {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      showToast("Please fill in your Name, WhatsApp number, and Address.");
      return;
    }

    setPlacingOrder(true);
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderItems = cart.map((c) => ({
      id: c.id,
      title: c.title,
      qty: c.qty,
      price: Number(c.price),
    }));

    const newOrder = {
      id: orderId,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      delivery_type: deliveryType,
      address: address.trim(),
      pincode: deliveryType === "Campus Pickup" ? "CAMPUS" : pincode.trim(),
      items: orderItems,
      total: cartSubtotal,
      total_cost: cartTotalCost,
      status: "Pending UPI Verification",
    };

    try {
      const sb = await getSupabaseClient();
      const { error } = await sb.from("orders").insert([newOrder]);
      if (error) throw error;

      // Update local stock display
      setProducts((prev) =>
        prev.map((p) => {
          const ordered = cart.find((c) => c.id === p.id);
          if (!ordered) return p;
          return { ...p, stock: Math.max(0, Number(p.stock) - ordered.qty) };
        })
      );
    } catch (err) {
      console.error("Order save warning:", err);
    }

    const itemLines = orderItems
      .map((i) => `• ${i.qty}x ${i.title} (₹${i.price * i.qty})`)
      .join("\n");

    const waMessage = `Hi *${settings.store_name}*! I just placed an order on your website:\n\n*Order ID:* #${orderId}\n*Items:*\n${itemLines}\n\n*Total Payable:* ₹${cartSubtotal}\n*Delivery Mode:* ${deliveryType}\n*Name:* ${customerName.trim()}\n*Phone:* ${customerPhone.trim()}\n*Address:* ${address.trim()}${
      deliveryType === "Courier" && pincode ? ` - ${pincode.trim()}` : ""
    }\n\nPlease share your UPI QR / confirm my order!`;

    const cleanPhone = String(settings.whatsapp_number || "").replace(/\D/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

    setLastPlacedOrder({
      ...newOrder,
      waUrl,
      waMessage,
    });
    setCart([]);
    setPlacingOrder(false);
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }

  // Public Order Tracker
  async function handleTrackOrder(e) {
    e.preventDefault();
    const q = trackInput.trim();
    if (!q) return;
    setTrackSearched(true);
    try {
      const sb = await getSupabaseClient();
      const cleanId = q.replace(/^#/, "").toUpperCase();
      const { data } = await sb
        .from("orders")
        .select("*")
        .or(`id.ilike.%${cleanId}%,customer_phone.ilike.%${q}%`)
        .order("created_at", { ascending: false });
      setTrackedOrders(data || []);
    } catch (err) {
      setTrackedOrders([]);
    }
  }

  // Admin Auth Login / Logout
  async function handleAdminLogin(e) {
    e.preventDefault();
    setLoginError("");
    setAuthLoading(true);
    try {
      const sb = await getSupabaseClient();
      const { data, error } = await sb.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      if (error) throw error;
      setSession(data.session);
      setLoginModalOpen(false);
      setAdminViewOpen(true);
      setLoginEmail("");
      setLoginPassword("");
      showToast("Welcome back, Founder!");
    } catch (err) {
      setLoginError(err.message || "Invalid email or password.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleAdminLogout() {
    try {
      const sb = await getSupabaseClient();
      await sb.auth.signOut();
      setSession(null);
      setAdminViewOpen(false);
      showToast("Logged out of Founder Dashboard");
    } catch (e) {
      console.error(e);
    }
  }

  // Admin: Update Order Status
  async function handleUpdateOrderStatus(orderId, newStatus) {
    try {
      const sb = await getSupabaseClient();
      const { error } = await sb
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      showToast(`Order #${orderId} updated to ${newStatus}`);
    } catch (err) {
      showToast("Failed to update status: " + err.message);
    }
  }

  // Admin: Upload Product Photo to Supabase Storage
  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const sb = await getSupabaseClient();
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadError } = await sb.storage
        .from("product-images")
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = sb.storage.from("product-images").getPublicUrl(fileName);
      setProductForm((prev) => ({ ...prev, image_url: urlData.publicUrl }));
      showToast("Photo uploaded to Supabase Storage!");
    } catch (err) {
      showToast("Upload failed: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  }

  // Admin: Save New or Edited Product
  function openNewProductForm() {
    setEditingProduct("NEW");
    setProductForm({
      title: "",
      category: "Desk Mats",
      price: "",
      cost: "",
      stock: "10",
      badge: "New Drop",
      art_type: "terminal",
      image_url: "",
      specs: "",
      description: "",
    });
  }

  function openEditProductForm(prod) {
    setEditingProduct(prod.id);
    setProductForm({
      title: prod.title || "",
      category: prod.category || "Desk Mats",
      price: String(prod.price ?? ""),
      cost: String(prod.cost ?? ""),
      stock: String(prod.stock ?? 0),
      badge: prod.badge || "",
      art_type: prod.art_type || "terminal",
      image_url: prod.image_url || "",
      specs: prod.specs || "",
      description: prod.description || "",
    });
  }

  async function handleSaveProduct(e) {
    e.preventDefault();
    if (!productForm.title.trim() || !productForm.price) return;
    setSavingProduct(true);
    const id = editingProduct === "NEW" ? `prod-${Date.now()}` : editingProduct;
    const payload = {
      id,
      title: productForm.title.trim(),
      category: productForm.category.trim() || "Desk Mats",
      price: Number(productForm.price),
      cost: Number(productForm.cost || 0),
      stock: Number(productForm.stock || 0),
      badge: productForm.badge.trim(),
      art_type: productForm.art_type,
      image_url: productForm.image_url.trim(),
      specs: productForm.specs.trim(),
      description: productForm.description.trim(),
    };

    try {
      const sb = await getSupabaseClient();
      const { error } = await sb.from("products").upsert([payload]);
      if (error) throw error;

      setProducts((prev) => {
        const exists = prev.some((p) => p.id === id);
        return exists ? prev.map((p) => (p.id === id ? payload : p)) : [...prev, payload];
      });
      setEditingProduct(null);
      showToast("Product saved to live storefront!");
    } catch (err) {
      showToast("Error saving product: " + err.message);
    } finally {
      setSavingProduct(false);
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm("Remove this product from your storefront?")) return;
    try {
      const sb = await getSupabaseClient();
      const { error } = await sb.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Product deleted");
    } catch (err) {
      showToast("Error deleting product: " + err.message);
    }
  }

  // Admin: Save Store Settings
  async function handleSaveSettings(e) {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const sb = await getSupabaseClient();
      const payload = {
        id: 1,
        store_name: settings.store_name,
        tagline: settings.tagline,
        announcement_text: settings.announcement_text,
        whatsapp_number: settings.whatsapp_number.replace(/\D/g, ""),
        upi_id: settings.upi_id,
        free_shipping_threshold: Number(settings.free_shipping_threshold || 999),
      };
      const { error } = await sb.from("store_settings").upsert([payload]);
      if (error) throw error;
      setSettings(payload);
      showToast("Store & WhatsApp settings updated!");
    } catch (err) {
      showToast("Failed to save settings: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  }

  // Admin Analytics Metrics
  const metrics = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== "Cancelled");
    const revenue = validOrders.reduce((s, o) => s + Number(o.total || 0), 0);
    const cost = validOrders.reduce((s, o) => s + Number(o.total_cost || 0), 0);
    const pendingCount = orders.filter((o) => o.status === "Pending UPI Verification").length;
    return {
      totalOrders: orders.length,
      revenue,
      profit: revenue - cost,
      pendingCount,
    };
  }, [orders]);

  // ==========================================================================
  // RENDER: FOUNDER ADMIN DASHBOARD
  // ==========================================================================
  if (session && adminViewOpen) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
        {toastMsg && (
          <div className="fixed bottom-5 right-5 z-50 bg-orange-500 text-black font-semibold px-4 py-2.5 rounded-lg shadow-xl text-sm">
            {toastMsg}
          </div>
        )}

        {/* Admin Top Navbar */}
        <header className="sticky top-0 z-30 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-black font-black text-sm">
              DF
            </span>
            <div>
              <h1 className="font-bold text-base tracking-tight">{settings.store_name} — Founder HQ</h1>
              <p className="text-xs text-zinc-400">{session.user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setAdminViewOpen(false)}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700"
            >
              View Live Storefront
            </button>
            <button
              onClick={handleAdminLogout}
              className="px-3.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-400 border border-red-500/30"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Gross Revenue</p>
              <p className="text-2xl font-extrabold text-white mt-1">₹{metrics.revenue.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Est. Net Profit</p>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">₹{metrics.profit.toLocaleString()}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Pending UPI</p>
              <p className="text-2xl font-extrabold text-orange-400 mt-1">{metrics.pendingCount}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-400 uppercase tracking-wider">Total Orders</p>
              <p className="text-2xl font-extrabold text-zinc-100 mt-1">{metrics.totalOrders}</p>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex gap-2 border-b border-zinc-800 pb-3 overflow-x-auto">
            {[
              { id: "orders", label: `Orders (${orders.length})` },
              { id: "products", label: `Products & Photos (${products.length})` },
              { id: "settings", label: "Store & UPI Settings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
                  adminTab === tab.id
                    ? "bg-orange-500 text-black"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: ORDERS */}
          {adminTab === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Incoming Customer Orders</h2>
                <button
                  onClick={loadOrders}
                  className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                >
                  Refresh Orders
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center text-zinc-400 text-sm">
                  No orders yet. Once a customer submits checkout on your store, their order appears here instantly.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-orange-400">#{order.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            {order.delivery_type}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {order.created_at ? new Date(order.created_at).toLocaleString() : ""}
                          </span>
                        </div>
                        <p className="font-semibold text-white">
                          {order.customer_name} •{" "}
                          <a
                            href={`https://wa.me/${String(order.customer_phone).replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 underline"
                          >
                            {order.customer_phone}
                          </a>
                        </p>
                        <p className="text-xs text-zinc-400">
                          Address: {order.address} {order.pincode ? `(${order.pincode})` : ""}
                        </p>
                        <div className="pt-1 flex flex-wrap gap-1.5">
                          {(order.items || []).map((it, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-md text-zinc-300"
                            >
                              {it.qty}× {it.title} (₹{it.price * it.qty})
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 border-t lg:border-t-0 border-zinc-800 pt-3 lg:pt-0">
                        <div className="text-right mr-2">
                          <p className="text-xs text-zinc-400">Total</p>
                          <p className="text-lg font-extrabold text-white">₹{order.total}</p>
                        </div>

                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-100 focus:outline-none focus:border-orange-500"
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS & PHOTO UPLOADS */}
          {adminTab === "products" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Product Catalog & Instagram Shots</h2>
                <button
                  onClick={openNewProductForm}
                  className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs"
                >
                  + Add New Accessory
                </button>
              </div>

              {editingProduct && (
                <form
                  onSubmit={handleSaveProduct}
                  className="bg-zinc-900 border border-orange-500/40 rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base">
                      {editingProduct === "NEW" ? "Add New Product" : "Edit Product"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Product Title *</label>
                      <input
                        required
                        value={productForm.title}
                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                        placeholder="e.g., C/C++ Terminal Desk Mat"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Category</label>
                      <input
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        placeholder="Desk Mats, Charger Skins, Acrylic Stands..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Selling Price (₹) *</label>
                      <input
                        required
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Your Print/Unit Cost (₹)</label>
                      <input
                        type="number"
                        value={productForm.cost}
                        onChange={(e) => setProductForm({ ...productForm, cost: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Available Stock</label>
                      <input
                        type="number"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-400 mb-1">Badge (Optional)</label>
                      <input
                        value={productForm.badge}
                        onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                        placeholder="Bestseller, Limited Drop..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  {/* Real Product Photo Upload */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3.5 space-y-2">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Upload Real Product Photo (From Hostel Shoot)
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                      />
                      {uploadingImage && (
                        <span className="text-xs text-orange-400">Uploading photo...</span>
                      )}
                    </div>
                    <input
                      value={productForm.image_url}
                      onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                      placeholder="Or paste an image URL directly..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Hardware Specs</label>
                    <input
                      value={productForm.specs}
                      onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                      placeholder="e.g., 900x400x4mm • Micro-weave cloth • Stitched edges"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm"
                  >
                    {savingProduct ? "Saving..." : "Save Product"}
                  </button>
                </form>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <ProductVisual product={prod} className="h-40" />
                      <div className="p-4 space-y-1">
                        <span className="text-[11px] text-orange-400 font-semibold uppercase">
                          {prod.category}
                        </span>
                        <h3 className="font-bold text-sm text-white">{prod.title}</h3>
                        <p className="text-xs text-zinc-400">
                          Price: <strong className="text-white">₹{prod.price}</strong> • Cost: ₹
                          {prod.cost} • Stock: <strong className="text-emerald-400">{prod.stock}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 flex gap-2">
                      <button
                        onClick={() => openEditProductForm(prod)}
                        className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold"
                      >
                        Edit / Photo
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STORE & UPI SETTINGS */}
          {adminTab === "settings" && (
            <form
              onSubmit={handleSaveSettings}
              className="max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4"
            >
              <h2 className="text-lg font-bold">Store, WhatsApp & UPI Configuration</h2>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Brand / Store Name</label>
                <input
                  value={settings.store_name}
                  onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Your WhatsApp Number (Include 91 for India, no + sign)
                </label>
                <input
                  required
                  value={settings.whatsapp_number}
                  onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                  placeholder="919876543210"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Your UPI ID (Shown at Checkout)</label>
                <input
                  value={settings.upi_id}
                  onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                  placeholder="yourname@okaxis"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Hero Tagline</label>
                <input
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Top Announcement Banner</label>
                <input
                  value={settings.announcement_text}
                  onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Free Shipping Threshold (₹)</label>
                <input
                  type="number"
                  value={settings.free_shipping_threshold}
                  onChange={(e) =>
                    setSettings({ ...settings, free_shipping_threshold: Number(e.target.value) })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm"
              >
                {savingSettings ? "Saving..." : "Save Store Settings"}
              </button>
            </form>
          )}
        </main>
      </div>
    );
  }

  // ==========================================================================
  // RENDER: PUBLIC CONSUMER STOREFRONT
  // ==========================================================================
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-orange-500 text-black font-bold px-4 py-2.5 rounded-lg shadow-2xl text-sm">
          {toastMsg}
        </div>
      )}

      {/* Top Announcement Bar */}
      <div className="bg-orange-500 text-black text-[11px] sm:text-xs font-extrabold tracking-wide text-center py-1.5 px-3">
        {settings.announcement_text}
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-black font-black text-base shadow-lg shadow-orange-500/20">
              DF
            </div>
            <div>
              <span className="font-black tracking-tight text-lg text-white block leading-none">
                {settings.store_name}
              </span>
              <span className="text-[10px] text-zinc-400 tracking-widest uppercase">
                Tactile Studio Gear
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {session && (
              <button
                onClick={() => setAdminViewOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold"
              >
                Dashboard
              </button>
            )}

            <button
              onClick={() => {
                setTrackModalOpen(true);
                setTrackSearched(false);
              }}
              className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300"
            >
              Track Order
            </button>

            <button
              onClick={() => {
                setLastPlacedOrder(null);
                setCartOpen(true);
              }}
              className="relative px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/15"
            >
              <span>Bag</span>
              <span className="bg-black text-orange-400 px-1.5 py-0.5 rounded text-[11px] font-mono">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-zinc-900/60 to-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-orange-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              Small-Batch Custom Drops • Zero Generic Templates
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.1]">
              {settings.tagline}
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
              Engineered for late-night coding sessions, hostel setups, and motorsport enthusiasts. Order directly via WhatsApp with instant UPI confirmation.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="#catalog"
                className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-sm transition"
              >
                Explore Drop
              </a>
              <button
                onClick={() => setTrackModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-sm transition"
              >
                Check Order Status
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-2xl">
              <ProductVisual product={products[0] || FALLBACK_PRODUCTS[0]} className="h-52 rounded-xl" />
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-400 px-1">
                <span>Featured: {products[0]?.title || "Terminal Desk Mat"}</span>
                <span className="text-orange-400 font-bold">₹{products[0]?.price || 899}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Filter & Search Bar */}
      <main id="catalog" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-black"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search desk mats, skins, stands..."
            className="w-full sm:w-64 bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        {dbError && (
          <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
            {dbError}
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const outOfStock = Number(product.stock) <= 0;
              return (
                <div
                  key={product.id}
                  className="group bg-zinc-900/90 border border-zinc-800/90 hover:border-orange-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition duration-300"
                >
                  <div>
                    <div
                      onClick={() => setQuickViewProduct(product)}
                      className="relative cursor-pointer"
                    >
                      <ProductVisual product={product} className="h-52" />
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur border border-zinc-700 text-[10px] font-extrabold uppercase tracking-wider text-orange-400">
                          {product.badge}
                        </span>
                      )}
                      {outOfStock && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="px-3 py-1 rounded bg-red-500 text-white text-xs font-extrabold uppercase">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="uppercase tracking-wider font-semibold text-orange-400/90">
                          {product.category}
                        </span>
                        <span>
                          {outOfStock ? "0 left" : `${product.stock} in stock`}
                        </span>
                      </div>

                      <h2
                        onClick={() => setQuickViewProduct(product)}
                        className="font-bold text-base text-white group-hover:text-orange-400 transition cursor-pointer"
                      >
                        {product.title}
                      </h2>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-zinc-800/70">
                    <div>
                      <span className="text-xs text-zinc-500 block">Price</span>
                      <span className="text-xl font-black text-white">₹{product.price}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
                      >
                        Specs
                      </button>
                      <button
                        disabled={outOfStock}
                        onClick={() => addToCart(product)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                          outOfStock
                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                            : "bg-orange-500 hover:bg-orange-400 text-black"
                        }`}
                      >
                        {outOfStock ? "Sold Out" : "+ Add"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer with Subtle Founder Login */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 sm:px-6 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} {settings.store_name}. Crafted for clean setups.
          </p>
          <div className="flex items-center gap-4">
            <span>UPI ID: {settings.upi_id}</span>
            <button
              onClick={() => {
                if (session) {
                  setAdminViewOpen(true);
                } else {
                  setLoginModalOpen(true);
                }
              }}
              className="text-zinc-600 hover:text-zinc-300 transition"
            >
              {session ? "Founder Dashboard" : "Founder Login"}
            </button>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          MODAL: PRODUCT SPECS QUICK VIEW
      ==================================================================== */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <ProductVisual product={quickViewProduct} className="h-60" />
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-orange-400 uppercase">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    {quickViewProduct.title}
                  </h3>
                </div>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="text-zinc-400 hover:text-white text-sm font-bold px-2 py-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {quickViewProduct.specs && (
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400">
                  <strong className="text-zinc-200 block mb-1">Build & Material Specs:</strong>
                  {quickViewProduct.specs}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-2xl font-black text-white">₹{quickViewProduct.price}</span>
                <button
                  disabled={Number(quickViewProduct.stock) <= 0}
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-sm"
                >
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: PUBLIC ORDER TRACKER
      ==================================================================== */}
      {trackModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">Track Your Order</h3>
              <button
                onClick={() => setTrackModalOpen(false)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTrackOrder} className="flex gap-2">
              <input
                required
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="Enter Order ID (ORD-1234) or Phone"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs"
              >
                Track
              </button>
            </form>

            {trackSearched && (
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {trackedOrders.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-4">
                    No matching orders found. Check your Order ID or phone number.
                  </p>
                ) : (
                  trackedOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-orange-400 text-xs">
                          #{ord.id}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[11px] font-bold">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">
                        Total: ₹{ord.total} • {ord.delivery_type}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================
          SLIDE-OUT CART & WHATSAPP CHECKOUT DRAWER
      ==================================================================== */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="bg-zinc-900 border-l border-zinc-800 w-full max-w-md h-full flex flex-col justify-between overflow-y-auto">
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-black text-lg text-white">Your Gear Bag ({cartCount})</h3>
              <button
                onClick={() => setCartOpen(false)}
                className="text-zinc-400 hover:text-white font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-5 space-y-5 overflow-y-auto">
              {/* Order Confirmation Screen */}
              {lastPlacedOrder ? (
                <div className="bg-zinc-950 border border-emerald-500/40 rounded-2xl p-5 space-y-4">
                  <div className="inline-block px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 text-xs font-bold">
                    Order Logged • #{lastPlacedOrder.id}
                  </div>
                  <h4 className="font-bold text-base text-white">
                    Complete Your Order on WhatsApp
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Your order is saved in our system. Send the pre-filled message on WhatsApp to confirm payment via UPI (<strong className="text-zinc-200">{settings.upi_id}</strong>).
                  </p>
                  <a
                    href={lastPlacedOrder.waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm"
                  >
                    Open WhatsApp Now
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(lastPlacedOrder.waMessage);
                      showToast("Order message copied!");
                    }}
                    className="block w-full text-center py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
                  >
                    Copy Order Summary
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 text-sm">
                  Your bag is empty. Add a desk mat or charger skin to get started!
                </div>
              ) : (
                <>
                  {/* Free Shipping Progress */}
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs">
                    {freeShipRemaining > 0 ? (
                      <p className="text-zinc-300">
                        Add <strong className="text-orange-400">₹{freeShipRemaining}</strong> more for{" "}
                        <strong>FREE Courier Shipping</strong> (Campus Pickup is always free).
                      </p>
                    ) : (
                      <p className="text-emerald-400 font-semibold">
                        You unlocked FREE Courier Shipping!
                      </p>
                    )}
                  </div>

                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="font-bold text-xs text-white">{item.title}</p>
                          <p className="text-xs text-orange-400 font-semibold mt-0.5">
                            ₹{item.price} × {item.qty} = ₹{item.price * item.qty}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQty(item.id, -1)}
                            className="h-7 w-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-bold text-sm"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono w-4 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateCartQty(item.id, 1)}
                            className="h-7 w-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 font-bold text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Checkout Form */}
                  <form onSubmit={handleWhatsAppCheckout} className="space-y-3 pt-2 border-t border-zinc-800">
                    <h4 className="font-bold text-sm text-white">Delivery Details</h4>

                    <div className="grid grid-cols-2 gap-2">
                      {["Courier", "Campus Pickup"].map((mode) => (
                        <button
                          type="button"
                          key={mode}
                          onClick={() => setDeliveryType(mode)}
                          className={`py-2 rounded-lg text-xs font-bold border ${
                            deliveryType === mode
                              ? "bg-orange-500/15 border-orange-500 text-orange-400"
                              : "bg-zinc-950 border-zinc-800 text-zinc-400"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>

                    <input
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Full Name *"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />

                    <input
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Your WhatsApp Number *"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />

                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={
                        deliveryType === "Campus Pickup"
                          ? "Hostel Block & Room Number *"
                          : "Full Street / Hostel Delivery Address *"
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    />

                    {deliveryType === "Courier" && (
                      <input
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="Pincode *"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                      />
                    )}

                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
                      <span className="text-xs text-zinc-400">Total Payable (UPI)</span>
                      <span className="text-lg font-black text-white">₹{cartSubtotal}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={placingOrder}
                      className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-lg shadow-emerald-500/20"
                    >
                      {placingOrder ? "Creating Order..." : "Place Order via WhatsApp →"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL: FOUNDER LOGIN
      ==================================================================== */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">Founder Login</h3>
              <button
                onClick={() => setLoginModalOpen(false)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input
                required
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Admin Email"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
              />
              <input
                required
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
              />
              {loginError && <p className="text-xs text-red-400">{loginError}</p>}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-sm"
              >
                {authLoading ? "Signing in..." : "Enter Founder HQ"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}