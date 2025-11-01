// estimator.js
// Quick Room Paint Estimate logic
// - calculates wall area for 4 walls (A + B + A + B) * height, 2 coats
// - converts m² -> litres (we'll assume 12m² per litre per coat for trade matt)
// - splits litres into tins using same logic as services.js (10L / 5L / 2.5L / 1L etc)
// - builds a system sheet (paint + fillers/caulk/tape kit) based on chosen room type
// - lets user add that full bundle to the basket

document.addEventListener("DOMContentLoaded", () => {
    // pull DOM
    const roomTypeEl = document.getElementById("roomType");
    const wallAEl = document.getElementById("wallA");
    const wallBEl = document.getElementById("wallB");
    const heightEl = document.getElementById("heightM");

    const calcBtn = document.getElementById("calcEstimateBtn");

    const resultBlock = document.getElementById("estimateResultBlock");
    const litreBreakdownTextEl = document.getElementById("litreBreakdownText");
    const systemSheetListEl = document.getElementById("systemSheetList");
    const addEstimateToBasketBtn = document.getElementById("addEstimateToBasketBtn");

    if (!roomTypeEl || !wallAEl || !wallBEl || !heightEl || !calcBtn) {
        // estimator card isn't on this page, do nothing
        return;
    }

    // --- same tin + kit logic we already use on services.js -----------------

    // this mirrors PRICEBOOK.paint from services.js
    // we pick a default finish based on roomType
    // standard     -> scrubbable matt
    // kitchenbath  -> kitchen/bath moisture resistant
    // rentalreset  -> rental high cover trade matt
    const PRICEBOOK = {
        paint: {
            scrubbable: {
                label: "Scrubbable Matt (wipeable, durable)",
                nameBase: "Scrubbable Matt - High Durability",
                finish: "Scrubbable Matt",
                tins: {
                    "10L": 89.99,
                    "5L": 49.99,
                    "2.5L": 29.99,
                    "1L": 14.99,
                },
                kitKey: "interior_scrubbable",
            },
            kitchen_bath: {
                label: "Kitchen & Bathroom (Steam Resistant)",
                nameBase: "Kitchen & Bathroom Moisture Resistant",
                finish: "Steam Resistant Matt",
                tins: {
                    "5L": 54.99,
                    "2.5L": 31.99,
                    "1L": 17.99,
                },
                kitKey: "kitchen_bath_kit",
            },
            rental: {
                label: "High-Cover Trade Matt (rental neutral)",
                nameBase: "High-Cover Trade Matt (Rental Neutral)",
                finish: "High Opacity Matt",
                tins: {
                    "10L": 84.99,
                    "5L": 46.99,
                    "2.5L": 27.99,
                    "1L": 12.99,
                },
                kitKey: "rental_standard",
            },
        },

        kits: {
            interior_scrubbable: [
                { name: "Toupret Interior Filler", finish: "Filler", size: "1kg", price: "£7.99" },
                { name: "Decorator’s Caulk", finish: "Caulk", size: "380ml", price: "£2.49" },
                { name: "Low-Tack Masking Tape", finish: "Tape", size: "50m", price: "£3.99" },
                { name: "Roller Sleeves + Tray Liners", finish: "Roller Kit", size: "Pack", price: "£5.99" },
            ],
            kitchen_bath_kit: [
                { name: "Mould-Resistant Bathroom Caulk", finish: "Sealant", size: "White", price: "£3.49" },
                { name: "Low-Tack Steam-Safe Tape", finish: "Tape", size: "Roll", price: "£4.49" },
                { name: "Small/Med Roller Kit (Kitchen/Bath)", finish: "Roller Kit", size: "Set", price: "£6.49" },
            ],
            rental_standard: [
                { name: "High-Opacity Touch-Up Filler", finish: "Filler", size: "1kg", price: "£6.99" },
                { name: "Decorator’s Caulk", finish: "Caulk", size: "White", price: "£2.49" },
                { name: "Masking Film (Floors/Kitchen Units)", finish: "Protection", size: "Pack", price: "£7.99" },
                { name: "Medium-Pile Roller Kit", finish: "Roller Kit", size: "Set", price: "£5.99" },
            ],
        },
    };

    // choose which finish definition to use, based on room type dropdown
    function pickPaintKeyForRoomType(typeVal) {
        if (typeVal === "kitchenbath") return "kitchen_bath";
        if (typeVal === "rentalreset") return "rental";
        return "scrubbable";
    }

    // same splitting logic as services.js
    function splitIntoTins(requestLitres, paintKey) {
        const paintDef = PRICEBOOK.paint[paintKey];
        if (!paintDef) return { cartLines: [], breakdownText: "-" };

        // turn tins map into array sorted big → small
        const tinEntries = Object.entries(paintDef.tins)
            .map(([sizeLabel, priceEach]) => {
                const litres = parseFloat(sizeLabel.replace("L", ""));
                return { sizeLabel, litres, priceEach };
            })
            .sort((a, b) => b.litres - a.litres);

        let remaining = Number(requestLitres);
        if (isNaN(remaining) || remaining <= 0) {
            return { cartLines: [], breakdownText: "-" };
        }

        const chosen = [];
        while (remaining > 0.0001) {
            // grab biggest tin that still fits, else smallest
            let pick = tinEntries.find(t => t.litres <= remaining);
            if (!pick) {
                pick = tinEntries[tinEntries.length - 1];
            }
            chosen.push(pick);
            remaining -= pick.litres;
        }

        // group same tin sizes for display
        const grouped = {};
        chosen.forEach(t => {
            grouped[t.sizeLabel] = (grouped[t.sizeLabel] || 0) + 1;
        });

        // build cart lines (each tin as its own line item @ 1 qty here)
        const cartLines = [];
        Object.entries(grouped).forEach(([sizeLabel, qty]) => {
            const paintName = paintDef.nameBase;
            const paintFinish = paintDef.finish;
            const priceEach = paintDef.tins[sizeLabel];

            for (let i = 0; i < qty; i++) {
                cartLines.push({
                    name: paintName,
                    finish: paintFinish,
                    size: sizeLabel,
                    price: "£" + Number(priceEach).toFixed(2),
                });
            }
        });

        const breakdownText = Object.entries(grouped)
            .map(([sizeLabel, qty]) => `${qty} × ${sizeLabel}`)
            .join(" + ");

        return { cartLines, breakdownText };
    }

    // stick paint tins + correct kit together into a final bundle
    function buildSystemSheetBundle(paintKey, paintCartLines) {
        const paintDef = PRICEBOOK.paint[paintKey];
        if (!paintDef) return { html: "-", bundle: [] };

        const kitItems = PRICEBOOK.kits[paintDef.kitKey] || [];
        const bundle = [...paintCartLines, ...kitItems];

        // summarise paint tins
        const summaryMap = {};
        paintCartLines.forEach(item => {
            const key = `${item.name} ${item.size} @ ${item.price}`;
            summaryMap[key] = (summaryMap[key] || 0) + 1;
        });

        let html = "";
        html += `<ul style="margin:0; padding-left:1rem; font-size:.8rem; line-height:1.4; color:var(--text-mid);">`;
        Object.entries(summaryMap).forEach(([desc, qty]) => {
            html += `<li>${qty} x ${desc}</li>`;
        });
        html += `</ul>`;

        if (kitItems.length) {
            html += `<div style="margin-top:.5rem; font-size:.75rem; color:var(--text-mid); font-weight:600;">Prep &amp; sundries:</div>`;
            html += `<ul style="margin:0; padding-left:1rem; color:var(--text-mid); font-size:.75rem; line-height:1.4;">`;
            kitItems.forEach(k => {
                html += `<li>${k.name} (${k.size})</li>`;
            });
            html += `</ul>`;
        }

        return { html, bundle };
    }

    // We’ll store the last bundle so we can add it to basket
    let lastBundle = [];

    // calculate handler
    calcBtn.addEventListener("click", () => {
        const A = parseFloat(wallAEl.value);
        const B = parseFloat(wallBEl.value);
        const H = parseFloat(heightEl.value);
        const typeVal = roomTypeEl.value;

        if (isNaN(A) || isNaN(B) || isNaN(H) || A <= 0 || B <= 0 || H <= 0) {
            alert("Please enter valid room sizes.");
            return;
        }

        // surface area of 4 walls (ignore doors/windows) = (2*A + 2*B) * H
        const wallAreaSingleCoat = (2 * A + 2 * B) * H;

        // assume 2 coats
        const totalCoatArea = wallAreaSingleCoat * 2;

        // assume ~12 m² per litre per coat for trade matt
        // => litresNeeded = totalArea / 12
        const litresNeeded = totalCoatArea / 12;

        // choose finish based on room type
        const paintKey = pickPaintKeyForRoomType(typeVal);

        // split that into tins
        const { cartLines, breakdownText } = splitIntoTins(litresNeeded, paintKey);

        // build full system (paint tins + filler/caulk/tape kit)
        const { html, bundle } = buildSystemSheetBundle(paintKey, cartLines);

        lastBundle = bundle; // stash so we can add to basket

        // update UI
        if (litreBreakdownTextEl) {
            litreBreakdownTextEl.innerHTML =
                `Approx ${litresNeeded.toFixed(1)}L total &nbsp;→&nbsp; ${breakdownText}`;
        }
        if (systemSheetListEl) {
            systemSheetListEl.innerHTML = html;
        }

        if (resultBlock) {
            resultBlock.style.display = "block";
        }
    });

    // add full system to basket handler
    if (addEstimateToBasketBtn) {
        addEstimateToBasketBtn.addEventListener("click", () => {
            if (!lastBundle || !lastBundle.length) {
                alert("Please calculate first.");
                return;
            }

            if (!window.PainterProCart || !window.PainterProCart.addItemsToCart) {
                alert("Basket system not ready.");
                return;
            }

            window.PainterProCart.addItemsToCart(lastBundle);

            // feedback
            addEstimateToBasketBtn.textContent = "Added ✓";
            addEstimateToBasketBtn.disabled = true;
            setTimeout(() => {
                addEstimateToBasketBtn.textContent = "Add full system to basket";
                addEstimateToBasketBtn.disabled = false;
            }, 1200);

            if (window.openCartPreview) {
                window.openCartPreview();
            }
        });
    }
});
