/* ==========================================================================
   TIBY.SEXY - LÓGICA E REGRAS DE NEGÓCIO DO CATÁLOGO DIGITAL (VANILLA JS)
   ========================================================================== */

// 1. BANCO DE DADOS DE PRODUTOS (COM CORES E TAMANHOS)
const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Calcinha Veneno",
        category: "lingeries",
        priceRegular: 49.90,
        pricePromo: 39.90,
        image: "assets/Calcinhas Veneno.jpeg",
        sizes: ["Único"],
        colors: [],
        description: "Calcinha sensual com caimento perfeito e toque macio. Design exclusivo para proporcionar conforto e extrema sensualidade.",
        isNew: true,
        isHot: true
    },
    {
        id: 2,
        name: "Conjunto Luxúria",
        category: "lingeries",
        priceRegular: 84.90,
        pricePromo: 64.90,
        image: "assets/Conjunto Luxúria.jpeg",
        sizes: ["G", "GG"],
        colors: [],
        description: "Conjunto sofisticado em renda premium com caimento impecável e detalhes marcantes. Ideal para quem busca elegância e conforto.",
        isNew: false,
        isHot: true
    },
    {
        id: 3,
        name: "Conjunto Siena",
        category: "lingeries",
        priceRegular: 84.90,
        pricePromo: 64.90,
        image: "assets/Conjunto Siena.jpeg",
        sizes: ["G", "GG"],
        colors: [],
        description: "Conjunto delicado com aro e detalhes de acabamento de altíssima qualidade. Valoriza e sustenta com total elegância.",
        isNew: true,
        isHot: false
    },
    {
        id: 4,
        name: "Conjunto Obsessão",
        category: "lingeries",
        priceRegular: 139.90,
        pricePromo: 109.90,
        image: "assets/Conjunto Obsessão.jpeg",
        sizes: ["GG"],
        colors: [],
        description: "Conjunto luxuoso com acabamentos impecáveis, suporte perfeito e estrutura diferenciada para realçar todas as curvas.",
        isNew: false,
        isHot: true
    },
    {
        id: 5,
        name: "Body Magnólia",
        category: "lingeries",
        priceRegular: 149.90,
        pricePromo: 119.90,
        image: "assets/Body Magnólia.jpeg",
        sizes: ["P", "M", "G"],
        colors: [],
        description: "Body sensual e elegante em renda premium e transparências sutis. Perfeito para compor looks incríveis e marcantes.",
        isNew: true,
        isHot: true
    },
    {
        id: 6,
        name: "Conjunto Desejo",
        category: "lingeries",
        priceRegular: 169.90,
        pricePromo: 139.90,
        image: "assets/Conjunto Desejo.jpeg",
        sizes: ["P", "M", "G"],
        colors: ["Preto", "Rosa"],
        colorImages: {
            "Preto": "assets/Conjunto Desejo.jpeg",
            "Rosa": "assets/Conjunto Desejo Rosa.jpeg"
        },
        description: "Conjunto em renda trabalhada e design sensual marcante. Excelente sustentação e conforto direto da fábrica. Disponível em Preto e Rosa.",
        isNew: true,
        isHot: true
    }
];

// 2. ESTADO DO APLICATIVO
let favorites = JSON.parse(localStorage.getItem("tiby_favorites")) || [];
let currentFilter = "all";
let currentSearch = "";
let showingFavoritesOnly = false;
let defaultCatalogTitle = "Produtos em Destaque";
const WHATSAPP_NUMBER = "5521991670127";

// Seletores das visualizações
const welcomeSection = document.querySelector(".app-welcome-section");
const filterSection = document.querySelector(".app-filter-section");
const productsSection = document.querySelector(".app-products-section");
const vipSection = document.querySelector(".app-vip-section");
const detailsView = document.getElementById("app-product-details-view");

const productsGrid = document.getElementById("products-catalog-grid");
const favBadge = document.getElementById("favorites-badge-count");
const mobileMenu = document.getElementById("mobile-menu-panel");

// Estado da página de detalhes ativa
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
        if (vipSection) vipSection.style.display = "block";
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

    // Favorites Trigger
    document.getElementById("btn-favorites-trigger").addEventListener("click", () => {
        window.location.hash = "#favoritos";
    });

    // Foco e teclado ao clicar na lupa
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
    
    // Mostra Vitrine
    welcomeSection.style.display = "block";
    filterSection.style.display = "block";
    productsSection.style.display = "block";
    if (vipSection) vipSection.style.display = "block";
    
    // Sincroniza estado de filtros na UI
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

// 6. RENDERIZAR VITRINE
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
        
        // Evita comportamento nativo de long-press/drag e define clique
        card.addEventListener("click", () => navigateToProduct(product.id));
        card.addEventListener("contextmenu", e => e.preventDefault());
        card.addEventListener("dragstart", e => e.preventDefault());
        
        // Badges
        let badgeHtml = "";
        if (product.isNew) badgeHtml = `<span class="badge-tag tag-new">Novo</span>`;
        else if (product.isHot) badgeHtml = `<span class="badge-tag tag-hot">Mais Vendido</span>`;

        // Tamanhos
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

// Permite buscar digitando
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
            
            // Evita comportamento nativo de long-press/drag e define clique
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

    // Atualiza Estado
    selectedDetailProduct = product;
    selectedDetailSize = product.sizes.length > 0 ? product.sizes[0] : null;
    selectedDetailColor = product.colors.length > 0 ? product.colors[0] : null;
    selectedDetailQty = 1;

    // Oculta Catálogo/Vitrine
    welcomeSection.style.display = "none";
    filterSection.style.display = "none";
    productsSection.style.display = "none";
    if (vipSection) vipSection.style.display = "none";

    // Mostra Detalhes
    detailsView.style.display = "block";
    detailsView.innerHTML = "";

    // Grade de tamanhos HTML
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

    // Grade de cores HTML (Apenas se houver mais de 1 opção)
    let colorSelectorHtml = "";
    if (product.colors && product.colors.length > 1) {
        colorSelectorHtml = `
            <div class="details-option-group">
                <h4 class="details-option-title">Escolha a Cor: <span id="selected-color-name-label" style="color: var(--accent-gold); font-weight: 600; font-size: 0.9rem;">${selectedDetailColor || product.colors[0]}</span></h4>
                <div class="color-options-row">
                    ${product.colors.map((c, idx) => {
                        const classColor = c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        return `
                            <button class="color-swatch-btn ${idx === 0 ? 'active' : ''}" onclick="selectDetailsColor(this, '${c}')" title="${c}" aria-label="${c}">
                                <span class="swatch-circle color-${classColor}"></span>
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

    // Sobe a página ao topo
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
    const buttons = document.querySelectorAll(".color-swatch-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    buttonEl.classList.add("active");
    selectedDetailColor = color;

    const label = document.getElementById("selected-color-name-label");
    if (label) label.textContent = color;

    // Troca dinâmica de imagem por cor selecionada
    if (selectedDetailProduct && selectedDetailProduct.colorImages && selectedDetailProduct.colorImages[color]) {
        const mainImg = document.getElementById("details-main-img");
        if (mainImg) {
            mainImg.src = selectedDetailProduct.colorImages[color];
        }
    }
}

function adjustDetailsQty(delta) {
    selectedDetailQty += delta;
    if (selectedDetailQty < 1) selectedDetailQty = 1;
    document.getElementById("details-qty-value").textContent = selectedDetailQty;
}

// 11. REDIRECIONAR AO WHATSAPP (SELEÇÃO DE VENDEDORAS)
function updateSellerOnlineStatus() {
    const hours = new Date().getHours();
    const isOnline = hours >= 8 && hours < 21; // Online entre 08:00 e 21:00
    
    const mariaStatus = document.getElementById("maria-status-text");
    const fernandaStatus = document.getElementById("fernanda-status-text");
    
    const statusHtml = isOnline 
        ? `<i class="fa-solid fa-circle" style="color: #25D366; font-size: 0.5rem;"></i> Vendedora Online`
        : `<i class="fa-regular fa-clock" style="color: var(--accent-gold); font-size: 0.7rem;"></i> Atendimento via WhatsApp`;

    if (mariaStatus) mariaStatus.innerHTML = statusHtml;
    if (fernandaStatus) fernandaStatus.innerHTML = statusHtml;
}

function openSellerModal(message) {
    const rawMsg = (message === 'general' || !message)
        ? "Olá! Estou navegando no catálogo Tiby.sexy e gostaria de tirar uma dúvida."
        : message;
    
    const encodedText = encodeURIComponent(rawMsg);
    
    const mariaLink = document.getElementById("seller-link-maria");
    const fernandaLink = document.getElementById("seller-link-fernanda");
    
    if (mariaLink) mariaLink.href = `https://api.whatsapp.com/send?phone=5531984818979&text=${encodedText}`;
    if (fernandaLink) fernandaLink.href = `https://api.whatsapp.com/send?phone=5531980207495&text=${encodedText}`;
    
    updateSellerOnlineStatus();

    const modal = document.getElementById("seller-choice-modal");
    if (modal) {
        modal.style.display = "flex";
        modal.classList.add("active");
    }
}

function closeSellerModal() {
    const modal = document.getElementById("seller-choice-modal");
    if (modal) {
        modal.classList.remove("active");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }
}

function buyProductWhatsApp() {
    if (!selectedDetailProduct) return;
    
    let detailsArr = [];
    if (selectedDetailSize) detailsArr.push(`Tamanho: ${selectedDetailSize}`);
    if (selectedDetailColor) detailsArr.push(`Cor: ${selectedDetailColor}`);
    if (selectedDetailQty > 1) detailsArr.push(`Quantidade: ${selectedDetailQty}x`);
    
    let detailsText = detailsArr.length > 0 ? `\n${detailsArr.join('\n')}` : "";
    let message = `Olá! Tenho interesse no ${selectedDetailProduct.name}${detailsText}`;
    
    openSellerModal(message);
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
