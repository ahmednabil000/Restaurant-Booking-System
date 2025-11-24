import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
        });
        console.log("User logged in:", userData);
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
        // Clear all auth data from localStorage
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("authType");
        console.log("User logged out");
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      // Helper method to check if user is authenticated
      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && state.user;
      },
    }),
    {
      name: "auth-storage", // name of the item in localStorage
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
