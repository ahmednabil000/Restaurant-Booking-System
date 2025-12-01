// Reservation API service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Helper function to get auth token
const getAuthToken = () => {
  return (
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );
};

// Helper function to build request headers
const buildHeaders = (includeAuth = true) => {
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

// Get available tables for a specific date and time range
export const getAvailableTables = async ({ date, startTime, endTime }) => {
  try {
    const params = new URLSearchParams({ date, startTime, endTime });
    const response = await fetch(
      `${API_BASE_URL}/reservations/available?${params.toString()}`,
      {
        method: "GET",
        headers: buildHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`خطأ في الخادم: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("API endpoint غير متاح حالياً");
    }

    const data = await response.json();

    // Extract available table numbers from the nested response structure
    let availableTables = [];

    if (
      data &&
      data.success &&
      data.data &&
      data.data.availability &&
      data.data.availability.availableTableNumbers
    ) {
      // API returns: { success: true, data: { availability: { availableTableNumbers: ["T01", "T02", ...] } } }
      availableTables = data.data.availability.availableTableNumbers
        .filter(Boolean)
        .map((tableNumber) => String(tableNumber));
    } else if (
      data &&
      data.availability &&
      data.availability.availableTableNumbers
    ) {
      // Fallback: direct availability object
      availableTables = data.availability.availableTableNumbers
        .filter(Boolean)
        .map((tableNumber) => String(tableNumber));
    } else if (Array.isArray(data)) {
      // Fallback: if data is directly an array
      availableTables = data
        .map((t) => (typeof t === "object" ? t.number || t.id || "" : t))
        .filter(Boolean);
    }

    return {
      success: true,
      availableTables,
      rawResponse: data,
    };
  } catch (error) {
    console.error("Error fetching available tables:", error);
    throw error;
  }
};

// Create a new reservation
export const createReservation = async (reservationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      throw new Error(`خطأ في إنشاء الحجز: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

// Reserve a table with the expected API format
export const reserveTable = async (reservationData) => {
  try {
    // Format the data according to the expected API structure
    // Ensure all required properties are sent in the request body
    const formattedData = {
      fullName: reservationData.name || reservationData.fullName,
      phone: reservationData.phone,
      peopleNum: parseInt(reservationData.guests || reservationData.peopleNum),
      date: reservationData.date,
      startTime: reservationData.startTime,
      endTime: reservationData.endTime,
      notes: reservationData.notes || "",
      tableNumber: reservationData.tableNumber,
    };

    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `خطأ في إنشاء الحجز: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error reserving table:", error);
    throw error;
  }
};

// Get user's reservations
export const getUserReservations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/my`, {
      method: "GET",
      headers: buildHeaders(),
    });

    if (!response.ok) {
      throw new Error(`خطأ في جلب الحجوزات: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    throw error;
  }
};

// Cancel a reservation
export const cancelReservation = async (reservationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reservations/${reservationId}`,
      {
        method: "DELETE",
        headers: buildHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`خطأ في إلغاء الحجز: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error canceling reservation:", error);
    throw error;
  }
};

// Update a reservation
export const updateReservation = async (reservationId, updateData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reservations/${reservationId}`,
      {
        method: "PUT",
        headers: buildHeaders(),
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`خطأ في تحديث الحجز: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating reservation:", error);
    throw error;
  }
};
