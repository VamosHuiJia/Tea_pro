import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
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
import { getAllUsers, createUser, updateUser, deleteUser } from "../../../../api/admin/user.api";
import { useToast } from "../../../../contexts/ToastContext";

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
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [selectedRoleName, setSelectedRoleName] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [mode, setMode] = useState<"create" | "edit" | "delete">("create");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const excelInputRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  const fetchData = async () => {
    setListLoading(true);
    try {
      const res = await getAllUsers();
      // rolelevel là staff và admin 
      const customerData = res.filter((u: any) => String(u.role?.level).toLowerCase() === "customer");
      
      const mapped = customerData.map((c: any) => ({
        id: c.id,
        publicId: c.publicId,
        username: c.username,
        fullName: c.fullName || c.username,
        email: c.email,
        phone: c.phone || "",
        avatar_url: c.avatar_url || "",
        roleName: c.roleName || "Khách hàng",
        roleLevel: "customer",
        created_at: c.created_at,
        updated_at: c.updated_at,
      }));
      setCustomers(mapped);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Lỗi lấy dữ liệu khách hàng", "error");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleSubmit = async (values: CustomerFormValues) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone || "");
      formData.append("roleName", values.roleName || "Khách hàng");
      formData.append("roleLevel", values.roleLevel || "customer");
      
      if (mode === "create") {
         formData.append("password", "123456"); 
      }

      if (values.avatar_url && values.avatar_url.startsWith("data:image")) {
        const fetchRes = await axios.get(values.avatar_url, { responseType: 'blob' });
        const blob = fetchRes.data;
        formData.append("avatar", blob, "avatar.png");
      }

      if (mode === "create") {
        await createUser(formData);
        showToast("Thêm khách hàng thành công", "success");
      } else if (selectedCustomer) {
        await updateUser(selectedCustomer.publicId || String(selectedCustomer.id), formData);
        showToast("Cập nhật thành công", "success");
      }

      await fetchData();
      setOpenModal(false);
      setSelectedCustomer(null);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Lỗi lưu dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (customer: CustomerItem) => {
    try {
        await deleteUser(customer.publicId || String(customer.id));
        showToast("Xóa danh mục thành công", "success");
        await fetchData();
    } catch (error: any) {
        showToast(error.message || "Lỗi khi xóa", "error");
    } finally {
        setOpenModal(false);
        setSelectedCustomer(null);
    }
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
      const mappedRows = rows
        .map(normalizeImportedCustomer)
        .filter((item) => item.fullName && item.email && item.username);

      for (const item of mappedRows) {
        const formData = new FormData();
        formData.append("username", item.username);
        formData.append("fullName", item.fullName);
        formData.append("email", item.email);
        formData.append("phone", item.phone || "");
        formData.append("roleName", item.roleName || "Khách hàng");
        formData.append("roleLevel", "customer");
        formData.append("password", "123456"); 
        try {
            await createUser(formData);
        } catch (e) {
            console.error("Lỗi khi thêm user import", e);
        }
      }
      
      showToast("Đã hoàn tất nhập dữ liệu Excel!", "success");
      await fetchData();
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

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-4xl">Quản lý khách hàng</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
              Sự hài lòng của khách hàng là thước đo chính xác nhất cho chất lượng dịch vụ
            </p>
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
        loading={listLoading}
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
