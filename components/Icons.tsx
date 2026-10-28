// Shared SVG sprite. Render <SpriteDefs /> once, then reference symbols with <use href="#id" />.

export function SpriteDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
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

export const Check = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size}><use href="#ick" /></svg>
);

export const Arrow = () => (
  <span className="arr"><svg width="14" height="14"><use href="#iar" /></svg></span>
);

export const Chk = ({ children }: { children: React.ReactNode }) => (
  <span className="chk"><Check />{children}</span>
);
