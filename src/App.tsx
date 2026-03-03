import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from "./components/Header"
import Footer from "./components/Footer";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />   

        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
