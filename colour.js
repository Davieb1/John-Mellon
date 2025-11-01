// colours.js
// Populates:
//  - Heritage + Scrubbable full palettes (modal with "Add to paint estimate")
//  - Other finishes dropdown (Kitchen/Bathroom, Masonry, Eggshell, etc.)
//  - Global all-colour dropdown with swatch + add to basket
// Wires up the "View full palette" buttons

document.addEventListener("DOMContentLoaded", () => {
    try {
        if (!window.PainterProCart) {
            console.warn("PainterProCart not ready yet (cart.js must load before colours.js).");
        }

        // ===== Dulux Heritage full palette =====
        const HERITAGE_COLOURS = [
            // PALE TONES
            { name: "Indian White", tone: "pale", hex: "#f3efd9",
              use: "Soft pale tone. Ideal for full-room walls & ceilings in lounges/bedrooms.",
              pair: "Pairs with Chalk White for trim/ceilings." },
            { name: "Panel White", tone: "pale", hex: "#fdf4d8",
              use: "Soft pale tone. Ideal for full-room walls & ceilings in lounges/bedrooms.",
              pair: "Pairs with Chalk White for trim/ceilings." },
            { name: "Flax Seed", tone: "pale", hex: "#f0e8cc",
              use: "Soft pale tone. Ideal for full-room walls & ceilings in lounges/bedrooms.",
              pair: "Pairs with Chalk White for trim/ceilings." },
            { name: "Green Clay", tone: "pale", hex: "#f2eed2",
              use: "Soft pale tone. Ideal for calm bedrooms or relaxed lounges.",
              pair: "Pairs with Chalk White or Turtledove Grey." },
            { name: "Fresh Flour", tone: "pale", hex: "#f2ecd1",
              use: "Soft pale neutral for bedrooms and nurseries.",
              pair: "Pairs with Chalk White on skirting/doors." },
            { name: "Candel Cream", tone: "pale", hex: "#f6eac7",
              use: "Warm gentle cream. Cosy living rooms, dining areas.",
              pair: "Pairs with Heritage Stone feature walls." },
            { name: "Chiltern White", tone: "pale", hex: "#f7edcb",
              use: "Subtle off-white for whole-room coverage.",
              pair: "Pairs with Pewter Plate accents." },
            { name: "Linen White", tone: "pale", hex: "#efe8ca",
              use: "Classic linen tone for lounges and bedrooms.",
              pair: "Pairs with Pewter Plate or Rope Ladder." },
            { name: "Powder Colour", tone: "pale", hex: "#efe5c7",
              use: "Gentle powder warmth. Good for relaxed family rooms.",
              pair: "Pairs with Dark Stone on media wall." },
            { name: "DH Linen Colour", tone: "pale", hex: "#efe1b5",
              use: "Warm pale linen. Safe rental-friendly neutral.",
              pair: "Pairs with Tudor Brown furniture." },
            { name: "DH White", tone: "pale", hex: "#f8efda",
              use: "Soft heritage 'white' with warmth.",
              pair: "Pairs with Lead Grey or Waxed Khaki accents." },
            { name: "Silver Fern", tone: "pale", hex: "#e6e6c9",
              use: "Green-tinted pale. Calming bedrooms / snug lounges.",
              pair: "Pairs with Stone Green on panelling." },
            { name: "Fennel White", tone: "pale", hex: "#ecebcf",
              use: "Soft green-cream. Works in kitchens / utility.",
              pair: "Pairs with Rosemary Leaf trim." },
            { name: "Clear SKies", tone: "pale", hex: "#ebf0df",
              use: "Fresh airy light tone. Brightens darker halls.",
              pair: "Pairs with Sky Blue details." },
            { name: "Copenhagen Blue", tone: "pale", hex: "#e0e9e9",
              use: "Nordic cool pale. Great for bathrooms / utility.",
              pair: "Pairs with Deep Ultramarine accents." },
            { name: "Light French Gray", tone: "pale", hex: "#dfe3d9",
              use: "Elegant pale grey. Good for lounges.",
              pair: "Pairs with Pewter Plate bannisters." },
            { name: "Turtledove Grey", tone: "pale", hex: "#e8e5d1",
              use: "Soft taupe-grey. Bedrooms / living rooms.",
              pair: "Pairs with Rope Ladder woodwork." },
            { name: "Green Earth", tone: "pale", hex: "#e5e8d3",
              use: "Gentle green neutral for lounges.",
              pair: "Pairs with Stone Green feature." },
            { name: "Cornish Clay", tone: "pale", hex: "#efe2d1",
              use: "Warm coastal neutral. Hall / stairs / landing.",
              pair: "Pairs with Pewter Plate handrails." },
            { name: "Green Marl", tone: "pale", hex: "#e7e6d3",
              use: "Pale green-beige. Good in dining rooms.",
              pair: "Pairs with Olive Tree accents." },
            { name: "Ochre White", tone: "pale", hex: "#f0e4c1",
              use: "Yellow-ochre cream. Cosy lounges / snug areas.",
              pair: "Pairs with Brushed Gold trim." },
            { name: "York White", tone: "pale", hex: "#efe3c6",
              use: "Classic warm 'heritage' neutral.",
              pair: "Pairs with Dark Stone / Pugin Red pops." },
            { name: "Romney Wool", tone: "pale", hex: "#efe1c7",
              use: "Soft woolen beige. Landlords / rentals.",
              pair: "Pairs with Tudor Brown doors." },
            { name: "Pale Nutmeg", tone: "pale", hex: "#e9dbc1",
              use: "Light biscuity neutral. Bedrooms.",
              pair: "Pairs with Biscuit Beige woodwork." },
            { name: "Potters Pink", tone: "pale", hex: "#ead8d2",
              use: "Calm blush. Bedrooms / nurseries.",
              pair: "Pairs with Pewter Plate bannisters." },
            { name: "DH Stone", tone: "pale", hex: "#e7dcc7",
              use: "Soft stone neutral. Whole-room safe.",
              pair: "Pairs with Rope Ladder doors." },

            // MID TONES
            { name: "Beachcom Grey", tone: "mid", hex: "#d1cbb7",
              use: "Mid-strength tone. Great for HSL or main wall.",
              pair: "Pairs with Chalk White or Pearl Barley trim." },
            { name: "Green Slate", tone: "mid", hex: "#cfd1bf",
              use: "Muted green-grey for lounges.",
              pair: "Pairs with Fennel White on ceilings." },
            { name: "Raw Cashmere", tone: "mid", hex: "#cbbfae",
              use: "Warm cashmere beige for bedrooms.",
              pair: "Pairs with Chalk White trim." },
            { name: "Ancient Sandstone", tone: "mid", hex: "#c0b6a2",
              use: "Stone neutral, nice in hall/stairs.",
              pair: "Pairs with Rope Ladder bannisters." },
            { name: "Bathstone Beige", tone: "mid", hex: "#c7b9a1",
              use: "Soft beige for lounges/diners.",
              pair: "Pairs with Pewter Plate spindles." },
            { name: "Pale Walnut", tone: "mid", hex: "#bcae94",
              use: "Brown/wood tone for feature walls.",
              pair: "Pairs with DH White ceilings." },
            { name: "Quartz Grey", tone: "mid", hex: "#bfc0b7",
              use: "Modern grey. Good for rental refresh.",
              pair: "Pairs with Chalk White doors." },
            { name: "Pumice Brown", tone: "mid", hex: "#b5a58e",
              use: "Warm neutral for living rooms.",
              pair: "Pairs with Pearl Barley trims." },
            { name: "DH BLossom", tone: "mid", hex: "#d9b5b0",
              use: "Subtle blush. Bedrooms / statement wall.",
              pair: "Pairs with Chalk White skirting." },
            { name: "Golden Ivory", tone: "mid", hex: "#d8c69b",
              use: "Soft golden neutral. Dining rooms.",
              pair: "Pairs with Brushed Gold accents." },
            { name: "Butter Cup", tone: "mid", hex: "#dac688",
              use: "Warm buttery wall tone.",
              pair: "Pairs with DH White ceilings." },
            { name: "Pale Olvine", tone: "mid", hex: "#c5c7a1",
              use: "Olive-leaning neutral. Cosy lounges.",
              pair: "Pairs with Olive Tree feature." },
            { name: "Rosemary Leaf", tone: "mid", hex: "#c4c6a4",
              use: "Botanical green-grey. Kitchens / utility.",
              pair: "Pairs with Fennel White cabinetry." },
            { name: "Light Teal", tone: "mid", hex: "#8ea9a4",
              use: "Soft teal. Bathrooms / feature wall.",
              pair: "Pairs with Dulux Heritage Velvet Matt True White." },
            { name: "Light Cobalt", tone: "mid", hex: "#8fa1b4",
              use: "Cool blue. Bedrooms / bathrooms.",
              pair: "Pairs with Chalk White trim." },
            { name: "Violet Night", tone: "mid", hex: "#8b8197",
              use: "Muted violet for bedrooms.",
              pair: "Pairs with DH White woodwork." },
            { name: "Pewter Plate", tone: "mid", hex: "#8a8a80",
              use: "Grey for bannisters / railings (properly keyed).",
              pair: "Pairs with Warm Linen on walls." },
            { name: "Stone Green", tone: "mid", hex: "#90987e",
              use: "Natural green. Lounge feature wall.",
              pair: "Pairs with Silver Fern walls." },
            { name: "Rope Ladder", tone: "mid", hex: "#998b6c",
              use: "Muted timber tone. Woodwork / doors.",
              pair: "Pairs with DH Stone walls." },
            { name: "Setting Stone", tone: "mid", hex: "#b7a78c",
              use: "Warm beige for rented flats.",
              pair: "Pairs with Romney Wool throughout." },
            { name: "Pearl Barley", tone: "mid", hex: "#cebfa0",
              use: "Creamy neutral good in dining/kitchen.",
              pair: "Pairs with Biscuit Beige trim." },
            { name: "Biscuit Beige", tone: "mid", hex: "#c9b295",
              use: "Biscuity beige. Bedrooms / lounge.",
              pair: "Pairs with Pale Nutmeg ceiling." },
            { name: "Pebble Grey", tone: "mid", hex: "#a9a79d",
              use: "Reliable grey neutral for HSL.",
              pair: "Pairs with Chalk White spindles." },
            { name: "Dusted Heather", tone: "mid", hex: "#b6a5a8",
              use: "Soft mauve-grey. Bedrooms.",
              pair: "Pairs with DH White frames." },
            { name: "Coral Pink", tone: "mid", hex: "#d9a59b",
              use: "Playful coral. Feature / kids room.",
              pair: "Pairs with Dulux Heritage Velvet Matt True White." },
            { name: "Buff", tone: "mid", hex: "#cdb393",
              use: "Warm buff neutral. Whole-room safe.",
              pair: "Pairs with Pewter Plate handrails." },
            { name: "Pale Cream", tone: "mid", hex: "#decfa3",
              use: "Classic cream. Landlord-friendly.",
              pair: "Pairs with Tudor Brown doors." },
            { name: "Veranda Green", tone: "mid", hex: "#8e9c7c",
              use: "Garden-room green. Conservatories.",
              pair: "Pairs with Fennel White ceiling." },
            { name: "Sage Green", tone: "mid", hex: "#8b967b",
              use: "Soft sage. Kitchens / utilities.",
              pair: "Pairs with Rosemary Leaf trim." },
            { name: "Sky Blue", tone: "mid", hex: "#8ca2b4",
              use: "Fresh blue. Bathrooms / ceilings.",
              pair: "Pairs with Clear SKies walls." },
            { name: "Boathouse Blue", tone: "mid", hex: "#718da4",
              use: "Classic blue for feature walls.",
              pair: "Pairs with Chalk White skirting." },
            { name: "DH Indigo", tone: "mid", hex: "#4d5977",
              use: "Deep indigo. Bedroom headboard wall.",
              pair: "Pairs with DH White trim." },

            // DEEP TONES
            { name: "Lead Grey", tone: "deep", hex: "#4f5351",
              use: "Deep accent tone. Media walls / panelling.",
              pair: "Pairs with Chalk White ceilings." },
            { name: "Waxed Khaki", tone: "deep", hex: "#5a5f4a",
              use: "Earthy deep khaki. Feature / snug walls.",
              pair: "Pairs with Fennel White ceilings." },
            { name: "Olive Tree", tone: "deep", hex: "#585e40",
              use: "Rich olive. Lounge/dining feature.",
              pair: "Pairs with Pale Olvine highlights." },
            { name: "Mud Lark", tone: "deep", hex: "#544d3f",
              use: "Warm mud-brown. Rustic / cottage feel.",
              pair: "Pairs with DH Linen Colour." },
            { name: "Dark Stone", tone: "deep", hex: "#595041",
              use: "Dark neutral brown-grey. Media wall.",
              pair: "Pairs with Powder Colour main walls." },
            { name: "Mid Umber", tone: "deep", hex: "#5a4b3a",
              use: "Strong umber. Good for panelling.",
              pair: "Pairs with Pale Walnut contrast." },
            { name: "Terra Ombra", tone: "deep", hex: "#5c4634",
              use: "Deep earthy brown. Fireplace / feature.",
              pair: "Pairs with DH White ceiling." },
            { name: "Fitzrovia Red", tone: "deep", hex: "#6c3834",
              use: "Heritage red. Dining / statement wall.",
              pair: "Pairs with York White elsewhere." },
            { name: "Red Ocher", tone: "deep", hex: "#6f3a2f",
              use: "Warm red-ochre. Feature chimney breast.",
              pair: "Pairs with Romney Wool." },
            { name: "Inca Orange", tone: "deep", hex: "#7a4a2b",
              use: "Burnt orange accent. Feature corners.",
              pair: "Pairs with Butter Cup trims." },
            { name: "Brushed Gold", tone: "deep", hex: "#7d6633",
              use: "Gold-tone warmth. Dining / hallway.",
              pair: "Pairs with Candel Cream walls." },
            { name: "DH Drab", tone: "deep", hex: "#56513a",
              use: "Classic deep heritage drab green/brown.",
              pair: "Pairs with Pale Nutmeg ceiling." },
            { name: "DH Grass Green", tone: "deep", hex: "#4d5b35",
              use: "Rich green for feature panels.",
              pair: "Pairs with Fennel White trim." },
            { name: "Maritime Teal", tone: "deep", hex: "#2e4d4e",
              use: "Deep teal. Bathrooms / media wall.",
              pair: "Pairs with Copenhagen Blue." },
            { name: "Deep Ultramarine", tone: "deep", hex: "#2f3f63",
              use: "Strong blue for statement walls.",
              pair: "Pairs with Light Cobalt ceiling." },
            { name: "Wild Blackberry", tone: "deep", hex: "#3f2e45",
              use: "Dark berry/plum. Bedroom feature.",
              pair: "Pairs with Dusted Heather." },
            { name: "Ravens Flight", tone: "deep", hex: "#2f2e36",
              use: "Almost black. Bannisters / rails (keyed).",
              pair: "Pairs with DH White walls." },
            { name: "Forest Grey", tone: "deep", hex: "#40443d",
              use: "Smoky grey-green. Lounge feature.",
              pair: "Pairs with Silver Fern walls." },
            { name: "Tudor Brown", tone: "deep", hex: "#4f3a2b",
              use: "Traditional brown for doors / trims.",
              pair: "Pairs with Pale Cream walls." },
            { name: "Wooded Walk", tone: "deep", hex: "#453a2a",
              use: "Deep woodland tone. Panelling / snug.",
              pair: "Pairs with Setting Stone." },
            { name: "Jenny Wren", tone: "deep", hex: "#4a3b3a",
              use: "Warm brown-grey. Period property vibe.",
              pair: "Pairs with DH Stone ceilings." },
            { name: "Cherry Truffle", tone: "deep", hex: "#5a3534",
              use: "Rich cherry-brown/red. Dining feature.",
              pair: "Pairs with Panel White trim." },
            { name: "Mauve Mist", tone: "deep", hex: "#56464f",
              use: "Dusky purple. Bedroom / dressing area.",
              pair: "Pairs with Violet Night." },
            { name: "Florentine Red", tone: "deep", hex: "#6a2d2c",
              use: "Classic deep red. Dining / bar area.",
              pair: "Pairs with DH White skirting." },
            { name: "Pugin Red", tone: "deep", hex: "#6d2a28",
              use: "Historic deep red. Feature wall / stairs.",
              pair: "Pairs with York White hall walls." },
            { name: "Red Sand", tone: "deep", hex: "#7f4032",
              use: "Rust/terracotta accent. Alcoves / fireplace.",
              pair: "Pairs with Powder Colour walls." },

            // WHITES
            { name: "Chalk White", tone: "white", hex: "#ffffff",
              use: "Clean off-white. Perfect on ceilings, skirting, doors.",
              pair: "Pairs with any mid or deep tone." },
            { name: "China White", tone: "white", hex: "#fff8ea",
              use: "Soft off-white. Ceilings / cornice.",
              pair: "Pairs with Warm Linen walls." },
            { name: "Linet White", tone: "white", hex: "#fff5eb",
              use: "Linen-tinted white. Great with taupes.",
              pair: "Pairs with Biscuit Beige." },
            { name: "Grecian White", tone: "white", hex: "#fff1dc",
              use: "Warm white for period coving.",
              pair: "Pairs with Ancient Sandstone." },
            { name: "Piano White", tone: "white", hex: "#fffdf4",
              use: "Bright near-pure white.",
              pair: "Pairs with DH Indigo accents." },
            { name: "Roamn White", tone: "white", hex: "#fff4de",
              use: "Soft heritage off-white.",
              pair: "Pairs with Rope Ladder woodwork." },
            { name: "Mallow WHite", tone: "white", hex: "#fff4ed",
              use: "Cream-white. Bedrooms / trims.",
              pair: "Pairs with Coral Pink feature." },
            { name: "Wiltshire White", tone: "white", hex: "#fff7ea",
              use: "Gentle white for ceilings/doors.",
              pair: "Pairs with Setting Stone walls." },
            { name: "Marble White", tone: "white", hex: "#fffaf5",
              use: "Very light neutral. Bathrooms / kitchens.",
              pair: "Pairs with Light Teal." },
            { name: "Violte White", tone: "white", hex: "#fff4ed",
              use: "White with lilac whisper. Dressing rooms.",
              pair: "Pairs with Mauve Mist." },

            // TRUE WHITES
            { name: "Dulux Heritage Velvet Matt True White", tone: "truewhite", hex: "#fffbfb",
              use: "True bright white (Velvet Matt). Ceilings, frames, skirtings, doors.",
              pair: "Pairs with any Heritage mid/deep tone." },
            { name: "Dulux Heritage Eggshell True White", tone: "truewhite", hex: "#fcfcfc",
              use: "True bright white (Eggshell). Woodwork/trim.",
              pair: "Pairs with any mid/deep tone for contrast." }
        ];

        // ===== Scrubbable Matt colours =====
        const SCRUBBABLE_COLOURS = [
            { name: "Soft Cotton", tone: "pale", hex: "#f2f2f2",
              use: "Whole-room light neutral. Family-safe for lounges/bedrooms.",
              pair: "Pair with Urban Grey on bannisters." },
            { name: "Trade White", tone: "pale", hex: "#ffffff",
              use: "Ceilings / reset coats for rentals.",
              pair: "Pair with Graphite Smoke feature wall." },
            { name: "Cream Mist", tone: "pale", hex: "#f4f1e4",
              use: "Warm light cream for living rooms.",
              pair: "Pair with Pebble Path woodwork." },
            { name: "Hallway Magnolia", tone: "pale", hex: "#efe5cf",
              use: "Classic landlord magnolia for lets.",
              pair: "Pair with Stone Taupe touch-ups." },

            { name: "Urban Grey", tone: "mid", hex: "#9b9e9f",
              use: "Modern mid grey for hall / stairs / landing.",
              pair: "Pair with Soft Cotton on walls." },
            { name: "Pebble Path", tone: "mid", hex: "#b5ad9f",
              use: "Taupe/stone feel, hides scuffs.",
              pair: "Pair with Cream Mist ceilings." },
            { name: "Stone Taupe", tone: "mid", hex: "#a1907c",
              use: "Good for rentals and cover-ups.",
              pair: "Pair with Trade White trim." },
            { name: "Smoke Blue", tone: "mid", hex: "#8da1ad",
              use: "Cool blue-grey for bathrooms / utility.",
              pair: "Pair with Trade White ceiling." },

            { name: "Graphite Smoke", tone: "deep", hex: "#4a4a4a",
              use: "Deep charcoal accent for media walls.",
              pair: "Pair with Soft Cotton surround walls." },
            { name: "Rail Black", tone: "deep", hex: "#2f2f2f",
              use: "Dark bannister / skirting (properly keyed).",
              pair: "Pair with Soft Cotton walls." },
            { name: "Charcoal Rail", tone: "deep", hex: "#3b3b3b",
              use: "Statement doors / staircase spindles.",
              pair: "Pair with Cream Mist main walls." }
        ];

        // ===== Other finishes / systems =====
        const OTHER_FINISHES = [
            {
                key: "kitchen_bath",
                name: "Kitchen & Bathroom (Steam Resistant)",
                finishLabel: "Kitchen & Bathroom Moisture Resistant",
                tinSize: "2.5L",
                price: "£31.99",
                hex: "#e8f1f3",
                use: "Steam-resistant, wipe-clean finish. Helps resist mould spotting.",
                pair: "Best in kitchens / bathrooms. Pair with Tile White on ceilings."
            },
            {
                key: "masonry_ext",
                name: "Masonry / Exterior Smooth",
                finishLabel: "Masonry / Exterior Smooth",
                tinSize: "5L",
                price: "£59.99",
                hex: "#faf9f0",
                use: "Flexible, weather-resistant coating for exterior render, brick, block and sills.",
                pair: "Pairs with Concrete Smoke / Graphite Trim accents on sills and trims."
            },
            {
                key: "eggshell_trim",
                name: "Low-Yellowing Eggshell (Woodwork)",
                finishLabel: "Low-Yellowing Eggshell (Woodwork)",
                tinSize: "1L",
                price: "£24.99",
                hex: "#ffffff",
                use: "Smooth modern eggshell for doors, frames, skirting, bannisters.",
                pair: "Pairs with Soft Ivory / Rail Black as contrast."
            },
            {
                key: "exterior_trim",
                name: "Exterior Satin / Gloss for Doors & Trims",
                finishLabel: "Exterior Satin / Gloss (Trims)",
                tinSize: "1L",
                price: "£24.99",
                hex: "#3b3b3b",
                use: "Weather-capable trim finish for exterior doors/frames.",
                pair: "Pairs with Masonry / Exterior Smooth on surrounding walls."
            },
            {
                key: "stain_block",
                name: "Stain Block / Nicotine Sealer",
                finishLabel: "Stain Block / Leak Cover",
                tinSize: "1L",
                price: "£19.99",
                hex: "#fffdf4",
                use: "Primer/sealer to lock in nicotine, water marks, leaks.",
                pair: "Use before High Opacity Matt for full let-ready reset."
            }
        ];

        // ===== Normalised range objects =====
        const RANGES = {
            heritage: {
                displayName: "Dulux Heritage Velvet Matt",
                note: "Luxury soft-touch matt, high pigmentation, wipeable. Ideal for lounges, bedrooms, stairwells.",
                finishLabel: "Velvet Matt (Heritage)",
                tinSize: "2.5L",
                price: "£39.59",
                colours: HERITAGE_COLOURS
            },
            scrubbable: {
                displayName: "Scrubbable Matt (Durable Wipe-Clean)",
                note: "High durability, wipeable without going shiny. Great for family rooms, halls, stairs, landings.",
                finishLabel: "Scrubbable Matt",
                tinSize: "2.5L",
                price: "£29.99",
                colours: SCRUBBABLE_COLOURS
            }
        };

        // Build one big list for the global colour dropdown
        const ALL_COLOURS = [];
        Object.entries(RANGES).forEach(([rangeKey, range]) => {
            range.colours.forEach(col => {
                ALL_COLOURS.push({
                    rangeKey,
                    rangeName: range.displayName,
                    finishLabel: range.finishLabel,
                    tinSize: range.tinSize,
                    price: range.price,
                    name: col.name,
                    hex: col.hex,
                    use: col.use,
                    pair: col.pair
                });
            });
        });

        // ===== DOM refs =====
        // Modal
        const modalEl = document.getElementById("colourModal");
        const modalCloseBtn = document.getElementById("closeColourModal");
        const modalRangeNameEl = document.getElementById("modalRangeName");
        const modalRangeNoteEl = document.getElementById("modalRangeNote");
        const modalColoursEl = document.getElementById("modalColours");

        // Range buttons ("View full Heritage palette →", etc.)
        const paletteBtns = [...document.querySelectorAll(".openPaletteBtn")];

        // Other finishes dropdown
        const otherFinishSelectEl = document.getElementById("otherFinishSelect");
        const otherPreviewBlockEl = document.getElementById("otherFinishPreviewBlock");
        const otherPreviewSwatchEl = document.getElementById("otherFinishPreviewSwatch");
        const otherPreviewNameEl = document.getElementById("otherFinishPreviewName");
        const otherPreviewUseEl = document.getElementById("otherFinishPreviewUse");
        const otherPreviewPairEl = document.getElementById("otherFinishPreviewPair");
        const otherPreviewMetaEl = document.getElementById("otherFinishPreviewMeta");
        const addOtherFinishBtn = document.getElementById("addOtherFinishToBasketBtn");

        // All-colours dropdown
        const colourSelectEl = document.getElementById("colourSelect");
        const previewBlockEl = document.getElementById("colourPreviewBlock");
        const previewSwatchEl = document.getElementById("colourPreviewSwatch");
        const previewNameEl = document.getElementById("colourPreviewName");
        const previewUseEl = document.getElementById("colourPreviewUse");
        const previewPairEl = document.getElementById("colourPreviewPair");
        const previewHexEl = document.getElementById("colourPreviewHex");
        const addColourToBasketBtn = document.getElementById("addColourToBasketBtn");

        // ===== Modal helpers =====
        function openModalForRange(rangeKey) {
            const range = RANGES[rangeKey];
            if (!range || !modalEl || !modalColoursEl) return;

            // header text
            modalRangeNameEl.textContent = range.displayName;
            modalRangeNoteEl.textContent = range.note;

            // build colour cards
            modalColoursEl.innerHTML = "";
            range.colours.forEach(col => {
                const card = document.createElement("div");
                card.className = "modal-colour-card";
                card.style.border = "1px solid var(--border-soft)";
                card.style.borderRadius = "var(--radius-btn)";
                card.style.boxShadow = "var(--shadow-soft)";
                card.style.padding = "1rem";
                card.style.background = "#fff";
                card.style.display = "grid";
                card.style.gap = ".5rem";
                card.style.fontSize = ".8rem";
                card.style.lineHeight = "1.4";

                card.innerHTML = `
                    <div style="
                        width:100%;
                        height:3rem;
                        border-radius:.5rem;
                        box-shadow:var(--shadow-soft);
                        border:1px solid #ccc;
                        background:${col.hex};
                    "></div>

                    <div style="display:grid; gap:.25rem;">
                        <div style="color:var(--text-dark); font-weight:600; font-size:.9rem;">
                            ${col.name}
                        </div>
                        <div style="color:var(--text-mid);">
                            ${col.use}
                        </div>
                        <div style="color:var(--text-mid); font-size:.7rem;">
                            ${col.pair}
                        </div>
                        <div style="color:var(--text-mid); font-size:.7rem;">
                            ${range.finishLabel} • ${range.tinSize} • ${range.price}
                        </div>
                    </div>

                    <button type="button"
                        class="btn btn-primary addColourFromModalBtn"
                        data-rangekey="${rangeKey}"
                        data-colourname="${col.name}"
                        style="width:max-content; font-size:.8rem; line-height:1.2; cursor:pointer;">
                        Add to paint estimate
                    </button>
                `;
                modalColoursEl.appendChild(card);
            });

            // show modal
            modalEl.style.display = "flex";
        }

        function closeModal() {
            if (modalEl) modalEl.style.display = "none";
        }

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener("click", closeModal);
        }
        if (modalEl) {
            modalEl.addEventListener("click", (e) => {
                if (e.target === modalEl) closeModal();
            });
        }

        // Attach click handlers for "View full ... palette →"
        paletteBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const rangeKey = btn.getAttribute("data-range");
                openModalForRange(rangeKey);
            });
        });

        // ---- ADD FROM MODAL TO BASKET ----
        if (modalColoursEl) {
            modalColoursEl.addEventListener("click", (e) => {
                const addBtn = e.target.closest(".addColourFromModalBtn");
                if (!addBtn) return;

                const rangeKey = addBtn.getAttribute("data-rangekey");
                const colourName = addBtn.getAttribute("data-colourname");

                const range = RANGES[rangeKey];
                if (!range) return;
                const col = range.colours.find(c => c.name === colourName);
                if (!col) return;

                const lineItem = {
                    name: `${range.displayName} - ${col.name}`,
                    finish: range.finishLabel,
                    size: range.tinSize,
                    price: range.price
                };

                if (!window.PainterProCart || !window.PainterProCart.addItemToCart) {
                    alert("Basket system not ready.");
                    return;
                }

                // add to cart
                window.PainterProCart.addItemToCart(lineItem);

                // mini feedback on the button itself
                addBtn.textContent = "Added ✓";
                addBtn.disabled = true;
                setTimeout(() => {
                    addBtn.textContent = "Add to paint estimate";
                    addBtn.disabled = false;
                }, 1200);

                // pop open minicart if available
                if (window.openCartPreview) {
                    window.openCartPreview();
                }
            });
        }

        // ===== Populate "Choose a finish / system" dropdown =====
        if (otherFinishSelectEl) {
            OTHER_FINISHES.forEach(item => {
                const opt = document.createElement("option");
                opt.value = item.key;
                opt.textContent = `${item.name} (${item.tinSize} ${item.price})`;
                otherFinishSelectEl.appendChild(opt);
            });

            otherFinishSelectEl.addEventListener("change", () => {
                const key = otherFinishSelectEl.value;
                const item = OTHER_FINISHES.find(f => f.key === key);

                if (!item) {
                    if (otherPreviewBlockEl) otherPreviewBlockEl.style.display = "none";
                    return;
                }

                if (otherPreviewSwatchEl) otherPreviewSwatchEl.style.background = item.hex;
                if (otherPreviewNameEl) otherPreviewNameEl.textContent = item.name;
                if (otherPreviewUseEl) otherPreviewUseEl.textContent = item.use;
                if (otherPreviewPairEl) otherPreviewPairEl.textContent = item.pair;
                if (otherPreviewMetaEl) {
                    otherPreviewMetaEl.textContent =
                        `${item.finishLabel} • ${item.tinSize} • ${item.price}`;
                }

                if (otherPreviewBlockEl) otherPreviewBlockEl.style.display = "grid";

                if (addOtherFinishBtn) {
                    addOtherFinishBtn.setAttribute("data-key", item.key);
                }
            });

            if (addOtherFinishBtn) {
                addOtherFinishBtn.addEventListener("click", () => {
                    const key = addOtherFinishBtn.getAttribute("data-key");
                    const item = OTHER_FINISHES.find(f => f.key === key);
                    if (!item) return;

                    const lineItem = {
                        name: item.name,
                        finish: item.finishLabel,
                        size: item.tinSize,
                        price: item.price
                    };

                    if (!window.PainterProCart || !window.PainterProCart.addItemToCart) {
                        alert("Basket system not ready.");
                        return;
                    }

                    window.PainterProCart.addItemToCart(lineItem);

                    // quick visual feedback
                    addOtherFinishBtn.textContent = "Added ✓";
                    addOtherFinishBtn.disabled = true;
                    setTimeout(() => {
                        addOtherFinishBtn.textContent = "Add to basket";
                        addOtherFinishBtn.disabled = false;
                    }, 1200);

                    if (window.openCartPreview) {
                        window.openCartPreview();
                    }
                });
            }
        }

        // ===== Populate full colour dropdown =====
        if (colourSelectEl) {
            // build optgroups per range
            const byRange = {};
            ALL_COLOURS.forEach(c => {
                if (!byRange[c.rangeKey]) {
                    byRange[c.rangeKey] = {
                        label: c.rangeName,
                        items: []
                    };
                }
                byRange[c.rangeKey].items.push(c);
            });

            Object.entries(byRange).forEach(([rangeKey, group]) => {
                const og = document.createElement("optgroup");
                og.label = group.label;

                group.items.forEach(c => {
                    const opt = document.createElement("option");
                    opt.value = `${rangeKey}|||${c.name}`;
                    opt.textContent = `${c.name} (${c.hex})`;
                    og.appendChild(opt);
                });

                colourSelectEl.appendChild(og);
            });

            colourSelectEl.addEventListener("change", () => {
                const val = colourSelectEl.value;
                if (!val) {
                    if (previewBlockEl) previewBlockEl.style.display = "none";
                    return;
                }

                const parts = val.split("|||");
                const rangeKey = parts[0];
                const colourName = parts[1];
                const found = ALL_COLOURS.find(
                    c => c.rangeKey === rangeKey && c.name === colourName
                );

                if (!found) {
                    if (previewBlockEl) previewBlockEl.style.display = "none";
                    return;
                }

                if (previewSwatchEl) previewSwatchEl.style.background = found.hex;
                if (previewNameEl) previewNameEl.textContent =
                    `${found.name} – ${found.rangeName}`;
                if (previewUseEl) previewUseEl.textContent = found.use;
                if (previewPairEl) previewPairEl.textContent = found.pair;
                if (previewHexEl) previewHexEl.textContent = found.hex;
                if (previewBlockEl) previewBlockEl.style.display = "grid";

                if (addColourToBasketBtn) {
                    addColourToBasketBtn.setAttribute("data-rangekey", found.rangeKey);
                    addColourToBasketBtn.setAttribute("data-colourname", found.name);
                }
            });

            if (addColourToBasketBtn) {
                addColourToBasketBtn.addEventListener("click", () => {
                    const rangeKey = addColourToBasketBtn.getAttribute("data-rangekey");
                    const colourName = addColourToBasketBtn.getAttribute("data-colourname");
                    if (!rangeKey || !colourName) return;

                    const range = RANGES[rangeKey];
                    if (!range) return;
                    const col = range.colours.find(c => c.name === colourName);
                    if (!col) return;

                    const lineItem = {
                        name: `${range.displayName} - ${col.name}`,
                        finish: range.finishLabel,
                        size: range.tinSize,
                        price: range.price
                    };

                    if (!window.PainterProCart || !window.PainterProCart.addItemToCart) {
                        alert("Basket system not ready.");
                        return;
                    }

                    window.PainterProCart.addItemToCart(lineItem);

                    // button feedback
                    addColourToBasketBtn.textContent = "Added ✓";
                    addColourToBasketBtn.disabled = true;
                    setTimeout(() => {
                        addColourToBasketBtn.textContent = "Add to basket";
                        addColourToBasketBtn.disabled = false;
                    }, 1200);

                    if (window.openCartPreview) {
                        window.openCartPreview();
                    }
                });
            }
        }

        console.log("colours.js initialised OK ✅");
    } catch (err) {
        console.error("colours.js failed to initialise ❌", err);
    }
});
