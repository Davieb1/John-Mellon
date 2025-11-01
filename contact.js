// contact.js
// Autofill contact form using query params from the estimator

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    const room = params.get("room") || "";
    const area = params.get("area") || "";
    const estStd = params.get("est_standard") || "";
    const estHer = params.get("est_heritage") || "";

    // Hidden inputs (so you receive them in the email)
    const roomField = document.getElementById("calc_room");
    const areaField = document.getElementById("calc_area");
    const stdField = document.getElementById("calc_est_standard");
    const herField = document.getElementById("calc_est_heritage");

    if (roomField) roomField.value = room;
    if (areaField) areaField.value = area;
    if (stdField) stdField.value = estStd;
    if (herField) herField.value = estHer;

    // Prefill the "What needs done?" textarea to save them work
    const detailsBox = document.getElementById("details");
    if (detailsBox && (room || area || estStd || estHer)) {
        const lines = [];
        if (room) lines.push("Room: " + room);
        if (area) lines.push("Wall area: " + area);
        if (estStd) lines.push("Estimated total (Standard finish): " + estStd);
        if (estHer) lines.push("Estimated total (Heritage finish): " + estHer);
        lines.push("");
        lines.push("Other notes: ");

        detailsBox.value = lines.join("\n");
    }
});
