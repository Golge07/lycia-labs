import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  outline?: boolean;
  children?: ReactNode;
};

const cx = (...classes: Array<string | undefined | false>) => classes.filter(Boolean).join(" ");

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { outline, className, children, ...props },
  ref,
) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-base font-semibold transition shadow-md";
  const variant = outline
    ? "border border-terracotta text-terracotta hover:bg-terracotta/10"
    : "bg-terracotta text-white hover:shadow-lg shadow-[rgba(167,68,68,0.25)]";

  return (
    <button ref={ref} {...props} className={cx(base, variant, className)}>
      {children}
    </button>
  );
});

export default Button;
