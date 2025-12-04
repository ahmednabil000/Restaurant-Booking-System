import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineArrowRight } from "react-icons/ai";
import useAuthStore from "../store/authStore";
import useRestaurantStore from "../store/restaurantStore";
import { useCartQuery, useClearCartMutation } from "../hooks/useCart";
import CartItem from "../components/CartItem";
import Container from "../ui/Container";
import Modal from "../components/ui/Modal";

const Cart = () => {
  const { isAuthenticated } = useAuthStore();
  const { restaurant, fetchRestaurantDetails } = useRestaurantStore();
  const { data: cartResponse, isLoading, error } = useCartQuery();
  const clearCartMutation = useClearCartMutation();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Fetch restaurant details if not already loaded
  React.useEffect(() => {
    if (!restaurant) {
      fetchRestaurantDetails();
    }
  }, [restaurant, fetchRestaurantDetails]);

  // Extract cart data from API response
  const cartData = cartResponse?.success ? cartResponse.cart : null;
  const cartItems = cartData?.items || [];
  const totalAmount = parseFloat(cartData?.totalAmount) || 0;
  const itemCount = parseInt(cartData?.itemCount) || 0;

  // Get service fees from restaurant details
  const serviceFees =
    +restaurant?.data?.serviceFees || +restaurant?.serviceFees || 5.0;

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

  if (cartItems.length === 0) {
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

  return (
    <Container>
      <div className="py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">سلة التسوق</h1>
          <p className="text-gray-600">عدد العناصر: {itemCount}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 min-h-0">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Clear Cart Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowClearConfirm(true)}
                disabled={clearCartMutation.isLoading}
                className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {clearCartMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    جاري إفراغ السلة...
                  </>
                ) : (
                  "إفراغ السلة"
                )}
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24 z-10 shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ملخص الطلب
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-semibold">
                    {totalAmount.toFixed(2)} ج.م
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">رسوم الخدمة</span>
                  <span className="font-semibold">
                    {serviceFees.toFixed(2)} ج.م
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع الكلي</span>
                    <span className="text-[#e26136]">
                      {(totalAmount + serviceFees).toFixed(2)} ج.م
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

      {/* Clear Cart Confirmation Modal */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="تأكيد إفراغ السلة"
        maxWidth="max-w-md"
        footerContent={
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                clearCartMutation.mutate(undefined, {
                  onSuccess: () => {
                    setShowClearConfirm(false);
                    console.log("تم إفراغ السلة بنجاح");
                  },
                  onError: (error) => {
                    setShowClearConfirm(false);
                    alert(`خطأ في إفراغ السلة: ${error.message}`);
                  },
                });
              }}
              disabled={clearCartMutation.isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {clearCartMutation.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري الحذف...
                </>
              ) : (
                "إفراغ السلة"
              )}
            </button>
          </div>
        }
      >
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed">
            هل أنت متأكد من رغبتك في إفراغ السلة؟ سيتم حذف جميع العناصر ولا يمكن
            التراجع عن هذا الإجراء.
          </p>
        </div>
      </Modal>
    </Container>
  );
};

export default Cart;
