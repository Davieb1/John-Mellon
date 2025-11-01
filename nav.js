// nav.js
// mobile menu toggle + basic cart badge placeholder

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("navlinks");
const cartCount = document.getElementById("cartCount");

// Mobile menu open/close
if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
        const expanded = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!expanded));
        navLinks.classList.toggle("open");
    });
}

// Cart count (will update later when we build cart.js)
if (cartCount) {
    // when we wire cart.js, this will read from localStorage
    cartCount.textContent = "0";
}
