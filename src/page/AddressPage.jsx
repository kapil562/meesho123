import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../component/Header";

const AddressPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, selectedSize, quantity, finalPrice } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    address: "",
  });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Product not found
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    // ⚡ No validation required now
    navigate(`/PaymentPage/${product.id}`, {
      state: { product, selectedSize, quantity, finalPrice, formData },
    });
  };

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>

        {/* Product Info */}
        <div className="border rounded-lg p-4 flex items-center gap-4 mb-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 object-contain border rounded"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-800 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600">
              Size: {selectedSize} • Qty: {quantity}
            </p>
            <p className="font-semibold">₹{finalPrice}</p>
          </div>
        </div>

        {/* Address Form (optional now) */}
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name (Optional)"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number (Optional)"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode (Optional)"
            value={formData.pincode}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City (Optional)"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
            <input
              type="text"
              name="state"
              placeholder="State (Optional)"
              value={formData.state}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <textarea
            name="address"
            placeholder="Full Address (Optional)"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded p-2 h-24"
          />
        </div>

        {/* Continue Button */}
        <div className="mt-6">
          <button
            onClick={handleContinue}
            className="w-full bg-pink-600 text-white py-2 rounded-lg font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;
