import React from "react";
import { Link } from "react-router";
import { AiOutlineShoppingCart, AiOutlineArrowRight } from "react-icons/ai";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import { useCartQuery } from "../hooks/useCart";
import CartItem from "../components/CartItem";
import Container from "../ui/Container";

const Cart = () => {
  const { isAuthenticated } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { data: cartData, isLoading, error } = useCartQuery();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <Container>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <AiOutlineShoppingCart className="text-6xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            تسجيل الدخول مطلوب
          </h2>
          <p className="text-gray-600 mb-6">
            يجب تسجيل الدخول لعرض سلة التسوق الخاصة بك
          </p>
          <Link
            to="/login"
            className="bg-[#e26136] text-white px-6 py-3 rounded-lg hover:bg-[#cd4f25] transition-colors duration-200"
          >
            تسجيل الدخول
          </Link>
        </div>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e26136] mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل سلة التسوق...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-bold text-red-800 mb-2">
              خطأ في تحميل السلة
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <AiOutlineShoppingCart className="text-6xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            سلة التسوق فارغة
          </h2>
          <p className="text-gray-600 mb-6">
            لم تقم بإضافة أي عناصر إلى سلة التسوق بعد
          </p>
          <Link
            to="/menu"
            className="bg-[#e26136] text-white px-6 py-3 rounded-lg hover:bg-[#cd4f25] transition-colors duration-200 flex items-center gap-2"
          >
            تصفح القائمة
            <AiOutlineArrowRight className="text-lg" />
          </Link>
        </div>
      </Container>
    );
  }

  const totalPrice = getTotalPrice();

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">سلة التسوق</h1>
          <p className="text-gray-600">عدد العناصر: {items.length}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
              >
                إفراغ السلة
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ملخص الطلب
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-semibold">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">رسوم التوصيل</span>
                  <span className="font-semibold">$5.00</span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع الكلي</span>
                    <span className="text-[#e26136]">
                      ${(totalPrice + 5).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-[#e26136] text-white py-3 rounded-lg font-semibold hover:bg-[#cd4f25] transition-colors duration-200 mb-4">
                إتمام الطلب
              </button>

              {/* Continue Shopping */}
              <Link
                to="/menu"
                className="block text-center text-[#e26136] font-medium hover:text-[#cd4f25] transition-colors duration-200"
              >
                متابعة التسوق
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Cart;
