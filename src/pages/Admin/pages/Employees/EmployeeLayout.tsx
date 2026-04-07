import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { ChevronDown, Search, Sparkles } from "lucide-react";
import EmployeeList from "./EmployeeList";
import type { EmployeeItem } from "./EmployeeList";
import EmployeeModal from "./EmployeeModal";
import type { EmployeeFormValues } from "./EmployeeModal";
import { exportToExcel, importFromExcel } from "../../../../utils/excel";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../../../api/admin/user.api";
import { useToast } from "../../../../contexts/ToastContext";

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
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [keyword, setKeyword] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [mode, setMode] = useState<"create" | "edit" | "delete">("create");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeItem | null>(null);
  const excelInputRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  const fetchData = async () => {
    setListLoading(true);
    try {
      const res = await getAllUsers();
      // rolelevel là staff và admin"
      const employeeData = res.filter((u: any) =>
        String(u.role?.level).toLowerCase() === "staff" ||
        String(u.role?.level).toLowerCase() === "admin"
      );

      const mapped = employeeData.map((c: any) => ({
        id: c.id,
        publicId: c.publicId,
        username: c.username,
        fullName: c.fullName || c.username,
        email: c.email,
        phone: c.phone || "",
        avatar_url: c.avatar_url || "",
        roleName: c.roleName || "Nhân viên",
        roleLevel: c.role?.level || "staff",
        created_at: c.created_at,
        updated_at: c.updated_at,
      }));
      setEmployees(mapped);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Lỗi lấy dữ liệu nhân viên", "error");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleSubmit = async (values: EmployeeFormValues) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone || "");
      formData.append("roleName", values.roleName || "Nhân viên");
      formData.append("roleLevel", values.roleLevel || "staff");

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
        showToast("Thêm nhân viên thành công", "success");
      } else if (selectedEmployee) {
        await updateUser(selectedEmployee.publicId || String(selectedEmployee.id), formData);
        showToast("Cập nhật thành công", "success");
      }

      await fetchData();
      setOpenModal(false);
      setSelectedEmployee(null);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Lỗi lưu dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (employee: EmployeeItem) => {
    try {
      await deleteUser(employee.publicId || String(employee.id));
      showToast("Xóa thành công", "success");
      await fetchData();
    } catch (error: any) {
      showToast(error.message || "Lỗi khi xóa", "error");
    } finally {
      setOpenModal(false);
      setSelectedEmployee(null);
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
        .map(normalizeImportedEmployee)
        .filter((item) => item.fullName && item.email && item.username);

      for (const item of mappedRows) {
        const formData = new FormData();
        formData.append("username", item.username);
        formData.append("fullName", item.fullName);
        formData.append("email", item.email);
        formData.append("phone", item.phone || "");
        formData.append("roleName", item.roleName || "Nhân viên");
        formData.append("roleLevel", item.roleLevel);
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

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold md:text-4xl">Quản lý nhân viên</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
              Mỗi ngày đi làm là một ngày vui
            </p>
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
        loading={listLoading}
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
