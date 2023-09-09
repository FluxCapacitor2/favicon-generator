import clsx from "clsx";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "base",
  ...props
}: PropsWithChildren<{
  variant?: "primary" | "secondary" | "link";
  size?: "base" | "sm";
}> &
  ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    {...props}
    className={clsx(
      variant === "primary" && "bg-primary-600 hover:bg-primary-700 text-white",
      variant === "secondary" &&
        "bg-primary-100 hover:bg-primary-200 text-primary-950",
      variant === "link" &&
        "hover:bg-primary-50 dark:hover:bg-transparent font-medium underline",
      size === "base" && "px-4 py-1.5",
      size === "sm" && "px-3 py-1",
      "flex items-center justify-center gap-2 rounded-md font-medium transition-colors"
    )}
  >
    {children}
  </button>
);
