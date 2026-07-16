
// 1. BANCO DE DADOS DE PRODUTOS (COM CORES E TAMANHOS)
const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Conjunto Corset Rendado Morgana",
        category: "lingeries",
        priceRegular: 69.90,
        pricePromo: 49.90,
        image: "assets/conjunto_luxo.png",
        sizes: ["P", "M", "G", "GG"],
        colors: ["Preto", "Borgonha"],
        description: "Conjunto corset premium rendado com aro de sustentação, alças reguláveis e detalhe em pingente banhado. Confeccionado em renda antialérgica ultra-macia. Perfeito para realçar as curvas com elegância.",
        isNew: false,
        isHot: true
    },
    {
        id: 2,
        name: "Body de Renda Premium Bordeaux",
        category: "lingeries",
        priceRegular: 59.90,
        pricePromo: 39.90,
        image: "assets/body_renda.png",
        sizes: ["P", "M", "G", "GG"],
        colors: ["Borgonha"],
        description: "Body luxo em renda francesa e tule macio na cor vinho bordeaux. Possui costas semi-abertas com regulagem e forro de algodão na parte inferior. Uma peça curinga para compor looks casuais ou momentos especiais.",
        isNew: true,
        isHot: false
    },
    {
        id: 3,
        name: "Conjunto Cropped Veludo Francês",
        category: "lingeries",
        priceRegular: 79.90,
        pricePromo: 54.90,
        image: "assets/conjunto_luxo.png",
        sizes: ["P", "M", "G"],
        colors: ["Preto", "Vinho"],
        description: "Conjunto com base cropped em veludo macio e detalhes em renda chantilly. Alças de cetim brilhante e fechamento triplo nas costas para ajuste perfeito no corpo.",
        isNew: true,
        isHot: false
    },
    {
        id: 4,
        name: "Baby Doll de Tule Mary",
        category: "lingeries",
        priceRegular: 49.90,
        pricePromo: 34.90,
        image: "assets/body_renda.png",
        sizes: ["M", "G", "GG"],
        colors: ["Preto", "Branco"],
        description: "Baby doll leve em tule trabalhado, com bojo moldado de renda e alça fina regulável. Shorts curtinho em microfibra macia. Caimento solto e super confortável para noites luxuosas.",
        isNew: false,
        isHot: false
    },
    {
        id: 5,
        name: "Body Splash Hidratante Alleva Glow 200ml",
        category: "cosmeticos",
        priceRegular: 39.90,
        pricePromo: 29.90,
        image: "assets/body_splash.png",
        sizes: [],
        colors: [],
        description: "Fragrância floral-oriental marcante com micropartículas de brilho dourado (shimmer) que iluminam a pele. Contém agentes hidratantes e fixação prolongada. O toque final que exala sensualidade.",
        isNew: false,
        isHot: true
    },
    {
        id: 6,
        name: "Gel Comestível de Massagem Feitiços 35ml",
        category: "cosmeticos",
        priceRegular: 19.90,
        pricePromo: 14.90,
        image: "assets/body_splash.png",
        sizes: [],
        colors: [],
        description: "Gel aromático beijável para massagem corporal com efeito de aquecimento ao soprar. Ideal para momentos a dois. Sabores sortidos de alta aceitação no mercado.",
        isNew: false,
        isHot: false
    },
    {
        id: 7,
        name: "Cartão de Agradecimento Thank You - 20 UND",
        category: "papelaria",
        priceRegular: 14.90,
        pricePromo: 9.90,
        image: "assets/papelaria_luxo.png",
        sizes: [],
        colors: [],
        description: "Papelaria de luxo para lojistas. Cartões em papel couché fosco 250g com impressão hot-stamping dourada 'Obrigada por escolher a Tiby'. Essencial para elevar a experiência de unboxing do seu cliente.",
        isNew: false,
        isHot: false
    },
    {
        id: 8,
        name: "Tag de Preço Look do Dia - 20 UND",
        category: "papelaria",
        priceRegular: 12.90,
        pricePromo: 8.90,
        image: "assets/papelaria_luxo.png",
        sizes: [],
        colors: [],
        description: "Etiquetas premium de preço em papel cartão preto com logo dourada, furação e barbante de algodão encerado incluso. Valorize as peças da sua marca.",
        isNew: false,
        isHot: false
    },
    {
        id: 9,
        name: "Kit Lucro Rápido - 3 Conjuntos + 1 Body Splash",
        category: "kits",
        priceRegular: 220.00,
        pricePromo: 159.90,
        image: "assets/banner.png",
        sizes: ["P/M", "G/GG"],
        colors: ["Misto"],
        description: "Combo perfeito para revenda. Contém 3 conjuntos de lingeries rendadas premium de tamanhos variados e 1 Body Splash Alleva Glow. Ganho estimado de até R$ 180,00 na revenda unitária.",
        isNew: false,
        isHot: true
    },
    {
        id: 10,
        name: "Kit Deslizando - Bodysuit + Gel Estimulante",
        category: "kits",
        priceRegular: 79.90,
        pricePromo: 59.90,
        image: "assets/body_renda.png",
        sizes: ["P", "M", "G", "GG"],
        colors: ["Borgonha"],
        description: "Kit especial contendo 1 Body de Renda Bordeaux e 1 Gel de Massagem Feitiços. Ideal para presentear ou para uso pessoal em noites especiais com economia garantida.",
        isNew: true,
        isHot: false
    }
];

// 2. ESTADO DO APLICATIVO
let favorites = JSON.parse(localStorage.getItem("tiby_favorites")) || [];
let currentFilter = "all";
let currentSearch = "";
let showingFavoritesOnly = false;
let defaultCatalogTitle = "Produtos em Destaque";
const WHATSAPP_NUMBER = "5521991670127";

const welcomeSection = document.querySelector(".app-welcome-section");
const filterSection = document.querySelector(".app-filter-section");
const productsSection = document.querySelector(".app-products-section");
const vipSection = document.querySelector(".app-vip-section");
const detailsView = document.getElementById("app-product-details-view");

const productsGrid = document.getElementById("products-catalog-grid");
const favBadge = document.getElementById("favorites-badge-count");
const mobileMenu = document.getElementById("mobile-menu-panel");

let selectedDetailProduct = null;
let selectedDetailSize = null;
let selectedDetailColor = null;
let selectedDetailQty = 1;

// 3. INICIALIZAÇÃO DO APP E ROUTER
document.addEventListener("DOMContentLoaded", () => {
    const sectionTitle = document.getElementById("catalog-section-title");
    if (sectionTitle) {
        defaultCatalogTitle = sectionTitle.textContent;
    }
    
    renderCatalog();
    updateFavoritesBadge();
    setupEventListeners();
    
    // Executa roteador inicial
    router();
});

window.addEventListener("hashchange", router);

// Roteador SPA baseado em Hash
function router() {
    const hash = window.location.hash;
    const match = hash.match(/^#produto\/(\d+)$/);

    if (match) {
        const productId = parseInt(match[1], 10);
        renderProductDetails(productId);
    } else if (hash === "#favoritos") {
        detailsView.style.display = "none";
        welcomeSection.style.display = "block";
        filterSection.style.display = "block";
        productsSection.style.display = "block";
        vipSection.style.display = "block";
        showFavoritesOnly();
    } else {
        showCatalogView();
    }
}

// 4. EVENT LISTENERS
function setupEventListeners() {
    // Menu Mobile
    document.getElementById("open-mobile-menu").addEventListener("click", () => {
        mobileMenu.classList.add("active");
    });
    document.getElementById("close-mobile-menu").addEventListener("click", () => {
        mobileMenu.classList.remove("active");
    });
    document.getElementById("mobile-menu-overlay").addEventListener("click", () => {
        mobileMenu.classList.remove("active");
    });

    document.getElementById("btn-favorites-trigger").addEventListener("click", () => {
        window.location.hash = "#favoritos";
    });

    const searchBtn = document.querySelector(".search-btn-app");
    const searchInput = document.getElementById("input-search-app");
    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", () => {
            searchInput.focus();
        });
    }
}

// 5. NAVEGAÇÃO DE PÁGINAS (SPA)
function showCatalogView() {
    showingFavoritesOnly = false;
    // Oculta Detalhes
    detailsView.style.display = "none";

    welcomeSection.style.display = "block";
    filterSection.style.display = "block";
    productsSection.style.display = "block";
    vipSection.style.display = "block";
    
    const dropdown = document.getElementById("select-category-dropdown");
    if (dropdown) dropdown.value = currentFilter;
    
    const searchInput = document.getElementById("input-search-app");
    if (searchInput) searchInput.value = currentSearch;

    renderCatalog();
}

function navigateToProduct(productId) {
    window.location.hash = `#produto/${productId}`;
}

function goBackToCatalog() {
    window.location.hash = "#";
}

function renderCatalog() {
    if (!productsGrid) return;
    productsGrid.innerHTML = "";

    const sectionTitle = document.getElementById("catalog-section-title");
    if (sectionTitle) sectionTitle.textContent = defaultCatalogTitle;

    const filtered = PRODUCTS_DATA.filter(prod => {
        const matchesCategory = currentFilter === "all" || prod.category === currentFilter;
        const matchesSearch = prod.name.toLowerCase().includes(currentSearch.toLowerCase()) || 
                              prod.category.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products-message" style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-muted);">
                <i class="fa-regular fa-folder-open" style="font-size: 2.5rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>Nenhum produto encontrado.</p>
            </div>
        `;
        return;
    }
    filtered.forEach(product => {
        const isFav = favorites.includes(product.id);
        const card = document.createElement("div");
        card.className = "product-card";
        
        card.addEventListener("click", () => navigateToProduct(product.id));
        card.addEventListener("contextmenu", e => e.preventDefault());
        card.addEventListener("dragstart", e => e.preventDefault());
        
        let badgeHtml = "";
        if (product.isNew) badgeHtml = `<span class="badge-tag tag-new">Novo</span>`;
        else if (product.isHot) badgeHtml = `<span class="badge-tag tag-hot">Mais Vendido</span>`;

        let sizeBadgesHtml = "";
        if (product.sizes.length > 0) {
            sizeBadgesHtml = `<div class="product-size-badges">` + 
                product.sizes.map(s => `<span class="size-badge">${s}</span>`).join("") + 
                `</div>`;
        } else {
            sizeBadgesHtml = `<div class="product-size-badges"><span class="size-badge">Único</span></div>`;
        }

        card.innerHTML = `
            <div class="product-image-container">
                <div class="product-badges">${badgeHtml}</div>
                <button class="wishlist-heart-btn ${isFav ? 'favorited' : ''}" onclick="toggleFavorite(event, ${product.id})" aria-label="Favoritar">
                    <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info-box">
                <span class="product-category-name">${product.category}</span>
                <h3 class="product-name-title"><span class="product-name-inner">${product.name}</span></h3>
                ${sizeBadgesHtml}
                <div class="price-box-wrapper">
                    <span class="price-regular">R$ ${product.priceRegular.toFixed(2).replace('.', ',')}</span>
                    <div class="price-row-promo">
                        <span class="price-promo">R$ ${product.pricePromo.toFixed(2).replace('.', ',')}</span>
                        <span class="pix-note-badge">no PIX</span>
                    </div>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// 7. FILTROS E BUSCA DO APP
function handleDropdownFilter(catVal) {
    currentFilter = catVal;
    renderCatalog();
}

function handleSearchInput(query) {
    currentSearch = query;
    renderCatalog();
}

function filterCategory(catVal) {
    currentFilter = catVal;
    window.location.hash = "#";
    
    const dropdown = document.getElementById("select-category-dropdown");
    if (dropdown) dropdown.value = catVal;

    mobileMenu.classList.remove("active");

    const section = document.getElementById("produtos");
    if (section) section.scrollIntoView({ behavior: 'smooth' });
    
    renderCatalog();
}

function closeMenuAndHome() {
    mobileMenu.classList.remove("active");
    currentFilter = "all";
    currentSearch = "";
    
    const dropdown = document.getElementById("select-category-dropdown");
    if (dropdown) dropdown.value = "all";

    const searchInput = document.getElementById("input-search-app");
    if (searchInput) searchInput.value = "";

    window.location.hash = "#";
    window.scrollTo(0, 0);
    renderCatalog();
}

// 8. FAVORITOS
function toggleFavorite(event, productId) {
    event.stopPropagation();
    const index = favorites.indexOf(productId);
    if (index === -1) {
        favorites.push(productId);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem("tiby_favorites", JSON.stringify(favorites));
    updateFavoritesBadge();
    
    if (showingFavoritesOnly) {
        showFavoritesOnly(false);
    } else {
        renderCatalog();
    }
}

function updateFavoritesBadge() {
    if (favBadge) {
        favBadge.textContent = favorites.length;
    }
}

function showFavoritesOnly(shouldScroll = true) {
    showingFavoritesOnly = true;
    currentSearch = "";
    currentFilter = "all";
    
    const dropdown = document.getElementById("select-category-dropdown");
    if (dropdown) dropdown.value = "all";

    const sectionTitle = document.getElementById("catalog-section-title");
    if (sectionTitle) sectionTitle.textContent = "Minha Lista de Desejos";

    if (productsGrid) {
        if (shouldScroll) {
            window.scrollTo(0, 0);
        }
        productsGrid.innerHTML = "";
        
        const favProducts = PRODUCTS_DATA.filter(prod => favorites.includes(prod.id));
        
        if (favProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products-message" style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-muted);">
                    <i class="fa-regular fa-heart" style="font-size: 2.5rem; margin-bottom: 15px; opacity: 0.5;"></i>
                    <p>Você não favoritou nenhum produto ainda.</p>
                </div>
            `;
            return;
        }
        favProducts.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card";
            
            card.addEventListener("click", () => navigateToProduct(product.id));
            card.addEventListener("contextmenu", e => e.preventDefault());
            card.addEventListener("dragstart", e => e.preventDefault());
            
            let sizeBadgesHtml = product.sizes.length > 0 
                ? `<div class="product-size-badges">` + product.sizes.map(s => `<span class="size-badge">${s}</span>`).join("") + `</div>`
                : `<div class="product-size-badges"><span class="size-badge">Único</span></div>`;

            card.innerHTML = `
                <div class="product-image-container">
                    <button class="wishlist-heart-btn favorited" onclick="toggleFavorite(event, ${product.id})" aria-label="Favoritar">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info-box">
                    <span class="product-category-name">${product.category}</span>
                    <h3 class="product-name-title"><span class="product-name-inner">${product.name}</span></h3>
                    ${sizeBadgesHtml}
                    <div class="price-box-wrapper">
                        <span class="price-regular">R$ ${product.priceRegular.toFixed(2).replace('.', ',')}</span>
                        <div class="price-row-promo">
                            <span class="price-promo">R$ ${product.pricePromo.toFixed(2).replace('.', ',')}</span>
                            <span class="pix-note-badge">no PIX</span>
                        </div>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);
        });
    }
}

// 9. RENDERIZAR PÁGINA DE DETALHES DEDICADA (SPA)
function renderProductDetails(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) {
        window.location.hash = "#";
        return;
    }

    selectedDetailProduct = product;
    selectedDetailSize = product.sizes.length > 0 ? product.sizes[0] : null;
    selectedDetailColor = product.colors.length > 0 ? product.colors[0] : null;
    selectedDetailQty = 1;

    welcomeSection.style.display = "none";
    filterSection.style.display = "none";
    productsSection.style.display = "none";
    vipSection.style.display = "none";

    detailsView.style.display = "block";
    detailsView.innerHTML = "";

    let sizeSelectorHtml = "";
    if (product.sizes.length > 0) {
        sizeSelectorHtml = `
            <div class="details-option-group">
                <h4 class="details-option-title">Selecione o Tamanho:</h4>
                <div class="size-options-row">
                    ${product.sizes.map((s, idx) => `
                        <button class="size-option-btn ${idx === 0 ? 'active' : ''}" onclick="selectDetailsSize(this, '${s}')">${s}</button>
                    `).join("")}
                </div>
            </div>
        `;
    }

    let colorSelectorHtml = "";
    if (product.colors.length > 0) {
        colorSelectorHtml = `
            <div class="details-option-group">
                <h4 class="details-option-title">Escolha a Cor:</h4>
                <div class="color-options-row">
                    ${product.colors.map((c, idx) => {
                        const classColor = c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normaliza strings
                        return `
                            <button class="color-option-btn ${idx === 0 ? 'active' : ''}" onclick="selectDetailsColor(this, '${c}')" title="${c}">
                                <span class="color-dot color-${classColor}"></span>
                            </button>
                        `;
                    }).join("")}
                </div>
            </div>
        `;
    }

    detailsView.innerHTML = `
        <button class="btn-back-catalog" onclick="goBackToCatalog()">
            <i class="fa-solid fa-arrow-left"></i> Voltar ao Catálogo
        </button>

        <div class="details-grid">
            <div class="details-image-holder">
                <img src="${product.image}" alt="${product.name}" id="details-main-img">
            </div>

            <div class="details-info-holder">
                <span class="details-category">${product.category}</span>
                <h1 class="details-title">${product.name}</h1>

                <div class="details-price-box">
                    <span class="regular">R$ ${product.priceRegular.toFixed(2).replace('.', ',')}</span>
                    <span class="promo">R$ ${product.pricePromo.toFixed(2).replace('.', ',')}</span>
                    <span class="pix-badge">PIX (-5%)</span>
                </div>

                <p class="details-description">${product.description}</p>

                ${sizeSelectorHtml}
                ${colorSelectorHtml}

                <div class="details-actions-row">
                    <div class="qty-selector-details">
                        <button class="qty-btn" onclick="adjustDetailsQty(-1)"><i class="fa-solid fa-minus"></i></button>
                        <span class="qty-value" id="details-qty-value">1</span>
                        <button class="qty-btn" onclick="adjustDetailsQty(1)"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    
                    <button class="btn-whatsapp-buy-large" onclick="buyProductWhatsApp()">
                        <i class="fa-brands fa-whatsapp"></i> COMPRAR PELO WHATSAPP
                    </button>
                </div>
            </div>
        </div>
    `;

    window.scrollTo(0, 0);
}

// 10. COMPORTAMENTOS DA PÁGINA DE DETALHES
function selectDetailsSize(buttonEl, size) {
    const buttons = document.querySelectorAll(".size-option-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    buttonEl.classList.add("active");
    selectedDetailSize = size;
}

function selectDetailsColor(buttonEl, color) {
    const buttons = document.querySelectorAll(".color-option-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    buttonEl.classList.add("active");
    selectedDetailColor = color;
}

function adjustDetailsQty(delta) {
    selectedDetailQty += delta;
    if (selectedDetailQty < 1) selectedDetailQty = 1;
    document.getElementById("details-qty-value").textContent = selectedDetailQty;
}

// 11. REDIRECIONAR AO WHATSAPP (BOTÃO DE COMPRA DA PÁGINA DE DETALHES)
function buyProductWhatsApp() {
    if (!selectedDetailProduct) return;
    
    let sizeText = selectedDetailSize ? `\n- Tamanho: *${selectedDetailSize}*` : "";
    let colorText = selectedDetailColor ? `\n- Cor: *${selectedDetailColor}*` : "";
    let qtyText = selectedDetailQty > 1 ? `\n- Quantidade: *${selectedDetailQty}x*` : "";
    
    let message = `Olá, tenho interesse no *${selectedDetailProduct.name}*.${sizeText}${colorText}${qtyText}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;
    
    window.open(whatsappLink, "_blank");
}

// 12. MODAL INSTITUCIONAL (AJUDA E SUPORTE)
const instModal = document.getElementById("institutional-modal");
const instBody = document.getElementById("inst-modal-body-content");

function openInstModal(pageKey) {
    if (!instBody) return;
    instBody.innerHTML = "";

    let content = "";
    if (pageKey === "how-to-buy") {
        content = `
            <h2>Como Comprar na TibySexy?</h2>
            <p>Comprar pelo catálogo da Tiby.sexy é muito prático e humanizado:</p>
            <ol>
                <li>Navegue pelos produtos e clique no produto desejado para abrir seus detalhes.</li>
                <li>Selecione suas opções de <strong>tamanho</strong>, <strong>cor</strong> e a <strong>quantidade</strong>.</li>
                <li>Clique no botão destacado <strong>COMPRAR PELO WHATSAPP</strong>.</li>
                <li>O sistema abrirá o chat oficial da Tiby com a mensagem pronta descrevendo o item escolhido.</li>
                <li>Nossa vendedora informará sobre a disponibilidade física, valores especiais utilizando cupons de desconto e finalizará seu faturamento.</li>
            </ol>
        `;
    } else if (pageKey === "exchange-policy") {
        content = `
            <h2>Política de Troca</h2>
            <p>Prezamos pela qualidade das nossas peças e pela sua satisfação. Para garantir a segurança e higiene de todas as clientes, seguimos as seguintes condições:</p>
            <ul>
                <li><strong>Defeito de Fabricação:</strong> Caso a peça apresente algum defeito de fabricação, a troca poderá ser solicitada em até 7 dias corridos após o recebimento do produto.</li>
                <li><strong>Condições:</strong> Para que a troca seja realizada, o produto deve estar: Sem sinais de uso, lavagem ou alterações; Na embalagem original; Com etiquetas e tags intactas.</li>
                <li><strong>Peças Íntimas:</strong> Por questões de higiene e segurança, não realizamos trocas de peças íntimas usadas ou sem defeito de fabricação comprovado.</li>
            </ul>
        `;
    } else if (pageKey === "order-tracking") {
        content = `
            <h2>Rastrear Pedido</h2>
            <p>Após fechar seu pedido com nossa vendedora no WhatsApp e realizar o faturamento:</p>
            <ul>
                <li>As peças serão despachadas em até <strong>3 dias úteis</strong>.</li>
                <li>A vendedora enviará o código de rastreamento direto no seu chat do WhatsApp.</li>
                <li>Você poderá acompanhar a entrega através dos Correios (PAC/SEDEX) ou transportadoras parceiras.</li>
            </ul>
        `;
    }

    instBody.innerHTML = content;
    instModal.classList.add("active");
}

function closeInstModal() {
    instModal.classList.remove("active");
}
