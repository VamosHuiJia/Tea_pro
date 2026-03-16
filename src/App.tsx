import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const showSiteChrome = !isAuthPage || Boolean(backgroundLocation);

  return (
    <>
      {showSiteChrome && <Header />}

      {showSiteChrome && (
        <main>
          <Routes location={backgroundLocation || location}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </main>
      )}

      {showSiteChrome && <Footer />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
