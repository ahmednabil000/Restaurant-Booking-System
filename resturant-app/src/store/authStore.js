import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearAuthData } from "../utils/auth";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: (userData, token = null) => {
        set({
          user: userData,
          isAuthenticated: true,
          token: token,
        });

        // Store JWT token if provided
        if (token) {
          localStorage.setItem("auth_token", token);
        }

        console.log("User logged in:", userData);
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        });

        // Clear all auth data from localStorage
        clearAuthData();
        console.log("User logged out");
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem("auth_token", token);
        }
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
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;
