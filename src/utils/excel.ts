import * as XLSX from "xlsx";

/**
 * Xuất dữ liệu ra file Excel
 * @param data Mảng dữ liệu cần xuất
 * @param fileName Tên file (bao gồm đuôi .xlsx)
 * @param sheetName 
 */
export const exportToExcel = <T,>(
  data: T[],
  fileName: string = "data.xlsx",
  sheetName: string = "Sheet1"
) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
};

/**
 * Đọc dữ liệu từ file Excel
 * @param file File tải lên
 * @returns Promise chứa mảng dữ liệu (mỗi phần tử là 1 object)
 */
export const importFromExcel = async <T = Record<string, unknown>>(
  file: File
): Promise<T[]> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const firstSheet = workbook.Sheets[firstSheetName];

  const rows = XLSX.utils.sheet_to_json<T>(firstSheet, {
    defval: "",
  });

  return rows;
};
