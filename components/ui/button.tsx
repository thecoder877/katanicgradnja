import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-5 text-sm font-semibold tracking-[0.01em] transition-[color,background-color,border-color,transform] duration-200 ease-out active:scale-[0.98] motion-reduce:transform-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-ink hover:bg-accent-deep hover:text-cream",
        secondary:
          "border border-cream/30 bg-transparent text-cream hover:border-cream hover:bg-cream/10",
        dark: "bg-ink text-cream hover:bg-surface",
        outline:
          "border border-ink/15 bg-transparent text-ink hover:border-ink/40 hover:bg-ink/5",
        ghost: "text-cream hover:text-accent",
      },
      size: {
        default: "min-h-11 px-5",
        lg: "min-h-12 px-6 text-[0.95rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
