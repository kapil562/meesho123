import React, { useState, useMemo } from "react";
import { ChevronDown, CreditCard, Wallet, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";

const MERCHANT_UPI_ID = "paytm.slzwjh8@pty"; // 👉 ensure VALID UPI ID
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

  // ✅ Correct UPI params (VERY IMPORTANT)
  const baseParams = useMemo(() => {
    const txnId = `TXN${Date.now()}`;
    return new URLSearchParams({
      pa: MERCHANT_UPI_ID,
      pn: "MerchantName",
      am: finalPrice && finalPrice > 0 ? finalPrice.toString() : "1",
      cu: COUNTRY_CURRENCY,
      tn: "Order Payment",
      tr: txnId,
    }).toString();
  }, [finalPrice]);

  // ✅ Universal UPI link (PhonePe will open if installed/default)
  const upiLink = `upi://pay?${baseParams}`;

  const handlePayClick = () => {
    if (!selectedPayment) {
      alert("Please select a payment method first!");
      return;
    }

    // 👉 Direct UPI intent
    window.location.href = upiLink;
  };

  return (
    <div className="min-h-screen bg-white">
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

        {/* Offer */}
        <div className="mx-4 mt-4 bg-pink-50 border border-pink-200 rounded-lg p-4">
          <p className="text-pink-600 font-semibold">
            Pay online & get EXTRA ₹25 off
          </p>
        </div>

        {/* PhonePe Option */}
        <div className="p-4">
          <p className="text-xs text-gray-500 font-semibold mb-3">PAY ONLINE</p>

          <div className="border rounded-lg mb-3">
            <button
              onClick={() =>
                setSelectedPayment(
                  selectedPayment === "phonepe" ? "" : "phonepe"
                )
              }
              className={`w-full flex items-center justify-between p-4 ${
                selectedPayment === "phonepe"
                  ? "bg-pink-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://kurtikk.diwalioffer.shop/static/media/phonepe.558dd7fea5d980ccf2c8.png"
                  alt="PhonePe"
                  className="w-8 h-8"
                />
                <span className="text-sm font-medium text-gray-800">
                  PhonePe
                </span>
              </div>

              <input
                type="radio"
                checked={selectedPayment === "phonepe"}
                readOnly
              />
            </button>
          </div>
        </div>

        {/* Price Details */}
        <div className="px-4 pb-4 border-t pt-4">
          <h3 className="text-base font-semibold mb-3">
            Price Details ({quantity} item{quantity > 1 ? "s" : ""})
          </h3>

          <div className="flex justify-between mb-2">
            <span>Total Product Price</span>
            <span>₹{finalPrice}</span>
          </div>

          <div className="flex justify-between font-bold border-t pt-2">
            <span>Order Total</span>
            <span>₹{finalPrice}</span>
          </div>
        </div>

        {/* Pay Button */}
        <div className="p-4 border-t">
          <button
            onClick={handlePayClick}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-lg"
          >
            PROCEED TO PAY ₹{finalPrice}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;