import React, { useState, useMemo } from "react";
import { ChevronDown, CreditCard, Wallet, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const MERCHANT_UPI_ID = "paytm.slzwjh8@pty";
const COUNTRY_CURRENCY = "INR";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { product, quantity, finalPrice } = location.state || {};
  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(false);

  // ❗ Direct open fix
  if (!product) {
    navigate("/");
    return null;
  }

  // ✅ UPI Params
  const upiParams = useMemo(() => {
    return new URLSearchParams({
      pa: MERCHANT_UPI_ID,
      pn: "Your Store",
      am: String(finalPrice || 0),
      cu: COUNTRY_CURRENCY,
      tn: `Order_${product?.id}`,
    }).toString();
  }, [finalPrice, product]);

  // ✅ Android Intent (PhonePe)
  const phonepeIntent = `intent://pay?${upiParams}#Intent;scheme=upi;package=com.phonepe.app;end`;

  // ✅ Universal UPI (fallback)
  const upiUniversal = `upi://pay?${upiParams}`;

  const handlePayClick = () => {
    if (!selectedPayment) {
      alert("Select payment method!");
      return;
    }

    setLoading(true);

    // 👉 Try PhonePe Intent first
    window.location.href = phonepeIntent;

    // 👉 Fallback after 1.5 sec (if failed)
    setTimeout(() => {
      window.location.href = upiUniversal;
    }, 1500);

    // 👉 Final fallback (Play Store)
    setTimeout(() => {
      window.location.href =
        "https://play.google.com/store/apps/details?id=com.phonepe.app";
      setLoading(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="flex justify-between p-4 border-b">
          <h2 className="font-semibold">Select Payment Method</h2>
          <div className="flex items-center text-xs">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            SAFE
          </div>
        </div>

        {/* Offer */}
        <div className="m-4 p-3 bg-pink-100 rounded">
          Pay online & get ₹25 OFF
        </div>

        {/* UPI */}
        <div className="p-4">
          <div className="border rounded mb-3">
            <button
              onClick={() =>
                setSelectedPayment(selectedPayment === "upi" ? "" : "upi")
              }
              className="w-full flex justify-between p-4"
            >
              <span>UPI (PhonePe / GPay / Paytm)</span>
              <input type="radio" checked={selectedPayment === "upi"} readOnly />
            </button>
          </div>

          {/* Disabled */}
          <div className="border rounded mb-3 bg-gray-100 p-4 opacity-50">
            Cards (Coming Soon)
          </div>

          <div className="border rounded bg-gray-100 p-4 opacity-50">
            COD (Not Available)
          </div>
        </div>

        {/* Price */}
        <div className="p-4 border-t">
          <div className="flex justify-between">
            <span>Total</span>
            <span>₹{finalPrice}</span>
          </div>

          <div className="flex justify-between font-bold mt-2">
            <span>Order Total</span>
            <span>₹{finalPrice}</span>
          </div>
        </div>

        {/* Pay Button */}
        <div className="p-4">
          <button
            onClick={handlePayClick}
            disabled={loading}
            className="w-full bg-pink-500 text-white py-4 rounded"
          >
            {loading ? "Processing..." : `PAY ₹${finalPrice}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;