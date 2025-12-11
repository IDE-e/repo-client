import { useEffect, useState } from "react";

type Axis = "width" | "height";

export function useScreenBelow(max: number, axis: Axis): boolean {
  const [isBelow, setIsBelow] = useState(() => {
    if (typeof window === "undefined") return false;
    return axis === "width"
      ? window.innerWidth <= max
      : window.innerHeight <= max;
  });

  useEffect(() => {
    const check = () => {
      setIsBelow(
        axis === "width" ? window.innerWidth <= max : window.innerHeight <= max
      );
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [max, axis]);

  return isBelow;
}
