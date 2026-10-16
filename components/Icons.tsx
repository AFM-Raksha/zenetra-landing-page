// Shared SVG sprite. Render <SpriteDefs /> once, then reference symbols with <use href="#id" />.

const BLADE = "M40 2 L198 2 C186 18 168 32 140 40 C108 48 62 43 4 60 C16 40 26 16 40 2 Z";

export function SpriteDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="zg" x1="0" y1="0" x2="1" y2=".3">
          <stop offset="0" stopColor="#D6A46C" />
          <stop offset=".55" stopColor="#A8723F" />
          <stop offset="1" stopColor="#7A532E" />
        </linearGradient>
        <linearGradient id="zk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2A2D33" />
          <stop offset="1" stopColor="#0B0D10" />
        </linearGradient>
        <symbol id="zmark" viewBox="0 0 200 136">
          <path d={BLADE} fill="url(#zg)" />
          <path d={BLADE} transform="rotate(180 101 68)" fill="url(#zk)" />
          <circle cx="100" cy="68" r="15" fill="#0B0D10" />
        </symbol>
        <symbol id="ick" viewBox="0 0 16 16">
          <path d="M3.5 8.4l3 3 6-6.6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="iar" viewBox="0 0 16 16">
          <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
      </defs>
    </svg>
  );
}

export const Mark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg aria-hidden="true" {...props}><use href="#zmark" /></svg>
);

export const Check = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size}><use href="#ick" /></svg>
);

export const Arrow = () => (
  <span className="arr"><svg width="14" height="14"><use href="#iar" /></svg></span>
);

export const Chk = ({ children }: { children: React.ReactNode }) => (
  <span className="chk"><Check />{children}</span>
);
