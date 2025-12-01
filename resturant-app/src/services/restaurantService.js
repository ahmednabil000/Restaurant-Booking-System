// Restaurant API service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Helper function to get auth token
const getAuthToken = () => {
  return (
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );
};

// Helper function to build request headers
const buildHeaders = (includeAuth = false) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Get restaurant details
export const getRestaurantDetails = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant/details`, {
      method: "GET",
      headers: buildHeaders(true), // Include auth for restaurant details
    });

    if (!response.ok) {
      throw new Error(`خطأ في الخادم: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("API endpoint غير متاح حالياً");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    throw error;
  }
};

// Get restaurant menu
export const getRestaurantMenu = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant/menu`, {
      method: "GET",
      headers: buildHeaders(false), // Menu might be public
    });

    if (!response.ok) {
      throw new Error(`خطأ في الخادم: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching restaurant menu:", error);
    throw error;
  }
};

// Get restaurant hours
export const getRestaurantHours = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant/hours`, {
      method: "GET",
      headers: buildHeaders(false), // Hours might be public
    });

    if (!response.ok) {
      throw new Error(`خطأ في الخادم: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching restaurant hours:", error);
    throw error;
  }
};

// Get restaurant contact info
export const getRestaurantContact = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant/contact`, {
      method: "GET",
      headers: buildHeaders(false), // Contact info might be public
    });

    if (!response.ok) {
      throw new Error(`خطأ في الخادم: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching restaurant contact:", error);
    throw error;
  }
};
