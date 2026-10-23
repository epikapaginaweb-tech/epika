const PALETTES = [
  { bg: "#002952", a: "#fd8901", b: "#0d3d70", text: "#ffffff" },
  { bg: "#fd8901", a: "#002952", b: "#ffb357", text: "#ffffff" },
  { bg: "#ffe9cf", a: "#fd8901", b: "#002952", text: "#002952" },
  { bg: "#0c1626", a: "#fd8901", b: "#1d3a5f", text: "#ffffff" },
  { bg: "#f2efe8", a: "#002952", b: "#fd8901", text: "#002952" },
];

function hash(value: string) {
  let h = 0;
  for (const char of value) h = (h * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(h);
}

function initials(title: string) {
  return title
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "É";
}

type Props = { seed: string; label?: string; className?: string };

export function CoverArt({ seed, label, className = "" }: Props) {
  const h = hash(seed);
  const p = PALETTES[h % PALETTES.length];
  const angle = (h % 4) * 90;

  return (
    <div
      className={`relative isolate flex h-full w-full items-end overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at ${20 + (h % 60)}% ${15 + (h % 30)}%, ${p.a} 0 18%, transparent 18.5%),
          radial-gradient(circle at 110% 110%, ${p.b} 0 45%, transparent 45.5%),
          conic-gradient(from ${angle}deg at 0% 100%, ${p.bg}, ${p.bg})`,
      }}
      aria-hidden
    >
      <span
        className="pointer-events-none absolute -right-2 top-1 text-[7rem] font-extrabold leading-none tracking-tighter opacity-15"
        style={{ color: p.text }}
      >
        {initials(seed)}
      </span>
      {label && (
        <span className="relative m-4 text-sm font-bold leading-tight" style={{ color: p.text }}>
          {label}
        </span>
      )}
    </div>
  );
}
