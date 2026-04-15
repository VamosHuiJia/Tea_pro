import { useNavigate } from "react-router-dom";
import { Eye, PackageCheck, Clock3, ShoppingBag } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";



type OrderItem = {
    id: string;
    date: string;
    total: number;
    status: "pending" | "confirmed" | "shipping" | "completed" | "cancelled";
    products: number;
};

const mockOrders: OrderItem[] = [
    { id: "DH001", date: "19/03/2026", total: 320000, status: "completed", products: 3 },
    { id: "DH002", date: "17/03/2026", total: 185000, status: "shipping", products: 2 },
    { id: "DH003", date: "14/03/2026", total: 540000, status: "pending", products: 5 },
    { id: "DH004", date: "12/03/2026", total: 210000, status: "confirmed", products: 2 },
    { id: "DH005", date: "10/03/2026", total: 120000, status: "cancelled", products: 1 },
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

type StatCardProps = {
    icon: React.ReactNode;
    label: string;
    value: number;
    tone?: "green" | "soft" | "dark";
};

function StatCard({ icon, label, value, tone = "soft" }: StatCardProps) {
    const toneClass = {
        green:
            "border-p-200 bg-gradient-to-br from-p-50 via-white to-p-100/70",
        soft:
            "border-n-100 bg-white",
        dark:
            "border-p-900 bg-gradient-to-br from-p-900 to-p-700 text-white",
    };

    const iconClass = {
        green: "bg-p-100 text-p-700",
        soft: "bg-n-100 text-n-700",
        dark: "bg-white/15 text-white",
    };

    const labelClass = {
        green: "text-n-500",
        soft: "text-n-500",
        dark: "text-white/75",
    };

    const valueClass = {
        green: "text-p-900",
        soft: "text-n-800",
        dark: "text-white",
    };

    return (
        <div
            className={`rounded-[24px] border p-4 shadow-[0_10px_30px_rgba(15,109,81,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,109,81,0.10)] ${toneClass[tone]}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className={`text-sm ${labelClass[tone]}`}>{label}</p>
                    <h2 className={`mt-2 text-3xl font-bold ${valueClass[tone]}`}>{value}</h2>
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass[tone]}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const totalOrders = mockOrders.length;
    const completedOrders = mockOrders.filter((item) => item.status === "completed").length;
    const processingOrders = mockOrders.filter(
        (item) => item.status === "pending" || item.status === "confirmed" || item.status === "shipping"
    ).length;

    const handleLogout = async () => {
        await logout();
    };

    const handleViewOrder = (orderId: string) => {
        console.log("Xem chi tiết đơn:", orderId);
    };

    if (!user) {
        return (
            <section className="container !pt-24 md:!pt-28">
                <div className="mx-auto max-w-4xl rounded-[28px] border border-p-100 bg-white p-6 shadow-[0_14px_40px_rgba(13,71,56,0.06)]">
                    <h1 className="text-2xl font-bold text-n-800">Thông tin tài khoản</h1>
                    <p className="mt-3 text-n-500">Bạn chưa đăng nhập.</p>
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="mt-6 rounded-2xl border-0 bg-p-900 px-5 py-3 text-sm font-medium text-white hover:bg-p-700"
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="container !pt-24 md:!pt-28">
            <div className="mx-auto max-w-[1240px]">
                <div className="grid grid-cols-1 gap-6 xl:min-h-[calc(100vh-180px)] xl:grid-cols-[320px_minmax(0,1fr)] xl:items-stretch">
                    <aside className="flex h-full flex-col rounded-[28px] border border-p-100 bg-gradient-to-b from-white via-white to-p-50/40 p-5 shadow-[0_14px_40px_rgba(13,71,56,0.06)]">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-p-100 bg-gradient-to-br from-p-50 to-p-100 shadow-inner">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold text-p-900">
                                        {(user.fullName || user.username || "U").charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <h1 className="mt-4 text-2xl font-bold text-n-800">
                                {user.fullName || user.username || "Người dùng"}
                            </h1>
                            <p className="mt-1 inline-flex rounded-full bg-p-50 px-3 py-1 text-xs font-medium text-p-700">
                                {user.roleLevel || "user"}
                            </p>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="rounded-2xl border border-transparent bg-white px-4 py-7 shadow-sm ring-1 ring-n-100">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-n-500">Tên đăng nhập</p>
                                <p className="mt-1 text-sm font-semibold text-n-800">{user.username || "-"}</p>
                            </div>

                            <div className="rounded-2xl border border-transparent bg-white px-4 py-7 shadow-sm ring-1 ring-n-100">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-n-500">Email</p>
                                <p className="mt-1 break-all text-sm font-semibold text-n-800">{user.email || "-"}</p>
                            </div>

                            <div className="rounded-2xl border border-transparent bg-white px-4 py-7 shadow-sm ring-1 ring-n-100">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-n-500">Số điện thoại</p>
                                <p className="mt-1 text-sm font-semibold text-n-800">{user.phone || "-"}</p>
                            </div>

                            {/* <div className="rounded-2xl border border-transparent bg-white px-4 py-3 shadow-sm ring-1 ring-n-100">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-n-500">Địa chỉ</p>
                                <p className="mt-1 text-sm font-semibold text-n-800">{user.address || "-"}</p>
                            </div> */}
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-10 w-full rounded-2xl border-0 bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(220,38,38,0.22)] hover:from-red-700 hover:to-red-600"
                        >
                            Đăng xuất
                        </button>
                    </aside>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <StatCard
                                icon={<ShoppingBag size={20} />}
                                label="Tổng đơn hàng"
                                value={totalOrders}
                                tone="green"
                            />
                            <StatCard
                                icon={<Clock3 size={20} />}
                                label="Đơn đang xử lý"
                                value={processingOrders}
                                tone="soft"
                            />
                            <StatCard
                                icon={<PackageCheck size={20} />}
                                label="Đơn hoàn thành"
                                value={completedOrders}
                                tone="dark"
                            />
                        </div>

                        <div className="rounded-[28px] border border-p-100 bg-white p-5 shadow-[0_14px_40px_rgba(13,71,56,0.06)]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-n-800">Đơn hàng đã đặt</h2>
                                    <p className="mt-1 text-sm text-n-500">
                                        Theo dõi các đơn gần đây của bạn
                                    </p>
                                </div>

                                <div className="rounded-full bg-p-50 px-3 py-1 text-xs font-semibold text-p-700">
                                    {mockOrders.length} đơn
                                </div>
                            </div>

                            <div className="mt-5 max-h-[460px] space-y-4 overflow-y-auto pr-2">
                                {mockOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="rounded-[24px] border border-n-100 bg-gradient-to-r from-white to-p-50/30 p-4 transition hover:border-p-200 hover:shadow-[0_10px_30px_rgba(13,71,56,0.08)]"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <p className="text-[11px] uppercase tracking-[0.18em] text-n-500">
                                                    Mã đơn hàng
                                                </p>
                                                <h3 className="mt-1 text-xl font-bold text-n-800">#{order.id}</h3>
                                                <p className="mt-2 text-sm text-n-500">Ngày đặt: {order.date}</p>
                                            </div>

                                            <div className="flex flex-col items-start gap-2 sm:items-end">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleViewOrder(order.id)}
                                                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-p-100 bg-white text-n-700 transition hover:border-p-200 hover:bg-p-50 hover:text-p-900"
                                                        title="Xem chi tiết đơn hàng"
                                                    >
                                                        <Eye size={18} />
                                                    </button>

                                                    <span
                                                        className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                            order.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(order.status)}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-n-500">{order.products} sản phẩm</p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-n-100 pt-4">
                                            <p className="text-sm text-n-500">Tổng tiền</p>
                                            <p className="text-xl font-bold text-p-900">
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
            </div>
        </section>
    );
}