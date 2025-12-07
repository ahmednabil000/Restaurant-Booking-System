import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateItemQuantity as updateItemQuantityService,
  clearCart,
} from "../services/cartService";
import useCartStore from "../store/cartStore";

// Query keys
export const cartKeys = {
  all: ["cart"],
  lists: () => [...cartKeys.all, "list"],
  list: (filters) => [...cartKeys.lists(), { filters }],
  details: () => [...cartKeys.all, "detail"],
  detail: (id) => [...cartKeys.details(), id],
};

// Get cart query
export const useCartQuery = () => {
  const { setItems, setLoading, setError } = useCartStore();

  return useQuery({
    queryKey: cartKeys.lists(),
    queryFn: getCart,
    onSuccess: (data) => {
      setItems(data.items || []);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Add to cart mutation
export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
  const { addItem, setError } = useCartStore();

  return useMutation({
    mutationFn: ({ mealId, quantity }) => addToCart(mealId, quantity),
    onSuccess: (data) => {
      try {
        // Handle different possible API response structures
        const item = data.item || data;

        if (item) {
          // Update local state
          addItem(item);
          // Invalidate and refetch cart query
          queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
        } else {
          console.error("Invalid API response structure:", data);
        }
      } catch (error) {
        console.error("Error processing add to cart success:", error);
        setError("خطأ في معالجة إضافة العنصر للسلة");
      }
    },
    onError: (error) => {
      console.error("Add to cart error:", error);
      setError(error.message || "خطأ في إضافة العنصر للسلة");
    },
  });
};

// Remove from cart mutation
export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();
  const { removeItem, setError } = useCartStore();

  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: (data, variables) => {
      // Update local state
      removeItem(variables);
      // Invalidate and refetch cart query
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
    },
    onError: (error) => {
      setError(error.message);
    },
  });
};

// Update cart item quantity mutation
export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();
  const { updateItemQuantity, setError } = useCartStore();

  return useMutation({
    mutationFn: ({ cartItemId, quantity }) =>
      updateItemQuantityService(cartItemId, quantity),
    onSuccess: (data, variables) => {
      // Update local state
      updateItemQuantity(variables.cartItemId, variables.quantity);
      // Invalidate and refetch cart query
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
    },
    onError: (error) => {
      setError(error.message);
    },
  });
};

// Clear cart mutation
export const useClearCartMutation = () => {
  const queryClient = useQueryClient();
  const { clearCart: clearCartStore, setError } = useCartStore();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      // Update local state
      clearCartStore();
      // Invalidate and refetch cart query
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
    },
    onError: (error) => {
      setError(error.message);
    },
  });
};
