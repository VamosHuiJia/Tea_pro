import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import {
    CheckCircle2,
    CircleAlert,
    Info,
    TriangleAlert,
    X,
} from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

type ToastItem = {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
};

type ToastContextType = {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastTone: Record<
    ToastType,
    {
        title: string;
        icon: ReactNode;
        border: string;
        iconBox: string;
        progress: string;
    }
> = {
    success: {
        title: "Thành công",
        icon: <CheckCircle2 className="h-5 w-5" />,
        border: "border-emerald-400/25",
        iconBox: "bg-emerald-400/15 text-emerald-300",
        progress: "bg-emerald-400",
    },
    error: {
        title: "Thất bại",
        icon: <CircleAlert className="h-5 w-5" />,
        border: "border-rose-400/25",
        iconBox: "bg-rose-400/15 text-rose-300",
        progress: "bg-rose-400",
    },
    info: {
        title: "Thông báo",
        icon: <Info className="h-5 w-5" />,
        border: "border-sky-400/25",
        iconBox: "bg-sky-400/15 text-sky-300",
        progress: "bg-sky-400",
    },
    warning: {
        title: "Lưu ý",
        icon: <TriangleAlert className="h-5 w-5" />,
        border: "border-amber-400/25",
        iconBox: "bg-amber-400/15 text-amber-300",
        progress: "bg-amber-400",
    },
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType = "success", duration = 3000) => {
            const id = Date.now() + Math.floor(Math.random() * 1000);

            setToasts((prev) => [...prev, { id, message, type, duration }]);

            window.setTimeout(() => {
                removeToast(id);
            }, duration);
        },
        [removeToast]
    );

    const value = useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}

            <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
                {toasts.map((toast) => {
                    const tone = toastTone[toast.type];

                    return (
                        <div
                            key={toast.id}
                            className={`toast-enter pointer-events-auto relative overflow-hidden rounded-2xl border bg-n-800/95 p-4 text-white shadow-[0_20px_45px_rgba(0,0,0,0.3)] backdrop-blur-md ${tone.border}`}
                        >
                            <button
                                type="button"
                                onClick={() => removeToast(toast.id)}
                                className="absolute right-3 top-3 rounded-md p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="flex items-start gap-3 pr-8">
                                <div
                                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.iconBox}`}
                                >
                                    {tone.icon}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold">{tone.title}</p>
                                    <p className="mt-1 text-sm leading-5 text-white/85">
                                        {toast.message}
                                    </p>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 h-1 w-full bg-white/10">
                                <div
                                    className={`h-full ${tone.progress}`}
                                    style={{
                                        animation: `toast-progress ${toast.duration}ms linear forwards`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used inside ToastProvider");
    }

    return context;
}