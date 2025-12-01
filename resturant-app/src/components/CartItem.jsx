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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      {/* Mobile Layout - Stacked */}
      <div className="flex flex-col sm:hidden space-y-4">
        {/* Image and Title Row */}
        <div className="flex items-start gap-3">
          {item.meal?.imageUrl && (
            <div className="shrink-0">
              <img
                src={item.meal.imageUrl}
                alt={item.meal.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-800 leading-tight">
              {item.meal?.title}
            </h3>
            {item.meal?.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {item.meal.description}
              </p>
            )}
          </div>
        </div>

        {/* Price Info */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-bold text-[#e26136]">
              {(parseFloat(item.totalPrice) || 0).toFixed(2)}ج.م
            </p>
            <p className="text-sm text-gray-500">
              الوحدة {(parseFloat(item.unitPrice) || 0).toFixed(2)} ج.م
            </p>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handleQuantityChange((parseInt(item.quantity) || 0) - 1)
              }
              disabled={updateCartItemMutation.isLoading}
              className="p-2 rounded-full border border-gray-300 hover:border-[#e26136] hover:bg-orange-50 transition-colors duration-200 disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <AiOutlineMinus className="text-sm" />
            </button>

            <span className="mx-3 min-w-8 text-center font-semibold text-lg">
              {parseInt(item.quantity) || 0}
            </span>

            <button
              onClick={() =>
                handleQuantityChange((parseInt(item.quantity) || 0) + 1)
              }
              disabled={updateCartItemMutation.isLoading}
              className="p-2 rounded-full border border-gray-300 hover:border-[#e26136] hover:bg-orange-50 transition-colors duration-200 disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <AiOutlinePlus className="text-sm" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={removeFromCartMutation.isLoading}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
            aria-label="Remove item"
          >
            <AiOutlineDelete className="text-lg" />
          </button>
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden sm:flex items-center gap-4">
        {/* Item Image */}
        {item.meal?.imageUrl && (
          <div className="shrink-0">
            <img
              src={item.meal.imageUrl}
              alt={item.meal.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {item.meal?.title}
          </h3>
          {item.meal?.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {item.meal.description}
            </p>
          )}
          <p className="text-lg font-bold text-[#e26136] mt-2">
            {(parseFloat(item.totalPrice) || 0).toFixed(2)}ج.م
          </p>
          <p className="text-sm text-gray-500">
            الوحدة {(parseFloat(item.unitPrice) || 0).toFixed(2)} ج.م
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              handleQuantityChange((parseInt(item.quantity) || 0) - 1)
            }
            disabled={updateCartItemMutation.isLoading}
            className="p-1 rounded-full border border-gray-300 hover:border-[#e26136] hover:bg-orange-50 transition-colors duration-200 disabled:opacity-50"
            aria-label="Decrease quantity"
          >
            <AiOutlineMinus className="text-sm" />
          </button>

          <span className="mx-2 min-w-8 text-center font-semibold">
            {parseInt(item.quantity) || 0}
          </span>

          <button
            onClick={() =>
              handleQuantityChange((parseInt(item.quantity) || 0) + 1)
            }
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
    </div>
  );
};

export default CartItem;
