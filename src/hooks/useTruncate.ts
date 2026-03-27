import { useEffect, useRef, useState } from "react";

type UseTruncateOptions = {
    text?: string;
    maxLines?: number;
};

type UseTruncateResult = {
    ref: React.RefObject<HTMLElement | null>;
    truncatedText: string;
    isTruncated: boolean;
};

function getLineHeight(element: HTMLElement) {
    const computedStyle = window.getComputedStyle(element);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const fontSize = parseFloat(computedStyle.fontSize);

    if (!Number.isNaN(lineHeight)) return lineHeight;
    if (!Number.isNaN(fontSize)) return fontSize * 1.5;

    return 24;
}

function createMeasureElement(sourceElement: HTMLElement) {
    const measureElement = document.createElement("div");
    const computedStyle = window.getComputedStyle(sourceElement);

    measureElement.style.position = "fixed";
    measureElement.style.left = "-99999px";
    measureElement.style.top = "0";
    measureElement.style.visibility = "hidden";
    measureElement.style.pointerEvents = "none";
    measureElement.style.zIndex = "-1";
    measureElement.style.whiteSpace = "normal";
    measureElement.style.wordBreak = computedStyle.wordBreak;
    measureElement.style.overflowWrap = computedStyle.overflowWrap;
    measureElement.style.font = computedStyle.font;
    measureElement.style.fontFamily = computedStyle.fontFamily;
    measureElement.style.fontSize = computedStyle.fontSize;
    measureElement.style.fontWeight = computedStyle.fontWeight;
    measureElement.style.fontStyle = computedStyle.fontStyle;
    measureElement.style.letterSpacing = computedStyle.letterSpacing;
    measureElement.style.lineHeight = computedStyle.lineHeight;
    measureElement.style.textTransform = computedStyle.textTransform;
    measureElement.style.padding = computedStyle.padding;
    measureElement.style.border = computedStyle.border;
    measureElement.style.boxSizing = computedStyle.boxSizing;
    measureElement.style.width = `${sourceElement.getBoundingClientRect().width}px`;

    document.body.appendChild(measureElement);

    return measureElement;
}

export function useTruncate({
    text = "",
    maxLines = 3,
}: UseTruncateOptions): UseTruncateResult {
    const ref = useRef<HTMLElement>(null);
    const [truncatedText, setTruncatedText] = useState(text);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const calculateTruncation = () => {
            const currentElement = ref.current;
            if (!currentElement) return;

            const rawText = text?.trim() ?? "";
            if (!rawText) {
                setTruncatedText("");
                setIsTruncated(false);
                return;
            }

            const measureElement = createMeasureElement(currentElement);
            const lineHeight = getLineHeight(currentElement);
            const maxHeight = lineHeight * maxLines;

            const fits = (value: string) => {
                measureElement.textContent = value;
                return measureElement.scrollHeight <= maxHeight + 1;
            };

            if (fits(rawText)) {
                setTruncatedText(rawText);
                setIsTruncated(false);
                document.body.removeChild(measureElement);
                return;
            }

            const words = rawText.split(/\s+/).filter(Boolean);

            let left = 0;
            let right = words.length;
            let best = "";

            while (left <= right) {
                const mid = Math.floor((left + right) / 2);
                const candidate =
                    mid < words.length
                        ? `${words.slice(0, mid).join(" ")}...`
                        : words.join(" ");

                if (fits(candidate)) {
                    best = candidate;
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }

            if (!best) {
                let charLeft = 0;
                let charRight = rawText.length;
                let charBest = "...";

                while (charLeft <= charRight) {
                    const mid = Math.floor((charLeft + charRight) / 2);
                    const candidate = `${rawText.slice(0, mid).trimEnd()}...`;

                    if (fits(candidate)) {
                        charBest = candidate;
                        charLeft = mid + 1;
                    } else {
                        charRight = mid - 1;
                    }
                }

                best = charBest;
            }

            setTruncatedText(best);
            setIsTruncated(true);
            document.body.removeChild(measureElement);
        };

        calculateTruncation();

        const resizeObserver = new ResizeObserver(() => {
            calculateTruncation();
        });

        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, [text, maxLines]);

    return { ref, truncatedText, isTruncated };
}