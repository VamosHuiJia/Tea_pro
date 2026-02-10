import $ from "jquery";

export type ProductTabOptions = {
    rootSelector?: string;     // mặc định: #products-tabs
    defaultTab?: string;       // mặc định: #matcha
    panelIds?: string[];       // mặc định 4 tab hiện tại
    fadeMs?: number;           // thời gian fade
};

export function initProductTabs(opts: ProductTabOptions = {}) {
    const rootSelector = opts.rootSelector ?? "#products-tabs";
    const defaultTab = opts.defaultTab ?? "#matcha";
    const panelIds = opts.panelIds ?? ["#matcha", "#whiteTea", "#oolongTea", "#blackTea"];
    const fadeMs = opts.fadeMs ?? 180;

    const $root = $(rootSelector);
    if ($root.length === 0) return () => { };

    const $panels = $root.find(panelIds.join(","));

    const normalizeHash = (hash?: string) => {
        if (!hash) return defaultTab;
        return panelIds.includes(hash) ? hash : defaultTab;
    };

    const showTab = (hashRaw?: string) => {
        const hash = normalizeHash(hashRaw);

        // hide all first
        $panels.stop(true, true).hide();

        // show target
        const $target = $root.find(hash);
        $target.stop(true, true).fadeIn(fadeMs);

        // active class: chỉ set cho li có <a>, bỏ qua <li>|</li>
        $root.find("ul li").removeClass("activeTab");
        $root.find(`ul li a[href="${hash}"]`).closest("li").addClass("activeTab");
    };

    // init
    $panels.hide();
    showTab(normalizeHash(window.location.hash));

    const onClick = (e: any) => {
        e.preventDefault();
        const hash = $(e.currentTarget).attr("href") as string;
        if (hash && hash.startsWith("#")) window.history.replaceState(null, "", hash);
        showTab(hash);
    };

    const onHashChange = () => showTab(window.location.hash);

    // bind events (scope trong root)
    $root.on("click", "a.tab-link", onClick);
    window.addEventListener("hashchange", onHashChange);

    // cleanup cho React unmount
    return () => {
        $root.off("click", "a.tab-link", onClick);
        window.removeEventListener("hashchange", onHashChange);
    };
}
