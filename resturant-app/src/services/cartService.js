// Cart API service functions
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
export const addToCart = async (item) => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
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
