const API_BASE_URL = `${import.meta.env.REACT_APP_API_URL}/api`;

export const getAllCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/categories/all-categories`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi lấy danh sách danh mục");
    return result;
};

export const getCategoryById = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi lấy dữ liệu danh mục");
    return result;
};

export const createCategory = async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/categories/create-cate`, {
        method: "POST",
        body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi thêm danh mục");
    return result;
};

export const updateCategory = async (id: number, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/categories/update-cate/${id}`, {
        method: "PATCH",
        body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi cập nhật danh mục");
    return result;
};

export const deleteCategory = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/categories/delete-cate/${id}`, {
        method: "DELETE",
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi xóa danh mục");
    return result;
};
