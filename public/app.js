// Fallback Data
const FALLBACK_DATA = {
    businessInfo: {
        whatsapp: "5541998541513",
        pixKey: "+5541998541513",
        name: "Bárbara Rosa"
    },
    products: [
        { id: '1', name: "Bombom de morango", price: 12.00, category: 'Bombons', image: "./public/assets/products/bombom-morango.jpeg" },
        { id: '2', name: "Bolo de pote", price: 10.00, category: 'Bolos', image: "./public/assets/products/bolo-de-pote.jpeg" },
        { id: '3', name: "Bombom de uva no pote", price: 10.00, category: 'Bombons', image: "./public/assets/products/bombom-uva-pote.jpeg" },
        { id: '4', name: "Banoffe", price: 10.00, category: 'Sobremesas', image: "./public/assets/products/banoffe.jpeg" },
        { id: '5', name: "Pavê de morango", price: 10.00, category: 'Sobremesas', image: "./public/assets/products/pave-morango.jpeg" },
        { id: '6', name: "Pavê de ninho com Nutella", price: 10.00, category: 'Sobremesas', image: "./public/assets/products/pave-ninho-nutella.jpeg" },
        { id: '7', name: "Mousse de maracujá", price: 10.00, category: 'Sobremesas', image: "./public/assets/products/mousse-maracuja.jpeg" },
        { id: '8', name: "Palha Italiana Tradicional", price: 7.50, category: 'Palhas', image: "./public/assets/products/palha-tradicional.jpeg" },
        { id: '9', name: "Palha de Oreo", price: 7.50, category: 'Palhas', image: "./public/assets/products/palha-oreo.jpeg" },
        { id: '10', name: "Palha de Paçoca", price: 7.50, category: 'Palhas', image: "./public/assets/products/palha-pacoca.jpeg" },
        { id: '11', name: "Cone trufado de maracujá", price: 6.50, category: 'Cones', image: "./public/assets/products/cone-maracuja.jpeg" },
        { id: '12', name: "Cone trufado de limão", price: 6.50, category: 'Cones', image: "./public/assets/products/cone-limao.jpeg" },
        { id: '13', name: "Cone trufado de ninho", price: 6.50, category: 'Cones', image: "./public/assets/products/cone-ninho.jpeg" },
        { id: '14', name: "Cone trufado de nozes", price: 6.50, category: 'Cones', image: "./public/assets/products/cone-nozes.jpeg" },
        { id: '15', name: "Cone trufado de pistache", price: 6.50, category: 'Cones', image: "./public/assets/products/cone-pistache.jpeg" },
        { id: '16', name: "Travessa de Banoffe (≈ 1,1kg)", price: 55.00, category: 'Travessas', image: "./public/assets/products/travessa-banoffe.jpeg" }
    ]
};

let BUSINESS_INFO = FALLBACK_DATA.businessInfo;
let PRODUCTS = FALLBACK_DATA.products;
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentCategory = 'Tudo';
let searchTerm = '';

// Load Data
async function init() {
    try {
        const response = await fetch('./public/db.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        BUSINESS_INFO = data.businessInfo;
        PRODUCTS = data.products;
    } catch (error) {
        console.warn("Loading fallback data due to fetch error (likely CORS or file:// protocol):", error);
        // Data is already set to FALLBACK_DATA
    } finally {
        document.getElementById('year').innerText = new Date().getFullYear();
        renderCategories();
        renderProducts();
        updateCartCount();
    }
}

init();

function renderCategories() {
    const categories = ['Tudo', ...new Set(PRODUCTS.map(p => p.category))];
    const container = document.getElementById('category-filters');
    if (!container) return;

    container.innerHTML = categories.map(cat => `
        <button onclick="setCategory('${cat}')" class="category-btn px-6 py-2 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${currentCategory === cat
            ? 'bg-brand border-brand text-white shadow-lg'
            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
        }">${cat}</button>
    `).join('');
}

function setCategory(cat) {
    currentCategory = cat;
    renderCategories();
    renderProducts();
}

function handleSearch(event) {
    searchTerm = event.target.value.toLowerCase();
    renderProducts();
}

function renderProducts(skipAnimation = false) {
    const container = document.getElementById('products-grid');
    if (!container) return;

    const filtered = PRODUCTS.filter(p => {
        const matchesCategory = currentCategory === 'Tudo' || p.category === currentCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    container.innerHTML = filtered.map(p => {
        const cartItem = cart.find(item => item.id === p.id);
        const qty = cartItem ? cartItem.quantity : 0;

        return `
            <div class="product-card glass glass-hover rounded-3xl overflow-hidden flex flex-col group h-full transition-all duration-300 ${skipAnimation ? '!animation-none' : ''}" style="${skipAnimation ? 'animation: none;' : ''}">
                <div class="h-48 md:h-64 overflow-hidden relative bg-black/20">
                    <img src="${p.image}" alt="${p.name}" class="product-img w-full h-full object-cover transition-transform duration-700" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80'">
                    <div class="absolute top-4 right-4 glass px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-brand uppercase tracking-widest">${p.category}</div>
                </div>
                <div class="p-5 md:p-7 flex flex-col flex-1">
                    <div class="flex justify-between items-start mb-4 md:mb-6 gap-2">
                        <h3 class="font-bold text-lg md:text-xl leading-tight flex-1">${p.name}</h3>
                        <div class="text-brand font-bold text-lg md:text-2xl whitespace-nowrap">${formatCurrency(p.price)}</div>
                    </div>
                    <div class="mt-auto">
                        ${qty === 0 ? `
                            <button onclick="addToCart('${p.id}')" class="w-full bg-brand text-white font-bold py-3 md:py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 text-sm md:text-base">
                                <i class="fas fa-plus"></i> Adicionar
                            </button>
                        ` : `
                            <div class="flex items-center justify-between glass !bg-white/5 rounded-xl p-1">
                                <button onclick="updateQty('${p.id}', -1)" class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/10 rounded-lg"><i class="fas fa-minus text-xs"></i></button>
                                <span class="font-bold text-lg md:text-xl">${qty}</span>
                                <button onclick="updateQty('${p.id}', 1)" class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/10 rounded-lg text-brand"><i class="fas fa-plus text-xs"></i></button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    cart.push({ ...product, quantity: 1 });
    saveCart(true); // true means skip re-rendering the full grid if possible
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    saveCart(true);
}

function saveCart(skipProductAnimation = false) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderProducts(skipProductAnimation);
    renderCartItems();
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    const navBadge = document.getElementById('nav-cart-count');

    if (badge) {
        badge.innerText = total;
        badge.classList.toggle('hidden', total === 0);
    }

    if (navBadge) {
        navBadge.innerText = total;
        navBadge.classList.toggle('hidden', total === 0);
    }
}

function toggleCart(show) {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) drawer.classList.toggle('hidden', !show);
    if (show) renderCartItems();
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    const totalEl = document.getElementById('cart-total');

    if (!container || !footer || !totalEl) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                <i class="fas fa-shopping-cart text-6xl mb-4"></i>
                <p class="text-lg">Seu carrinho está vazio</p>
            </div>
        `;
        footer.classList.add('hidden');
        return;
    }

    footer.classList.remove('hidden');
    let total = 0;

    container.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="flex gap-4">
                <div class="w-20 h-20 rounded-2xl overflow-hidden glass shrink-0">
                    <img src="${item.image}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-white truncate pr-2">${item.name}</h3>
                        <button onclick="updateQty('${item.id}', -${item.quantity})" class="text-white/30 hover:text-red-400">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>
                    <p class="text-brand font-bold text-sm mb-3">${formatCurrency(item.price)}</p>
                    <div class="flex items-center gap-3 glass !bg-white/5 !border-white/5 w-fit rounded-lg p-1">
                        <button onclick="updateQty('${item.id}', -1)" class="p-1 px-2 hover:bg-white/10 rounded text-xs"><i class="fas fa-minus"></i></button>
                        <span class="font-bold text-xs w-4 text-center">${item.quantity}</span>
                        <button onclick="updateQty('${item.id}', 1)" class="p-1 px-2 hover:bg-white/10 rounded text-brand text-xs"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    totalEl.innerText = formatCurrency(total);
}

function formatCurrency(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function checkout() {
    let msg = `*Oi, tudo bem?* 😊\n*Gostaria de fazer o seguinte pedido:*\n\n`;
    let total = 0;
    cart.forEach(item => {
        msg += `✅ *${item.quantity}x* ${item.name} — _${formatCurrency(item.price * item.quantity)}_\n`;
        total += item.price * item.quantity;
    });
    msg += `\n💰 *Total: ${formatCurrency(total)}*`;
    msg += `\n\n_Como posso realizar o pagamento?_`;
    window.open(`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
}

function goToPixFromCart() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const pixInput = document.getElementById('pix-amount');
    const pixSection = document.getElementById('pix-section');

    if (pixInput && pixSection) {
        // Format to the expected mask value
        pixInput.value = total.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        toggleCart(false);
        pixSection.scrollIntoView({ behavior: 'smooth' });

        // Add a slight highlight effect to the input
        pixInput.classList.add('ring-2', 'ring-brand');
        setTimeout(() => pixInput.classList.remove('ring-2', 'ring-brand'), 2000);
    }
}

// Pix Logic
let pixCode = "";

// Currency Mask for PIX input
const pixInput = document.getElementById('pix-amount');
if (pixInput) {
    pixInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = (value / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        e.target.value = value !== "0,00" ? value : "";
    });
}

/**
 * CRC16-CCITT implementation for PIX
 */
function crc16(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
        crc ^= (str.charCodeAt(i) << 8);
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function generatePix() {
    const inputAmount = document.getElementById('pix-amount').value;
    if (!inputAmount) return;

    const amount = parseFloat(inputAmount.replace(/\./g, "").replace(",", "."));
    if (isNaN(amount) || amount <= 0) return;

    const amountStr = amount.toFixed(2);
    const pixKey = BUSINESS_INFO.pixKey;
    const name = BUSINESS_INFO.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 25);
    const city = "CURITIBA";

    // Tag 00: Payload Format Indicator (Fixed)
    let payload = "000201";

    // Tag 26: Merchant Account Information
    const gui = "0014br.gov.bcb.pix";
    const key = "01" + pixKey.length.toString().padStart(2, '0') + pixKey;
    const merchantAccount = "26" + (gui.length + key.length).toString().padStart(2, '0') + gui + key;
    payload += merchantAccount;

    // Tag 52: Merchant Category Code (Fixed)
    payload += "52040000";

    // Tag 53: Transaction Currency (BRL = 986)
    payload += "5303986";

    // Tag 54: Transaction Amount
    const amountTag = "54" + amountStr.length.toString().padStart(2, '0') + amountStr;
    payload += amountTag;

    // Tag 58: Country Code (BR)
    payload += "5802BR";

    // Tag 59: Merchant Name
    const nameTag = "59" + name.length.toString().padStart(2, '0') + name;
    payload += nameTag;

    // Tag 60: Merchant City
    const cityTag = "60" + city.length.toString().padStart(2, '0') + city;
    payload += cityTag;

    // Tag 62: Additional Data Field (TXID)
    const txid = "***";
    const txidSubTag = "05" + txid.length.toString().padStart(2, '0') + txid;
    const additionalData = "62" + txidSubTag.length.toString().padStart(2, '0') + txidSubTag;
    payload += additionalData;

    // Tag 63: CRC16 (Tag 63 length 04)
    payload += "6304";

    // Add Checksum
    pixCode = payload + crc16(payload);

    // Show Modal
    const modal = document.getElementById('pix-modal');
    const qrImg = document.getElementById('pix-qr');
    const merchantEl = document.getElementById('pix-merchant-name');

    if (modal && qrImg && merchantEl) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`;
        merchantEl.innerText = BUSINESS_INFO.name;
        modal.classList.remove('hidden');
    }
}

function closePixModal() {
    const modal = document.getElementById('pix-modal');
    if (modal) modal.classList.add('hidden');
}

function copyPixCode() {
    navigator.clipboard.writeText(pixCode);
    const btn = document.getElementById('copy-pix-btn');
    if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-check text-green-400"></i> COPIADO!`;
        setTimeout(() => btn.innerHTML = original, 2000);
    }
}

// Easter Egg Logic
let easterEggActive = false;
function toggleEasterEgg() {
    const container = document.querySelector('.logo-container');
    const qrImg = document.getElementById('logo-qr');
    const msg = document.getElementById('easter-egg-msg');

    if (!container || !qrImg || !msg) return;

    easterEggActive = !easterEggActive;

    if (easterEggActive) {
        // Generate QR for the site dynamically using the current location
        const siteUrl = window.location.href.split('#')[0];
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(siteUrl)}`;

        container.classList.add('flipped');
        msg.classList.add('show');

        // Hide message after 3 seconds
        setTimeout(() => {
            msg.classList.remove('show');
        }, 3000);
    } else {
        container.classList.remove('flipped');
        msg.classList.remove('show');
    }
}

// Desktop Scroll Logic
window.addEventListener('scroll', () => {
    const nav = document.getElementById('desktop-nav');
    if (nav && window.innerWidth >= 768) {
        if (window.scrollY > 200) {
            nav.style.transform = 'translateY(0)';
        } else {
            nav.style.transform = 'translateY(-100%)';
        }
    }
});
