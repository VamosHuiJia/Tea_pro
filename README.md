# 🍃 Tea Shop (Frontend)

> Giao diện người dùng cho hệ thống website thương mại điện tử **Huy Bán Trà** – Hiện đại, tinh tế và tối ưu trải nghiệm.

---

## 📖 Giới thiệu

**Tea Shop** là một website mua bán trà trực tuyến cao cấp. Giao diện được thiết kế với phong cách tối giản, sang trọng, mang lại cảm giác thư thái cho người dùng khi mua sắm các sản phẩm trà. Dự án bao gồm cả trang dành cho Khách hàng (Client) và Trang quản trị (Admin Dashboard).

## 🚀 Công nghệ sử dụng

- **Core**: React 19, TypeScript, Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion, AOS (Animate On Scroll)
- **Data Fetching**: Axios
- **Icons**: Lucide React
- **Tiện ích khác**: React Countup, React Intersection Observer, xlsx

---

## ✨ Tính năng nổi bật

### 🛍️ Dành cho Khách hàng (Client)
- **Trang chủ trực quan**: Banner động, danh mục sản phẩm nổi bật với hiệu ứng animation mượt mà (Framer Motion, AOS).
- **Danh sách & Lọc sản phẩm**: Hiển thị đa dạng các loại trà, hỗ trợ tìm kiếm và lọc theo danh mục.
- **Chi tiết sản phẩm**: Xem thông tin chi tiết, giá cả và hình ảnh trực quan.
- **Giỏ hàng & Thanh toán**: Quản lý giỏ hàng nhanh chóng, quy trình mua sắm tiện lợi.
- **Responsive Design**: Hoạt động hoàn hảo trên mọi kích thước màn hình (Mobile, Tablet, Desktop).

### ⚙️ Dành cho Quản trị viên (Admin)
- **Dashboard Thống kê**: Theo dõi doanh thu, số lượng đơn hàng, người dùng thông qua giao diện tổng quan.
- **Quản lý Sản phẩm & Danh mục**: Thêm mới, cập nhật, xóa sản phẩm và tải ảnh lên (kết nối API Backend).
- **Quản lý Đơn hàng**: Theo dõi và cập nhật trạng thái các đơn hàng từ khách.
- **Quản lý Khách hàng**: Xem danh sách khách hàng và thông tin cơ bản.
- **Xuất dữ liệu**: Hỗ trợ xuất dữ liệu ra file Excel (sử dụng thư viện `xlsx`).

---

## ⚙️ Yêu cầu hệ thống

- **Node.js**: `v18.x` trở lên
- **NPM** hoặc **Yarn**

---

## 🛠️ Hướng dẫn cài đặt & Chạy dự án

### 1. Clone dự án

```bash
git clone https://github.com/VamosHuiJia/Tea_pro.git
cd FE-tea-react
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` ở thư mục gốc dự án:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Khởi động ứng dụng

**Chế độ phát triển (Development):**
```bash
npm run dev
```

**Build và chạy bằng CSS đã nén:**
```bash
npm run build
npm run preview
```

---

## 🎨 Cấu trúc thư mục (Tham khảo)

- `src/pages`: Chứa các trang giao diện (Client, Admin)
- `src/components`: Các component dùng chung (Button, Card, Modal, Navbar v.v.)
- `src/services`: Các file xử lý gọi API bằng Axios
- `src/assets`: Chứa hình ảnh, fonts, icons tĩnh
- `src/index.css`: File cấu hình CSS global & Tailwind

---

## 👨‍💻 Tác giả

- **Gia Huy** - *Fullstack Developer*
