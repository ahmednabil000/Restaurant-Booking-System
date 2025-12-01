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
      // For development: provide mock data when API is not available
      if (error.message.includes("API endpoint غير متاح")) {
        const mockData = {
          success: true,
          data: {
            id: "mock-id",
            name: "مطعم الأصالة العربية",
            address: "شارع الملك عبدالله، وسط البلد، عمان، الأردن",
            phone: "+962-6-123-4567",
            email: "info@alasala-restaurant.com",
            tablesCount: 15,
            description:
              "مطعم عربي أصيل يقدم أشهى المأكولات التقليدية والحديثة",
            workingDays: [
              {
                id: "1",
                name: "Sunday",
                startHour: "09:00:00",
                endHour: "23:00:00",
                isActive: true,
              },
              {
                id: "2",
                name: "Monday",
                startHour: "09:00:00",
                endHour: "23:00:00",
                isActive: true,
              },
              {
                id: "3",
                name: "Tuesday",
                startHour: "09:00:00",
                endHour: "23:00:00",
                isActive: true,
              },
              {
                id: "4",
                name: "Wednesday",
                startHour: "09:00:00",
                endHour: "23:00:00",
                isActive: true,
              },
              {
                id: "5",
                name: "Thursday",
                startHour: "09:00:00",
                endHour: "23:00:00",
                isActive: true,
              },
              {
                id: "6",
                name: "Friday",
                startHour: "14:00:00",
                endHour: "23:30:00",
                isActive: true,
              },
              {
                id: "7",
                name: "Saturday",
                startHour: "09:00:00",
                endHour: "23:00:00",
                isActive: true,
              },
            ],
          },
        };
        set({ restaurant: mockData, loading: false });
        return mockData;
      }
      set({ error: error.message || "Failed to fetch", loading: false });
      return null;
    }
  },
}));

export default useRestaurantStore;
