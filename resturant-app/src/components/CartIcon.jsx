import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

const CartIcon = () => {
  const { isAuthenticated } = useAuthStore();
  const { getTotalItems } = useCartStore();

  const totalItems = getTotalItems();

  // Only show cart icon if user is authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Link
      to="/cart"
      className="relative flex items-center justify-center p-2 text-gray-700 hover:text-[#e26136] transition-colors duration-200"
      aria-label={`Cart with ${totalItems} items`}
    >
      <AiOutlineShoppingCart className="text-xl md:text-2xl" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#e26136] text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
