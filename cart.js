// cart.js
// Global cart state, basket page render, header badge, header preview dropdown

const CART_KEY = "painterpro_cart_v1";

/* ===== Helpers ===== */
function readCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (err) {
        console.error("Cart read error:", err);
        return [];
    }
}

function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartCountBadge(items);
    renderCartPreview(items);
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCountBadge([]);
    renderCartPreview([]);
    renderBasketTable(); // refresh basket table if we're on basket.html
}

function money(n) {
    const num = Number(n || 0);
    return "£" + num.toFixed(2);
}

function makeKey(item) {
    return [
        item.name,
        item.finish,
        item.size,
        item.price
    ].join(" | ");
}

/* ===== Public actions ===== */
function addItemToCart(item) {
    const cart = readCart();
    const key = makeKey(item);

    const existing = cart.find(i => makeKey(i) === key);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            ...item,
            qty: 1,
        });
    }

    writeCart(cart);
    renderBasketTable();
    openCartPreview(); // feedback to user
}

function addItemsToCart(itemsArray) {
    if (!Array.isArray(itemsArray)) return;
    itemsArray.forEach(item => {
        addItemToCart(item);
    });
}

function removeItemFromCart(key) {
    let cart = readCart();
    cart = cart.filter(i => makeKey(i) !== key);
    writeCart(cart);
    renderBasketTable();
}

function updateQtyForItem(key, newQty) {
    const qtyNum = parseInt(newQty, 10);
    if (isNaN(qtyNum) || qtyNum < 1) return;

    const cart = readCart();
    const line = cart.find(i => makeKey(i) === key);
    if (line) {
        line.qty = qtyNum;
        writeCart(cart);
        renderBasketTable();
    }
}

/* ===== Header Badge ===== */
function updateCartCountBadge(itemsParam) {
    const cartCountEl = document.getElementById("cartCount");
    if (!cartCountEl) return;

    const items = itemsParam || readCart();
    const totalQty = items.reduce((acc, item) => acc + item.qty, 0);
    cartCountEl.textContent = String(totalQty);
}

/* ===== Header Preview Dropdown ===== */
function renderCartPreview(itemsParam) {
    const preview = document.getElementById("cartPreview");
    const body = document.getElementById("cartPreviewBody");
    const subtotalEl = document.getElementById("cartPreviewSubtotal");
    if (!preview || !body || !subtotalEl) return;

    const cart = itemsParam || readCart();

    body.innerHTML = "";
    if (cart.length === 0) {
        body.innerHTML = `<div class="cart-preview-empty">Your basket is empty.</div>`;
        subtotalEl.textContent = "£0.00";
        return;
    }

    let subtotal = 0;

    cart.forEach(item => {
        const unitPriceNum = Number(item.price.replace(/[£]/g, "")) || 0;
        const lineTotal = unitPriceNum * item.qty;
        subtotal += lineTotal;

        const line = document.createElement("div");
        line.className = "cart-line";

        line.innerHTML = `
            <div class="cart-line-main">
                <div class="cart-line-name">${item.name}</div>
                <div class="cart-line-meta">
                    ${item.finish} &bull; ${item.size}
                </div>
            </div>
            <div class="cart-line-qtyprice">
                <span>x${item.qty}</span>
                <span>${money(lineTotal)}</span>
            </div>
        `;

        body.appendChild(line);
    });

    subtotalEl.textContent = money(subtotal);
}

function toggleCartPreview(forceOpen) {
    const preview = document.getElementById("cartPreview");
    if (!preview) return;

    const isOpen = preview.classList.contains("open");
    const shouldOpen = forceOpen === true ? true : !isOpen;

    if (shouldOpen) {
        preview.classList.add("open");
    } else {
        preview.classList.remove("open");
    }
}

function openCartPreview() {
    toggleCartPreview(true);
}

/* ===== Basket Page Render ===== */
function renderBasketTable() {
    const tbody = document.getElementById("basketBody");
    const subtotalEl = document.getElementById("basketSubtotal");
    const vatEl = document.getElementById("basketVAT");
    const totalEl = document.getElementById("basketTotal");
    const cartSummaryMount = document.getElementById("cartSummaryMount");

    // If we're not on basket page, still sync badge/preview
    if (!tbody || !subtotalEl || !vatEl || !totalEl) {
        updateCartCountBadge();
        renderCartPreview();
        return;
    }

    const cart = readCart();
    tbody.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {
        const lineKey = makeKey(item);
        const unitPriceNum = Number(item.price.replace(/[£]/g, "")) || 0;
        theLineTotal = unitPriceNum * item.qty;
        const lineTotal = unitPriceNum * item.qty;
        subtotal += lineTotal;

        const tr = document.createElement("tr");
        tr.setAttribute("data-key", lineKey);

        tr.innerHTML = `
            <td style="padding:.5rem .5rem; vertical-align:top;">
                <strong style="color:var(--text-dark); font-weight:600;">${item.name}</strong>
            </td>
            <td style="padding:.5rem .5rem; vertical-align:top; color:var(--text-mid);">
                ${item.finish}
            </td>
            <td style="padding:.5rem .5rem; vertical-align:top; color:var(--text-mid);">
                ${item.size}
            </td>
            <td style="padding:.5rem .5rem; vertical-align:top; color:var(--text-mid);">
                ${item.price}
            </td>
            <td style="padding:.5rem .5rem; vertical-align:top;">
                <input
                  class="qty-input"
                  type="number"
                  min="1"
                  value="${item.qty}"
                  style="width:4rem; font-size:.8rem; padding:.4rem .4rem;
                         border-radius:var(--radius-btn);
                         border:1px solid var(--border-soft);"
                />
            </td>
            <td style="padding:.5rem .5rem; vertical-align:top; text-align:right; color:var(--text-dark); font-weight:600;">
                ${money(lineTotal)}
            </td>
            <td style="padding:.5rem .5rem; vertical-align:top; text-align:right;">
                <button
                  class="remove-item"
                  style="font-size:.7rem; background:#000; color:#fff;
                         border:none; border-radius:var(--radius-btn);
                         padding:.4rem .5rem; cursor:pointer;">
                  Remove
                </button>
            </td>
        `;

        tr.querySelector(".qty-input").addEventListener("change", (e) => {
            updateQtyForItem(lineKey, e.target.value);
        });

        tr.querySelector(".remove-item").addEventListener("click", () => {
            removeItemFromCart(lineKey);
        });

        tbody.appendChild(tr);
    });

    const vat = subtotal * 0.2;
    const total = subtotal + vat;

    subtotalEl.textContent = money(subtotal);
    vatEl.textContent = money(vat);
    totalEl.textContent = money(total);

    // Build hidden inputs for the email
    if (cartSummaryMount) {
        const summaryStr = cart.map(i => {
            return `${i.qty}x ${i.name} ${i.size} @ ${i.price}`;
        }).join("; ");

        cartSummaryMount.innerHTML = `
            <input type="hidden" name="cart_summary" value="${summaryStr}"/>
            <input type="hidden" name="cart_total" value="${total.toFixed(2)}"/>
        `;
    }

    updateCartCountBadge(cart);
    renderCartPreview(cart);
}

/* ===== Expose the cart API EARLY so services.js can use it ===== */
window.PainterProCart = {
    addItemToCart,
    addItemsToCart,
};

/* ===== Boot / Event wiring ===== */
document.addEventListener("DOMContentLoaded", () => {
    // Sync UI on load
    updateCartCountBadge();
    renderCartPreview();
    renderBasketTable();

    // cart preview open/close
    const cartToggleBtn = document.getElementById("cartToggle");
    const cartCloseBtn = document.getElementById("cartCloseBtn");

    if (cartToggleBtn) {
        cartToggleBtn.addEventListener("click", () => {
            toggleCartPreview();
        });
    }

    if (cartCloseBtn) {
        cartCloseBtn.addEventListener("click", () => {
            toggleCartPreview(false);
        });
    }

    // click outside to close preview
    document.addEventListener("click", (e) => {
        const wrapper = document.querySelector(".cart-wrapper");
        const preview = document.getElementById("cartPreview");
        if (!wrapper || !preview) return;

        const clickedInside = wrapper.contains(e.target);
        if (!clickedInside) {
            preview.classList.remove("open");
        }
    });

    // basket form submit -> AFTER email client opens, THEN clear cart + reset
    const basketForm = document.getElementById("basketForm");
    if (basketForm) {
        basketForm.addEventListener("submit", () => {
            // Delay cleanup so the mailto: still sees all filled values
            setTimeout(() => {
                clearCart();

                // blank visible form fields for next order
                [...basketForm.querySelectorAll("input[type=text], input[type=tel], input[type=radio], textarea")].forEach(el => {
                    if (el.type === "radio") {
                        el.checked = false;
                    } else {
                        el.value = "";
                    }
                });
            }, 1000);
        });
    }
});
