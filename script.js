const hamburgerBtn = document.querySelector(".hamburger-btn");
const navMenu = document.querySelector("nav ul");
const productGrid = document.querySelector(".product-grid");

hamburgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle('nav-open')

})

fetch("https://fakestoreapi.com/products").then(response => response.json()).then(data => renderProducts(data));

function createProductCard(product) {
    return `
    <div class="product-card">
    <img src="${product.image}">
    <h3>${product.title}</h3>
    <p>$${product.price}</p>
    <button data-id="${product.id}" class="add-to-cart-btn">Add to Cart</button>
    </div>
    `;
}

function renderProducts(data) {
    const cardsHTML = data.slice(0, 8).map(createProductCard).join("");
    productGrid.innerHTML = cardsHTML;
}



