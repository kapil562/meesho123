import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../component/Header";
import axios from "axios";

const API_BASE = "https://meesho-backend-2-jkuy.onrender.com/api"; // 🔹 Django backend base URL

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  // ------------------- FETCH PRODUCT -------------------
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products/${id}/`);
      setProduct(res.data);
      fetchReviews(id);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------- FETCH REVIEWS -------------------
  const fetchReviews = async (productId) => {
    try {
      const res = await axios.get(`${API_BASE}/reviews/?product=${productId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  // ------------------- EVENT HANDLERS -------------------
  const handleBuyNow = () => {
    if (!product) return;
    navigate(`/AddressPage/${product.id}`, {
      state: {
        product,
        quantity,
        finalPrice: product.price * quantity,
        selectedSize: selectedSize || "Free Size",
      },
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    alert(
      `🛒 Added ${product.name} (Size: ${
        selectedSize || "Free Size"
      }, Qty: ${quantity}) - ₹${product.price * quantity} to cart`
    );
  };

  // ------------------- UI STATES -------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Product not found.
      </div>
    );
  }

  const activeSizes =
    product.available_sizes?.length > 0
      ? product.available_sizes
      : ["Free Size"];

  const finalPrice = (product.price * quantity).toFixed(2);

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* ---------------- LEFT SIDE - IMAGES ---------------- */}
          <div>
            <div className="w-full border rounded-lg overflow-hidden bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[400px] object-contain"
              />
            </div>
          </div>

          {/* ---------------- RIGHT SIDE - PRODUCT INFO ---------------- */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{product.name}</h2>

            {/* Price */}
            <div className="flex items-center gap-3 text-lg">
              <span className="font-bold text-gray-800">₹{finalPrice}</span>
              {product.discount > 0 && (
                <span className="text-green-600">{product.discount}% off</span>
              )}
            </div>
            <p className="text-sm text-green-700">Free Delivery</p>

            {/* Sizes */}
            <div>
              <h4 className="font-medium mb-2">Available Sizes</h4>
              <div className="flex flex-wrap gap-3">
                {activeSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                      selectedSize === size
                        ? "bg-pink-600 text-white border-pink-600"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:border-pink-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-xs text-gray-600 mt-1">
                  Selected Size:{" "}
                  <span className="font-semibold">{selectedSize}</span>
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <h4 className="font-medium mb-2">Quantity</h4>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 border rounded-lg"
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 border rounded-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-pink-100 text-pink-700 py-2 rounded-lg font-medium"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-pink-600 text-white py-2 rounded-lg font-medium"
              >
                Buy Now
              </button>
            </div>

            {/* Seller */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Sold By</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{product.sold_by}</p>
                  <p className="text-sm text-gray-500">Verified Seller</p>
                </div>
                <button className="px-3 py-1 border rounded-lg text-pink-600">
                  View Shop
                </button>
              </div>
            </div>

            {/* Highlights (Mapped from model fields) */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Product Highlights</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <p>Occasion: {product.occasion || "N/A"}</p>
                <p>Color: {product.color || "N/A"}</p>
                <p>Fit/Shape: {product.fit_shape || "N/A"}</p>
                <p>Pattern: {product.pattern || "N/A"}</p>
              </div>
            </div>

            {/* Product Details (Mapped from model fields) */}
            <div className="border-t pt-4 text-sm text-gray-700">
              <h4 className="font-medium mb-2">Product Details</h4>
              <ul className="space-y-1">
                <li>Fabric: {product.fabric || "N/A"}</li>
                <li>Sleeve Length: {product.sleeve_length || "N/A"}</li>
                <li>Available Sizes: {activeSizes.join(", ")}</li>
                <li>Country of Origin: {product.country_of_origin}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ---------------- REVIEWS SECTION ---------------- */}
        <div className="max-w-7xl mx-auto mt-8 bg-white rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-6">
            Product Ratings & Reviews
          </h3>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="mb-6 pb-6 border-b last:border-b-0">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {review.reviewer_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {review.reviewer_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-green-700 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        {review.rating} ★
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {review.image && (
                  <div className="mb-3">
                    <img
                      src={review.image}
                      alt="Review"
                      className="w-20 h-20 rounded-lg object-cover border"
                    />
                  </div>
                )}

                {review.comment && (
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
