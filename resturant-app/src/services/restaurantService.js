// Restaurant API service functions
import { API_BASE_URL } from "../config/api";

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

// Update basic restaurant information
export const updateBasicInfo = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant/basic-info`, {
      method: "PATCH",
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`خطأ في الخادم: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating basic info:", error);
    throw error;
  }
};

// Update contact information
export const updateContactInfo = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant/contact-info`, {
      method: "PATCH",
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`خطأ في الخادم: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating contact info:", error);
    throw error;
  }
};

// Update reservation settings
export const updateReservationSettings = async (data) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/restaurant/reservation-settings`,
      {
        method: "PATCH",
        headers: buildHeaders(true),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`خطأ في الخادم: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating reservation settings:", error);
    throw error;
  }
};

// Update operating hours
export const updateOperatingHours = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant/operating-hours`, {
      method: "PATCH",
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`خطأ في الخادم: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating operating hours:", error);
    throw error;
  }
};

// Update tables count
export const updateTablesCount = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant/tables`, {
      method: "PUT",
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`خطأ في الخادم: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating tables count:", error);
    throw error;
  }
};

// Update full restaurant information
export const updateFullRestaurant = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant`, {
      method: "PUT",
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`خطأ في الخادم: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating full restaurant:", error);
    throw error;
  }
};

// Update social media URLs
export const updateSocialMedia = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurant/social-media`, {
      method: "PATCH",
      headers: buildHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`خطأ في الخادم: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating social media:", error);
    throw error;
  }
};
