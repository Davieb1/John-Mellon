/* ==== Data ==== */
const COLOURS = [
    { name: 'Coastal White', hex: '#F3F6F9' },
    { name: 'Harbour Mist', hex: '#C9D3DD' },
    { name: 'Slate Breaker', hex: '#6B7A8C' },
    { name: 'Deep Atlantic', hex: '#1E2A36' },
    { name: 'Dulwich Cream', hex: '#F2E7D5' },
    { name: 'Honeyed Sand', hex: '#D7C3A5' }
];
const TINS = [
    { size: '10L', litres: 10, price: 99.99 },
    { size: '5L', litres: 5, price: 54.99 },
    { size: '2.5L', litres: 2.5, price: 32.99 },
    { size: '1L', litres: 1, price: 19.99 }
];

/* ==== Utils / State ==== */
const qs = (s, r = document) => r.querySelector(s);
const money = n => `£${Number(n).toFixed(2)}`;
function toast(msg) { const t = qs('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1200); }

const basket = []; // {size, price, colour?}
let currentColour = null;
let lastRecommendation = null;

/* ==== Product price/size ==== */
function updatePrice() {
    const sel = qs('#size');
    const opt = sel.options[sel.selectedIndex];
    qs('#price').textContent = money(opt.dataset.price);
    qs('#selectedSizeLabel').textContent = `Selected: ${opt.value}`;
}

function addToBasket(item) {
    if (!item) {
        const sel = qs('#size');
        const opt = sel.options[sel.selectedIndex];
        item = { size: opt.value, price: Number(opt.dataset.price) };
        if (currentColour) item.colour = currentColour;
    }
    basket.push(item);
    localStorage.setItem('demo:basket', JSON.stringify(basket));
    qs('#basket').classList.remove('hidden');
    renderBasket();
    toast('Added to basket');
}

function removeItem(idx) {
    basket.splice(idx, 1);
    localStorage.setItem('demo:basket', JSON.stringify(basket));
    renderBasket();
    if (!basket.length) collapseBasket();
}

function clearBasket() {
    basket.length = 0;
    localStorage.removeItem('demo:basket');
    renderBasket();
}

function collapseBasket() {
    qs('#basket').classList.add('hidden');
    qs('#customerForm').classList.add('hidden');
    qs('#placeOrder').textContent = 'Place order';
}

function renderBasket() {
    const box = qs('#basketItems');
    const countEl = qs('#basketCount');
    countEl.textContent = basket.length;
    if (!basket.length) {
        box.textContent = 'No items yet';
        qs('#basketTotal').textContent = money(0);
        return;
    }
    box.innerHTML = basket.map((it, i) => {
        const colourLine = it.colour ? `<div class="tag">Colour: ${it.colour.name} (${it.colour.hex})</div>` : '';
        return `<div class="item">
                  <div class="item-head">
                    <div><strong>${it.size}</strong> — ${money(it.price)}</div>
                    <button class="remove" data-rm="${i}">Remove</button>
                  </div>
                  ${colourLine}
                </div>`;
    }).join('');
    const total = basket.reduce((s, it) => s + it.price, 0);
    qs('#basketTotal').textContent = money(total);
}

/* ==== Colour helpers ==== */
function hexToHsl(hex) {
    let r = 0, g = 0, b = 0; const v = hex.replace('#', '');
    if (v.length === 6) { r = parseInt(v.slice(0, 2), 16); g = parseInt(v.slice(2, 4), 16); b = parseInt(v.slice(4, 6), 16); }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min; s = l > .5 ? d / (2 - max - min) : d / (max + min);
        switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break }
        h /= 6;
    }
    return { h, s, l };
}
function hslToHex(h, s, l) {
    function hue2rgb(p, q, t) { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; }
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else { const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3); }
    const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function generateShades(hex) {
    const { h, s, l } = hexToHsl(hex);
    return [
        { label: 'Base', hex },
        { label: 'Shade 1', hex: hslToHex(h, s, Math.min(1, l * 0.86 + 0.07)) },
        { label: 'Shade 2', hex: hslToHex(h, s, Math.max(0, l * 0.74)) },
        { label: 'Shade 3', hex: hslToHex(h, s, Math.max(0, l * 0.58)) }
    ];
}

function renderPalette() {
    const grid = qs('#paletteGrid');
    const term = (qs('#search').value || '').toLowerCase();
    grid.innerHTML = '';
    COLOURS.filter(c => c.name.toLowerCase().includes(term)).forEach(base => {
        generateShades(base.hex).forEach(sh => {
            const card = document.createElement('article'); card.className = 'swatch-card';
            const sw = document.createElement('div'); sw.className = 'swatch'; sw.style.background = sh.hex;
            const body = document.createElement('div'); body.className = 'swatch-body';
            const title = document.createElement('div'); title.className = 'swatch-title'; title.textContent = `${base.name} — ${sh.label}`;

            const hexRow = document.createElement('div'); hexRow.className = 'hex-row';
            const code = document.createElement('span'); code.className = 'code'; code.textContent = sh.hex;
            const btnCopy = document.createElement('button'); btnCopy.className = 'copy-btn'; btnCopy.textContent = 'Copy';
            btnCopy.addEventListener('click', async () => {
                try { await navigator.clipboard.writeText(sh.hex); } catch (_) {
                    const ta = document.createElement('textarea'); ta.value = sh.hex; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
                }
                currentColour = { name: `${base.name} — ${sh.label}`, hex: sh.hex };
                toast(`${sh.hex} copied`);
            });
            hexRow.append(code, btnCopy);

            // Add multiple colours with user-selected tin size
            const controls = document.createElement('div'); controls.className = 'hex-row';
            const sizeSel = document.createElement('select'); sizeSel.className = 'select';
            sizeSel.innerHTML = [...TINS].reverse().map(t => `<option value="${t.size}" data-price="${t.price}">${t.size}</option>`).join('');
            const addBtn = document.createElement('button'); addBtn.className = 'copy-btn'; addBtn.textContent = 'Add colour';
            addBtn.addEventListener('click', () => {
                const opt = sizeSel.options[sizeSel.selectedIndex];
                addToBasket({ size: opt.value, price: Number(opt.dataset.price), colour: { name: `${base.name} — ${sh.label}`, hex: sh.hex } });
            });
            controls.append(sizeSel, addBtn);

            body.append(title, hexRow, controls);
            card.append(sw, body);
            grid.append(card);
        });
    });
}

/* ==== Calculator (cheapest tin combo) ==== */
function calculateMinCost(litresNeeded) {
    let best = null;
    const max10 = Math.ceil(litresNeeded / 10) + 2;
    for (let a = 0; a <= max10; a++) {
        const remA = litresNeeded - a * 10;
        const max5 = Math.ceil(Math.max(0, remA) / 5) + 2;
        for (let b = 0; b <= max5; b++) {
            const remB = litresNeeded - a * 10 - b * 5;
            const max25 = Math.ceil(Math.max(0, remB) / 2.5) + 2;
            for (let c = 0; c <= max25; c++) {
                const remC = litresNeeded - a * 10 - b * 5 - c * 2.5;
                const d = Math.max(0, Math.ceil(remC / 1));
                const total = a * 10 + b * 5 + c * 2.5 + d;
                if (total < litresNeeded) continue;
                const cost = a * 99.99 + b * 54.99 + c * 32.99 + d * 19.99;
                const combo = { '10L': a, '5L': b, '2.5L': c, '1L': d, totalLitres: total, cost };
                if (!best || cost < best.cost || (cost === best.cost && total < best.totalLitres)) best = combo;
            }
        }
    }
    return best;
}

function calculatePaint() {
    const l = +qs('#length').value || 0, w = +qs('#width').value || 0, cov = +qs('#coverage').value || 12;
    if (l > 0 && w > 0 && cov > 0) {
        const litres = (l * w * 2) / cov; // two coats
        const best = calculateMinCost(litres);
        lastRecommendation = best;
        const lines = [];['10L', '5L', '2.5L', '1L'].forEach(sz => { if (best[sz]) lines.push(`${best[sz]} × ${sz}`); });
        qs('#calcResult').textContent = `Approx. ${litres.toFixed(1)}L needed → ${lines.join(', ')} (Total ${money(best.cost)})`;
        qs('#addRecommended').disabled = false;
    } else {
        lastRecommendation = null;
        qs('#calcResult').textContent = 'Enter length, width and coverage';
        qs('#addRecommended').disabled = true;
    }
}

function addRecommended() {
    if (!lastRecommendation) return;
    ['10L', '5L', '2.5L', '1L'].forEach(sz => {
        const qty = lastRecommendation[sz] || 0; if (!qty) return;
        const tin = TINS.find(t => t.size === sz);
        for (let i = 0; i < qty; i++) addToBasket({ size: tin.size, price: tin.price, colour: currentColour || null });
    });
}

/* ==== Email order ==== */
function buildOrderEmail() {
    const name = (qs('#custName').value || '').trim();
    const phone = (qs('#custPhone').value || '').trim();
    const email = (qs('#custEmail').value || '').trim();
    const type = qs('#deliveryType').value;
    const date = qs('#prefDate').value;
    const time = qs('#prefTime').value;
    if (!name || !phone || !email) throw new Error('Please enter name, phone and email');

    const itemsText = basket.map(it => {
        const colour = it.colour ? ` | Colour: ${it.colour.name} (${it.colour.hex})` : '';
        return `- ${it.size} — ${money(it.price)}${colour}`;
    }).join('%0D%0A');
    const total = basket.reduce((s, it) => s + it.price, 0);

    const subject = encodeURIComponent('Website Order');
    const typeLabel = (type === 'Click & Collect') ? 'collection' : 'delivery';
    const body = `Customer: ${name}%0D%0APhone: ${phone}%0D%0AEmail: ${email}%0D%0AOrder type: ${type}%0D%0APreferred ${typeLabel} date/time: ${date || 'n/a'} ${time || ''}%0D%0A%0D%0AItems:%0D%0A${itemsText}%0D%0A%0D%0ATotal: ${money(total)}%0D%0A`;
    const businessEmail = 'orders@example.com';
    return { href: `mailto:${businessEmail}?subject=${subject}&body=${body}&cc=${encodeURIComponent(email)}` };
}

function placeOrder() {
    if (!basket.length) { toast('Basket is empty'); return; }
    const form = qs('#customerForm');
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        qs('#placeOrder').textContent = 'Send order email';
        return;
    }
    try {
        const { href } = buildOrderEmail();
        window.location.href = href;
        setTimeout(() => { clearBasket(); collapseBasket(); }, 300);
    } catch (e) { toast(e.message); }
}

/* ==== Init & Events ==== */
document.addEventListener('DOMContentLoaded', () => {
    // Restore basket
    try {
        const saved = JSON.parse(localStorage.getItem('demo:basket') || '[]');
        if (Array.isArray(saved) && saved.length) {
            saved.forEach(x => basket.push(x));
            qs('#basket').classList.remove('hidden');
        }
    } catch (_) {/* ignore */ }
    renderBasket();

    updatePrice();
    qs('#size').addEventListener('change', updatePrice);
    qs('#addToBasket').addEventListener('click', () => addToBasket());

    renderPalette();
    qs('#search').addEventListener('input', renderPalette);

    qs('#calcBtn').addEventListener('click', calculatePaint);
    qs('#addRecommended').addEventListener('click', addRecommended);

    qs('#placeOrder').addEventListener('click', placeOrder);
    qs('#clearBasket').addEventListener('click', () => { clearBasket(); collapseBasket(); toast('Basket cleared'); });

    // Remove buttons (event delegation)
    qs('#basketItems').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-rm]');
        if (btn) removeItem(Number(btn.getAttribute('data-rm')));
    });

    // Start collapsed
    collapseBasket();
});