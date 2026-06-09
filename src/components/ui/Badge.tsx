interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border border-[var(--border)] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)] ${className}`}
    >
      {children}
    </span>
  );
}
