const API_BASE_URL = `${import.meta.env.REACT_APP_API_URL || "http://localhost:8000"}/api`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export const getDashboardStats = async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi lấy thống kê");
    return result;
};
