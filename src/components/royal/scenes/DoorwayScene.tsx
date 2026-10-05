import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ballroom from "@/assets/ballroom.jpg";
import { invitation } from "@/config/invitation";

gsap.registerPlugin(ScrollTrigger);

export function DoorwayScene() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(q("[data-door-l], [data-door-r]"), { opacity: 0 });
        gsap.set(q("[data-venue]"), { opacity: 1, "--engrave": "115%" });
        gsap.set(q("[data-city]"), { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=190%", scrub: 1, pin: true, anticipatePin: 1 },
      });

      tl.fromTo(q("[data-beyond]"), { scale: 1.3, opacity: 0.25 }, { scale: 1.05, opacity: 0.85, ease: "none", duration: 2.4 }, 0)
        .fromTo(q("[data-handle]"), { opacity: 0.3 }, { opacity: 1, duration: 0.6, ease: "sine.out" }, 0.4)
        // doors open inward with weight
        .to(q("[data-door-l]"), { rotateY: -82, xPercent: -6, duration: 1.8, ease: "power2.inOut" }, 0.7)
        .to(q("[data-door-r]"), { rotateY: 82, xPercent: 6, duration: 1.8, ease: "power2.inOut" }, 0.7)
        .to(q("[data-handle]"), { opacity: 0, duration: 0.4 }, 0.8)
        .to(q("[data-doorframe]"), { scale: 1.9, opacity: 0, duration: 1.6, ease: "power2.in" }, 1.9)
        .fromTo(q("[data-venue]"), { opacity: 0, "--engrave": "0%" }, { opacity: 1, "--engrave": "115%", ease: "power1.inOut", duration: 1.2 }, 2.1)
        .fromTo(q("[data-city]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 2.7);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="scene h-screen w-full bg-midnight" aria-label="The royal destination">
      <img
        data-beyond
        src={ballroom}
        alt="The illuminated hall revealed beyond the royal doorway"
        width={1920}
        height={1088}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-maroon/14 mix-blend-multiply" />
      <div className="absolute inset-0 vignette" />

      {/* monumental doorway */}
      <div
        data-doorframe
        className="absolute left-1/2 top-1/2 h-[82vh] w-[min(58vw,44rem)] -translate-x-1/2 -translate-y-1/2 border-2 border-gold/40"
        style={{ perspective: "1400px", boxShadow: "0 0 140px oklch(0.09 0.04 12 / 0.9) inset" }}
      >
        <div
          data-door-l
          className="absolute left-0 top-0 h-full w-1/2 origin-left velvet-weave border-r border-gold/25 will-change-transform"
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-5 border border-gold/20" />
          <div className="absolute inset-y-16 left-8 w-px bg-gold/15" />
        </div>
        <div
          data-door-r
          className="absolute right-0 top-0 h-full w-1/2 origin-right velvet-weave border-l border-gold/25 will-change-transform"
          style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        >
          <div className="absolute inset-5 border border-gold/20" />
          <div className="absolute inset-y-16 right-8 w-px bg-gold/15" />
        </div>
        <div
          data-handle
          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ backgroundImage: "var(--gradient-gold)", boxShadow: "0 0 40px oklch(0.9 0.05 88 / 0.35)" }}
        />
      </div>

      <div className="absolute inset-x-0 bottom-[12vh] z-20 flex flex-col items-center px-6 text-center">
        <p className="label-caps text-gold/70">The royal destination</p>
        {invitation.showVenue ? (
          <>
            <p data-venue className="engrave mt-6 font-display text-[clamp(1.8rem,5vw,3.6rem)] leading-tight">
              {invitation.venueName}
            </p>
            <p data-city className="mt-3 label-caps text-[0.65rem] text-champagne/80 opacity-0">
              {invitation.venueLocation}
            </p>
          </>
        ) : (
          <>
            <p data-venue className="engrave mt-6 font-display text-[clamp(1.8rem,5vw,3.6rem)] leading-tight">
              To be revealed
            </p>
            <p data-city className="mt-3 label-caps text-[0.65rem] text-champagne/80 opacity-0">
              Kept for the royal hour
            </p>
          </>
        )}
      </div>
    </section>
  );
}
