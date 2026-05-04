import React, { useState, useMemo } from "react";
import { ChevronDown, CreditCard, Wallet, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";

const MERCHANT_UPI_ID = "paytm.s1zwjh8@pty"; // ⚠️ change if needed
const COUNTRY_CURRENCY = "INR";

const PaymentPage = () => {
  const location = useLocation();
  const { product, quantity, finalPrice } = location.state || {};

  const [selectedPayment, setSelectedPayment] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No Product Found
      </div>
    );
  }

  // ✅ Clean & Correct UPI Params
  const baseParams = useMemo(() => {
    const txnId = `ORDER_${Date.now()}`;
    return new URLSearchParams({
      pa: MERCHANT_UPI_ID,
      pn: "My Store",
      am: finalPrice?.toString() || "1",
      cu: COUNTRY_CURRENCY,
      tn: "Order Payment",
      tr: txnId,
    }).toString();
  }, [finalPrice]);

  // ✅ Universal UPI Link (IMPORTANT)
  const upiLink = `upi://pay?${baseParams}`;

  const handlePayClick = () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    // ✅ Direct open UPI
    window.location.href = upiLink;

    // ✅ Fallback (if app not opened)
    setTimeout(() => {
      window.location.href = upiLink;
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Select Payment Method
          </h2>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            SAFE
          </div>
        </div>

        {/* Offer */}
        <div className="mx-4 mt-4 bg-pink-50 border rounded p-3">
          <p className="text-pink-600 text-sm font-semibold">
            Pay online & get discount
          </p>
        </div>

        {/* Payment Options */}
        <div className="p-4">

          {/* PhonePe */}
          <div className="border rounded mb-3">
            <button
              onClick={() => setSelectedPayment("upi")}
              className="w-full flex justify-between p-4"
            >
              <span>UPI (PhonePe / GPay / Paytm)</span>
              <input type="radio" checked={selectedPayment==="upi"} readOnly />
            </button>
          </div>

          {/* Disabled */}
          <div className="border rounded bg-gray-100 p-4 text-gray-400">
            Cards / COD Not Available
          </div>

        </div>

        {/* Price Details */}
        <div className="px-4 pb-4 border-t pt-4">
          <h3 className="font-semibold mb-2">
            Price Details ({quantity} item)
          </h3>

          <div className="flex justify-between text-sm mb-2">
            <span>Total</span>
            <span>₹{finalPrice}</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Order Total</span>
            <span>₹{finalPrice}</span>
          </div>
        </div>

        {/* Pay Button */}
        <div className="p-4 border-t">
          <button
            onClick={handlePayClick}
            className="w-full bg-pink-500 text-white py-4 rounded-lg font-semibold"
          >
            PAY ₹{finalPrice}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;