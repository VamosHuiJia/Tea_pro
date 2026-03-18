import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import AdminLayout from "./pages/Admin/layout/AdminLayout";
import Dashboard from "./pages/Admin/pages/Dashboard";
import Brand from "./pages/Admin/pages/Brands/BrandLayout";

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const isAdminPage = location.pathname.startsWith("/admin");

  const showSiteChrome =
    (!isAuthPage && !isAdminPage) || Boolean(backgroundLocation);

  return (
    <>
      {showSiteChrome && <Header />}

      {!isAdminPage && showSiteChrome && (
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

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="brands" element={<Brand />} />
        </Route>
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