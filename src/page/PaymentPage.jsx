import React, { useState, useMemo } from "react";
import { ChevronDown, CreditCard, Wallet, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";

const MERCHANT_UPI_ID = "paytm.slzwjh8@pty"; // updated
const COUNTRY_CURRENCY = "INR";

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

  // ✅ Correct UPI params
  const baseParams = useMemo(() => {
    const tid = `ORDER:${product.id}`;
    return new URLSearchParams({
      pa: MERCHANT_UPI_ID,
      pn: "Meesho",
      am: finalPrice?.toString() || "0",
      cu: COUNTRY_CURRENCY,
      tn: "Order Payment",
      tr: tid,
    }).toString();
  }, [finalPrice, product.id]);

  // ✅ FIXED LINKS
  const paymentLinks = {
    phonepe: `phonepe://upi/pay?${baseParams}`,
    paytm: `paytmmp://pay?${baseParams}`,
  };

  const handlePayClick = () => {
    if (!selectedPayment) {
      alert("Please select a payment method first!");
      return;
    }

    if (selectedPayment === "paytm") {
      alert("Paytm is currently unavailable. Please use PhonePe.");
      return;
    }

    if (paymentLinks[selectedPayment]) {
      window.location.href = paymentLinks[selectedPayment};
    } else {
      alert("Payment method not supported!");
    }
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

        {/* PhonePe */}
        <div className="p-4">
          <div className="border rounded-lg mb-3">
            <button
              onClick={() =>
                setSelectedPayment(selectedPayment === "phonepe" ? "" : "phonepe")
              }
              className={`w-full flex items-center justify-between p-4 ${
                selectedPayment === "phonepe" ? "bg-pink-50" : "hover:bg-gray-50"
              }`}
            >
              <span className="text-sm font-medium">PhonePe</span>
              <input
                type="radio"
                checked={selectedPayment === "phonepe"}
                readOnly
              />
            </button>
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
            className="w-full bg-pink-500 text-white py-4 rounded-lg"
          >
            PAY ₹{finalPrice}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;