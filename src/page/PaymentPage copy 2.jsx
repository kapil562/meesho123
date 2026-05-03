import React, { useState, useMemo } from "react";
import { ChevronDown, CreditCard, Wallet, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const MERCHANT_UPI_ID = "0792603A0247061.bqr@kotak"; // Your UPI ID
const COUNTRY_CURRENCY = "INR";
const API_BASE = "https://meesho-backend-2-jkuy.onrender.com/api"; // Base URL for your API

const PaymentPage = () => {
  const location = useLocation();
  const { product, selectedSize, quantity, finalPrice } = location.state || {};

  const [selectedPayment, setSelectedPayment] = useState("");
  const [isReselling, setIsReselling] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No Product Found
      </div>
    );
  }

  // ✅ Common UPI params with dynamic amount
  const baseParams = useMemo(() => {
    const tid = `ORDER:${product.id}`;
    return new URLSearchParams({
      pa: MERCHANT_UPI_ID,
      pn: "MerchantName",
      am: finalPrice?.toString() || "0",
      cu: COUNTRY_CURRENCY,
      tid,
    }).toString();
  }, [finalPrice, product.id]);

  const paymentLinks = {
    phonepe: `phonepe://pay?${baseParams}`,
    paytm: `paytmmp://pay?${baseParams}`,
  };

  const handlePayClick = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method first!");
      return;
    }

    if (selectedPayment === "paytm") {
      alert("Paytm is currently unavailable. Please use PhonePe.");
      return;
    }

    // ✅ Log the transaction to the backend
    try {
      await axios.post(`${API_BASE}/create-transaction/`, {
        product_name: product.name,
        quantity: quantity,
        amount: finalPrice,
        payment_method: selectedPayment,
      });
      console.log("Transaction saved successfully!");

      // ✅ Redirect to UPI payment
      if (paymentLinks[selectedPayment]) {
        window.location.href = paymentLinks[selectedPayment];
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Error saving transaction to backend!");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Payment Methods Section */}
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Select Payment Method
          </h2>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <div>
              <div className="font-semibold">100% SAFE</div>
              <div>PAYMENTS</div>
            </div>
          </div>
        </div>

        {/* Online Payment Offer Banner */}
        <div className="mx-4 mt-4 bg-pink-50 border border-pink-200 rounded-lg p-4">
          <p className="text-pink-600 font-semibold">
            Pay online & get EXTRA ₹25 off
          </p>
        </div>

        {/* Pay Online Section */}
        <div className="p-4">
          <p className="text-xs text-gray-500 font-semibold mb-3">PAY ONLINE</p>

          {/* PhonePe */}
          <div className="border rounded-lg mb-3">
            <button
              onClick={() =>
                setSelectedPayment(selectedPayment === "phonepe" ? "" : "phonepe")
              }
              className={`w-full flex items-center justify-between p-4 ${
                selectedPayment === "phonepe" ? "bg-pink-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="https://imgs.search.brave.com/ocFAMm1R4ib-9sZzXXebk2hCfXxFatiRTXqcEkFfNdg/rs:fit:32:32:1:0/g:ce/aHR0cDovL2Zhdmlj/b25zLnNlYXJjaC5i/cmF2ZS5jb20vaWNv/bnMvOGU4Y2QxMDk4/Zjc2NTE0N2EyZWJh/ZGZkNjIyYzM1N2U0/YjJlOWMwZTkzNzk2/YTI5Mjg0M2Y5NWU0/YzdkMTE4Yy93d3cu/cGhvbmVwZS5jb20v"
                    alt="PhonePe"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-gray-800">PhonePe</span>
              </div>
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "phonepe"}
                readOnly
                className="w-5 h-5"
              />
            </button>
          </div>

          {/* Paytm */}
          <div className="border rounded-lg mb-3">
            <button
              onClick={() =>
                setSelectedPayment(selectedPayment === "paytm" ? "" : "paytm")
              }
              className={`w-full flex items-center justify-between p-4 ${
                selectedPayment === "paytm" ? "bg-pink-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="https://1000logos.net/wp-content/uploads/2023/03/Paytm-logo.png"
                    alt="Paytm"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-gray-800">Paytm</span>
              </div>
              <input
                type="radio"
                name="payment"
                checked={selectedPayment === "paytm"}
                readOnly
                className="w-5 h-5"
              />
            </button>

            {/* ✅ Warning message if Paytm selected */}
            {selectedPayment === "paytm" && (
              <p className="text-xs text-red-500 px-4 py-2">
                Paytm currently unavailable. Please use PhonePe.
              </p>
            )}
          </div>

          {/* Debit/Credit Cards (disabled) */}
          <div className="border rounded-lg mb-3 bg-gray-50">
            <button className="w-full flex items-center justify-between p-4 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-medium text-gray-800">
                  Debit/Credit Cards ( Not Available )
                </span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Reselling Section */}
        <div className="px-4 pb-4 border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Reselling the Order?
              </h3>
              <p className="text-xs text-gray-500">
                Click on 'Yes' to add Final Price
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsReselling(false)}
                className={`px-5 py-2 rounded-full border-2 font-medium text-sm ${
                  !isReselling
                    ? "border-pink-500 text-pink-500"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                No
              </button>
              <button
                onClick={() => setIsReselling(true)}
                className={`px-5 py-2 rounded-full border-2 font-medium text-sm ${
                  isReselling
                    ? "border-pink-500 bg-pink-500 text-white"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>

        {/* Price Details */}
        <div className="px-4 pb-4 border-t pt-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Price Details ( {quantity} item{quantity > 1 ? "s" : ""} )
          </h3>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Total Product Price</span>
            <span className="text-sm font-medium text-gray-800">+ ₹{finalPrice}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-base font-semibold text-gray-800">Order Total</span>
            <span className="text-lg font-bold text-gray-900">₹{finalPrice}</span>
          </div>
        </div>

        {/* Pay Button */}
        <div className="p-4 border-t">
          <button
            onClick={handlePayClick}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 rounded-lg transition-colors"
          >
            PROCEED TO PAY ₹{finalPrice}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
