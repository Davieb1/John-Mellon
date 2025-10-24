/* ===== helpers ===== */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const tc = s => (s || '').replace(/\b\w/g, m => m.toUpperCase());
const money = n => '£' + (n || 0).toFixed(2);
const parseGBP = s => +String(s).replace(/[£,]/g, '') || 0;
const j = o => JSON.stringify(o).replace(/"/g, '&quot;');
const rid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/* === NEW: tin pick + hex lookup helpers === */
// choose a single tin size that best covers 'litres' (min overage)
function pickSingleTin(litres, sizes = DATA.tinSizes) {
    const need = Math.max(0, litres);
    const ascending = [...sizes].sort((a, b) => a - b);
    const fit = ascending.find(s => s >= need);
    return fit || ascending[ascending.length - 1];
}
// find hex for a given heritage colour name
function getHeritageHex(name) {
    for (const tone in DATA.heritage) {
        const list = DATA.heritage[tone].colours || [];
        const hit = list.find(c => typeof c === "object" && c.name === name);
        if (hit) return hit.hex;
    }
    return "#666";
}

/* ===== data (expanded & with finishes lists) ===== */
const DATA = {
    pricePerLitre: {
        default: 12,
        "Dulux Heritage Velvet Matt": 18, "Dulux Diamond Matt": 16, "Crown Scrubbable Matt": 14,
        "Tikkurila Anti-Reflex White": 15, "Johnstone’s Ultra-Flat Matt": 13, "Dulux Ultra Matt": 15,
        "Dulux Supermatt": 11.5, "Dulux Vinyl Matt": 12.5, "Dulux Satinwood": 17, "Dulux Gloss": 17.5, "Dulux Eggshell (Trade)": 16.5
    },
    tinSizes: [10, 5, 2.5, 1],
    heritage: {
        "Pale Tones": {
            desc: "Our pale tones give a hint of colour and can gently lift ceilings and woodwork.",
            colours: [
                { name: "Indian White", hex: "#FFEDD9" },
                { name: "Panel White", hex: "#F4EAD2" },
                { name: "Flax Seed", hex: "#E9D2A6" },
                { name: "Green Clay", hex: "#ACA07D" },
                { name: "Fresh Flour", hex: "#F2E9D5" },
                { name: "Candle Cream", hex: "#EFE3C2" },
                { name: "Chiltern White", hex: "#E8E1D2" },
                { name: "Linen White", hex: "#F2ECDA" },
                { name: "Powder Colour", hex: "#E4D6C3" },
                { name: "DH Linen Colour", hex: "#D6C6AD" },
                { name: "TurtleDove Grey", hex: "#C9C3B7" },
                { name: "Green Earth", hex: "#AFA67E" },
                { name: "Cornish Clay", hex: "#B6A68E" },
                { name: "Green Marl", hex: "#9C9678" },
                { name: "Ochre White", hex: "#E9D8AF" },
                { name: "York White", hex: "#EDE3C5" },
                { name: "Romney Wool", hex: "#D9C9B1" },
                { name: "Pale Nutmeg", hex: "#E4C9A6" },
                { name: "Potters Pink", hex: "#C9A39D" },
                { name: "DH Stone", hex: "#B9A792" }
            ]
        },

        "Mid Tones": {
            desc: "Balanced hues for relaxed living spaces. Great for walls with soft white woodwork.",
            colours: [
                { name: "Beachcomb Grey", hex: "#B7BBB6" },
                { name: "Green Slate", hex: "#6B7D70" },
                { name: "Raw Cashmere", hex: "#C9BBAA" },
                { name: "Ancient Sandstone", hex: "#C6B59A" },
                { name: "Bathstone Beige", hex: "#D1C0A3" },
                { name: "Pale Walnut", hex: "#B99E7E" },
                { name: "Quartz Grey", hex: "#8C8F92" },
                { name: "Pumice Brown", hex: "#8A7464" },
                { name: "DH Blossom", hex: "#D9A8A8" },
                { name: "Golden Ivory", hex: "#E8D6A7" },
                { name: "Pewter Plate", hex: "#7A7E82" },
                { name: "Stone Green", hex: "#7C8C7E" },
                { name: "Rope Ladder", hex: "#9D8667" },
                { name: "Setting Stone", hex: "#B9AA97" },
                { name: "Pearl Barley", hex: "#D9C9A7" },
                { name: "Biscuit Beige", hex: "#CFB89B" },
                { name: "Pebble Grey", hex: "#B6B7B0" },
                { name: "Dusted Heather", hex: "#B7A0AF" },
                { name: "Coral Pink", hex: "#E59A86" },
                { name: "Buff", hex: "#E2C79A" }
            ]
        },

        "Deep Tones": {
            desc: "Dramatic and cocooning shades for feature walls and statement rooms.",
            colours: [
                { name: "Lead Grey", hex: "#595B5C" },
                { name: "Waxed Khaki", hex: "#5F5A45" },
                { name: "Olive Tree", hex: "#5B5E3D" },
                { name: "Mud Lark", hex: "#6A5B4E" },
                { name: "Dark Stone", hex: "#6B5C4C" },
                { name: "Mid Umber", hex: "#7B604A" },
                { name: "Terra Ombra", hex: "#8A5A43" },
                { name: "Fitzrovia Red", hex: "#873633" },
                { name: "Red Ochre", hex: "#8C3E30" },
                { name: "Inca Orange", hex: "#B0552D" },
                { name: "Ravens Flight", hex: "#2E2F33" },
                { name: "Forest Grey", hex: "#4B554A" },
                { name: "Tudor Brown", hex: "#4B3A2B" },
                { name: "Wooded Walk", hex: "#4D4337" },
                { name: "Jenny Wren", hex: "#5C5247" },
                { name: "Cherry Truffle", hex: "#6E2E2B" },
                { name: "Mauve Mist", hex: "#7C6A76" },
                { name: "Florentine Red", hex: "#8E3E3B" },
                { name: "Pugin Red", hex: "#702E27" },
                { name: "Red Sand", hex: "#A0523A" }
            ]
        },

        "Whites": {
            desc: "Crisp and clean whites from warm to cool for trim, ceilings and minimalist spaces.",
            colours: [
                { name: "Chalk White", hex: "#F4F3EC" },
                { name: "China White", hex: "#E8E5DA" },
                { name: "Linnet White", hex: "#EFEBDC" },
                { name: "Grecian White", hex: "#EEEBDD" },
                { name: "Piano White", hex: "#F3F0E7" },
                { name: "Roman White", hex: "#EDE8D9" },
                { name: "Mallow White", hex: "#F5F1E4" },
                { name: "Wiltshire White", hex: "#EDE8D8" },
                { name: "Marble White", hex: "#F2EFE3" },
                { name: "Voile White", hex: "#F7F5ED" }
            ]
        }
    },
    tabs: {
        ceiling: [
            { id: 'tik-ar2', brand: "Tikkurila", name: "Anti-Reflex White", finishes: ["Matt"], use: "interior" },
            { id: 'dx-ultra', brand: "Dulux", name: "Ultra Matt", finishes: ["Matt"], use: "interior" },
            { id: 'js-ultraflat', brand: "Johnstone’s", name: "Ultra-Flat", finishes: ["Matt"], use: "interior" },
            { id: 'dx-supermatt', brand: "Dulux", name: "Supermatt", finishes: ["Matt"], use: "interior" },
            { id: 'dx-vinylmatt', brand: "Dulux", name: "Vinyl Matt", finishes: ["Matt"], use: "interior" }
        ],
        walls: [
            { systemId: "new-plaster", brand: "New Plaster" },
            { systemId: "metal", brand: "Interior Metal" },
            { systemId: "lining", brand: "Lining Paper" },
            { id: 'dx-herit-velvet', brand: "Dulux Heritage", name: "Velvet", finishes: ["Velvet Matt", "Eggshell"], use: "interior", colours: ["China Clay", "Pebble Grey", "Oxford Blue", "Roman Plaster"] },
            { id: 'crown-scrub', brand: "Crown", name: "Scrubbable", finishes: ["Matt"], use: "interior" },
            { id: 'dx-diamond', brand: "Dulux Diamond", name: "Diamond", finishes: ["Matt", "Eggshell"], use: "interior" },
            { id: 'js-acrylic-durable', brand: "Johnstone’s", name: "Acrylic Durable", finishes: ["Matt", "Silk"], use: "interior" },
            { id: 'tik-joker', brand: "Tikkurila", name: "Joker", finishes: ["Matt"], use: "interior" }
        ],
        woodwork: [
            { id: 'dx-satinwood', brand: "Dulux", name: "Satinwood", finishes: ["Satin", "Gloss", "Eggshell"], use: "interior" },
            { id: 'dx-eggshell', brand: "Dulux", name: "Eggshell (Trade)", finishes: ["Eggshell"], use: "interior" },
            { id: 'dx-undercoat', brand: "Dulux", name: "Undercoat (Trade)", finishes: ["Undercoat"], use: "interior" },
            { id: 'dx-gloss', brand: "Dulux", name: "Gloss", finishes: ["Gloss"], use: "interior" },
            { id: 'js-aqua', brand: "Johnstone’s", name: "Aqua Guard", finishes: ["Satin", "Gloss"], use: "interior" }
        ],
        interior: [
            { systemId: "interior-general", brand: "Interior – General System" },
            { systemId: "walls", brand: "Walls" },
            { systemId: "ceiling", brand: "Ceilings" },
            { systemId: "skirtings", brand: "Skirtings / Trim" }
        ],
        exterior: [
            { systemId: "exterior-general", brand: "Exterior Joinery" },
            { systemId: "gutters", brand: "Gutters / Downpipes" },
            { systemId: "soffits", brand: "Soffits / Fascia Boards" },
            { systemId: "windows", brand: "Windows" },
            { systemId: "doors", brand: "Doors" }
        ],
        taping: [
            { id: 'tp-jf', brand: "Toupret", name: "Joint Filler", group: "Joint Fillers", use: "interior", finishes: ["Powder"] },
            { id: 'tp-ex', brand: "Toupret", name: "Exterior Filler", group: "Fillers", use: "exterior", finishes: ["Powder"] },
            { id: 'tp-jc', brand: "Toupret", name: "Joint Cement", group: "Joint Cements", use: "interior", finishes: ["Ready-mix"] },
            { id: 'gy-jc', brand: "Gyproc", name: "Joint Cement", group: "Joint Cements", use: "interior", finishes: ["Ready-mix"] },
            { id: 'ft-mesh', brand: "FibaTape", name: "Mesh Tape", group: "Tapes", use: "both", finishes: ["Mesh"] },
            { id: 'gen-paper', brand: "Generic", name: "Paper Tape", group: "Tapes", use: "interior", finishes: ["Paper"] },
            { id: 'lvl-corner', brand: "Levelline", name: "Corner Tape", group: "Tapes", use: "interior", finishes: ["Composite"] },
            { id: 'gen-metal', brand: "Generic", name: "Metal Tape", group: "Tapes", use: "both", finishes: ["Paper-metal"] },
            { id: 'gen-bead', brand: "Generic", name: "Metal Bead", group: "Beads", use: "both", finishes: ["Bead"] }
        ],
        heritage: [{ brand: "Dulux Heritage", name: "Tone Library", tone: true }]
    }
};

/* ===== state ===== */
let activeTab = 'ceiling';
let lastCalc = { litres: 0, coverage: 12, coats: 2, context: 'walls' };
let CART = [];

/* ===== routing/init ===== */
function init() {
    // Ensure we always start with a hash
    if (!location.hash) location.hash = '#home';

    // Initial route render
    const route = (location.hash || '#home').replace('#', '');
    showRoute(route);

    // React to URL hash changes
    window.addEventListener('hashchange', () => showRoute((location.hash || '#home').replace('#', '')));

    // Mobile nav
    $('.nav-toggle')?.addEventListener('click', () => {
        const l = $('#navlinks'); const open = l.classList.toggle('open');
        $('.nav-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // “Jump to Heritage” buttons on Home
    $$('[data-go-tab]').forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault();
            location.hash = '#catalogue';
            setTimeout(() => activateTab('heritage'), 0);
        });
    });

    // Tab buttons in Catalogue
    $$('.tab').forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));

    // Search & filters
    [$('#searchInput'), $('#searchAll'), $('#filterBrand'), $('#filterFinish'), $('#filterUse')]
        .forEach(el => el.addEventListener('input', () => renderTab(activeTab)));

    // Calculator
    $('#calcBtn').addEventListener('click', runCalc);
    $('#calcAddTins').addEventListener('click', addRecommendedTins);

    // Basket
    $('#openCart').addEventListener('click', openCart);
    buildSlots();

    // First render of catalogue UI (defaults to Ceiling)
    populateFilters();
    activateTab('ceiling');
}
document.addEventListener('DOMContentLoaded', init);

/* Robust route renderer */
function showRoute(r) {
    const route = (r || 'home');
    document.querySelectorAll('.route')
        .forEach(x => x.classList.toggle('route-active', x.id === route));

    if (route === 'catalogue') {
        renderTab(activeTab);
        populateFilters();
        adjustCalcForTab();
    }
}

/* Force SPA navigation on in-page links (so Home links always work) */
document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href') || '#home';
    const route = href.slice(1) || 'home';
    e.preventDefault();
    if (location.hash !== href) location.hash = href;
    showRoute(route);
});

/* ===== filtering ===== */
function populateFilters() {
    const pool = $('#searchAll').checked ? Object.values(DATA.tabs).flat() : DATA.tabs[activeTab];
    const brands = [...new Set(pool.map(p => p.brand).filter(Boolean))].sort();
    const finishes = [...new Set(Object.values(DATA.tabs).flat().map(p => p.finishes).flat().filter(Boolean))].sort();

    $('#filterBrand').innerHTML = `<option value="">All brands</option>` + brands.map(b => `<option>${b}</option>`).join('');
    $('#filterFinish').innerHTML = `<option value="">All finishes</option>` + finishes.map(f => `<option>${f}</option>`).join('');
}

/* ===== render tab ===== */
function activateTab(id) {
    activeTab = id;
    $$('.tab').forEach(b => b.classList.toggle('is-active', b.dataset.tab === id));
    adjustCalcForTab();
    renderTab(id);
    populateFilters();
}

const resultsEl = $('#results');

function renderTab(id) {
    const query = $('#searchInput').value.trim().toLowerCase();
    const scope = $('#searchAll').checked
        ? Object.entries(DATA.tabs).flatMap(([k, v]) => v.map(p => ({ ...p, _scope: k })))
        : DATA.tabs[id].map(p => ({ ...p, _scope: id }));

    let items = scope;

    // Heritage has its own rendering unless "Search all tabs" is on
    if (id === 'heritage' && !$('#searchAll').checked) {
        resultsEl.innerHTML = renderHeritage();
        return;
    }

    if (query) items = items.filter(p => [p.brand, p.name, p.group, p.finishes?.join(' '), p._scope].filter(Boolean).join(' ').toLowerCase().includes(query));
    if ($('#filterBrand').value) items = items.filter(p => p.brand === $('#filterBrand').value);
    if ($('#filterFinish').value) items = items.filter(p => (p.finishes || []).includes($('#filterFinish').value));
    if ($('#filterUse').value) {
        const want = $('#filterUse').value;
        items = items.filter(p => (p.use || '').toLowerCase() === want || (p.use || '').toLowerCase() === 'both' || p.systemId);
    }

    resultsEl.innerHTML = items.map(cardHTML).join('') || `<div class="card">No matches found.</div>`;
}

function cardHTML(p) {
    // System entry card
    if (p.systemId) {
        return `
      <article class="product">
        <h4>${p.brand}</h4>
        <p class="spec">Recommended system for <strong>${p.brand}</strong>.</p>
        <div class="card-actions">
          <button class="btn" data-open-system="${p.systemId}">Open System Sheet</button>
        </div>
      </article>`;
    }

    // Product entry card
    const litres = Math.max(0, +lastCalc.litres || 0);
    const ppl = DATA.pricePerLitre[`${p.brand} ${p.name}`] ?? DATA.pricePerLitre.default;
    const priceInc = (litres * ppl * 1.2);
    const colours = (p.colours || []).slice(0, 2);
    const finishSelect = p.finishes?.length ? `
    <label>Finish
      <select data-finish-for="${p.id}">
        ${p.finishes.map(f => `<option>${f}</option>`).join('')}
      </select>
    </label>` : '';

    return `
    <article class="product">
      <h4>${p.brand} — ${p.name}</h4>
      <p class="spec">Use: ${tc(p.use || '—')}</p>
      ${colours.length ? `<p class="spec">Recommended colours: <strong>${colours.join(', ')}</strong></p>` : ''}
      <p class="spec">${litres ? `Recommended litres: <strong>${litres.toFixed(2)} L</strong> • Est. ${money(priceInc)} inc VAT` : 'Run the calculator to estimate litres & price.'}</p>
      <div class="card-actions">
        ${finishSelect}
        <button class="linklike" data-open-system="${inferSystemFromTab(p._scope)}">System Sheet</button>
        <button class="linklike" data-add-to-calculator='${j({ brand: p.brand, name: p.name })}'>Add to Calculator</button>
        <button class="btn" data-add-to-basket='${j({ id: p.id, brand: p.brand, name: p.name, finishSel: p.id, litres: litres || 2.5 })}'>Add to Basket</button>
      </div>
    </article>`;
}

/* ===== Heritage ===== */
function renderHeritage() {
    const toneNames = Object.keys(DATA.heritage);
    const current = toneNames[0];

    const toolbar = `
    <div class="tone-toolbar">
      <label> Tone group
        <select id="toneSelect">${toneNames.map(t => `<option>${t}</option>`).join('')}</select>
      </label>
      <span id="toneDesc" class="spec">${DATA.heritage[current].desc}</span>
    </div>`;

    const grid = `
    <div id="toneGrid" class="tone-grid">
      ${DATA.heritage[current].colours.map(c => swatchHTML(c)).join('')}
    </div>`;

    return `<article class="product full-bleed"><h3>Dulux Heritage — Tone Library</h3>${toolbar}${grid}</article>`;
}

function swatchHTML(c) {
    const name = (typeof c === 'string') ? c : c?.name || 'Unknown';
    const colour = (typeof c === 'string') ? '#666' : (c?.hex || '#666');
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return `
    <div class="swatch" title="${name}">
      <div class="swatch-chip" style="background:${colour}; border:1px solid #1e2230"></div>
      <div class="swatch-name">${name}</div>
      <div class="spec">Goes well with: walls • indoor • woodwork</div>
      <button class="btn" data-open-colour='${j({ name, finishes: ["Velvet Matt", "Eggshell"] })}'>View colour</button>
    </div>`;
}

/* Tone dropdown interactions */
document.addEventListener('change', e => {
    if (e.target.id === 'toneSelect') {
        const tone = e.target.value;
        $('#toneDesc').textContent = DATA.heritage[tone].desc;
        $('#toneGrid').innerHTML = DATA.heritage[tone].colours.map(c => swatchHTML(c)).join('');
    }
});

/* Colour modal */
const systemModal = $('#systemModal');
const systemContent = $('#systemContent');

document.addEventListener('click', e => {
    const cBtn = e.target.closest('[data-open-colour]');
    if (cBtn) {
        const { name, finishes } = JSON.parse(cBtn.dataset.openColour);
        openColourSheet(name, finishes);
    }
});

/* === UPDATED: smarter colour modal with usage presets & suggested tin === */
function openColourSheet(name, finishes) {
    // base litres from calculator (0 if not run yet)
    const baseL = +lastCalc.litres || 0;

    // usage presets
    const PRESETS = [
        { id: "main", label: "Main colour (100%)", ratio: 1.0 },
        { id: "accent", label: "Accent/feature (25%)", ratio: 0.25 },
        { id: "trim", label: "Trim/woodwork (10%)", ratio: 0.10 },
    ];

    // default preset: Accent if we have a calc value (likely a second colour), else Main
    const defaultPreset = baseL ? "accent" : "main";
    const ratio = PRESETS.find(p => p.id === defaultPreset).ratio;

    const needL = baseL * ratio || 2.5; // sensible default if no calc yet
    const suggestedSize = pickSingleTin(needL);
    const hex = getHeritageHex(name);

    const toolbar = `
    <fieldset id="usageGroup" class="usage" style="display:flex;gap:8px;flex-wrap:wrap;margin:0 0 8px">
      ${PRESETS.map(p => `
        <label class="chip">
          <input type="radio" name="usage" value="${p.id}" ${p.id === defaultPreset ? 'checked' : ''} data-ratio="${p.ratio}">
          ${p.label}
        </label>`).join('')}
    </fieldset>`;

    const html = `
    <div class="system">
      <h3>${name}</h3>
      <div class="swatch-chip" style="background:${hex}; height:200px; border-radius:16px; margin:12px 0 16px;"></div>
      ${toolbar}
      <div class="card-actions" style="gap:12px;flex-wrap:wrap;align-items:center">
        <label>Tin size
          <select id="colourTin">
            ${DATA.tinSizes.map(s => `<option value="${s}" ${s === suggestedSize ? 'selected' : ''}>${s} L</option>`).join('')}
          </select>
        </label>
        <label>Qty <input id="colourQty" type="number" min="1" value="1" style="width:90px"></label>
        <span id="sizeHint" class="spec">Suggested: ${suggestedSize} L for ~${Math.max(0, needL).toFixed(1)} L need</span>
        <button class="btn" id="colourAdd" data-colour='${j({ name, finish: finishes[0] })}'>Add to basket</button>
        <button class="linklike" id="colourUseCalc" data-colour='${j({ name, finish: finishes[0] })}'>Use calculator litres</button>
        <button class="linklike" data-open-system="walls">System Sheet</button>
      </div>
      <p class="spec">Available finishes: ${finishes.join(', ')}</p>
    </div>`;
    systemContent.innerHTML = html;
    systemModal.showModal();
}

/* Close any modal with the × button */
document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-close')) e.target.closest('dialog')?.close();
});

/* === NEW: Update suggestion when usage preset changes === */
document.addEventListener('change', (e) => {
    if (e.target.closest && e.target.closest('#usageGroup')) {
        const r = +e.target.dataset.ratio || 1;
        const need = (+lastCalc.litres || 0) * r || 2.5;
        const size = pickSingleTin(need);
        const sel = document.getElementById('colourTin');
        if (sel) {
            [...sel.options].forEach(o => o.selected = (+o.value === size));
        }
        const hint = document.getElementById('sizeHint');
        if (hint) hint.textContent = `Suggested: ${size} L for ~${need.toFixed(1)} L need`;
    }
});

/* Colour modal → add to basket */
document.addEventListener('click', e => {
    if (e.target.id === 'colourAdd') {
        const meta = JSON.parse(e.target.dataset.colour);
        const L = +$('#colourTin').value;
        const qty = Math.max(1, +$('#colourQty').value || 1);
        CART.push({ id: rid(), brand: "Dulux Heritage", name: meta.name, finish: meta.finish, colour: meta.name, tins: Array(qty).fill(L), qty: 1 });
        updateCartCount(); openCart();
    }
    if (e.target.id === 'colourUseCalc') {
        const meta = JSON.parse(e.target.dataset.colour);
        ensureCalc();
        const tins = recommendTins(lastCalc.litres);
        CART.push({ id: rid(), brand: "Dulux Heritage", name: meta.name, finish: meta.finish, colour: meta.name, tins, qty: 1 });
        updateCartCount(); openCart();
    }
});

/* ===== calculator ===== */
function adjustCalcForTab() {
    const ceiling = activeTab === 'ceiling';
    $('#heightField').style.display = ceiling ? 'none' : 'flex';
    $('#doorsField').style.display = ceiling ? 'none' : 'flex';
    $('#windowsField').style.display = ceiling ? 'none' : 'flex';
    lastCalc.context = ceiling ? 'ceiling' : 'walls';
}

function runCalc() {
    const coats = Math.max(1, +$('#calcCoats').value || 1);
    const cov = +$('#calcCoverage').value || 12;
    let area = 0;

    if (activeTab === 'ceiling') {
        const w = +$('#calcWidth').value || 0, l = +$('#calcLength').value || 0;
        area = w * l;
    } else {
        const w = +$('#calcWidth').value || 0, l = +$('#calcLength').value || 0, h = +$('#calcHeight').value || 0;
        const per = 2 * (w + l);
        area = Math.max(0, (per * h) - ((+$('#calcDoors').value || 0) * 1.9 + (+$('#calcWindows').value || 0) * 1.5));
    }

    const litres = (area * coats) / cov;
    lastCalc = { litres, coverage: cov, coats, context: activeTab === 'ceiling' ? 'ceiling' : 'walls' };
    const ex = litres * DATA.pricePerLitre.default, inc = ex * 1.2;
    $('#calcResult').textContent = `~ ${litres.toFixed(2)} L • ${$('#calcVAT').value === 'ex' ? money(ex) + ' ex VAT' : money(inc) + ' inc VAT'}`;

    // refresh to inject litres/price on cards
    renderTab(activeTab);
}

function ensureCalc() { if (!lastCalc.litres) { runCalc(); } }

function addRecommendedTins() {
    ensureCalc();
    const tins = recommendTins(lastCalc.litres);
    CART.push({ id: rid(), brand: "Assorted", name: "Recommended tins", finish: "—", tins, qty: 1 });
    updateCartCount(); openCart();
}

/* ===== system sheets (open from any card) ===== */
document.addEventListener('click', e => {
    const b = e.target.closest('[data-open-system]');
    if (!b) return;
    const id = b.dataset.openSystem;
    const sheet = SYSTEM_SHEETS[id] || SYSTEM_SHEETS['interior-general'];
    systemContent.innerHTML = renderSheet(sheet);
    systemModal.showModal();
});

function renderSheet(s) {
    return `
    <div class="system">
      <h3>${s.title}</h3>
      <p class="spec">${s.subtitle || ''}</p>
      ${s.rows.map(r => `
        <div class="row">
          <h4>${r.stage}</h4>
          <div>
            <p>${r.detail}</p>
            ${r.products?.length ? `<p><strong>Recommended:</strong> ${r.products.join(', ')}</p>` : ''}
          </div>
        </div>`).join('')}
      <p class="muted">Drying times vary by product and conditions. Follow the tin data.</p>
    </div>`;
}

function inferSystemFromTab(tab) {
    switch (tab) {
        case 'ceiling': return 'ceiling';
        case 'walls': return 'walls';
        case 'woodwork': return 'woodwork';
        case 'exterior': return 'exterior-general';
        case 'taping': return 'taping-general';
        default: return 'interior-general';
    }
}

/* ===== add-to-calculator & add-to-basket (cards) ===== */
document.addEventListener('click', e => {
    const toCalc = e.target.closest('[data-add-to-calculator]');
    if (toCalc) {
        $('#calcGrid').scrollIntoView({ behavior: 'smooth', block: 'center' });
        $('#calcGrid').animate([{ outline: '2px solid var(--ring)' }, { outline: '0' }], { duration: 1200 });
    }

    const toBasket = e.target.closest('[data-add-to-basket]');
    if (toBasket) {
        const meta = JSON.parse(toBasket.dataset.addToBasket);
        const finSel = document.querySelector(`[data-finish-for="${meta.finishSel}"]`);
        const finish = finSel ? finSel.value : undefined;
        ensureCalc();
        const tins = recommendTins(meta.litres || lastCalc.litres);
        CART.push({ id: rid(), brand: meta.brand, name: meta.name, finish: finish || '—', tins, qty: 1 });
        updateCartCount(); openCart();
    }
});

/* ===== basket ===== */
const cartModal = $('#cartModal');
const cartItems = $('#cartItems');
const cartSub = $('#cartSubtotal');
const cartVAT = $('#cartVAT');
const cartTotal = $('#cartTotal');
const cartCount = $('#cartCount');

function openCart() { renderCart(); cartModal.showModal(); }
function updateCartCount() { cartCount.textContent = CART.length; }

cartItems.addEventListener('input', e => {
    const id = e.target.getAttribute('data-cart-qty');
    if (!id) return;
    const it = CART.find(x => x.id === id);
    if (it) { it.qty = Math.max(1, +e.target.value || 1); renderCart(); }
});

cartItems.addEventListener('click', e => {
    const id = e.target.getAttribute('data-cart-remove');
    if (!id) return;
    CART = CART.filter(x => x.id !== id);
    updateCartCount(); renderCart();
});

$('#submitOrder').addEventListener('click', () => {
    const fulfil = document.querySelector('input[name="fulfil"]:checked')?.value || 'delivery';
    const payload = {
        items: CART,
        fulfilment: { type: fulfil, day: $('#slotDay').value, time: $('#slotTime').value },
        totals: {
            exVAT: parseGBP(cartSub.textContent),
            VAT: parseGBP(cartVAT.textContent),
            total: parseGBP(cartTotal.textContent)
        }
    };
    console.log('ORDER SUBMITTED', payload); // EmailJS hook
    alert('Order submitted! Confirmation email will be sent (integration to follow).');
    cartModal.close();
});

function renderCart() {
    if (!CART.length) {
        cartItems.innerHTML = `<div class="card">Your basket is empty.</div>`;
    } else {
        cartItems.innerHTML = CART.map(i => `
      <div class="cart-row">
        <div>
          <strong>${i.brand} — ${i.name}</strong>${i.finish ? ` <small>• ${i.finish}</small>` : ''}${i.colour ? ` <small>• ${i.colour}</small>` : ''}
          ${i.tins ? `<div class="spec">Tins: ${i.tins.join('L + ')}L</div>` : ''}
        </div>
        <input type="number" min="1" value="${i.qty}" data-cart-qty="${i.id}">
        <div class="spec">${money(itemTotal(i))}</div>
        <button class="remove" data-cart-remove="${i.id}">✕</button>
      </div>`).join('');
    }
    const ex = CART.reduce((s, i) => s + itemTotal(i), 0);
    const vat = ex * 0.2;
    const inc = ex + vat;
    cartSub.textContent = money(ex);
    cartVAT.textContent = money(vat);
    cartTotal.textContent = money(inc);
}

function itemTotal(i) {
    const litres = i.tins ? i.tins.reduce((a, b) => a + b, 0) : (+i.litres || 0);
    const ppl = DATA.pricePerLitre[`${i.brand} ${i.name}`] ?? DATA.pricePerLitre.default;
    return litres * ppl * (i.qty || 1);
}

/* ===== slots & tins ===== */
function buildSlots() {
    const sel = $('#slotTime'); const opts = [];
    for (let h = 8; h <= 18; h++) {
        for (const m of [0, 15, 30, 45]) {
            const hh = String(h).padStart(2, '0'), mm = String(m).padStart(2, '0');
            opts.push(`<option value="${hh}:${mm}">${hh}:${mm}</option>`);
        }
    }
    sel.innerHTML = opts.join('');
}

function recommendTins(litres, sizes = [10, 5, 2.5, 1]) {
    let r = Math.max(0, litres); const out = [];
    for (const s of sizes) { while (r >= s - 1e-9) { out.push(s); r -= s; } }
    if (r > 0) out.push(sizes[sizes.length - 1]);
    return out;
}

/* ===== system sheets library ===== */
const SYSTEM_SHEETS = {
    'interior-general': {
        title: 'Interior Walls – General System', subtitle: 'New or previously painted in good condition.',
        rows: [
            { stage: 'Prep', detail: 'Dust-sheet, mask, clean. Sand to key. Fill defects; sand; dust off.', products: ['Toupret Interior Filler'] },
            { stage: 'Prime/Seal', detail: 'Spot-prime filled areas. New plaster: mist coat 10–20% thinned.', products: ['Dulux Supermatt (mist)'] },
            { stage: 'Finish', detail: 'Apply 2 coats with even layoff.', products: ['Dulux Heritage Velvet Matt', 'Dulux Diamond Matt', 'Crown Scrubbable Matt'] }
        ]
    },
    'ceiling': {
        title: 'Ceilings – Low Flash System',
        rows: [
            { stage: 'Prep', detail: 'Fill, sand to P180–P220, remove dust.' },
            { stage: 'Prime/Seal', detail: 'Spot-prime repairs to prevent flashing.' },
            { stage: 'Finish', detail: '1–2 coats low-sheen ceiling paint.', products: ['Tikkurila Anti-Reflex White (AR2)', 'Dulux Ultra Matt', 'Johnstone’s Ultra-Flat Matt'] }
        ]
    },
    'walls': {
        title: 'Walls – Durable Washable System',
        rows: [
            { stage: 'Prep', detail: 'As interior general. For stains, isolate with stain block.', products: ['Zinsser B-I-N / 123 (optional)'] },
            { stage: 'Finish', detail: '2 coats durable emulsion.', products: ['Dulux Diamond Matt', 'Crown Scrubbable Matt', 'Dulux Heritage Velvet Matt'] }
        ]
    },
    'woodwork': {
        title: 'Woodwork – Trim System',
        rows: [
            { stage: 'Prep', detail: 'Degrease, sand to dull. Fill/caulk; denib.' },
            { stage: 'Prime/Undercoat', detail: 'Undercoat for opacity and adhesion.', products: ['Dulux Undercoat (Trade)'] },
            { stage: 'Finish', detail: '1–2 coats depending on coverage.', products: ['Dulux Satinwood', 'Dulux Eggshell (Trade)', 'Dulux Gloss'] }
        ]
    },
    'exterior-general': {
        title: 'Exterior – Joinery System',
        rows: [
            { stage: 'Prep', detail: 'Remove failing coatings; sand. Spot prime bare wood; fill; seal end grain.', products: ['Toupret Exterior Filler', 'Zinsser Cover Stain / 123 Plus'] },
            { stage: 'Undercoat', detail: 'Build film for durability.', products: ['Dulux Weathershield Undercoat'] },
            { stage: 'Finish', detail: 'Apply 2 finish coats.', products: ['Dulux Weathershield Gloss/Satin/Eggshell'] }
        ]
    },
    'gutters': {
        title: 'Gutters & Downpipes – uPVC/Metal',
        rows: [
            { stage: 'Prep', detail: 'Clean, abrade lightly.' },
            { stage: 'Prime', detail: 'Adhesion primer if required.', products: ['Zinsser Bulls Eye 123 Plus'] },
            { stage: 'Finish', detail: '2 coats exterior finish.', products: ['Dulux Weathershield'] }
        ]
    },
    'soffits': {
        title: 'Soffits & Fascia Boards',
        rows: [
            { stage: 'Prep', detail: 'As exterior general; treat knots if needed.', products: ['Knotting solution (if softwood)'] },
            { stage: 'System', detail: 'Undercoat + 2 coats finish.', products: ['Weathershield system'] }
        ]
    },
    'windows': {
        title: 'Windows (Exterior)',
        rows: [
            { stage: 'Prep', detail: 'De-glaze if required, mask glass carefully.' },
            { stage: 'System', detail: 'Prime, undercoat, 2 coats topcoat with attention to edges.', products: ['Weathershield system'] }
        ]
    },
    'doors': {
        title: 'Doors (Exterior)',
        rows: [
            { stage: 'Prep', detail: 'Remove ironmongery, sand between coats.' },
            { stage: 'System', detail: 'Undercoat + 2 coats finish.', products: ['Weathershield Gloss/Satin'] }
        ]
    },
    'taping-general': {
        title: 'Taping & Jointing – Drywall',
        rows: [
            { stage: 'Reinforce', detail: 'Tape joints and corners.', products: ['Paper Tape', 'FibaTape Mesh', 'Levelline', 'Metal (paper-metal)'] },
            { stage: 'Fill', detail: 'Apply joint filler; dry; second fill to level.', products: ['Toupret Joint Filler', 'Gyproc Joint Cement'] },
            { stage: 'Finish', detail: 'Sand P180–P220; dust off; prime/seal before painting.', products: ['Mist coat / Sealer'] }
        ]
    },
    'new-plaster': {
        title: 'New Plaster',
        rows: [
            { stage: 'Dry', detail: 'Allow full dry. Scrape nibs; light sand; dust off.' },
            { stage: 'Mist', detail: '1 mist coat 10–20% thinned.', products: ['Dulux Supermatt'] },
            { stage: 'Finish', detail: '2 coats finish.', products: ['Dulux Heritage Velvet Matt', 'Dulux Diamond Matt'] }
        ]
    },
    'metal': {
        title: 'Interior Metal',
        rows: [
            { stage: 'Prep', detail: 'Remove rust to bright metal; degrease.' },
            { stage: 'Prime', detail: 'Metal or adhesion primer.' },
            { stage: 'Finish', detail: 'Appropriate trim finish.' }
        ]
    },
    'lining': {
        title: 'Lining Paper',
        rows: [
            { stage: 'Hang', detail: 'Cross-line where appropriate; tight seams.' },
            { stage: 'Prime', detail: 'Seal lightly before finishing.' },
            { stage: 'Finish', detail: '2 coats chosen wall finish.' }
        ]
    },
    'skirtings': {
        title: 'Skirtings & Trim',
        rows: [
            { stage: 'Prep', detail: 'Caulk gaps; fill dents; sand smooth.' },
            { stage: 'Undercoat', detail: 'One coat undercoat.', products: ['Dulux Undercoat (Trade)'] },
            { stage: 'Finish', detail: '1–2 coats.', products: ['Satinwood / Gloss / Eggshell'] }
        ]
    }
};
