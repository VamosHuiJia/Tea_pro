import { partnerLogos, productList, partnerLogoBasePath } from "./data.js";

// Hiển thị tất cả logo Partner
$(function () {
    const container = document.getElementById("partner-logo-list");

    for (let i = 0; i < 2; i++) {
        partnerLogos.forEach((logo) => {
            const img = document.createElement("img");

            img.src = partnerLogoBasePath + logo.fileName;
            img.alt = logo.alt;
            img.classList.add("logo-ticker-image");
            container.appendChild(img);
        });
    }
});
