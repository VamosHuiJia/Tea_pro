import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type UserInfo = {
    username?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
    roleLevel?: string;
};

type OrderItem = {
    id: string;
    date: string;
    total: number;
    status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
    products: number;
};

const mockOrders: OrderItem[] = [
    {
        id: "DH001",
        date: "19/03/2026",
        total: 320000,
        status: "completed",
        products: 3,
    },
    {
        id: "DH002",
        date: "17/03/2026",
        total: 185000,
        status: "shipping",
        products: 2,
    },
    {
        id: "DH003",
        date: "14/03/2026",
        total: 540000,
        status: "pending",
        products: 5,
    },
];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(value);

const getStatusLabel = (status: OrderItem["status"]) => {
    switch (status) {
        case "pending":
            return "Chờ xác nhận";
        case "confirmed":
            return "Đã xác nhận";
        case "shipping":
            return "Đang giao";
        case "completed":
            return "Hoàn thành";
        case "cancelled":
            return "Đã hủy";
        default:
            return status;
    }
};

const getStatusClass = (status: OrderItem["status"]) => {
    switch (status) {
        case "pending":
            return "bg-amber-50 text-amber-700 border-amber-200";
        case "confirmed":
            return "bg-sky-50 text-sky-700 border-sky-200";
        case "shipping":
            return "bg-violet-50 text-violet-700 border-violet-200";
        case "completed":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "cancelled":
            return "bg-red-50 text-red-700 border-red-200";
        default:
            return "bg-gray-50 text-gray-700 border-gray-200";
    }
};

export default function Profile() {
    const navigate = useNavigate();

    const user: UserInfo | null = useMemo(() => {
        const raw = localStorage.getItem("user");
        if (!raw) return null;

        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }, []);

    const totalOrders = mockOrders.length;
    const completedOrders = mockOrders.filter((item) => item.status === "completed").length;
    const pendingOrders = mockOrders.filter(
        (item) => item.status === "pending" || item.status === "confirmed" || item.status === "shipping"
    ).length;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-changed"));
        navigate("/");
    };

    if (!user) {
        return (
            <section className="container">
                <div className="rounded-[28px] border border-n-100 bg-white p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-n-800">Thông tin tài khoản</h1>
                    <p className="mt-3 text-n-500">Bạn chưa đăng nhập.</p>
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="mt-6 rounded-2xl bg-p-900 px-5 py-3 text-sm font-medium text-white border-0 hover:bg-p-700"
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="container">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
                <aside className="rounded-[28px] border border-n-100 bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-p-100 bg-p-50">
                            {user.avatar ? (
                                <img src={user.avatar} alt="avatar" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-p-900">
                                    {(user.fullName || user.username || "U").charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-n-800">
                            {user.fullName || user.username || "Người dùng"}
                        </h1>
                        <p className="mt-1 text-sm text-n-500">{user.roleLevel || "user"}</p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="rounded-2xl bg-n-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-wide text-n-500">Tên đăng nhập</p>
                            <p className="mt-1 text-sm font-medium text-n-800">{user.username || "-"}</p>
                        </div>

                        <div className="rounded-2xl bg-n-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-wide text-n-500">Email</p>
                            <p className="mt-1 text-sm font-medium text-n-800">{user.email || "-"}</p>
                        </div>

                        <div className="rounded-2xl bg-n-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-wide text-n-500">Số điện thoại</p>
                            <p className="mt-1 text-sm font-medium text-n-800">{user.phone || "-"}</p>
                        </div>

                        <div className="rounded-2xl bg-n-50 px-4 py-3">
                            <p className="text-xs uppercase tracking-wide text-n-500">Địa chỉ</p>
                            <p className="mt-1 text-sm font-medium text-n-800">{user.address || "-"}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-8 w-full rounded-2xl border-0 bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Đăng xuất
                    </button>
                </aside>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-[24px] border border-n-100 bg-white p-5 shadow-sm">
                            <p className="text-sm text-n-500">Tổng đơn hàng</p>
                            <h2 className="mt-2 text-3xl font-bold text-n-800">{totalOrders}</h2>
                        </div>

                        <div className="rounded-[24px] border border-n-100 bg-white p-5 shadow-sm">
                            <p className="text-sm text-n-500">Đơn đang xử lý</p>
                            <h2 className="mt-2 text-3xl font-bold text-n-800">{pendingOrders}</h2>
                        </div>

                        <div className="rounded-[24px] border border-n-100 bg-white p-5 shadow-sm">
                            <p className="text-sm text-n-500">Đơn hoàn thành</p>
                            <h2 className="mt-2 text-3xl font-bold text-n-800">{completedOrders}</h2>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-n-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-n-800">Đơn hàng đã đặt</h2>
                                <p className="mt-1 text-sm text-n-500">
                                    Theo dõi danh sách đơn hàng gần đây của bạn
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            {mockOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="rounded-[24px] border border-n-100 bg-n-50 p-5 transition hover:shadow-sm"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-n-500">
                                                Mã đơn hàng
                                            </p>
                                            <h3 className="mt-1 text-lg font-semibold text-n-800">
                                                #{order.id}
                                            </h3>
                                            <p className="mt-2 text-sm text-n-500">Ngày đặt: {order.date}</p>
                                        </div>

                                        <div className="flex flex-col gap-3 md:items-end">
                                            <span
                                                className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >
                                                {getStatusLabel(order.status)}
                                            </span>
                                            <p className="text-sm text-n-500">{order.products} sản phẩm</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-n-100 pt-4">
                                        <p className="text-sm text-n-500">Tổng tiền</p>
                                        <p className="text-lg font-bold text-p-900">
                                            {formatCurrency(order.total)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {mockOrders.length === 0 && (
                                <div className="rounded-2xl border border-dashed border-n-200 p-8 text-center text-n-500">
                                    Bạn chưa có đơn hàng nào.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}