import * as React from "react";
import { cn } from "../../utils";

type ButtonProps = {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "default",
  size = "sm",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-md transition focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive:
      "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
    outline:
      "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost:
      "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-9 px-4 py-2 has-[>svg]:px-3",
    sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
    lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
    icon: "size-9 rounded-md",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
