type EyeProps = {
    level?: number;
    maxLevel?: number;
};

function Eye({ level = 0, maxLevel = 7 }: EyeProps) {
    const size = 260 - level * 28;
    const padding = Math.max(4, 15 - level);

    return (
        <div
            className="relative animate-[spin_8s_linear_infinite] rounded-[100%_0_100%_0] bg-gradient-to-br from-p-700 to-p-900 shadow-[0_0_40px_rgba(18,137,99,0.18)]"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                padding: `${padding}px`,
            }}
        >
            <div className="absolute inset-0 z-0 rounded-[0_100%_0_100%] bg-gradient-to-br from-p-200 to-p-500 opacity-95" />

            {level < maxLevel && (
                <div className="relative z-10 flex h-full w-full items-center justify-center">
                    <Eye level={level + 1} maxLevel={maxLevel} />
                </div>
            )}
        </div>
    );
}

const loadingText = "Bạn đợi xíu nhé...";

export default function LoadingEye() {
    return (
        <div className="flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-p-50 via-white to-p-100 px-4">
            <div className="flex flex-col items-center">
                <div className="rotate-45 scale-75 sm:scale-90 md:scale-100">
                    <Eye />
                </div>

                <div className="mt-20 text-center">
                    <p className="text-xl font-bold tracking-wide text-p-700 md:text-2xl">
                        {loadingText.split("").map((char, index) => (
                            <span
                                key={`${char}-${index}`}
                                className={`inline-block animate-[waveText_1.6s_ease-in-out_infinite] ${char === "." ? "text-p-500" : "text-p-700"
                                    }`}
                                style={{
                                    animationDelay: `${index * 0.08}s`,
                                    whiteSpace: char === " " ? "pre" : "normal",
                                }}
                            >
                                {char}
                            </span>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    );
}