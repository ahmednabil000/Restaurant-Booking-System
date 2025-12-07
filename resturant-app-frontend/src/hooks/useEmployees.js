import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as employeesService from "../services/employeesService";

// Query keys
export const employeeKeys = {
  all: ["employees"],
  lists: () => [...employeeKeys.all, "list"],
  list: (filters) => [...employeeKeys.lists(), { filters }],
  details: () => [...employeeKeys.all, "detail"],
  detail: (id) => [...employeeKeys.details(), id],
};

// Get all employees query
export const useEmployeesQuery = (params = {}) => {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => employeesService.getAllEmployees(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Get single employee query
export const useEmployeeQuery = (id) => {
  return useQuery({
    queryKey: employeeKeys.detail(id),
    queryFn: () => employeesService.getEmployeeById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Create employee mutation
export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeesService.createEmployee,
    onSuccess: () => {
      // Invalidate and refetch employees list and stats
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.stats() });
    },
    onError: (error) => {
      console.error("Create employee failed:", error);
    },
  });
};

// Update employee mutation
export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => employeesService.updateEmployee(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch employees list
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      // Update the specific employee cache
      queryClient.invalidateQueries({
        queryKey: employeeKeys.detail(variables.id),
      });
    },
    onError: (error) => {
      console.error("Update employee failed:", error);
    },
  });
};

// Delete employee mutation (soft delete)
export const useDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeesService.deleteEmployee,
    onSuccess: () => {
      // Invalidate and refetch employees list
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
    onError: (error) => {
      console.error("Delete employee failed:", error);
    },
  });
};

// Permanent delete employee mutation
export const usePermanentDeleteEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeesService.permanentDeleteEmployee,
    onSuccess: () => {
      // Invalidate and refetch employees list
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
    onError: (error) => {
      console.error("Permanent delete employee failed:", error);
    },
  });
};

// Combined hook for employee operations
export const useEmployeeOperations = () => {
  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation();
  const deleteMutation = useDeleteEmployeeMutation();
  const permanentDeleteMutation = usePermanentDeleteEmployeeMutation();

  return {
    createEmployee: createMutation.mutateAsync,
    updateEmployee: updateMutation.mutateAsync,
    deleteEmployee: deleteMutation.mutateAsync,
    permanentDeleteEmployee: permanentDeleteMutation.mutateAsync,
    isLoading:
      createMutation.isLoading ||
      updateMutation.isLoading ||
      deleteMutation.isLoading ||
      permanentDeleteMutation.isLoading,
    errors: {
      create: createMutation.error,
      update: updateMutation.error,
      delete: deleteMutation.error,
      permanentDelete: permanentDeleteMutation.error,
    },
  };
};
