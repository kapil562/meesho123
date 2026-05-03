import React, { useState, useEffect, useRef } from "react";
import { Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../component/Header";

// ---------------- CATEGORY CIRCLES SLIDER ----------------
function CategoryCirclesSlider() {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const categories = [
    { id: 1, image: "https://kurtikk.diwalioffer.shop/static/media/homesilder.6892f317534061e0f574.webp" },
    { id: 2, image: "https://kurtikk.diwalioffer.shop/static/media/homesilder2.52cd5e20a74c625da15b.webp" },
    { id: 3, image: "https://kurtikk.diwalioffer.shop/static/media/homesilder3.11ad8ccc8fe1435b0757.webp" },
    { id: 4, image: "https://kurtikk.diwalioffer.shop/static/media/homesilder4.e781a43aad5902347d06.webp" },
    { id: 5, image: "https://kurtikk.diwalioffer.shop/static/media/homesilder5.1602de9aa0bd8b43657a.webp" },
    { id: 6, image: "https://kurtikk.diwalioffer.shop/static/media/homesilder6.80b4cda9bf6e766fa099.webp" },
    { id: 7, image: "https://kurtikk.diwalioffer.shop/static/media/homesilder7.cab07317ed5bf663e4c5.webp" },
    { id: 8, image: "https://kurtikk.diwalioffer.shop/static/media/homesilder8.05a357ab1a826f082d82.webp" },
    { id: 9, image: "https://kurtikk.diwalioffer.shop/static/media/homesilder11.0c764c1b490978dff3d8.webp" },
    { id: 10, image: "https://kurtikk.diwalioffer.shop/static/media/homesilder12.c5044c3eaa6903c18080.webp" },
    { id: 11, image: "https://kurtikk.diwalioffer.shop/static/media/homesilder13.d52c256eb905be8b9b3e.webp" },
    { id: 12, image: "https://kurtikk.diwalioffer.shop/static/media/homesilder14.03d41c0e7739a11d1def.webp" },
    { id: 13, image: "https://kurtikk.diwalioffer.shop/static/media/homesilder15.b525ef2493b04cd7c6f6.webp" },
  ];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="bg-white py-3">
      <div
        ref={scrollRef}
        className="flex gap-4 px-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {categories.map((cat) => (
          <div key={cat.id} className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
              <img src={cat.image} alt={`Category ${cat.id}`} className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- IMAGE SLIDER ----------------
function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full bg-white px-3 py-3 flex gap-3">
      <div className="flex-1 relative overflow-hidden rounded-lg">
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((img, i) => (
            <div key={i} className="w-full flex-shrink-0">
              <img src={img} alt={`Slide ${i}`} className="w-full h-full object-cover rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- PROMOTIONAL BANNERS ----------------
function PromotionalBanners() {
  return (
    <div className="bg-white">
      <div className="w-full py-4 text-center text-white font-semibold text-base" style={{ backgroundColor: "#9c27b0" }}>
        Buy 2 Get 1 Free (Add 3 item to cart)
      </div>
      <div className="w-full bg-[#fffbea] flex justify-center py-4">
        <img
          src="https://kurtikk.diwalioffer.shop/static/media/freeshippingposter.8c0aff28d27a959880ff.webp"
          alt="Free shipping"
          className="max-w-4xl w-full object-contain"
        />
      </div>
    </div>
  );
}

// ---------------- PRODUCT CARD ----------------
function ProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded overflow-hidden relative cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`, { state: product })}
    >
      <button
        onClick={(e) => e.stopPropagation()}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow hover:scale-110 transition"
      >
        <Heart className="w-4 h-4 text-gray-600" />
      </button>

      <div className="w-full relative bg-gray-50" style={{ paddingBottom: "100%" }}>
        <img src={product.image} alt={product.name} className="absolute top-0 left-0 w-full h-full object-cover" />
      </div>

      <div className="p-2">
        <h3
          className="text-xs text-gray-700 mb-1 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "32px",
            lineHeight: "16px",
          }}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-base font-bold text-gray-900">₹{product.price}</span>
          {product.discount && (
            <span className="text-xs text-gray-400 line-through">₹{Math.floor(product.price * (1 + product.discount / 100))}</span>
          )}
        </div>

        <p className="text-xs text-gray-600 mb-2">Free Delivery</p>
      </div>
    </div>
  );
}

// ---------------- PRODUCT GRID ----------------
function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderImages = [
    "https://kurtikk.diwalioffer.shop/static/media/c1oug.529b42955c36742bbffa.gif",
    "https://kurtikk.diwalioffer.shop/static/media/0muga.5a23765c71bc806439e8.gif",
  ];

  // ✅ Fetch products from Django backend
  useEffect(() => {
    fetch("https://meesho-backend-2-jkuy.onrender.com/api/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CategoryCirclesSlider />
      <div className="w-full py-2 px-4" style={{ backgroundColor: "#ffc107" }}>
        <img
          src="https://kurtikk.diwalioffer.shop/static/media/pngmeesho.4e5fc246936989b7b849.jpeg"
          alt="Maha Sale"
          className="w-full h-auto object-cover"
        />
      </div>
      <ImageSlider images={sliderImages} />
      <PromotionalBanners />

      <div className="px-3 py-4 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Products For You</h2>
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-600">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 gap-0">
          {products.map((item, index) => (
            <div key={item.id} className={`${index % 2 === 0 ? "border-r" : ""} border-b`}>
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
