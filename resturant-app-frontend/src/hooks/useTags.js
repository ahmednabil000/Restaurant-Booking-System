import { useQuery } from "@tanstack/react-query";
import { getTags } from "../services/tagsService";

// Query keys
export const tagsKeys = {
  all: ["tags"],
  lists: () => [...tagsKeys.all, "list"],
};

// Get tags query
export const useTagsQuery = () => {
  return useQuery({
    queryKey: tagsKeys.lists(),
    queryFn: getTags,
    staleTime: 10 * 60 * 1000, // 10 minutes - tags don't change often
    cacheTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });
};
