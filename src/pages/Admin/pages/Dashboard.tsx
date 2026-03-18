import {
    ArrowUpRight,
    BadgeDollarSign,
    Box,
    CupSoda,
    ShoppingBag,
    ShoppingCart,
    Star,
    Users,
} from "lucide-react";

type StatCardProps = {
    title: string;
    value: string;
    change: string;
    icon: React.ReactNode;
};

type OrderItem = {
    id: string;
    customer: string;
    product: string;
    total: string;
    status: "Đã thanh toán" | "Chờ xử lý" | "Đang giao";
};

const stats: StatCardProps[] = [
    {
        title: "Tổng doanh thu",
        value: "84.500.000đ",
        change: "+12.5% tháng này",
        icon: <BadgeDollarSign className="h-5 w-5" />,
    },
    {
        title: "Đơn hàng",
        value: "1,286",
        change: "+8.2% so với tuần trước",
        icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
        title: "Sản phẩm",
        value: "248",
        change: "+14 sản phẩm mới",
        icon: <Box className="h-5 w-5" />,
    },
    {
        title: "Khách hàng",
        value: "3,642",
        change: "+5.1% khách quay lại",
        icon: <Users className="h-5 w-5" />,
    },
];

const recentOrders: OrderItem[] = [
    {
        id: "#DH001",
        customer: "Nguyễn Minh Anh",
        product: "Trà Oolong Sữa",
        total: "245.000đ",
        status: "Đã thanh toán",
    },
    {
        id: "#DH002",
        customer: "Trần Gia Hân",
        product: "Trà Đào Cam Sả",
        total: "168.000đ",
        status: "Chờ xử lý",
    },
    {
        id: "#DH003",
        customer: "Lê Quốc Bảo",
        product: "Combo Trà Trái Cây",
        total: "320.000đ",
        status: "Đang giao",
    },
    {
        id: "#DH004",
        customer: "Phạm Thanh Tâm",
        product: "Matcha Latte",
        total: "189.000đ",
        status: "Đã thanh toán",
    },
];

const topProducts = [
    { name: "Trà Oolong Sữa", sold: 320, percent: 82 },
    { name: "Trà Đào Cam Sả", sold: 274, percent: 70 },
    { name: "Matcha Latte", sold: 231, percent: 61 },
    { name: "Hồng Trà Sữa", sold: 198, percent: 54 },
];

const weeklyBars = [45, 62, 58, 80, 66, 91, 72];

function getStatusClass(status: OrderItem["status"]) {
    switch (status) {
        case "Đã thanh toán":
            return "bg-p-100 text-p-700 border border-p-200";
        case "Chờ xử lý":
            return "bg-amber-100 text-amber-700 border border-amber-200";
        case "Đang giao":
            return "bg-sky-100 text-sky-700 border border-sky-200";
        default:
            return "bg-gray-100 text-gray-700 border border-gray-200";
    }
}

function StatCard({ title, value, change, icon }: StatCardProps) {
    return (
        <div className="rounded-3xl border border-p-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-p-50 text-p-700">
                    {icon}
                </div>
                <span className="rounded-full bg-p-50 px-3 py-1 text-xs font-semibold text-p-700">
                    Live
                </span>
            </div>

            <p className="text-sm font-medium text-n-500">{title}</p>
            <h3 className="mt-2 text-2xl font-bold text-n-800">{value}</h3>

            <div className="mt-3 flex items-center gap-2 text-sm text-p-700">
                <ArrowUpRight className="h-4 w-4" />
                <span>{change}</span>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Hero heading */}
            <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-p-900 via-p-700 to-p-500 p-6 text-white shadow-lg md:p-8">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-0 right-10 h-24 w-24 rounded-full bg-white/10 blur-xl" />

                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-medium text-white/80">
                            Trang quản trị cửa hàng trà
                        </p>
                        <h2 className="text-2xl font-bold md:text-4xl">
                            Hoạt động kinh doanh
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
                            Tận tâm từng tách – giữ chân từng khách
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm text-center">
                            <p className="text-xs text-white/70">Hôm nay</p>
                            <p className="mt-1 text-lg font-semibold">126 đơn</p>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm text-center">
                            <p className="text-xs text-white/70">Doanh thu</p>
                            <p className="mt-1 text-lg font-semibold">12.8tr</p>
                        </div>
                        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm col-span-2 sm:col-span-1 text-center">
                            <p className="text-xs text-white/70">Khách mới</p>
                            <p className="mt-1 text-lg font-semibold">+48</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                    <StatCard key={item.title} {...item} />
                ))}
            </section>

            {/* Main grid */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Revenue panel */}
                <div className="rounded-[28px] border border-p-100 bg-white p-5 shadow-sm xl:col-span-2">
                    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-n-500">Doanh thu 7 ngày</p>
                            <h2 className="mt-1 text-xl font-bold text-n-800">
                                Hiệu suất bán hàng trong tuần
                            </h2>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="rounded-full bg-p-900 px-4 py-2 text-sm font-semibold text-white border border-p-900">
                                7 ngày
                            </button>
                            <button className="rounded-full bg-p-50 px-4 py-2 text-sm font-semibold text-p-700 border border-p-100">
                                30 ngày
                            </button>
                        </div>
                    </div>

                    <div className="grid h-[280px] grid-cols-7 items-end gap-3">
                        {weeklyBars.map((value, index) => (
                            <div key={index} className="flex h-full flex-col items-center justify-end gap-3">
                                <div className="w-full rounded-t-[18px] bg-gradient-to-t from-p-700 to-p-300 shadow-sm transition-all duration-300 hover:from-p-900 hover:to-p-400"
                                    style={{ height: `${value}%` }}
                                />
                                <span className="text-xs font-medium text-n-500">
                                    T{index + 2}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right summary */}
                <div className="space-y-6">
                    <div className="rounded-[28px] border border-p-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-n-800">Mục tiêu tháng</h3>
                            <Star className="h-5 w-5 text-p-700" />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-n-500">Doanh thu</span>
                                    <span className="font-semibold text-n-800">84%</span>
                                </div>
                                <div className="h-3 rounded-full bg-p-50">
                                    <div className="h-3 w-[84%] rounded-full bg-gradient-to-r from-p-500 to-p-800" />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-n-500">Đơn hàng</span>
                                    <span className="font-semibold text-n-800">68%</span>
                                </div>
                                <div className="h-3 rounded-full bg-p-50">
                                    <div className="h-3 w-[68%] rounded-full bg-gradient-to-r from-p-400 to-p-700" />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-n-500">Khách quay lại</span>
                                    <span className="font-semibold text-n-800">73%</span>
                                </div>
                                <div className="h-3 rounded-full bg-p-50">
                                    <div className="h-3 w-[73%] rounded-full bg-gradient-to-r from-p-300 to-p-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-p-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-n-800">Điểm nhấn hôm nay</h3>
                            <CupSoda className="h-5 w-5 text-p-700" />
                        </div>

                        <div className="space-y-3">
                            <div className="rounded-2xl bg-p-50 p-4">
                                <p className="text-sm text-n-500">Sản phẩm bán chạy</p>
                                <p className="mt-1 font-semibold text-p-900">Trà Oolong Sữa</p>
                            </div>
                            <div className="rounded-2xl bg-p-50 p-4">
                                <p className="text-sm text-n-500">Khung giờ đông khách</p>
                                <p className="mt-1 font-semibold text-p-900">19:00 - 21:00</p>
                            </div>
                            <div className="rounded-2xl bg-p-50 p-4">
                                <p className="text-sm text-n-500">Tỉ lệ hoàn thành đơn</p>
                                <p className="mt-1 font-semibold text-p-900">96.4%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom grid */}
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Orders table */}
                <div className="rounded-[28px] border border-p-100 bg-white p-5 shadow-sm xl:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-n-500">Đơn hàng gần đây</p>
                            <h3 className="text-xl font-bold text-n-800">
                                Danh sách đơn mới nhất
                            </h3>
                        </div>

                        <button className="rounded-full border border-p-200 bg-p-50 px-4 py-2 text-sm font-semibold text-p-700">
                            Xem tất cả
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border-separate border-spacing-y-3">
                            <thead>
                                <tr className="text-left text-sm text-n-500">
                                    <th className="pb-2 font-medium">Mã đơn</th>
                                    <th className="pb-2 font-medium">Khách hàng</th>
                                    <th className="pb-2 font-medium">Sản phẩm</th>
                                    <th className="pb-2 font-medium">Tổng tiền</th>
                                    <th className="pb-2 font-medium">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="rounded-2xl bg-p-50/60">
                                        <td className="rounded-l-2xl px-4 py-4 font-semibold text-n-800">
                                            {order.id}
                                        </td>
                                        <td className="px-4 py-4 text-n-700">{order.customer}</td>
                                        <td className="px-4 py-4 text-n-700">{order.product}</td>
                                        <td className="px-4 py-4 font-semibold text-p-900">
                                            {order.total}
                                        </td>
                                        <td className="rounded-r-2xl px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top products */}
                <div className="rounded-[28px] border border-p-100 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-n-500">Top sản phẩm</p>
                            <h3 className="text-xl font-bold text-n-800">Bán chạy nhất</h3>
                        </div>
                        <ShoppingBag className="h-5 w-5 text-p-700" />
                    </div>

                    <div className="space-y-4">
                        {topProducts.map((item) => (
                            <div key={item.name} className="rounded-2xl bg-p-50 p-4">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <p className="font-semibold text-n-800">{item.name}</p>
                                    <span className="text-sm font-semibold text-p-700">
                                        {item.sold} ly
                                    </span>
                                </div>

                                <div className="h-2.5 rounded-full bg-white">
                                    <div
                                        className="h-2.5 rounded-full bg-gradient-to-r from-p-400 to-p-800"
                                        style={{ width: `${item.percent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}