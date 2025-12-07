import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAvailableTables,
  reserveTable,
  getUserReservations,
} from "../services/reservationService";

// Query keys
export const reservationKeys = {
  all: ["reservations"],
  lists: () => [...reservationKeys.all, "list"],
  list: (filters) => [...reservationKeys.lists(), { filters }],
  availableTables: (params) => [
    ...reservationKeys.all,
    "availableTables",
    params,
  ],
  userReservations: () => [...reservationKeys.all, "userReservations"],
};

// Get available tables query
export const useAvailableTablesQuery = ({ date, startTime, endTime }) => {
  return useQuery({
    queryKey: reservationKeys.availableTables({ date, startTime, endTime }),
    queryFn: () => getAvailableTables({ date, startTime, endTime }),
    enabled: !!(date && startTime && endTime), // Only run if all params are provided
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

// Get user reservations query
export const useUserReservationsQuery = () => {
  return useQuery({
    queryKey: reservationKeys.userReservations(),
    queryFn: getUserReservations,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Reserve table mutation
export const useReserveTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reserveTable,
    onSuccess: (data) => {
      // Invalidate and refetch user reservations
      queryClient.invalidateQueries({
        queryKey: reservationKeys.userReservations(),
      });

      // Optionally invalidate available tables queries as well
      queryClient.invalidateQueries({
        queryKey: reservationKeys.availableTables({}),
      });

      return data;
    },
    onError: (error) => {
      console.error("Reservation failed:", error);
      throw error;
    },
  });
};
