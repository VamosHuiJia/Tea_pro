async function loadHome() {
    const res = await fetch('/src/pages/Home.html');
    const html = await res.text();

    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = html;
}

loadHome();
