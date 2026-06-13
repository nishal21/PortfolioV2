import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const variants: Record<Variant, string> = {
  primary: 'bg-[var(--amber)] text-[var(--ink)] hover:brightness-110',
  secondary: 'border border-[var(--border)] bg-transparent text-[var(--text-soft)] hover:border-[var(--text-dim)]',
  ghost: 'text-[var(--text-muted)] hover:text-[var(--text-soft)]',
};

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex hit-target items-center justify-center gap-2 rounded px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
