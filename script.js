const hamburgerBtn = document.querySelector(".hamburger-btn");
const navMenu = document.querySelector("nav ul");
const productGrid = document.querySelector(".product-grid");
const cartCount = document.querySelector(".cart-count");
const qtyDecrease = document.querySelector(".qty-decrease");
const qtyIncrease = document.querySelector(".qty-increase");
const qtyValue = document.querySelector(".qty-value");
const productAddToCart = document.querySelector("#product-add-to-cart");
let allProducts = [];
let currentProduct = null;
let currentQty = 1;

hamburgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle('nav-open')

})

if (productGrid !== null) {
    productGrid.addEventListener("click", (e) => {
        if(e.target.classList.contains("add-to-cart-btn")) {
            let idValue = Number(e.target.dataset.id);

            let product = allProducts.find(item => item.id === idValue);

            addToCart(product, 1);
        }
    })

    fetch("https://fakestoreapi.com/products").then(response => response.json()).then(data => renderProducts(data));
}

function createProductCard(product) {
    return `
    <div class="product-card">
    <a href ="product.html?id=${product.id}">
        <img src="${product.image}">
        <h3>${product.title}</h3>
    </a>
    <p>$${product.price}</p>
    <button data-id="${product.id}" class="add-to-cart-btn">Add to Cart</button>
    </div>
    `;
}

function renderProducts(data) {
    allProducts = data;
    const cardsHTML = data.slice(0, 8).map(createProductCard).join("");
    productGrid.innerHTML = cardsHTML;
}

function getCart() {
    let cartData = localStorage.getItem("cart");
    if (cartData !== null) {
        return JSON.parse(cartData);
    } else {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart))
}

function addToCart(product, qty) {
    let cart = getCart();
    let existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        cart.push(
            {id: product.id, title: product.title, price: product.price, image: product.image, quantity: qty}
        );
    }

    saveCart(cart);
    updateCartCount();
}

function updateCartCount() {
    let cart = getCart();
    let total = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = total;
}

updateCartCount();


const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if(productId) {
    fetch(`https://fakestoreapi.com/products/${productId}`).then(response => response.json()).then(product => renderProductDetail(product));
}

function renderProductDetail(product) {
    const productTitle = document.querySelector(".product-title");
    const productCategory = document.querySelector(".product-category");
    const productPrice = document.querySelector(".product-price");
    const productDescription = document.querySelector(".product-description");
    const productDetailImage = document.querySelector(".product-detail-image img");

    currentProduct = product;
    productTitle.textContent = product.title;
    productCategory.textContent = product.category;
    productPrice.textContent = `$${product.price}`;
    productDescription.textContent = product.description;
    productDetailImage.src = product.image;
    productDetailImage.alt = product.title;
}

if(qtyIncrease) {
    qtyIncrease.addEventListener("click", () => {
        currentQty++;
        qtyValue.textContent = currentQty;
    })

    qtyDecrease.addEventListener("click", () => {
        if (currentQty > 1) {
            currentQty--;
            qtyValue.textContent = currentQty; 
        }
    })

    productAddToCart.addEventListener("click", () => {
        addToCart(currentProduct, currentQty);

        const confirmMsg = document.querySelector(".product-detail-info p:last-child");
        confirmMsg.classList.remove("hidden");
        setTimeout(() => {
            confirmMsg.classList.add("hidden");
        }, 2000);

        currentQty = 1;
        qtyValue.textContent = currentQty
    })
}

