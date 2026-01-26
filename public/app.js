// Fallback Data
const FALLBACK_DATA = {
    businessInfo: {
        whatsapp: "5541998541513",
        pixKey: "+5541998541513",
        name: "Bárbara Rosa"
    },
    products: [
        { id: '1', name: "Bombom de morango", price: 12.00, category: 'Bombons', image: "./public/assets/products/bombom-morango-real.jpeg" },
        { id: '2', name: "Bolo de pote", price: 10.00, category: 'Bolos', image: "./public/assets/products/bolo-de-pote-new.png" },
        { id: '3', name: "Bombom de uva no pote", price: 10.00, category: 'Bombons', image: "./public/assets/products/bombom-uva-real.jpeg" },
        { id: '4', name: "Banoffe", price: 10.00, category: 'Sobremesas', image: "./public/assets/products/banoffe-real.jpeg" },
        { id: '5', name: "Pavê de morango", price: 10.00, category: 'Sobremesas', image: "./public/assets/products/pave-morango-real.jpeg" },
        { id: '6', name: "Pavê de ninho com Nutella", price: 10.00, category: 'Sobremesas', image: "./public/assets/products/pave-ninho-nutella-real.jpeg" },
        { id: '7', name: "Mousse de maracujá", price: 10.00, category: 'Sobremesas', image: "./public/assets/products/mousse-maracuja-real.jpeg" },
        { id: '8', name: "Palha Italiana Tradicional", price: 7.50, category: 'Palhas', image: "./public/assets/products/palha-tradicional-new.png" },
        { id: '9', name: "Palha de Oreo", price: 7.50, category: 'Palhas', image: "./public/assets/products/palha-oreo-new.png" },
        { id: '10', name: "Palha de Paçoca", price: 7.50, category: 'Palhas', image: "./public/assets/products/palha-pacoca-new.png" },
        { id: '11', name: "Cone trufado de maracujá", price: 6.50, category: 'Cones', image: "./public/assets/products/cone-maracuja-new.png" },
        { id: '12', name: "Cone trufado de limão", price: 6.50, category: 'Cones', image: "./public/assets/products/cone-limao-new.png" },
        { id: '13', name: "Cone trufado de ninho", price: 6.50, category: 'Cones', image: "./public/assets/products/cone-ninho-new.png" },
        { id: '14', name: "Cone trufado de nozes", price: 6.50, category: 'Cones', image: "./public/assets/products/cone-nozes-new.png" },
        { id: '15', name: "Cone trufado de pistache", price: 6.50, category: 'Cones', image: "./public/assets/products/cone-pistache-new.png" },
        { id: '16', name: "Travessa de Banoffe (≈ 1,1kg)", price: 55.00, category: 'Travessas', image: "./public/assets/products/travessa-banoffe-real.jpeg" }
    ]
};

let BUSINESS_INFO = FALLBACK_DATA.businessInfo;
let PRODUCTS = FALLBACK_DATA.products;
let businessInfo = FALLBACK_DATA.businessInfo;
let allProducts = FALLBACK_DATA.products;
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let currentCategory = 'Tudo';
let searchTerm = '';

// Load Data
async function init() {
    renderSkeletons();
    try {
        const response = await fetch(`./public/db.json?v=${new Date().getTime()}`);
        if (response.ok) {
            const data = await response.json();
            businessInfo = data.businessInfo;
            allProducts = data.products;
        } else {
            console.warn('Usando dados locais de fallback');
            businessInfo = FALLBACK_DATA.businessInfo;
            allProducts = FALLBACK_DATA.products;
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        businessInfo = FALLBACK_DATA.businessInfo;
        allProducts = FALLBACK_DATA.products;
    } finally {
        // Artificial delay for better UX (so skeletons are visible)
        setTimeout(() => {
            document.getElementById('year').innerText = new Date().getFullYear();
            renderCategories();
            renderProducts();
            updateCartCount();
            injectStructuredData();
        }, 800);
    }
}

function renderSkeletons() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = Array(6).fill(0).map(() => `
        <div class="glass p-6 rounded-[2.5rem] border-white/5 overflow-hidden">
            <div class="aspect-square skeleton w-full mb-6 rounded-[2rem]"></div>
            <div class="px-2 pb-2">
                <div class="h-6 skeleton w-3/4 mb-4 rounded-lg"></div>
                <div class="h-8 skeleton w-1/2 mb-8 rounded-lg"></div>
                <div class="h-14 skeleton w-full rounded-2xl"></div>
            </div>
        </div>
    `).join('');
}

function injectStructuredData() {
    injectProductSchema();
    injectFAQSchema();
    injectBakerySchema();
}

function injectBakerySchema() {
    // Already in HTML, but we can ensure it's up to date if needed
    // or just rely on the static one for now as it's quite complete.
}

function injectFAQSchema() {
    const schemaId = 'dynamic-faq-schema';
    let script = document.getElementById(schemaId);
    if (!script) {
        script = document.createElement('script');
        script.id = schemaId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }

    const faqs = [
        { q: "Como faço meu pedido?", a: "Você pode escolher seus doces favoritos aqui no site e finalizar o pedido diretamente pelo WhatsApp para combinarmos a entrega ou retirada." },
        { q: "Quais as formas de pagamento?", a: "Aceitamos Pix (com QR Code gerado aqui no site), cartões de débito/crédito e dinheiro na retirada." },
        { q: "Vocês fazem entregas?", a: "Sim, realizamos entregas em diversas regiões de Curitiba. Consulte a taxa de entrega informando seu endereço via WhatsApp." },
        { q: "Os doces são frescos?", a: "Sempre! Produzimos nossos doces artesanais diariamente para garantir o máximo de frescor e qualidade para você." }
    ];

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };
    script.textContent = JSON.stringify(schema);
}

function injectProductSchema() {
    const schemaId = 'dynamic-product-schema';
    let script = document.getElementById(schemaId);
    if (!script) {
        script = document.createElement('script');
        script.id = schemaId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }

    const schema = {
        "@context": "https://schema.org",
        "@graph": allProducts.map(p => ({
            "@type": "Product",
            "name": p.name,
            "image": window.location.origin + p.image.substring(1),
            "description": `${p.name} - Doce artesanal da Bárbara Rosa.`,
            "brand": {
                "@type": "Brand",
                "name": "Bárbara Rosa"
            },
            "offers": {
                "@type": "Offer",
                "price": p.price,
                "priceCurrency": "BRL",
                "availability": "https://schema.org/InStock"
            }
        }))
    };
    script.textContent = JSON.stringify(schema);
}


function renderCategories() {
    const categories = ['Tudo', ...new Set(allProducts.map(p => p.category))];
    const container = document.getElementById('category-filters');
    if (!container) return;

    container.innerHTML = categories.map(cat => `
        <button onclick="setCategory('${cat}')" 
            role="tab" aria-selected="${currentCategory === cat}"
            aria-label="Filtrar por ${escapeHTML(cat)}"
            class="category-btn px-6 py-3 rounded-full text-sm font-bold transition-all border whitespace-nowrap ${currentCategory === cat
            ? 'bg-brand border-brand text-white shadow-lg'
            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
        }">${escapeHTML(cat)}</button>
    `).join('');
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function setCategory(cat) {
    currentCategory = cat;
    renderCategories();
    renderProducts();
    updatePageMetadata();
}

function updatePageMetadata() {
    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
        if (currentCategory === 'Tudo') {
            desc.content = "Experimente os melhores doces artesanais de Curitiba. Bombons, bolos, pavês e muito mais feitos com carinho pela Bárbara Rosa.";
        } else {
            desc.content = `Confira nossa seleção de ${currentCategory} artesanais. O melhor sabor de Curitiba preparado pela Bárbara Rosa.`;
        }
    }
}

function handleSearch(event) {
    searchTerm = event.target.value.toLowerCase();
    renderProducts();
}

function renderProducts(skipAnimation = false) {
    const container = document.getElementById('products-grid');
    if (!container) return;

    const filtered = allProducts.filter(p => {
        const matchesCategory = currentCategory === 'Tudo' || p.category === currentCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-20 text-center animate-fade-in">
                <div class="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-search text-3xl opacity-20"></i>
                </div>
                <h3 class="text-xl font-bold opacity-50">Nenhum doce encontrado</h3>
                <p class="opacity-30 mt-2">Tente buscar por outro nome ou categoria.</p>
                <button onclick="searchTerm=''; document.querySelector('input[type=text]').value=''; renderProducts();" class="mt-6 text-brand font-bold uppercase tracking-widest text-xs">Limpar busca</button>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(p => {
        const cartItem = cart.find(item => item.id === p.id);
        const qty = cartItem ? cartItem.quantity : 0;

        return `
            <div class="product-card-premium rounded-[2.5rem] overflow-hidden flex flex-col group h-full transition-all duration-300 ${skipAnimation ? '!animation-none' : ''}" style="${skipAnimation ? 'animation: none;' : ''}">
                <div class="product-image-wrapper relative">
                    <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
                    ${p.label ? `
                        <div class="absolute top-4 right-4 z-20">
                            <img src="${p.label}" class="product-label-sticker" alt="Etiqueta ${p.name}">
                        </div>
                    ` : `
                        <div class="absolute top-8 right-8 product-tag">${escapeHTML(p.category)}</div>
                    `}
                </div>
                <div class="px-7 pb-7 flex flex-col flex-1">
                    <div class="flex flex-col mb-6 gap-2">
                        <h3 class="font-bold text-lg md:text-xl leading-tight">${escapeHTML(p.name)}</h3>
                        <div class="text-brand font-black text-2xl">${formatCurrency(p.price)}</div>
                    </div>
                    <div class="mt-auto">
                        ${qty === 0 ? `
                            <button onclick="addToCart('${p.id}')" aria-label="Adicionar ${escapeHTML(p.name)} ao carrinho" class="w-full bg-brand text-white font-bold py-3 md:py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 text-sm md:text-base">
                                <i class="fas fa-plus"></i> Adicionar
                            </button>
                        ` : `
                            <div class="flex items-center justify-between glass !bg-white/5 rounded-xl p-1" aria-label="Quantidade de ${escapeHTML(p.name)}">
                                <button onclick="updateQty('${p.id}', -1)" aria-label="Diminuir quantidade" class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/10 rounded-lg"><i class="fas fa-minus text-xs"></i></button>
                                <span class="font-bold text-lg md:text-xl" aria-live="polite">${qty}</span>
                                <button onclick="updateQty('${p.id}', 1)" aria-label="Aumentar quantidade" class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/10 rounded-lg text-brand"><i class="fas fa-plus text-xs"></i></button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function addToCart(id) {
    const product = allProducts.find(p => p.id === id);
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

    // Add micro-animation hint to the cart buttons/badges
    const badges = [document.getElementById('cart-count'), document.getElementById('nav-cart-count')];
    badges.forEach(b => {
        if (b && !b.classList.contains('hidden')) {
            b.classList.remove('animate-bounce-short');
            void b.offsetWidth; // trigger reflow
            b.classList.add('animate-bounce-short');
        }
    });
}

function clearCart() {
    if (confirm('Deseja limpar todos os itens do carrinho?')) {
        cart = [];
        saveCart();
    }
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    const navBadge = document.getElementById('nav-cart-count');

    if (badge) {
        badge.innerText = total;
        badge.classList.toggle('hidden', total === 0);
        if (total > 0) badge.classList.add('animate-bounce-short');
        setTimeout(() => badge.classList.remove('animate-bounce-short'), 400);
    }

    if (navBadge) {
        navBadge.innerText = total;
        navBadge.classList.toggle('hidden', total === 0);
        if (total > 0) navBadge.classList.add('animate-bounce-short');
        setTimeout(() => navBadge.classList.remove('animate-bounce-short'), 400);
    }
}

// Mobile Tab Bar active state handling
window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const links = document.querySelectorAll('.mobile-tab-bar a');

    if (scrollPos < 300) {
        links.forEach(l => l.classList.remove('active'));
        links[0].classList.add('active');
    } else if (scrollPos > 300 && scrollPos < 1500) {
        links.forEach(l => l.classList.remove('active'));
        links[1].classList.add('active');
    }
});

init();

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
            <div class="h-full flex flex-col items-center justify-center text-center py-20 animate-fade-in">
                <div class="bg-white/5 p-8 rounded-full mb-6">
                    <i class="fas fa-shopping-basket text-6xl text-brand/30"></i>
                </div>
                <p class="text-xl font-bold opacity-40">Seu carrinho está vazio</p>
                <p class="text-sm opacity-30 mt-2">Adicione algumas delícias para começar!</p>
                <button onclick="toggleCart(false)" class="mt-8 text-brand font-bold uppercase tracking-widest text-xs hover:underline">Voltar ao Menu</button>
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
                <div class="w-20 h-20 rounded-xl overflow-hidden glass shrink-0 p-0">
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
    window.open(`https://wa.me/${businessInfo.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
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

    // Sanitize input to ensure it's a valid number format
    const cleanValue = inputAmount.replace(/[^\d,]/g, "").replace(",", ".");
    const amount = parseFloat(cleanValue);

    if (isNaN(amount) || amount <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    const amountStr = amount.toFixed(2);
    const pixKey = businessInfo.pixKey;
    const name = businessInfo.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 25);
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
        // Use Local QR Code Generator (QRious)
        const qrContainer = document.getElementById('pix-qr');

        // Clear previous QR if any (though qrious handles replacement)
        new QRious({
            element: qrContainer,
            value: pixCode,
            size: 256,
            padding: 4,
            level: 'H',
            foreground: '#000000',
            background: '#ffffff'
        });

        merchantEl.innerText = businessInfo.name;
        document.getElementById('pix-modal').classList.remove('hidden');
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
