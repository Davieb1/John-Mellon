// estimate.js
// Paint + labour estimate calculator + add-to-basket + pass data to contact form
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("calcBtn");
    if (!btn) return; // not on this page

    const roomTypeInput = document.getElementById("roomType");
    const widthAInput = document.getElementById("widthA");
    const widthBInput = document.getElementById("widthB");
    const heightInput = document.getElementById("height");

    const areaOut = document.getElementById("estArea");
    const litresOut = document.getElementById("estLitres");
    const stdOut = document.getElementById("estStandard");
    const herOut = document.getElementById("estHeritage");
    const labourOut = document.getElementById("estLabour");
    const totalStdOut = document.getElementById("estTotalStandard");
    const totalHerOut = document.getElementById("estTotalHeritage");

    const bookLink = document.getElementById("estBookLink");
    const resultPanel = document.getElementById("estimateResult");

    const addStdBtn = document.getElementById("addStdToCart");
    const addHerBtn = document.getElementById("addHerToCart");

    // we keep the latest calc so we know how many tins to add
    let calcState = null;

    // helper: reset calculator after adding to basket
    function resetEstimateUI() {
        // clear inputs
        roomTypeInput.value = "Living room / Bedroom";
        widthAInput.value = "";
        widthBInput.value = "";
        heightInput.value = "";

        // clear output text
        areaOut.textContent = "";
        litresOut.textContent = "";
        stdOut.textContent = "";
        herOut.textContent = "";
        labourOut.textContent = "";
        totalStdOut.textContent = "";
        totalHerOut.textContent = "";

        // hide result panel
        resultPanel.style.display = "none";

        // clear calc state
        calcState = null;
    }

    btn.addEventListener("click", () => {
        const A = parseFloat(widthAInput.value);
        const B = parseFloat(widthBInput.value);
        const H = parseFloat(heightInput.value);
        const roomType = roomTypeInput.value;

        if (!A || !B || !H) {
            alert("Please enter wall lengths and height.");
            return;
        }

        // 1. wall area (2 coats on all 4 walls)
        const singleCoatArea = 2 * (A + B) * H;   // m² one coat
        const twoCoatArea = singleCoatArea * 2;   // two coats

        // 2. litres
        const coveragePerLitre = 13; // m² per L
        const litresNeeded = twoCoatArea / coveragePerLitre;

        // round up to nearest 0.5L
        const roundedLitres = Math.ceil(litresNeeded * 2) / 2;

        // tins of 2.5L
        const tinSizeL = 2.5;
        const tinsNeeded = Math.ceil(roundedLitres / tinSizeL);

        // 3. material cost
        const priceStandardPerTin = 29.99; // Scrubbable Matt 2.5L
        const priceHeritagePerTin = 39.59; // Dulux Heritage Velvet Matt 2.5L

        const standardMaterials = tinsNeeded * priceStandardPerTin;
        const heritageMaterials = tinsNeeded * priceHeritagePerTin;

        // 4. labour by room type
        let labourCost = 140; // living/bed
        if (roomType.includes("Hall")) {
            labourCost = 180;
        } else if (roomType.includes("Kitchen") || roomType.includes("Bathroom")) {
            labourCost = 160;
        }

        // 5. totals (supply & apply)
        const totalStandard = standardMaterials + labourCost;
        const totalHeritage = heritageMaterials + labourCost;

        // 6. strings
        const areaText = twoCoatArea.toFixed(1) + " m² (2 coats on walls)";
        const litresText = roundedLitres.toFixed(1) + " L total (" +
            tinsNeeded + " × 2.5L tins)";

        const stdText = "Approx £" + standardMaterials.toFixed(2) +
            " in Scrubbable Matt (" + tinsNeeded + " tin" +
            (tinsNeeded === 1 ? "" : "s") + ")";
        const herText = "Approx £" + heritageMaterials.toFixed(2) +
            " in Dulux Heritage Velvet Matt (" + tinsNeeded + " tin" +
            (tinsNeeded === 1 ? "" : "s") + ")";

        const labourText = "About £" + labourCost.toFixed(0) +
            " labour for " + roomType + ".";

        const totalStdText = "Approx £" + totalStandard.toFixed(2) +
            " total (materials + labour, Scrubbable Matt).";

        const totalHerText = "Approx £" + totalHeritage.toFixed(2) +
            " total (materials + labour, Dulux Heritage).";

        // 7. inject
        areaOut.textContent = areaText;
        litresOut.textContent = litresText;
        stdOut.textContent = stdText;
        herOut.textContent = herText;
        labourOut.textContent = labourText;
        totalStdOut.textContent = totalStdText;
        totalHerOut.textContent = totalHerText;

        // 8. contact link (prefill contact form)
        const params = new URLSearchParams({
            room: roomType,
            area: twoCoatArea.toFixed(1) + "m2",
            est_standard: "£" + totalStandard.toFixed(2),
            est_heritage: "£" + totalHeritage.toFixed(2),
        });
        if (bookLink) {
            bookLink.href = "contact.html?" + params.toString();
        }

        // 9. save calc state so we know what to add to cart
        calcState = {
            tinsNeeded,
            standardItem: {
                name: "Scrubbable Matt - High Durability",
                finish: "Scrubbable Matt",
                size: "2.5L",
                price: "£29.99"
            },
            heritageItem: {
                name: "Dulux Heritage Velvet Matt - Custom Colour",
                finish: "Velvet Matt",
                size: "2.5L",
                price: "£39.59"
            }
        };

        // 10. show result panel
        resultPanel.style.display = "block";
    });

    // helper to add N tins to basket using global cart API
    function addMultipleToCart(baseItem, count) {
        if (!window.PainterProCart || !baseItem || !count) return;
        for (let i = 0; i < count; i++) {
            window.PainterProCart.addItemToCart(baseItem);
        }
    }

    if (addStdBtn) {
        addStdBtn.addEventListener("click", () => {
            if (!calcState) {
                alert("Calculate first.");
                return;
            }
            addMultipleToCart(calcState.standardItem, calcState.tinsNeeded);

            // RESET THE CALCULATOR for next room
            resetEstimateUI();
        });
    }

    if (addHerBtn) {
        addHerBtn.addEventListener("click", () => {
            if (!calcState) {
                alert("Calculate first.");
                return;
            }
            addMultipleToCart(calcState.heritageItem, calcState.tinsNeeded);

            // RESET THE CALCULATOR for next room
            resetEstimateUI();
        });
    }
});
