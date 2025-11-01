// services.js
// Builds dynamic system sheets per selection, shows preview, and adds bundle to basket.

document.addEventListener("DOMContentLoaded", () => {
    if (!window.PainterProCart) {
        console.warn("PainterProCart not found. Make sure cart.js loads first.");
    }

    // ===== PRICE / KIT DEFINITIONS =====
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
            heritage: {
                label: "Dulux Heritage Velvet Matt (luxury soft-touch)",
                nameBase: "Dulux Heritage Velvet Matt - Custom Colour",
                finish: "Velvet Matt",
                tins: {
                    "10L": 139.99,
                    "5L": 79.99,
                    "2.5L": 39.59,
                    "1L": 19.99,
                },
                kitKey: "interior_heritage",
            },
            eggshell: {
                label: "Low-Yellowing Eggshell (woodwork / trim)",
                nameBase: "Low-Yellowing Eggshell (Woodwork)",
                finish: "Eggshell (Woodwork)",
                tins: {
                    "2.5L": 34.99,
                    "1L": 24.99,
                },
                kitKey: "interior_eggshell",
            },
            masonry: {
                label: "Weatherproof Masonry Paint (Smooth)",
                nameBase: "Weatherproof Masonry Paint (Smooth)",
                finish: "Masonry Exterior",
                tins: {
                    "10L": 99.99,
                    "5L": 59.99,
                    "2.5L": 32.99,
                    "1L": 14.99,
                },
                kitKey: "exterior_masonry",
            },
            trim_ext: {
                label: "Exterior Satin / Gloss for Doors & Trims",
                nameBase: "Exterior Satin / Gloss",
                finish: "Exterior Trim",
                tins: {
                    "2.5L": 36.99,
                    "1L": 24.99,
                },
                kitKey: "exterior_trim",
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
            stainblock: {
                label: "Nicotine / Leak Stain Block + Cover Coat",
                nameBase: "Stain Block / Nicotine Sealer",
                finish: "Stain Block",
                tins: {
                    "5L": 64.99,
                    "2.5L": 36.99,
                    "1L": 19.99,
                },
                kitKey: "rental_stainblock",
            },
        },

        kits: {
            interior_scrubbable: [
                { name: "Toupret Interior Filler", finish: "Filler", size: "1kg", price: "£7.99" },
                { name: "Decorator’s Caulk", finish: "Caulk", size: "380ml", price: "£2.49" },
                { name: "Low-Tack Masking Tape", finish: "Tape", size: "50m", price: "£3.99" },
                { name: "Roller Sleeves + Tray Liners", finish: "Roller Kit", size: "Pack", price: "£5.99" },
            ],
            interior_heritage: [
                { name: "Toupret Fine Surface Filler", finish: "Fine Filler", size: "1kg", price: "£8.49" },
                { name: "Decorator’s Caulk (Fine Line)", finish: "Caulk", size: "White", price: "£2.99" },
                { name: "Precision Masking Tape (Heritage-safe)", finish: "Tape", size: "Low-tack", price: "£4.49" },
                { name: "Mini Roller Kit (Velvet Finish)", finish: "Roller Kit", size: "Pack", price: "£6.49" },
            ],
            interior_eggshell: [
                { name: "Wood Filler / Frame Repair", finish: "Wood Filler", size: "Tube", price: "£5.99" },
                { name: "Fine Caulk for Skirting & Architrave", finish: "Caulk", size: "White", price: "£2.99" },
                { name: "Detail Brush / Small Roller Kit", finish: "Brush Kit", size: "Set", price: "£5.49" },
                { name: "Low-Tack Tape for Woodwork", finish: "Tape", size: "25mm", price: "£3.49" },
            ],

            exterior_masonry: [
                { name: "Exterior Masonry Filler", finish: "Filler", size: "1kg", price: "£8.99" },
                { name: "Frame Sealant / Exterior Caulk", finish: "Sealant", size: "380ml", price: "£3.49" },
                { name: "Weather Masking Film & Tape", finish: "Exterior Tape", size: "Roll", price: "£6.99" },
                { name: "Long-Pile Masonry Roller Kit", finish: "Roller Kit", size: "Set", price: "£9.99" },
            ],
            exterior_trim: [
                { name: "Exterior Wood Filler", finish: "Wood Filler", size: "Tube", price: "£6.49" },
                { name: "Exterior Flexible Caulk", finish: "Sealant", size: "White", price: "£3.99" },
                { name: "Precision Exterior Masking Tape", finish: "Tape", size: "UV resistant", price: "£4.99" },
                { name: "Brush / Small Roller Trim Kit", finish: "Trim Kit", size: "Set", price: "£6.99" },
            ],

            rental_standard: [
                { name: "High-Opacity Touch-Up Filler", finish: "Filler", size: "1kg", price: "£6.99" },
                { name: "Decorator’s Caulk", finish: "Caulk", size: "White", price: "£2.49" },
                { name: "Masking Film (Floors/Kitchen Units)", finish: "Protection", size: "Pack", price: "£7.99" },
                { name: "Medium-Pile Roller Kit", finish: "Roller Kit", size: "Set", price: "£5.99" },
            ],
            rental_stainblock: [
                { name: "Nicotine / Leak Stain Block Primer", finish: "Blocker", size: "1L", price: "£11.99" },
                { name: "High-Opacity Touch-Up Filler", finish: "Filler", size: "1kg", price: "£6.99" },
                { name: "Masking Film (Floors/Kitchen Units)", finish: "Protection", size: "Pack", price: "£7.99" },
                { name: "Roller Kit for Cover Coat", finish: "Roller Kit", size: "Set", price: "£5.99" },
            ],

            taping: [
                { name: "Jointing Tape (Paper/Fibre)", finish: "Joint Tape", size: "Roll", price: "£4.99" },
                { name: "Flex Corner / Internal Corner Tape", finish: "Corner Tape", size: "Roll", price: "£6.99" },
                { name: "Ready-Mix Joint Compound", finish: "Joint Compound", size: "5kg Tub", price: "£14.99" },
                { name: "Fine Surface Skim Filler", finish: "Fine Filler", size: "1kg", price: "£7.49" },
                { name: "Sanding Mesh Sheets + Pole Head", finish: "Sanding Kit", size: "Pack", price: "£12.99" },
                { name: "Low-Tack Tape & Floor Protection", finish: "Protection", size: "Roll/Sheet Pack", price: "£9.99" },
            ],
        },
    };

    // ===== HELPERS =====
    function splitIntoTins(requestLitres, finishKey) {
        const paintDef = PRICEBOOK.paint[finishKey];
        if (!paintDef) {
            return { cartLines: [], breakdownText: "-" };
        }

        // turn litres into tin selection using biggest-first greedy
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
            let pick = tinEntries.find(t => t.litres <= remaining);
            if (!pick) {
                pick = tinEntries[tinEntries.length - 1];
            }
            chosen.push(pick);
            remaining -= pick.litres;
        }

        // group same size
        const grouped = {};
        chosen.forEach(t => {
            grouped[t.sizeLabel] = (grouped[t.sizeLabel] || 0) + 1;
        });

        // build cart lines
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

        // nice UI summary
        const breakdownText = Object.entries(grouped)
            .map(([sizeLabel, qty]) => `${qty} × ${sizeLabel}`)
            .join(", ");

        return { cartLines, breakdownText };
    }

    function buildSystemSheet(finishKey, paintCartLines) {
        const paintDef = PRICEBOOK.paint[finishKey];
        if (!paintDef) return { html: "-", bundle: [] };

        const kitItems = PRICEBOOK.kits[paintDef.kitKey] || [];
        const bundle = [...paintCartLines, ...kitItems];

        let html = "";

        // paint tins summary
        if (paintCartLines.length) {
            const summaryMap = {};
            paintCartLines.forEach(item => {
                const key = `${item.name} ${item.size} @ ${item.price}`;
                summaryMap[key] = (summaryMap[key] || 0) + 1;
            });

            html += `<ul style="margin:0; padding-left:1rem;">`;
            Object.entries(summaryMap).forEach(([desc, qty]) => {
                html += `<li>${qty} x ${desc}</li>`;
            });
            html += `</ul>`;
        }

        // kit extras
        if (kitItems.length) {
            html += `<div style="margin-top:.5rem; font-size:.75rem; color:var(--text-mid); font-weight:600;">Prep &amp; sundries:</div>`;
            html += `<ul style="margin:0; padding-left:1rem; color:var(--text-mid);">`;
            kitItems.forEach(k => {
                html += `<li>${k.name} (${k.size})</li>`;
            });
            html += `</ul>`;
        }

        return { html, bundle };
    }

    // ===== CORE WIRING =====
    function wireCalcBlock({
        litresInputId,
        finishSelectId,
        tinBreakdownId,
        systemSheetId,
        addBtnId,
    }) {
        const litresEl = document.getElementById(litresInputId);
        const finishEl = document.getElementById(finishSelectId);
        const tinOutEl = document.getElementById(tinBreakdownId);
        const sheetOutEl = document.getElementById(systemSheetId);
        const addBtnEl = document.getElementById(addBtnId);

        if (!litresEl || !finishEl || !tinOutEl || !sheetOutEl || !addBtnEl) return;

        function recalcAndReturnBundle() {
            const litresVal = parseFloat(litresEl.value);
            const finishKey = finishEl.value;

            const { cartLines, breakdownText } = splitIntoTins(litresVal, finishKey);
            const { html, bundle } = buildSystemSheet(finishKey, cartLines);

            tinOutEl.textContent = breakdownText || "-";
            sheetOutEl.innerHTML = html || "-";

            return bundle;
        }

        // live preview update
        litresEl.addEventListener("input", recalcAndReturnBundle);
        finishEl.addEventListener("change", recalcAndReturnBundle);

        // initial UI
        recalcAndReturnBundle();

        // add to basket
        addBtnEl.addEventListener("click", () => {
            const bundle = recalcAndReturnBundle();

            console.log("Add system clicked for block", addBtnId, bundle);

            if (!bundle.length) {
                alert("Please enter litres first.");
                return;
            }
            if (!window.PainterProCart || !window.PainterProCart.addItemsToCart) {
                alert("Basket system not ready.");
                return;
            }

            window.PainterProCart.addItemsToCart(bundle);

            // reset litres for next room/job
            litresEl.value = "";
            recalcAndReturnBundle();
        });
    }

    // wire each block
    wireCalcBlock({
        litresInputId: "litresInterior",
        finishSelectId: "finishInterior",
        tinBreakdownId: "interiorTinBreakdown",
        systemSheetId: "interiorSystemSheet",
        addBtnId: "addInteriorSystem",
    });

    wireCalcBlock({
        litresInputId: "litresExterior",
        finishSelectId: "finishExterior",
        tinBreakdownId: "exteriorTinBreakdown",
        systemSheetId: "exteriorSystemSheet",
        addBtnId: "addExteriorSystem",
    });

    wireCalcBlock({
        litresInputId: "litresRental",
        finishSelectId: "finishRental",
        tinBreakdownId: "rentalTinBreakdown",
        systemSheetId: "rentalSystemSheet",
        addBtnId: "addRentalSystem",
    });

    // taping kit (fixed list, no litres selector)
    const tapingSheetEl = document.getElementById("tapingSystemSheet");
    const addTapingBtn = document.getElementById("addTapingSystem");

    if (tapingSheetEl) {
        const tapingKit = PRICEBOOK.kits.taping || [];
        let tapingHtml = `<ul style="margin:0; padding-left:1rem; color:var(--text-mid);">`;
        tapingKit.forEach(k => {
            tapingHtml += `<li>${k.name} (${k.size})</li>`;
        });
        tapingHtml += `</ul>`;
        tapingSheetEl.innerHTML = tapingHtml;
    }

    if (addTapingBtn) {
        addTapingBtn.addEventListener("click", () => {
            const tapingKit = PRICEBOOK.kits.taping || [];
            if (!tapingKit.length) {
                alert("No taping kit defined.");
                return;
            }
            if (!window.PainterProCart || !window.PainterProCart.addItemsToCart) {
                alert("Basket system not ready.");
                return;
            }
            window.PainterProCart.addItemsToCart(tapingKit);
        });
    }
});
