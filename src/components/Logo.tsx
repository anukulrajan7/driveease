export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className="shrink-0 drop-shadow-sm"
    >
      <rect width="64" height="64" rx="14" fill="#15803d" />
      <circle cx="44" cy="20" r="7" fill="#fb923c" />
      <path d="M6 50 L24 24 L34 38 L41 29 L58 50 Z" fill="#ffffff" />
      <path d="M24 24 L30 32 L27 36 L34 38 Z" fill="#bbf7d0" />
    </svg>
  );
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className={`text-xl font-bold tracking-tight ${light ? "text-white" : "text-slate-900"}`}>
        Drive<span className="text-brand-600">Ease</span>
      </span>
    </span>
  );
}
