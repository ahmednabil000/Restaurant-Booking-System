// Test script to verify working days API
const API_URL = process.env.API_URL || "http://localhost:8080";

const testWorkingDaysAPI = async () => {
  try {
    const response = await fetch(`${API_URL}/restaurant/working-days`);
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (response.ok) {
      const data = await response.json();
      console.log("Success! Data received:", data);
      return data;
    } else {
      console.log("Error response:", await response.text());
    }
  } catch (error) {
    console.log("Network error:", error);
  }
};

// Run the test
testWorkingDaysAPI();
