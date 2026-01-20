import type { ReactNode } from "react";
import styles from "./tooltip.module.css";

interface TooltipProps {
  label: string;
  children: ReactNode;
  position?: "top" | "bottom";
}

export function Tooltip({ label, children, position = "bottom" }: TooltipProps) {
  return (
    <div
      className={`${styles.wrapper} ${styles[position]}`}
      data-tooltip={label}
    >
      {children}
    </div>
  );
}
