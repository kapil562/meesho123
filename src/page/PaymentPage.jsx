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

  const baseParams = useMemo(() => {
    const tid = `ORDER${product.id}${Date.now()}`;
    return new URLSearchParams({
      pa: MERCHANT_UPI_ID,
      pn: "MerchantName",
      am: finalPrice?.toString() || "0",
      cu: COUNTRY_CURRENCY,
      tn: `Order for ${product.name || "Product"}`,
      tr: tid,
    }).toString();
  }, [finalPrice, product.id]);

  const paymentLinks = {
    phonepe: `phonepe://pay?${baseParams}`,
    paytm:   `paytmmp://pay?${baseParams}`,
    upi:     `upi://pay?${baseParams}`,
  };

  const handlePayClick = () => {
    if (!selectedPayment) {
      alert("Please select a payment method first!");
      return;
    }

    if (selectedPayment === "paytm") {
      alert("Paytm currently unavailable. Please use PhonePe.");
      return;
    }

    // ✅ App-specific deep link try karo
    window.location.href = paymentLinks[selectedPayment];

    // ✅ 2 sec baad universal UPI fallback (agar app nahi mila)
    setTimeout(() => {
      window.location.href = paymentLinks["upi"];
    }, 2000);
  };

  return (
    // ... baaki UI same rahega aapka
  );
};

export default PaymentPage;