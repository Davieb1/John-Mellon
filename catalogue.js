// catalogue.js
// Runs only on catalogue.html. Handles "Add to basket" clicks.

document.addEventListener("DOMContentLoaded", () => {
    // make sure cart API is available
    if (!window.PainterProCart) return;

    // find every product card with .add-to-cart
    const buttons = document.querySelectorAll(".add-to-cart");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            // climb up to the card that holds product data
            const card = btn.closest(".product-card");
            if (!card) return;

            const item = {
                name: card.getAttribute("data-name") || "Paint",
                finish: card.getAttribute("data-finish") || "",
                size: card.getAttribute("data-size") || "",
                price: card.getAttribute("data-price") || "£0.00"
            };

            window.PainterProCart.addItemToCart(item);
        });
    });
});
