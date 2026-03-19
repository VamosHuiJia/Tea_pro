import { useMemo, useRef, useState } from "react";
import { ChevronDown, Search, Shield, Sparkles, UserCheck, UsersRound } from "lucide-react";
import EmployeeList from "./EmployeeList";
import type { EmployeeItem } from "./EmployeeList";
import EmployeeModal from "./EmployeeModal";
import type { EmployeeFormValues } from "./EmployeeModal";
import { exportToExcel, importFromExcel } from "../../../../utils/excel";

const mockEmployees: EmployeeItem[] = [
  {
    id: 3001,
    publicId: "emp_001",
    username: "admin.huy",
    fullName: "Đỗ Huy Hoàng",
    email: "admin.huy@gmail.com",
    phone: "0905556661",
    avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
    roleName: "Quản trị hệ thống",
    roleLevel: "admin",
    created_at: "2026-03-01T08:00:00",
    updated_at: "2026-03-18T09:25:00",
  },
  {
    id: 3002,
    publicId: "emp_002",
    username: "staff.trang",
    fullName: "Nguyễn Thu Trang",
    email: "staff.trang@gmail.com",
    phone: "0911222333",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
    roleName: "Nhân viên bán hàng",
    roleLevel: "staff",
    created_at: "2026-03-06T10:20:00",
    updated_at: "2026-03-17T15:50:00",
  },
  {
    id: 3003,
    publicId: "emp_003",
    username: "staff.nam",
    fullName: "Lê Hoài Nam",
    email: "staff.nam@gmail.com",
    phone: "0988456123",
    avatar_url: "",
    roleName: "Quản lý kho",
    roleLevel: "staff",
    created_at: "2026-03-09T11:40:00",
    updated_at: "2026-03-18T08:45:00",
  },
  {
    id: 3004,
    publicId: "emp_004",
    username: "admin.linh",
    fullName: "Phạm Mỹ Linh",
    email: "admin.linh@gmail.com",
    phone: "0977000888",
    avatar_url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80",
    roleName: "Quản lý cửa hàng",
    roleLevel: "admin",
    created_at: "2026-03-10T14:30:00",
    updated_at: "2026-03-18T16:00:00",
  },
];

function normalizeImportedEmployee(row: Record<string, unknown>) {
  const rawRoleLevel = String(
    row.roleLevel ?? row["Quyền hạn"] ?? "staff"
  )
    .trim()
    .toLowerCase();

  const roleLevel: "admin" | "staff" = rawRoleLevel === "admin" ? "admin" : "staff";

  return {
    username: String(row.username ?? row["Tên đăng nhập"] ?? "").trim(),
    fullName: String(row.fullName ?? row["Họ tên"] ?? "").trim(),
    email: String(row.email ?? row["Email"] ?? "").trim(),
    phone: String(row.phone ?? row["Số điện thoại"] ?? "").trim(),
    avatar_url: String(row.avatar_url ?? row["Hình ảnh"] ?? "").trim(),
    roleName: String(row.roleName ?? row["Chức vụ"] ?? "Nhân viên").trim(),
    roleLevel,
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

export default function EmployeeLayout() {
  const [employees, setEmployees] = useState<EmployeeItem[]>(mockEmployees);
  const [keyword, setKeyword] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"create" | "edit" | "delete">("create");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeItem | null>(null);
  const excelInputRef = useRef<HTMLInputElement | null>(null);

  const filteredEmployees = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesKeyword =
        !normalized ||
        [employee.fullName, employee.username, employee.email, employee.phone, employee.roleName]
          .some((value) => String(value || "").toLowerCase().includes(normalized));

      const matchesPermission =
        selectedPermission === "all" || employee.roleLevel === selectedPermission;

      return matchesKeyword && matchesPermission;
    });
  }, [employees, keyword, selectedPermission]);

  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const totalAdmins = employees.filter((item) => item.roleLevel === "admin").length;
    const totalStaff = employees.filter((item) => item.roleLevel === "staff").length;

    return { totalEmployees, totalAdmins, totalStaff };
  }, [employees]);

  const handleOpenCreate = () => {
    setMode("create");
    setSelectedEmployee(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (employee: EmployeeItem) => {
    setMode("edit");
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleOpenDelete = (employee: EmployeeItem) => {
    setMode("delete");
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  const handleSubmit = (values: EmployeeFormValues) => {
    setLoading(true);

    try {
      if (mode === "create") {
        const now = new Date().toISOString();

        const newEmployee: EmployeeItem = {
          id: Date.now(),
          publicId: `emp_${Date.now()}`,
          username: values.username,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          avatar_url: values.avatar_url,
          roleName: values.roleName || "Nhân viên",
          roleLevel: values.roleLevel,
          created_at: now,
          updated_at: now,
        };

        setEmployees((prev) => [newEmployee, ...prev]);
      } else if (selectedEmployee) {
        setEmployees((prev) =>
          prev.map((item) =>
            item.id === selectedEmployee.id
              ? {
                  ...item,
                  username: values.username,
                  fullName: values.fullName,
                  email: values.email,
                  phone: values.phone,
                  avatar_url: values.avatar_url,
                  roleName: values.roleName || "Nhân viên",
                  roleLevel: values.roleLevel,
                  updated_at: new Date().toISOString(),
                }
              : item
          )
        );
      }

      setOpenModal(false);
      setSelectedEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = (employee: EmployeeItem) => {
    setEmployees((prev) => prev.filter((item) => item.id !== employee.id));
    setOpenModal(false);
    setSelectedEmployee(null);
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
      const mappedRows: EmployeeItem[] = rows
        .map(normalizeImportedEmployee)
        .filter((item) => item.fullName && item.email && item.username)
        .map((item, index) => ({
          id: Date.now() + index,
          publicId: `emp_import_${Date.now() + index}`,
          username: item.username,
          fullName: item.fullName,
          email: item.email,
          phone: item.phone,
          avatar_url: item.avatar_url,
          roleName: item.roleName || "Nhân viên",
          roleLevel: item.roleLevel,
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString(),
        }));

      setEmployees((prev) => [...mappedRows, ...prev]);
    } catch (error) {
      console.error("Lỗi khi đọc file Excel nhân viên:", error);
    } finally {
      event.target.value = "";
    }
  };

  const handleExportEmployees = () => {
    const data = employees.map((employee) => ({
      "Họ tên": employee.fullName,
      "Tên đăng nhập": employee.username,
      Email: employee.email,
      "Số điện thoại": employee.phone || "",
      "Hình ảnh": employee.avatar_url || "",
      "Chức vụ": employee.roleName || "Nhân viên",
      "Quyền hạn": employee.roleLevel,
      "Tạo lúc": employee.created_at || "",
      "Cập nhật lúc": employee.updated_at || "",
    }));

    exportToExcel(data, "danh-sach-nhan-vien.xlsx", "Employees");
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
              Trang quản trị nhân viên
            </div>
            <h1 className="text-3xl font-bold md:text-5xl">Quản lý nhân viên</h1>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
              <p className="text-xs text-white/70">Tổng nhân viên</p>
              <p className="mt-2 text-2xl font-bold">{stats.totalEmployees}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
              <p className="text-xs text-white/70">Staff</p>
              <p className="mt-2 text-2xl font-bold">{stats.totalStaff}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
              <p className="text-xs text-white/70">Admin</p>
              <p className="mt-2 text-2xl font-bold">{stats.totalAdmins}</p>
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
              value={selectedPermission}
              onChange={(event) => setSelectedPermission(event.target.value)}
              className="w-full appearance-none rounded-2xl border border-p-100 bg-p-50/60 px-4 py-3.5 pr-12 text-sm font-semibold text-n-700 outline-none transition-all duration-200 hover:border-p-300 focus:border-p-400 focus:bg-white focus:ring-4 focus:ring-p-100"
            >
              <option value="all">Tất cả quyền hạn</option>
              <option value="staff">staff</option>
              <option value="admin">admin</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-p-700" />
          </div>
        </div>
      </section>

      <EmployeeList
        employees={filteredEmployees}
        loading={false}
        onAdd={handleOpenCreate}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onImportExcel={handleImportExcelClick}
        onExportExcel={handleExportEmployees}
      />

      <input
        ref={excelInputRef}
        type="file"
        hidden
        accept=".xlsx,.xls,.csv"
        onChange={handleImportExcelFile}
      />

      <EmployeeModal
        open={openModal}
        mode={mode}
        initialData={selectedEmployee}
        loading={loading}
        onClose={() => {
          setOpenModal(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleSubmit}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}
