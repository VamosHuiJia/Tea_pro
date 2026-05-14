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

import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "461541633169-c9c38epi84dqqa03544lr87pfis91sej.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
