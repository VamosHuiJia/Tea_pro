// src/animations/counterUp.ts

interface CounterUpOptions {
    action?: 'start' | 'stop';
    duration?: number;
    delay?: number;
}

// Interface 
interface CountUpElement extends HTMLElement {
    _countUpOrigInnerHTML?: string;
    countUpTimeout?: ReturnType<typeof setTimeout>;
}

export const counterUp = (el: CountUpElement | null, options: CounterUpOptions = {}) => {
    if (!el) return;

    let targetNumber: number;
    const dataCount = el.getAttribute('data-count');

    if (dataCount) {
        targetNumber = parseFloat(dataCount);
    } else {
        const text = el.innerHTML.replace(/[^0-9.]/g, '');
        targetNumber = parseFloat(text);
    }

    if (isNaN(targetNumber) || targetNumber <= 0) return;

    const { action = 'start', duration = 1800, delay = 10 } = options;

    if (action === 'stop') {
        stopCounting(el);
        return;
    }

    stopCounting(el);

    if (!/\d/.test(el.innerHTML)) return;

    const numbers = divideNumbers(el.innerHTML, { duration, delay });

    el._countUpOrigInnerHTML = el.innerHTML;
    el.innerHTML = numbers[0] || '&nbsp;';
    el.style.visibility = 'visible';

    let index = 1;

    const update = () => {
        el.innerHTML = numbers[index] || '&nbsp;';
        index++;

        if (index < numbers.length) {
            el.countUpTimeout = window.setTimeout(update, delay);
        } else {
            el._countUpOrigInnerHTML = undefined;
        }
    };

    el.countUpTimeout = window.setTimeout(update, delay);
};

const stopCounting = (el: CountUpElement) => {
    if (el.countUpTimeout !== undefined) {
        window.clearTimeout(el.countUpTimeout);
        el.countUpTimeout = undefined;
    }

    if (el._countUpOrigInnerHTML !== undefined) {
        el.innerHTML = el._countUpOrigInnerHTML;
        el._countUpOrigInnerHTML = undefined;
    }

    el.style.visibility = '';
};

// divideNumbers
const divideNumbers = (
    nStr: string,
    options: { duration: number; delay: number }
): string[] => {
    const { duration, delay } = options;
    const steps = Math.ceil(duration / delay);
    const parts = nStr.split(/(<[^>]+>|[0-9,.]+)/g);
    const frames: string[] = Array(steps + 1).fill('');

    parts.forEach((part) => {
        if (!/[0-9]/.test(part) || /<[^>]+>/.test(part)) {
            for (let i = 0; i < steps; i++) {
                frames[i] += part;
            }
            return;
        }

        let numStr = part.replace(/[,.]/g, '');
        const separators = [...part.matchAll(/[.,]/g)]
            .map((m) => ({ char: m[0], pos: part.length - (m.index ?? 0) - 1 }))
            .sort((a, b) => a.pos - b.pos);

        let currentStep = steps - 1;

        for (let step = steps; step >= 1; step--) {
            let value = Math.floor((Number(numStr) * step) / steps);
            let strValue = value.toString();

            separators.forEach(({ char, pos }) => {
                if (strValue.length > pos) {
                    const len = strValue.length;
                    strValue =
                        strValue.slice(0, len - pos) + char + strValue.slice(len - pos);
                }
            });

            frames[currentStep] += strValue;
            currentStep--;
        }
    });

    frames[steps] = nStr;
    return frames;
};

export default counterUp;