import React from "react";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from "react-icons/ai";
import {
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from "../hooks/useCart";

const CartItem = ({ item }) => {
  const removeFromCartMutation = useRemoveFromCartMutation();
  const updateCartItemMutation = useUpdateCartItemMutation();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      handleRemove();
      return;
    }
    updateCartItemMutation.mutate({
      cartItemId: item.id,
      quantity: newQuantity,
    });
  };

  const handleRemove = () => {
    removeFromCartMutation.mutate(item.id);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Item Image */}
      {item.image && (
        <div className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
        <p className="text-lg font-bold text-[#e26136] mt-2">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={updateCartItemMutation.isLoading}
          className="p-1 rounded-full border border-gray-300 hover:border-[#e26136] hover:bg-orange-50 transition-colors duration-200 disabled:opacity-50"
          aria-label="Decrease quantity"
        >
          <AiOutlineMinus className="text-sm" />
        </button>

        <span className="mx-2 min-w-[2rem] text-center font-semibold">
          {item.quantity}
        </span>

        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={updateCartItemMutation.isLoading}
          className="p-1 rounded-full border border-gray-300 hover:border-[#e26136] hover:bg-orange-50 transition-colors duration-200 disabled:opacity-50"
          aria-label="Increase quantity"
        >
          <AiOutlinePlus className="text-sm" />
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        disabled={removeFromCartMutation.isLoading}
        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
        aria-label="Remove item"
      >
        <AiOutlineDelete className="text-lg" />
      </button>
    </div>
  );
};

export default CartItem;
