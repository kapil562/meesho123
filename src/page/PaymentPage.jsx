import React, { useState, useMemo } from "react";
import { ChevronDown, CreditCard, Wallet, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";

const MERCHANT_UPI_ID = "paytm.s1jy71g@pty"; // 🔴 CHANGE THIS (use valid UPI)
const COUNTRY_CURRENCY = "INR";

const PaymentPage = () => {
  const location = useLocation();
  const { product, selectedSize, quantity, finalPrice } = location.state || {};

  const [selectedPayment, setSelectedPayment] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No Product Found
      </div>
    );
  }

  // ✅ UPI Params (Improved)
  const baseParams = useMemo(() => {
    const txnId = `ORDER_${Date.now()}`;
    return new URLSearchParams({
      pa: MERCHANT_UPI_ID,
      pn: "My Store",
      am: finalPrice?.toString() || "1",
      cu: COUNTRY_CURRENCY,
      tn: `Order ${product.id}`, // note
      tr: txnId, // transaction ref
    }).toString();
  }, [finalPrice, product.id]);

  // ✅ Payment Links
  const paymentLinks = {
    phonepe: `phonepe://pay?${baseParams}`,
    paytm: `paytmmp://pay?${baseParams}`,
    gpay: `tez://upi/pay?${baseParams}`,
  };

  const handlePayClick = () => {
    if (!selectedPayment) {
      alert("Select payment method first");
      return;
    }

    const link = paymentLinks[selectedPayment];

    if (!link) {
      alert("Payment method not supported");
      return;
    }

    // ✅ Open App
    window.location.href = link;

    // ✅ Fallback to generic UPI
    setTimeout(() => {
      window.location.href = `upi://pay?${baseParams}`;
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Select Payment Method</h2>
          <div className="flex items-center gap-1 text-xs">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            100% SAFE
          </div>
        </div>

        {/* Payment Options */}
        <div className="p-4">

          {/* PhonePe */}
          <div className="border rounded mb-3">
            <button
              onClick={() => setSelectedPayment("phonepe")}
              className="w-full flex justify-between p-4"
            >
              <span>PhonePe</span>
              <input type="radio" checked={selectedPayment==="phonepe"} readOnly />
            </button>
          </div>

          {/* Google Pay */}
          <div className="border rounded mb-3">
            <button
              onClick={() => setSelectedPayment("gpay")}
              className="w-full flex justify-between p-4"
            >
              <span>Google Pay</span>
              <input type="radio" checked={selectedPayment==="gpay"} readOnly />
            </button>
          </div>

          {/* Paytm */}
          <div className="border rounded mb-3">
            <button
              onClick={() => setSelectedPayment("paytm")}
              className="w-full flex justify-between p-4"
            >
              <span>Paytm</span>
              <input type="radio" checked={selectedPayment==="paytm"} readOnly />
            </button>
          </div>

          {/* Disabled */}
          <div className="border rounded bg-gray-100 p-4 text-gray-400">
            Cards / COD Not Available
          </div>
        </div>

        {/* Price */}
        <div className="p-4 border-t">
          <div className="flex justify-between">
            <span>Total</span>
            <span>₹{finalPrice}</span>
          </div>
        </div>

        {/* Pay Button */}
        <div className="p-4">
          <button
            onClick={handlePayClick}
            className="w-full bg-pink-500 text-white py-3 rounded"
          >
            PAY ₹{finalPrice}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;