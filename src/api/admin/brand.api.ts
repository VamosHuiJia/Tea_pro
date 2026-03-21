const API_BASE_URL = `${import.meta.env.REACT_APP_API_URL || 'http://localhost:5000'}/api`;

export const getAllBrands = async () => {
    const response = await fetch(`${API_BASE_URL}/brands/all-brands`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi lấy danh sách thương hiệu");
    return result;
};

export const getBrandById = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/brands/${id}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi lấy dữ liệu thương hiệu");
    return result;
};

export const createBrand = async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/brands/create-brand`, {
        method: "POST",
        body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi thêm thương hiệu");
    return result;
};

export const updateBrand = async (id: number, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/brands/update-brand/${id}`, {
        method: "PATCH",
        body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi cập nhật thương hiệu");
    return result;
};

export const deleteBrand = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/brands/delete-brand/${id}`, {
        method: "DELETE",
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Lỗi xóa thương hiệu");
    return result;
};
