// Products Array with 5-star Ratings and Discount Prices
const products = [
  { id: 1, name: "Wireless Headphones", category: "tech", price: 2999, oldPrice: 3749, discount: "20% OFF", rating: "⭐⭐⭐⭐⭐", desc: "High-bass noise canceling headphones with 30hr battery backup.", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
  { id: 2, name: "Smart Fitness Watch", category: "tech", price: 4999, oldPrice: 6249, discount: "20% OFF", rating: "⭐⭐⭐⭐⭐", desc: "AMOLED Display with real-time heart rate and sleep tracking.", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
  { id: 3, name: "Mechanical Keyboard", category: "tech", price: 3499, oldPrice: 4369, discount: "20% OFF", rating: "⭐⭐⭐⭐⭐", desc: "RGB backlit tactile mechanical switches for fast typing & gaming.", img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500" },
  { id: 4, name: "RGB Gaming Mouse", category: "tech", price: 1299, oldPrice: 1629, discount: "20% OFF", rating: "⭐⭐⭐⭐⭐", desc: "Ergonomic design with adjustable DPI settings up to 12000.", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500" },
  { id: 5, name: "Nike Air Running Shoes", category: "shoes", price: 4299, oldPrice: 5369, discount: "20% OFF", rating: "⭐⭐⭐⭐⭐", desc: "Lightweight cushioned sole perfect for marathon running.", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
  { id: 6, name: "White Urban Sneakers", category: "shoes", price: 2499, oldPrice: 3119, discount: "20% OFF", rating: "⭐⭐⭐⭐⭐", desc: "Trendy streetwear sneakers crafted with premium leather.", img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500" },
  { id: 7, name: "Classic Denim Jacket", category: "clothes", price: 1999, oldPrice: 2499, discount: "20% OFF", rating: "⭐⭐⭐⭐⭐", desc: "100% Cotton durable denim jacket designed for all seasons.", img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500" },
  { id: 8, name: "Black Cotton T-Shirt", category: "clothes", price: 799, oldPrice: 999, discount: "20% OFF", rating: "⭐⭐⭐⭐⭐", desc: "Super soft breathable slim-fit cotton plain black t-shirt.", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500" }
];

// LocalStorage Persistence
let cart = JSON.parse(localStorage.getItem('techhub_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('techhub_wishlist')) || [];
let currentCategory = 'all';

// DOM Elements
const productGrid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const priceRange = document.getElementById('price-range');
const priceVal = document.getElementById('price-val');
const sortSelect = document.getElementById('sort-select');

// Modals & Panels
const cartModal = document.getElementById('cart-modal');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');

const wishlistModal = document.getElementById('wishlist-modal');
const openWishlistBtn = document.getElementById('open-wishlist-btn');
const closeWishlistBtn = document.getElementById('close-wishlist-btn');
const wishlistItemsContainer = document.getElementById('wishlist-items');
const wishlistCount = document.getElementById('wishlist-count');

const productModal = document.getElementById('product-modal');
const closeProductModal = document.getElementById('close-product-modal');
const productModalBody = document.getElementById('product-modal-body');
const themeToggleBtn = document.getElementById('theme-toggle');

// Remove Loader Spinner on Page Load
window.addEventListener('load', () => {
  const loader = document.getElementById('loader-wrapper');
  loader.style.opacity = '0';
  setTimeout(() => loader.style.display = 'none', 500);
});

// Display Products
function displayProducts(items) {
  if (items.length === 0) {
    productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No products match your search/filter!</p>`;
    return;
  }

  productGrid.innerHTML = items.map(product => {
    const isWishlisted = wishlist.some(w => w.id === product.id);
    return `
      <div class="product-card">
        <span class="discount-badge">${product.discount}</span>
        <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
          ${isWishlisted ? '❤️' : '🤍'}
        </button>
        <div class="img-box" onclick="openQuickView(${product.id})" style="cursor:pointer;">
          <img src="${product.img}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3 onclick="openQuickView(${product.id})" style="cursor:pointer;">${product.name}</h3>
          <div class="ratings">${product.rating}</div>
          <div class="price-box">
            <span class="price">₹${product.price.toLocaleString('en-IN')}</span>
            <span class="old-price">₹${product.oldPrice.toLocaleString('en-IN')}</span>
          </div>
          <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    `;
  }).join('');
}

// Filter, Search, Price Range, and Sorting Controller
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const maxPrice = Number(priceRange.value);
  const sortValue = sortSelect.value;

  let filtered = products.filter(product => {
    const matchesCat = (currentCategory === 'all' || product.category === currentCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesPrice = product.price <= maxPrice;
    return matchesCat && matchesSearch && matchesPrice;
  });

  if (sortValue === 'low-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'high-low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  displayProducts(filtered);
}

// Event Listeners for Filters
searchInput.addEventListener('input', applyFilters);
sortSelect.addEventListener('change', applyFilters);
priceRange.addEventListener('input', (e) => {
  priceVal.innerText = `₹${e.target.value}`;
  applyFilters();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    filterBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentCategory = e.target.dataset.category;
    applyFilters();
  });
});

// Toast Notifications
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Quick View Product Details Modal
function openQuickView(productId) {
  const product = products.find(p => p.id === productId);
  productModalBody.innerHTML = `
    <div class="modal-detail-box">
      <img src="${product.img}" alt="${product.name}">
      <div class="modal-info">
        <h3>${product.name}</h3>
        <p class="ratings">${product.rating}</p>
        <p class="desc" style="color:var(--text-muted); margin:10px 0;">${product.desc}</p>
        <div class="price-box" style="margin-bottom:15px;">
          <span class="price">₹${product.price.toLocaleString('en-IN')}</span>
          <span class="old-price">₹${product.oldPrice.toLocaleString('en-IN')}</span>
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id}); closeQuickView();">Add to Cart</button>
      </div>
    </div>
  `;
  productModal.classList.add('open');
}

function closeQuickView() { productModal.classList.remove('open'); }
closeProductModal.addEventListener('click', closeQuickView);

// Cart Logic
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  localStorage.setItem('techhub_cart', JSON.stringify(cart));
  updateCartUI();
  showToast(`🛒 "${product.name}" added to cart!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('techhub_cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  cartCount.innerText = cart.length;
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty!</p>';
    cartTotal.innerText = '₹0';
    return;
  }
  cartItemsContainer.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <p>₹${item.price.toLocaleString('en-IN')}</p>
      </div>
      <button onclick="removeFromCart(${index})" style="background:#ef4444; color:#fff; border:none; padding:5px 10px; border-radius:6px; cursor:pointer;">Remove</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.innerText = `₹${total.toLocaleString('en-IN')}`;
}

// Wishlist Logic
function toggleWishlist(productId) {
  const index = wishlist.findIndex(w => w.id === productId);
  const product = products.find(p => p.id === productId);

  if (index === -1) {
    wishlist.push(product);
    showToast(`❤️ Added to Wishlist!`);
  } else {
    wishlist.splice(index, 1);
    showToast(`Removed from Wishlist`);
  }

  localStorage.setItem('techhub_wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
  applyFilters();
}

function updateWishlistUI() {
  wishlistCount.innerText = wishlist.length;
  if (wishlist.length === 0) {
    wishlistItemsContainer.innerHTML = '<p class="empty-msg">Your wishlist is empty!</p>';
    return;
  }
  wishlistItemsContainer.innerHTML = wishlist.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <p>₹${item.price.toLocaleString('en-IN')}</p>
      </div>
      <button onclick="addToCart(${item.id})" style="background:var(--accent-color); color:#0f172a; border:none; padding:5px 10px; border-radius:6px; cursor:pointer; font-weight:600;">Add to Cart</button>
    </div>
  `).join('');
}

// Modals Toggles
openCartBtn.addEventListener('click', () => cartModal.classList.add('open'));
closeCartBtn.addEventListener('click', () => cartModal.classList.remove('open'));

openWishlistBtn.addEventListener('click', () => wishlistModal.classList.add('open'));
closeWishlistBtn.addEventListener('click', () => wishlistModal.classList.remove('open'));

// Dark / Light Theme Toggle Logic
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  themeToggleBtn.innerText = isLight ? '☀️' : '🌙';
});

// Initial Setup
displayProducts(products);
updateCartUI();
updateWishlistUI();
