import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "../src/styles/showHideNav.css"

import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({                         
  anchorPlacement: 'top-center',        
});

window.addEventListener('load', () => {
  AOS.refresh();
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
