// Zenetra mark for generated images (Open Graph, Apple touch icon).

const BLADE = "M40 2 L198 2 C186 18 168 32 140 40 C108 48 62 43 4 60 C16 40 26 16 40 2 Z";

export function ZMark({ width, dark = false }: { width: number; dark?: boolean }) {
  const ink = dark ? "#F2F1EE" : "#0B0D10";
  return (
    <svg width={width} height={(width * 136) / 200} viewBox="0 0 200 136">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#D6A46C" />
          <stop offset="0.55" stopColor="#A8723F" />
          <stop offset="1" stopColor="#7A532E" />
        </linearGradient>
      </defs>
      <path d={BLADE} fill="url(#g)" />
      <path d={BLADE} transform="rotate(180 101 68)" fill={ink} />
      <circle cx="100" cy="68" r="15" fill={ink} />
    </svg>
  );
}
