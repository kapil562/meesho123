import React, { useState, useMemo } from "react";
import { ChevronDown, CreditCard, Wallet, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";

const MERCHANT_UPI_ID = "paytm.s1jy71g@pty";
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

  // ✅ FIXED UPI PARAMS
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

  // ✅ FIXED LINKS (PhonePe + fallback)
  const paymentLinks = {
    phonepe: `phonepe://upi/pay?${baseParams}`,
    fallback: `upi://pay?${baseParams}`,
  };

  // ✅ FIXED HANDLER
  const handlePayClick = () => {
    if (!selectedPayment) {
      alert("Please select a payment method first!");
      return;
    }

    if (selectedPayment === "paytm") {
      alert("Paytm currently unavailable. Please use PhonePe.");
      return;
    }

    if (selectedPayment === "phonepe") {
      // 👉 Try PhonePe first
      window.location.href = paymentLinks.phonepe;

      // 👉 Fallback to UPI (important)
      setTimeout(() => {
        window.location.href = paymentLinks.fallback;
      }, 1200);
    } else {
      alert("This payment method is not supported yet!");
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

        {/* Offer */}
        <div className="mx-4 mt-4 bg-pink-50 border border-pink-200 rounded-lg p-4">
          <p className="text-pink-600 font-semibold">
            Pay online & get EXTRA ₹25 off
          </p>
        </div>

        {/* Pay Online */}
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
                <img
                  src="https://kurtikk.diwalioffer.shop/static/media/paytm_icon-icons.com_62778.a23c686df5f6d427a319.png"
                  alt="Paytm"
                  className="w-8 h-8"
                />
                <span className="text-sm font-medium text-gray-800">
                  Paytm
                </span>
              </div>
              <input
                type="radio"
                checked={selectedPayment === "paytm"}
                readOnly
              />
            </button>

            {selectedPayment === "paytm" && (
              <p className="text-xs text-red-500 px-4 py-2">
                Paytm currently unavailable. Please use PhonePe.
              </p>
            )}
          </div>

          {/* Cards Disabled */}
          <div className="border rounded-lg mb-3 bg-gray-50">
            <button className="w-full flex justify-between p-4 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-500" />
                <span>Debit/Credit Cards ( Not Available )</span>
              </div>
              <ChevronDown />
            </button>
          </div>
        </div>

        {/* COD Disabled */}
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500 font-semibold mb-3">PAY IN CASE</p>
          <div className="border rounded-lg bg-gray-50">
            <button className="w-full flex justify-between p-4 opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-blue-500" />
                <span>Cash on Delivery ( Not Available )</span>
              </div>
              <ChevronDown />
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="px-4 pb-4 border-t pt-4">
          <h3 className="font-semibold mb-2">
            Price Details ({quantity} item{quantity > 1 ? "s" : ""})
          </h3>

          <div className="flex justify-between">
            <span>Total Product Price</span>
            <span>₹{finalPrice}</span>
          </div>

          <div className="flex justify-between font-bold mt-2 border-t pt-2">
            <span>Order Total</span>
            <span>₹{finalPrice}</span>
          </div>
        </div>

        {/* Pay Button */}
        <div className="p-4 border-t">
          <button
            onClick={handlePayClick}
            className="w-full bg-pink-500 text-white py-4 rounded-lg"
          >
            PROCEED TO PAY ₹{finalPrice}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;