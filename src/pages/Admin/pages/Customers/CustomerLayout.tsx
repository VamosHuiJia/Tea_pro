import { useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Search,
  Sparkles,
  UserRound,
  Users,
  UserCheck,
} from "lucide-react";
import CustomerList from "./CustomerList";
import type { CustomerItem } from "./CustomerList";
import CustomerModal from "./CustomerModal";
import type { CustomerFormValues } from "./CustomerModal";
import { exportToExcel, importFromExcel } from "../../../../utils/excel";

const mockCustomers: CustomerItem[] = [
  {
    id: 2001,
    publicId: "cus_001",
    username: "ngocanh",
    fullName: "Nguyễn Ngọc Anh",
    email: "ngocanh@gmail.com",
    phone: "0901234567",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    roleName: "Khách hàng thân thiết",
    roleLevel: "customer",
    created_at: "2026-03-04T09:20:00",
    updated_at: "2026-03-17T14:05:00",
  },
  {
    id: 2002,
    publicId: "cus_002",
    username: "minhthu",
    fullName: "Trần Minh Thư",
    email: "minhthu@gmail.com",
    phone: "0912987654",
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=80",
    roleName: "Khách hàng mới",
    roleLevel: "customer",
    created_at: "2026-03-08T10:45:00",
    updated_at: "2026-03-18T09:30:00",
  },
  {
    id: 2003,
    publicId: "cus_003",
    username: "quanghuy",
    fullName: "Lê Quang Huy",
    email: "quanghuy@gmail.com",
    phone: "0988111222",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    roleName: "Khách hàng",
    roleLevel: "customer",
    created_at: "2026-03-11T08:10:00",
    updated_at: "2026-03-16T16:15:00",
  },
  {
    id: 2004,
    publicId: "cus_004",
    username: "linhchi",
    fullName: "Phạm Linh Chi",
    email: "linhchi@gmail.com",
    phone: "0977333444",
    avatar_url: "",
    roleName: "Khách hàng VIP",
    roleLevel: "customer",
    created_at: "2026-03-12T13:35:00",
    updated_at: "2026-03-18T15:25:00",
  },
];

function normalizeImportedCustomer(row: Record<string, unknown>) {
  return {
    username: String(row.username ?? row["Tên đăng nhập"] ?? "").trim(),
    fullName: String(row.fullName ?? row["Họ tên"] ?? "").trim(),
    email: String(row.email ?? row["Email"] ?? "").trim(),
    phone: String(row.phone ?? row["Số điện thoại"] ?? "").trim(),
    avatar_url: String(row.avatar_url ?? row["Hình ảnh"] ?? "").trim(),
    roleName: String(row.roleName ?? row["Chức vụ"] ?? "Khách hàng").trim(),
    created_at: row.created_at
      ? String(row.created_at)
      : row["Tạo lúc"]
        ? String(row["Tạo lúc"])
        : undefined,
    updated_at: row.updated_at
      ? String(row.updated_at)
      : row["Cập nhật lúc"]
        ? String(row["Cập nhật lúc"])
        : undefined,
  };
}

export default function CustomerLayout() {
  const [customers, setCustomers] = useState<CustomerItem[]>(mockCustomers);
  const [keyword, setKeyword] = useState("");
  const [selectedRoleName, setSelectedRoleName] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"create" | "edit" | "delete">("create");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const excelInputRef = useRef<HTMLInputElement | null>(null);

  const roleNameOptions = useMemo(() => {
    return Array.from(
      new Set(customers.map((item) => item.roleName).filter(Boolean))
    );
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesKeyword =
        !normalized ||
        [customer.fullName, customer.username, customer.email, customer.phone, customer.roleName]
          .some((value) => String(value || "").toLowerCase().includes(normalized));

      const matchesRoleName =
        selectedRoleName === "all" || customer.roleName === selectedRoleName;

      return matchesKeyword && matchesRoleName;
    });
  }, [customers, keyword, selectedRoleName]);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const withPhone = customers.filter((item) => item.phone).length;
    const updatedToday = customers.filter((item) => {
      if (!item.updated_at) return false;
      const date = new Date(item.updated_at);
      const now = new Date();
      return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;

    return { totalCustomers, withPhone, updatedToday };
  }, [customers]);

  const handleOpenCreate = () => {
    setMode("create");
    setSelectedCustomer(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (customer: CustomerItem) => {
    setMode("edit");
    setSelectedCustomer(customer);
    setOpenModal(true);
  };

  const handleOpenDelete = (customer: CustomerItem) => {
    setMode("delete");
    setSelectedCustomer(customer);
    setOpenModal(true);
  };

  const handleSubmit = (values: CustomerFormValues) => {
    setLoading(true);

    try {
      if (mode === "create") {
        const now = new Date().toISOString();

        const newCustomer: CustomerItem = {
          id: Date.now(),
          publicId: `cus_${Date.now()}`,
          username: values.username,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          avatar_url: values.avatar_url,
          roleName: values.roleName || "Khách hàng",
          roleLevel: "customer",
          created_at: now,
          updated_at: now,
        };

        setCustomers((prev) => [newCustomer, ...prev]);
      } else if (selectedCustomer) {
        setCustomers((prev) =>
          prev.map((item) =>
            item.id === selectedCustomer.id
              ? {
                  ...item,
                  username: values.username,
                  fullName: values.fullName,
                  email: values.email,
                  phone: values.phone,
                  avatar_url: values.avatar_url,
                  roleName: values.roleName || "Khách hàng",
                  roleLevel: "customer",
                  updated_at: new Date().toISOString(),
                }
              : item
          )
        );
      }

      setOpenModal(false);
      setSelectedCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = (customer: CustomerItem) => {
    setCustomers((prev) => prev.filter((item) => item.id !== customer.id));
    setOpenModal(false);
    setSelectedCustomer(null);
  };

  const handleImportExcelClick = () => {
    excelInputRef.current?.click();
  };

  const handleImportExcelFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const rows = await importFromExcel<Record<string, unknown>>(file);
      const mappedRows: CustomerItem[] = rows
        .map(normalizeImportedCustomer)
        .filter((item) => item.fullName && item.email && item.username)
        .map((item, index) => ({
          id: Date.now() + index,
          publicId: `cus_import_${Date.now() + index}`,
          username: item.username,
          fullName: item.fullName,
          email: item.email,
          phone: item.phone,
          avatar_url: item.avatar_url,
          roleName: item.roleName || "Khách hàng",
          roleLevel: "customer",
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString(),
        }));

      setCustomers((prev) => [...mappedRows, ...prev]);
    } catch (error) {
      console.error("Lỗi khi đọc file Excel khách hàng:", error);
    } finally {
      event.target.value = "";
    }
  };

  const handleExportCustomers = () => {
    const data = customers.map((customer) => ({
      "Họ tên": customer.fullName,
      "Tên đăng nhập": customer.username,
      Email: customer.email,
      "Số điện thoại": customer.phone || "",
      "Hình ảnh": customer.avatar_url || "",
      "Chức vụ": customer.roleName || "Khách hàng",
      "Tạo lúc": customer.created_at || "",
      "Cập nhật lúc": customer.updated_at || "",
    }));

    exportToExcel(data, "danh-sach-khach-hang.xlsx", "Customers");
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_25%),linear-gradient(135deg,#062820_0%,#0F6D51_45%,#22B684_100%)] p-6 text-white shadow-[0_20px_60px_rgba(6,40,32,0.25)] md:p-8">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-emerald-200/10 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Trang quản trị khách hàng
            </div>
            <h1 className="text-3xl font-bold md:text-5xl">Quản lý khách hàng</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
              Giao diện FE mô phỏng theo entity User/Role ở BE. Màn hình này chỉ quản lý
              user có RoleLevel = customer.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
              <p className="text-xs text-white/70">Tổng khách hàng</p>
              <p className="mt-2 text-2xl font-bold">{stats.totalCustomers}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
              <p className="text-xs text-white/70">Đã có SĐT</p>
              <p className="mt-2 text-2xl font-bold">{stats.withPhone}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
              <p className="text-xs text-white/70">Cập nhật hôm nay</p>
              <p className="mt-2 text-2xl font-bold">{stats.updatedToday}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_0.8fr]">
        <div className="rounded-[30px] border border-p-100 bg-white p-5 shadow-sm">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-n-500" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo họ tên, username, email, số điện thoại hoặc chức vụ..."
              className="w-full rounded-2xl border border-p-100 bg-p-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-p-400"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-p-100 bg-white/90 p-4 shadow-[0_10px_30px_rgba(34,182,132,0.08)]">
          <div className="group relative">
            <select
              value={selectedRoleName}
              onChange={(event) => setSelectedRoleName(event.target.value)}
              className="w-full appearance-none rounded-2xl border border-p-100 bg-p-50/60 px-4 py-3.5 pr-12 text-sm font-semibold text-n-700 outline-none transition-all duration-200 hover:border-p-300 focus:border-p-400 focus:bg-white focus:ring-4 focus:ring-p-100"
            >
              <option value="all">Tất cả chức vụ hiển thị</option>
              {roleNameOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-p-700" />
          </div>
        </div>
      </section>

      <CustomerList
        customers={filteredCustomers}
        loading={false}
        onAdd={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onImportExcel={handleImportExcelClick}
        onExportExcel={handleExportCustomers}
      />

      <input
        ref={excelInputRef}
        type="file"
        hidden
        accept=".xlsx,.xls,.csv"
        onChange={handleImportExcelFile}
      />

      <CustomerModal
        open={openModal}
        mode={mode}
        initialData={selectedCustomer}
        loading={loading}
        onClose={() => {
          setOpenModal(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleSubmit}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
