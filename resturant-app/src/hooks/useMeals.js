import { useQuery } from "@tanstack/react-query";
import {
  getMeals,
  getMealsByTags,
  getTopDemandedMeals,
} from "../services/mealsService";

// Query keys for meals
export const mealsKeys = {
  all: ["meals"],
  lists: () => [...mealsKeys.all, "list"],
  list: (filters) => [...mealsKeys.lists(), filters],
  tagMeals: (tagIds, filters) => [
    ...mealsKeys.all,
    "tagMeals",
    tagIds.sort().join(","),
    filters,
  ],
  topDemanded: (limit) => [...mealsKeys.all, "topDemanded", limit],
};

// Custom hook to fetch meals with pagination and filters
export const useMealsQuery = ({
  page = 1,
  pageSize = 10,
  category,
  type,
  isAvailable,
  minPrice,
  maxPrice,
  search,
  sortBy,
  sortOrder,
  tags,
} = {}) => {
  const filters = {
    page,
    pageSize,
    category,
    type,
    isAvailable,
    minPrice,
    maxPrice,
    search,
    sortBy,
    sortOrder,
  };

  // Use the tags endpoint when any tags are selected
  const shouldUseTagsEndpoint = tags && tags.length > 0;

  return useQuery({
    queryKey: shouldUseTagsEndpoint
      ? mealsKeys.tagMeals(tags, filters)
      : mealsKeys.list({ ...filters, tags }),
    queryFn: () => {
      if (shouldUseTagsEndpoint) {
        return getMealsByTags(tags, filters);
      } else {
        return getMeals(filters);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading new data
    retry: 2,
  });
};

// Custom hook to fetch top demanded meals
export const useTopDemandedMealsQuery = (limit = 3) => {
  return useQuery({
    queryKey: mealsKeys.topDemanded(limit),
    queryFn: () => getTopDemandedMeals(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes - top demanded meals change less frequently
    retry: 2,
  });
};
