"use client";

import { useEffect } from "react";

// Blur-in reveal for headings and cards that start below the fold.
// Anything already on screen, or seen without JS, stays fully visible.
export default function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.remove("pre"); io.unobserve(en.target); } }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal],.fcard,.hcard,.area,.scard").forEach((n) => {
      n.classList.add("rv");
      if (n.getBoundingClientRect().top > innerHeight) { n.classList.add("pre"); io.observe(n); }
    });
    return () => io.disconnect();
  }, []);
  return null;
}
