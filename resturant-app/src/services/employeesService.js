import { API_BASE_URL } from "../config/api";

const API_URL = API_BASE_URL;

const getAuthToken = () => {
  return (
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token")
  );
};

// Helper function to make API calls with auth
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("المصادقة مطلوبة. يرجى تسجيل الدخول أولاً.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_token");
      throw new Error(
        "انتهت صلاحية جلسة المصادقة. يرجى تسجيل الدخول مرة أخرى."
      );
    }

    if (response.status === 403) {
      throw new Error("ليس لديك صلاحية للوصول إلى هذه الميزة.");
    }

    const errorData = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

// Get all employees with filtering and pagination
export const getAllEmployees = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams();

    // Add pagination params
    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);

    // Add filter params
    if (params.search) searchParams.append("search", params.search);
    if (params.job) searchParams.append("job", params.job);
    if (params.isActive !== undefined)
      searchParams.append("isActive", params.isActive);

    const queryString = searchParams.toString();
    const endpoint = `/employees${queryString ? `?${queryString}` : ""}`;

    const data = await apiCall(endpoint);
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// Get single employee by ID
export const getEmployeeById = async (id) => {
  try {
    const data = await apiCall(`/employees/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error;
  }
};

// Create new employee
export const createEmployee = async (employeeData) => {
  try {
    const data = await apiCall("/employees", {
      method: "POST",
      body: JSON.stringify(employeeData),
    });
    return data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

// Update employee
export const updateEmployee = async (id, employeeData) => {
  try {
    const data = await apiCall(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employeeData),
    });
    return data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

// Soft delete employee
export const deleteEmployee = async (id) => {
  try {
    const data = await apiCall(`/employees/${id}`, {
      method: "DELETE",
    });
    return data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

// Permanent delete employee
export const permanentDeleteEmployee = async (id) => {
  try {
    const data = await apiCall(`/employees/${id}?permanent=true`, {
      method: "DELETE",
    });
    return data;
  } catch (error) {
    console.error("Error permanently deleting employee:", error);
    throw error;
  }
};

// Job positions for dropdown
export const JOB_POSITIONS = [
  "Manager",
  "Chef",
  "Sous Chef",
  "Cook",
  "Waiter",
  "Waitress",
  "Host",
  "Hostess",
  "Bartender",
  "Cashier",
  "Kitchen Assistant",
  "Dishwasher",
  "Cleaner",
  "Security",
  "Delivery",
  "Other",
];

// Helper function to get job position in Arabic
export const getJobInArabic = (job) => {
  const jobTranslations = {
    Manager: "مدير",
    Chef: "شيف",
    "Sous Chef": "مساعد شيف",
    Cook: "طباخ",
    Waiter: "نادل",
    Waitress: "نادلة",
    Host: "مضيف",
    Hostess: "مضيفة",
    Bartender: "خادم المشروبات",
    Cashier: "أمين الصندوق",
    "Kitchen Assistant": "مساعد مطبخ",
    Dishwasher: "غاسل الأطباق",
    Cleaner: "عامل نظافة",
    Security: "أمن",
    Delivery: "توصيل",
    Other: "أخرى",
  };

  return jobTranslations[job] || job;
};
