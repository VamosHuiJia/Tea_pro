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

// Navigation
$(function () {
    // Ẩn hiện navigation
    $(".navbar").hidescroll();

    // Hamburger menu
    const toggleBtn = $("#toggle_btn");
    const dropdownMenu = $(".dropdown-menu");

    toggleBtn.click(() => {
        dropdownMenu.toggleClass("open");
    });
});

// Đổi qua các tab Products
$(function () {
    // Active tab cho <li> đầu
    $("li:first").addClass("activeTab");

    // đổi màu Active tab
    $("li").on("click", function () {
        $("li").removeClass("activeTab");
        $('div[id="products-tabs"] ul .r-tabs-state-active').addClass("activeTab");
    });

    $("#products-tabs").responsiveTabs({
        animation: "fade",
    });
});

// Slicker sản phẩm
$(function() {
    $(".slider").slick({
        autoplay: true,
        dots: true,
    })
})