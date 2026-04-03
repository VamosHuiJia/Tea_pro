import { useEffect, type RefObject } from "react";

export function useOnClickOutside<T extends HTMLElement>(
  refOrRefs: RefObject<T | null> | RefObject<T | null>[],
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      const refs = Array.isArray(refOrRefs) ? refOrRefs : [refOrRefs];
      
      const isOutside = refs.every((ref) => {
        return !ref.current || !ref.current.contains(target);
      });
      
      if (isOutside) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refOrRefs, handler]);
}
