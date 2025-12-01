// Cart API service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Get user's cart
export const getCart = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (mealId, quantity = 1) => {
  try {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("المستخدم غير مسجل الدخول");
    }

    if (!mealId) {
      throw new Error("معرف الوجبة مطلوب");
    }

    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mealId,
        quantity: quantity || 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `خطأ في إضافة الوجبة للسلة: ${response.status} - ${errorData}`
      );
    }

    const data = await response.json();

    // Log the response to understand the structure
    console.log("Add to cart response:", data);

    return data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/cart/item/${cartItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

// Update item quantity in cart
export const updateItemQuantity = async (cartItemId, quantity) => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(
      `${API_BASE_URL}/cart/item/${cartItemId}/quantity`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw error;
  }
};

// Clear all items from cart
export const clearCart = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
