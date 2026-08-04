const hamburgerBtn = document.querySelector(".hamburger-btn");
const navMenu = document.querySelector("nav ul");

hamburgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle('nav-open')

})

