const API_BASE_URL = `${import.meta.env.REACT_APP_API_URL}/api`;

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Đăng nhập thất bại');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (username: string, email: string, password: string, phone: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, phone }),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Đăng ký thất bại');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};
