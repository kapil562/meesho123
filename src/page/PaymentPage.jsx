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
  const [isLoading, setIsLoading] = useState(false);

  // ✅ अगर direct page open हुआ तो redirect
  if (!product) {
    navigate("/");
    return null;
  }

  // ✅ Universal UPI params
  const upiParams = useMemo(() => {
    return new URLSearchParams({
      pa: MERCHANT_UPI_ID,
      pn: "Your Store",
      am: finalPrice?.toString() || "0",
      cu: COUNTRY_CURRENCY,
      tn: `Order ${product?.id}`,
    }).toString();
  }, [finalPrice, product]);

  // ✅ Universal UPI link (works with all apps)
  const upiLink = `upi://pay?${upiParams}`;

  const handlePayClick = () => {
    if (!selectedPayment) {
      alert("Please select payment method!");
      return;
    }

    setIsLoading(true);

    // 👉 open UPI
    setTimeout(() => {
      window.location.href = upiLink;
      setIsLoading(false);
    }, 500);
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

        {/* Payment Methods */}
        <div className="p-4">
          <p className="text-xs text-gray-500 font-semibold mb-3">
            PAY ONLINE
          </p>

          {/* UPI (All apps) */}
          <div className="border rounded-lg mb-3">
            <button
              onClick={() =>
                setSelectedPayment(selectedPayment === "upi" ? "" : "upi")
              }
              className={`w-full flex items-center justify-between p-4 ${
                selectedPayment === "upi" ? "bg-pink-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5f/UPI-Logo-vector.svg"
                  alt="UPI"
                  className="w-8 h-8"
                />
                <span className="text-sm font-medium text-gray-800">
                  UPI (PhonePe / GPay / Paytm)
                </span>
              </div>
              <input
                type="radio"
                checked={selectedPayment === "upi"}
                readOnly
              />
            </button>
          </div>

          {/* Disabled Card */}
          <div className="border rounded-lg mb-3 bg-gray-50">
            <button className="w-full flex items-center justify-between p-4 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-500" />
                <span>Cards (Coming Soon)</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* COD Disabled */}
          <div className="border rounded-lg bg-gray-50">
            <button className="w-full flex items-center justify-between p-4 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-blue-500" />
                <span>Cash on Delivery (Not Available)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="px-4 pb-4 border-t pt-4">
          <h3 className="font-semibold mb-3">
            Price Details ({quantity} item)
          </h3>

          <div className="flex justify-between mb-2">
            <span>Total</span>
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
            disabled={isLoading}
            className="w-full bg-pink-500 text-white py-4 rounded-lg"
          >
            {isLoading ? "Processing..." : `PAY ₹${finalPrice}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;