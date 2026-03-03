import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "../src/styles/showHideNav.css"

import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
  easing: 'ease-out',
  offset: 120,
});

const refreshAOS = () => {
  AOS.refresh();        
};

window.addEventListener('load', refreshAOS);           

setTimeout(refreshAOS, 600);

// Refresh khi scroll lần đầu 
let hasScrolled = false;
const onFirstScroll = () => {
  if (!hasScrolled) {
    hasScrolled = true;
    refreshAOS();
    window.removeEventListener('scroll', onFirstScroll);
  }
};
window.addEventListener('scroll', onFirstScroll, { passive: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
