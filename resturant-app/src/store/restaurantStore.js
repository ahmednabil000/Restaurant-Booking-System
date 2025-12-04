import { create } from "zustand";
import { getRestaurantDetails } from "../services/restaurantService";

const useRestaurantStore = create((set) => ({
  restaurant: null,
  loading: false,
  error: null,
  fetchRestaurantDetails: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getRestaurantDetails();
      set({ restaurant: data, loading: false });
      return data;
    } catch (error) {
      console.error("Restaurant fetch error:", error);
      set({ error: error.message || "Failed to fetch", loading: false });
      return null;
    }
  },
}));

export default useRestaurantStore;
