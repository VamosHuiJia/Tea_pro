import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CircleHelp } from "lucide-react";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const confirm = useCallback((opts: ConfirmOptions | string) => {
    return new Promise<boolean>((resolve) => {
      setOptions(typeof opts === "string" ? { message: opts } : opts);
      setResolver(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolver?.(true);
    setIsOpen(false);
  }, [resolver]);

  const handleCancel = useCallback(() => {
    resolver?.(false);
    setIsOpen(false);
  }, [resolver]);

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}

      {isOpen && options && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-[24px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center p-8 text-center text-n-800">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-500 shadow-inner">
                <CircleHelp className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold">
                {options.title || "Xác nhận"}
              </h3>
              <p className="text-sm leading-relaxed text-n-600">
                {options.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-n-100 border-t border-n-100 text-sm font-semibold">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-white py-4 text-n-600 transition hover:bg-n-50 hover:text-n-800 active:bg-n-100"
              >
                {options.cancelText || "Hủy"}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="bg-white py-4 text-p-600 transition hover:bg-p-50 hover:text-p-700 active:bg-p-100"
              >
                {options.confirmText || "Đồng ý"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used inside ConfirmProvider");
  }
  return context;
}
