import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      // Add item to cart
      addItem: (item) => {
        const { items } = get();
        // Ensure we have a valid item with safe property access
        if (!item || !item.id) {
          console.error("Invalid item provided to addItem:", item);
          return;
        }

        const existingItem = items.find(
          (cartItem) => cartItem && cartItem.id === item.id
        );

        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: items.map((cartItem) =>
              cartItem && cartItem.id === item.id
                ? {
                    ...cartItem,
                    quantity: (cartItem.quantity || 0) + (item.quantity || 1),
                  }
                : cartItem
            ),
          });
        } else {
          // Add new item to cart
          set({
            items: [...items, { ...item, quantity: item.quantity || 1 }],
          });
        }
      },

      // Remove item from cart
      removeItem: (itemId) => {
        const { items } = get();
        set({
          items: items.filter((item) => item && item.id !== itemId),
        });
      },

      // Update item quantity
      updateItemQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const { items } = get();
        set({
          items: items.map((item) =>
            item && item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      // Clear cart
      clearCart: () => {
        set({ items: [] });
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Set error state
      setError: (error) => {
        set({ error });
      },

      // Set cart items (for API sync)
      setItems: (items) => {
        set({ items });
      },

      // Get total items count
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item?.quantity || 0), 0);
      },

      // Get total price
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + (item?.price || 0) * (item?.quantity || 0),
          0
        );
      },

      // Check if cart is empty
      isEmpty: () => {
        const { items } = get();
        return items.length === 0;
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

export default useCartStore;
