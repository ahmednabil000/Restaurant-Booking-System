// Restaurant management hooks using React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRestaurantDetails,
  updateBasicInfo,
  updateContactInfo,
  updateReservationSettings,
  updateOperatingHours,
  updateTablesCount,
  updateFullRestaurant,
  updateSocialMedia,
} from "../services/restaurantService";

// Get restaurant details
export const useRestaurantQuery = () => {
  return useQuery({
    queryKey: ["restaurant", "details"],
    queryFn: getRestaurantDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Update restaurant information
export const useUpdateRestaurantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ endpoint, data }) => {
      switch (endpoint) {
        case "basic-info":
          return updateBasicInfo(data);
        case "contact-info":
          return updateContactInfo(data);
        case "social-media":
          return updateSocialMedia(data);
        case "reservation-settings":
          return updateReservationSettings(data);
        case "operating-hours":
          return updateOperatingHours(data);
        case "tables":
          return updateTablesCount(data);
        case "full":
          return updateFullRestaurant(data);
        default:
          throw new Error("Unknown endpoint");
      }
    },
    onSuccess: () => {
      // Invalidate and refetch restaurant data
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
    },
    onError: (error) => {
      console.error("Restaurant update failed:", error);
    },
  });
};
