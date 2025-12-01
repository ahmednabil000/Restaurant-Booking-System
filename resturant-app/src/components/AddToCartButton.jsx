import React, { useState } from "react";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";
import { useAddToCartMutation } from "../hooks/useCart";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router";
import {
  showSuccessNotification,
  showErrorNotification,
} from "../utils/notifications";

const AddToCartButton = ({ item, quantity = 1, className = "", children }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const addToCartMutation = useAddToCartMutation();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Call addToCart with mealId and quantity as expected by the API
    addToCartMutation.mutate(
      {
        mealId: item.id,
        quantity: quantity,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);

          // Show toast notification
          showSuccessNotification(
            "تمت إضافة الوجبة للسلة بنجاح!",
            `تم إضافة ${item.name || item.title} إلى سلة التسوق`
          );
        },
        onError: (error) => {
          // Show error notification
          showErrorNotification(
            "خطأ في إضافة الوجبة",
            error.message || "حدث خطأ أثناء إضافة الوجبة للسلة"
          );
        },
      }
    );
  };

  const defaultButtonContent = (
    <>
      {showSuccess ? (
        <>
          <AiOutlineCheck className="text-lg" />
          <span>تمت الإضافة</span>
        </>
      ) : (
        <>
          <AiOutlinePlus className="text-lg" />
          <span>إضافة للسلة</span>
        </>
      )}
    </>
  );

  const buttonClasses = `
    ${className}
    ${
      showSuccess
        ? "bg-green-500 hover:bg-green-600 text-white"
        : "bg-[#e26136] hover:bg-[#cd4f25] text-white"
    }
    ${
      addToCartMutation.isLoading
        ? "opacity-70 cursor-not-allowed"
        : "cursor-pointer"
    }
    transition-all duration-200 flex items-center justify-center gap-2 rounded-lg
  `.trim();

  return (
    <button
      onClick={handleAddToCart}
      disabled={addToCartMutation.isLoading || showSuccess}
      className={buttonClasses}
      aria-label={`Add ${item.title || item.name} to cart`}
    >
      {children || defaultButtonContent}
      {addToCartMutation.isLoading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      )}
    </button>
  );
};

export default AddToCartButton;
