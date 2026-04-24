import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, PackageCheck, Clock3, ShoppingBag, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useConfirm } from "../../contexts/ConfirmContext";
import { getMyOrders, cancelOrder } from "../../api/shop/order.api";

type OrderItem = {
    id: number;
    created_at: string;
    totalAmount: number;
    status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
    orderDetails: {
        id: number;
        productId: number;
        quantity: number;
        price: number;
        product?: {
            id: number;
            name: string;
            urlImg: string;
        };
    }[];
    payment: {
        method: string;
        status: string;
    };
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value);

const getStatusLabel = (status: OrderItem["status"]) => {
    switch (status) {
        case "pending":
            return "Chờ xác nhận";
        case "confirmed":
            return "Đã xác nhận";
        case "shipping":
            return "Đang giao";
        case "delivered":
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
        case "delivered":
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
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const data = await getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng", error);
            showToast("Không thể tải danh sách đơn hàng", "error");
        }
    };

    const totalOrders = orders.length;
    const completedOrders = orders.filter((item) => item.status === "delivered").length;
    const processingOrders = orders.filter(
        (item) => item.status === "pending" || item.status === "confirmed" || item.status === "shipping"
    ).length;

    const handleLogout = async () => {
        await logout();
    };

    const handleViewOrder = (order: OrderItem) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCancelOrder = async (orderId: number) => {
        const isConfirmed = await confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
        if (!isConfirmed) return;

        try {
            await cancelOrder(orderId);
            showToast("Hủy đơn hàng thành công", "success");
            fetchOrders();
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng", error);
            showToast("Có lỗi xảy ra khi hủy đơn", "error");
        }
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
                                    {orders.length} đơn
                                </div>
                            </div>

                            <div className="mt-5 max-h-[460px] space-y-4 overflow-y-auto pr-2">
                                {orders.map((order) => {
                                    const productCount = order.orderDetails?.reduce((acc, curr) => acc + curr.quantity, 0) || 0;
                                    return (
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
                                                    <p className="mt-2 text-sm text-n-500">Ngày đặt: {new Date(order.created_at).toLocaleDateString("vi-VN")}</p>
                                                </div>

                                                <div className="flex flex-col items-start gap-2 sm:items-end">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleViewOrder(order)}
                                                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-p-100 bg-white text-n-700 transition hover:border-p-200 hover:bg-p-50 hover:text-p-900"
                                                            title="Xem chi tiết đơn hàng"
                                                        >
                                                            <Eye size={18} />
                                                        </button>

                                                        {order.status === 'pending' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCancelOrder(order.id)}
                                                                className="inline-flex items-center rounded-full border border-red-200 bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 transition"
                                                            >
                                                                Hủy đơn
                                                            </button>
                                                        )}

                                                        <span
                                                            className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                                                                order.status
                                                            )}`}
                                                        >
                                                            {getStatusLabel(order.status)}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm text-n-500">{productCount} sản phẩm</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-n-100 pt-4">
                                                <p className="text-sm text-n-500">Tổng tiền</p>
                                                <p className="text-xl font-bold text-p-900">
                                                    {formatCurrency(Number(order.totalAmount))}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}

                                {orders.length === 0 && (
                                    <div className="rounded-2xl border border-dashed border-n-200 p-8 text-center text-n-500">
                                        Bạn chưa có đơn hàng nào.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Order Details Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between border-b border-p-100 px-6 py-4">
                            <h3 className="text-xl font-bold text-n-800">
                                Chi tiết đơn hàng #{selectedOrder.id}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-full p-2 text-n-500 hover:bg-n-100 hover:text-n-700 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(selectedOrder.status)}`}>
                                    {getStatusLabel(selectedOrder.status)}
                                </span>
                                <span className="text-sm text-n-500">
                                    Ngày đặt: {new Date(selectedOrder.created_at).toLocaleString("vi-VN")}
                                </span>
                            </div>

                            <div className="rounded-2xl border border-p-100 bg-p-50/30 p-4 space-y-3">
                                <h4 className="font-semibold text-n-800 border-b border-p-100 pb-2">Danh sách sản phẩm</h4>
                                <div className="space-y-4">
                                    {selectedOrder.orderDetails?.map((detail) => (
                                        <div key={detail.id} className="flex items-center gap-4">
                                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-p-100 bg-white">
                                                <img
                                                    src={detail.product?.urlImg || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=200&auto=format&fit=crop"}
                                                    alt={detail.product?.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="truncate font-medium text-n-800">{detail.product?.name || "Sản phẩm"}</h5>
                                                <p className="text-sm text-n-500">Số lượng: {detail.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-n-800">{formatCurrency(Number(detail.price))}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-p-100 pt-4">
                                <span className="font-semibold text-n-600">Tổng cộng:</span>
                                <span className="text-2xl font-bold text-p-900">{formatCurrency(Number(selectedOrder.totalAmount))}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}