const hamburgerBtn = document.querySelector(".hamburger-btn");
const navMenu = document.querySelector("nav ul");
const productGrid = document.querySelector(".product-grid");
const cartCount = document.querySelector(".cart-count");
const qtyDecrease = document.querySelector(".qty-decrease");
const qtyIncrease = document.querySelector(".qty-increase");
const qtyValue = document.querySelector(".qty-value");
const productAddToCart = document.querySelector("#product-add-to-cart");
const cartItemsDiv = document.querySelector(".cart-items");
const emptyMessage = document.querySelector(".empty-cart-message");
const cartSummary = document.querySelector(".cart-summary");
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

function createCartItemRow(item) {
    return `
    <div class="cart-item">
        <img src="${item.image}">
        <div class="cart-item-info">
            <p>${item.title}</p>
            <p>$${item.price}</p>
        </div>
        <div class="quantity-selector">
            <button class="qty-decrease" data-id="${item.id}">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-increase" data-id="${item.id}">+</button>
        </div>
        <p class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</p>
        <button class="remove-item-btn" data-id="${item.id}">Remove</button>
    </div>
    `
}

function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "";
        emptyMessage.style.display = "block";
        cartSummary.style.display = "none";
    } else {
        emptyMessage.style.display = "none";
        cartSummary.style.display = "block";
        cartItemsDiv.innerHTML = cart.map(createCartItemRow).join("");
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        document.querySelector("#cart-subtotal").textContent = "$" + subtotal.toFixed(2);
        document.querySelector("#cart-total").textContent = "$" + subtotal.toFixed(2);
    }
}

if (cartItemsDiv !== null) {
    cartItemsDiv.addEventListener("click", (e) => {
        let idValue = Number(e.target.dataset.id);
        let cart = getCart();
        if(e.target.classList.contains("qty-increase")) {
            let item = cart.find(i => i.id === idValue);
            item.quantity++;
            saveCart(cart);
        }

        if(e.target.classList.contains("qty-decrease")) {
            let item = cart.find(i => i.id === idValue);
            if(item.quantity > 1) {
                item.quantity--;
            }
            saveCart(cart);
        }

        if (e.target.classList.contains("remove-item-btn")) {
            let updatedCart = cart.filter(item => item.id !== idValue);
            saveCart(updatedCart)
        }

        renderCart();
        updateCartCount();
    })

    renderCart();
    updateCartCount();
}

