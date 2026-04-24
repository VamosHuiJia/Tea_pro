import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ConfirmProvider } from "./contexts/ConfirmContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import LoadingPage from "./components/LoadingPage";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/Products/ui/ProductDetail";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Profile/Profile";
import Cart from "./pages/Cart/CartLayout";
import Checkout from "./pages/Payment/Checkout";
import PaymentPage from "./pages/Payment/Payment";

import AdminLayout from "./pages/Admin/layout/AdminLayout";
import Dashboard from "./pages/Admin/pages/Dashboard";
import Brand from "./pages/Admin/pages/Brands/BrandLayout";
import Category from "./pages/Admin/pages/Categories/CategoryLayout";
import Product from "./pages/Admin/pages/Products/ProductLayout";
import Customer from "./pages/Admin/pages/Customers/CustomerLayout";
import Employees from "./pages/Admin/pages/Employees/EmployeeLayout";
import Order from "./pages/Admin/pages/Orders/OrderLayout";
import Payment from "./pages/Admin/pages/Payment/PaymentLayout";


function AppRoutes() {
  const { isLoading } = useAuth();
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;

  if (isLoading) {
    return <LoadingPage />;
  }

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
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          </Routes>
        </main>
      )}

      {showSiteChrome && <Footer />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin", "staff"]}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="brands" element={<Brand />} />
          <Route path="categories" element={<Category />} />
          <Route path="products" element={<Product />} />
          <Route path="customers" element={<Customer />} />
          <Route path="employees" element={<Employees />} />
          <Route path="orders" element={<Order />} />
          <Route path="payments" element={<Payment />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <ConfirmProvider>
            <BrowserRouter>
              <ScrollToTop />
              <AppRoutes />
            </BrowserRouter>
          </ConfirmProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;