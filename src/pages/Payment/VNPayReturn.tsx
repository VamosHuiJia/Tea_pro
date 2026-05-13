import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Home, FileText } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import axiosClient from "../../services/axiosClient";

export default function VNPayReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const verifyRef = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  // Các tham số trả về từ VNPay
  const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
  const vnp_TxnRef = searchParams.get("vnp_TxnRef");
  const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");

  useEffect(() => {
    if (verifyRef.current) return;
    verifyRef.current = true;

    if (vnp_ResponseCode !== "00") {
      setStatus("failed");
      return;
    }

    const verifyPayment = async () => {
      try {
        if (!vnp_TxnRef) {
          setStatus("failed");
          return;
        }

        const queryString = window.location.search;
        const response: any = await axiosClient.get(`/orders/vnpay/return${queryString}`);

        if (response && response.code === "00") {
          setStatus("success");
          clearCart();
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Lỗi xác thực thanh toán VNPay:", error);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [searchParams, clearCart, vnp_ResponseCode, vnp_TxnRef]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-p-600 border-t-transparent"></div>
      </div>
    );
  }

  const isSuccess = status === "success";

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-md overflow-hidden rounded-[30px] border border-p-100 bg-white shadow-[0_20px_60px_rgba(6,40,32,0.08)]">
        <div className={`p-8 text-center ${isSuccess ? "bg-p-50/50" : "bg-rose-50/50"}`}>
          <div className="mb-6 flex justify-center">
            {isSuccess ? (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                <CheckCircle2 className="h-10 w-10 text-p-600" />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
                <XCircle className="h-10 w-10 text-rose-500" />
              </div>
            )}
          </div>

          <h1 className="mb-2 text-2xl font-bold text-n-800">
            {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
          </h1>
          <p className="text-sm text-n-500">
            {isSuccess
              ? "Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được xác nhận."
              : "Giao dịch không thành công hoặc đã bị hủy. Vui lòng thử lại."}
          </p>
        </div>

        <div className="p-8">
          <div className="mb-8 space-y-4 rounded-2xl bg-n-50 p-5 text-sm">
            <div className="flex justify-between">
              <span className="text-n-500">Mã đơn hàng</span>
              <span className="font-semibold text-n-800">#{vnp_TxnRef ? vnp_TxnRef.split("_")[0] : ""}</span>
            </div>
            {vnp_TransactionNo && (
              <div className="flex justify-between border-t border-n-200 pt-4">
                <span className="text-n-500">Mã giao dịch VNPay</span>
                <span className="font-medium text-n-800">{vnp_TransactionNo}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {isSuccess ? (
              <Link
                to="/profile"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-p-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-p-700"
              >
                <FileText className="h-4 w-4" />
                Xem đơn hàng
              </Link>
            ) : (
              <button
                onClick={() => navigate("/cart")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-p-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-p-700"
              >
                Thử lại
              </button>
            )}

            <Link
              to="/"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-p-200 bg-white px-5 py-3.5 text-sm font-semibold text-n-700 transition hover:bg-n-50"
            >
              <Home className="h-4 w-4" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
