// Reservation API service functions
import { API_BASE_URL } from "../config/api";

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
      paymentMethod: reservationData.paymentMethod || "cash", // "cash" or "card"
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

// ADMIN FUNCTIONS

// Get all reservations (Admin only)
export const getAllReservations = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    // Add pagination
    if (params.page) queryParams.append("page", params.page);
    if (params.pageSize) queryParams.append("pageSize", params.pageSize);

    // Add filters
    if (params.date) queryParams.append("date", params.date);
    if (params.status) queryParams.append("status", params.status);
    if (params.peopleNum) queryParams.append("peopleNum", params.peopleNum);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    // Add sorting
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await fetch(
      `${API_BASE_URL}/reservations?${queryParams.toString()}`,
      {
        method: "GET",
        headers: buildHeaders(true), // Admin auth required
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `خطأ في جلب الحجوزات: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    throw error;
  }
};

// Get reservation by ID
export const getReservationById = async (reservationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reservations/${reservationId}`,
      {
        method: "GET",
        headers: buildHeaders(false), // Public endpoint
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `خطأ في جلب الحجز: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching reservation by ID:", error);
    throw error;
  }
};

// Confirm reservation (Admin only)
export const confirmReservation = async (reservationId, data = {}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reservations/${reservationId}/confirm`,
      {
        method: "PUT",
        headers: buildHeaders(true), // Admin auth required
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `خطأ في تأكيد الحجز: ${response.status}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error confirming reservation:", error);
    throw error;
  }
};

// Reject reservation (Admin only)
export const rejectReservation = async (reservationId, reason) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reservations/${reservationId}/reject`,
      {
        method: "PUT",
        headers: buildHeaders(true), // Admin auth required
        body: JSON.stringify({ reason }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `خطأ في رفض الحجز: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error rejecting reservation:", error);
    throw error;
  }
};

// Complete reservation (Admin only)
export const completeReservation = async (reservationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reservations/${reservationId}/complete`,
      {
        method: "PUT",
        headers: buildHeaders(true), // Admin auth required
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `خطأ في إتمام الحجز: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error completing reservation:", error);
    throw error;
  }
};

// Mark reservation as no-show (Admin only)
export const markNoShow = async (reservationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reservations/${reservationId}/no-show`,
      {
        method: "PUT",
        headers: buildHeaders(true), // Admin auth required
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `خطأ في تسجيل عدم الحضور: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error marking no-show:", error);
    throw error;
  }
};

// Bulk update reservation status (Admin only)
export const bulkUpdateStatus = async (reservationIds, status, reason = "") => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations/bulk/status`, {
      method: "PUT",
      headers: buildHeaders(true), // Admin auth required
      body: JSON.stringify({
        reservationIds,
        status,
        reason,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `خطأ في التحديث الجماعي: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error bulk updating status:", error);
    throw error;
  }
};

// Send confirmation notification (Admin only)
export const sendConfirmationNotification = async (
  reservationId,
  method = "email"
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reservations/${reservationId}/send-confirmation`,
      {
        method: "POST",
        headers: buildHeaders(true), // Admin auth required
        body: JSON.stringify({ method }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `خطأ في إرسال التأكيد: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending confirmation:", error);
    throw error;
  }
};

// Send rejection notification (Admin only)
export const sendRejectionNotification = async (
  reservationId,
  method = "email",
  reason = ""
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reservations/${reservationId}/send-rejection`,
      {
        method: "POST",
        headers: buildHeaders(true), // Admin auth required
        body: JSON.stringify({ method, reason }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `خطأ في إرسال الرفض: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending rejection:", error);
    throw error;
  }
};
