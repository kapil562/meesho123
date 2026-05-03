// App.jsx
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './page/Dashbord';
import ProductDetail from './page/ProductDetail';
import AddressPage from './page/AddressPage';
import PaymentPage from './page/PaymentPage';
import ReactPixel from 'react-facebook-pixel';

// Yeh chhota wrapper banaya hai taaki route change detect ho
function PixelTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactPixel.pageView(); // Har route change pe PageView track karega
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    const pixelId = '834554985820552';
    const options = {
      autoConfig: true,
      debug: false,
    };
    ReactPixel.init(pixelId, null, options);
    ReactPixel.pageView(); // First page view track karega
  }, []);

  return (
    <div>
      <HashRouter>
        {/* Yeh tracker component route changes observe karega */}
        <PixelTracker />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/AddressPage/:id" element={<AddressPage />} />
          <Route path="/PaymentPage/:id" element={<PaymentPage />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
