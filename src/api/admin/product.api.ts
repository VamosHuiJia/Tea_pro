const API_BASE_URL = `${import.meta.env.REACT_APP_API_URL}/api`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = new Headers();
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export const getAllProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products/all-products`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi lấy danh sách sản phẩm");
    return result;
};

export const getProductById = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi lấy dữ liệu sản phẩm");
    return result;
};

export const createProduct = async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/products/create-product`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi thêm sản phẩm");
    return result;
};

export const updateProduct = async (id: number, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/products/update-product/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi cập nhật sản phẩm");
    return result;
};

export const deleteProduct = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/products/delete-product/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi xóa sản phẩm");
    return result;
};
