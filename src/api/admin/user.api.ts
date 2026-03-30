const API_BASE_URL = `${import.meta.env.REACT_APP_API_URL || "http://localhost:8000"}/api`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = new Headers();
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export const getAllUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/users/all-user`, {
        headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi lấy danh sách người dùng");
    return result;
};

export const createUser = async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/users/create-user`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi tạo người dùng");
    return result;
};

export const updateUser = async (id: string, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/users/update-user/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi cập nhật người dùng");
    return result;
};

export const deleteUser = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi xóa người dùng");
    return result;
};
