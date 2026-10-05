import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RoyalClock } from "../RoyalClock";
import { invitation } from "@/config/invitation";

gsap.registerPlugin(ScrollTrigger);

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function WhatsappGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <path
        d="M12 3a9 9 0 0 0-7.75 13.55L3 21l4.6-1.22A9 9 0 1 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.3 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.4.2.5.7 1.6.7 1.8s0 .3-.1.5c-.2.2-.3.3-.5.5-.1.2-.3.3-.1.6.2.4.8 1.2 1.7 1.9 1.1.9 2 1.2 2.4 1.3.3.1.5.1.6-.1.2-.2.7-.8.9-1 .2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.4.1.5-.1 1.2-.5 1.6-.4.4-1.2.8-1.9.8-1.7.1-3.4-.7-4.7-1.8-1.5-1.2-2.5-2.7-2.9-3.6-.3-.7-.5-1.5-.1-2.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function FinaleScene({ onReplay }: { onReplay: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(q("[data-final], [data-initials], [data-replay]"), { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=160%", scrub: 1, pin: true, anticipatePin: 1 },
      });

      tl.fromTo(q("[data-emblem]"), { scale: 1.45, opacity: 0.25 }, { scale: 1, opacity: 0.6, ease: "none", duration: 2 }, 0)
        .fromTo(q("[data-sheen]"), { xPercent: -130 }, { xPercent: 130, ease: "sine.inOut", duration: 2 }, 0.3)
        .fromTo(q("[data-final]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: "power2.out", duration: 1 }, 0.9)
        .fromTo(q("[data-initials]"), { opacity: 0, letterSpacing: "0.6em" }, { opacity: 1, letterSpacing: "0.22em", ease: "power2.out", duration: 1.2 }, 1.6)
        .fromTo(q("[data-replay]"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 2.4);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="scene h-screen w-full velvet-weave" aria-label="Until the royal hour">
      <div data-emblem className="absolute left-1/2 top-1/2 w-[min(90vw,80vh)] -translate-x-1/2 -translate-y-1/2 opacity-25">
        <RoyalClock initials="" className="h-auto w-full" />
      </div>
      <div className="absolute inset-0 bg-midnight/70" />
      <div
        data-sheen
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.95 0.05 90 / 0.12), transparent)" }}
      />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        <h2 data-final className="gold-leaf font-display text-[clamp(2rem,6vw,4.5rem)] italic opacity-0">
          Until the Royal Hour.
        </h2>
        <p data-initials className="mt-10 font-display text-[clamp(1.4rem,3.5vw,2.4rem)] text-gold opacity-0">
          {invitation.initials}
        </p>
        <button
          data-replay
          onClick={onReplay}
          className="mt-12 label-caps rounded-full border border-gold/35 px-7 py-3 text-[0.55rem] text-gold/80 opacity-0 transition-colors hover:border-gold/70 hover:text-champagne"
        >
          Experience it again
        </button>

        <div data-replay className="mt-10 flex w-full flex-col items-center gap-4 px-4 opacity-0">
          <p className="label-caps text-[0.6rem] text-champagne/90">
            {invitation.credits.label} <span className="text-gold">{invitation.credits.name}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={invitation.credits.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 text-champagne transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              <InstagramGlyph />
            </a>
            <a
              href={invitation.credits.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message us on WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 text-champagne transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold"
            >
              <WhatsappGlyph />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
