import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RoyalClock } from "../RoyalClock";
import { invitation } from "@/config/invitation";

gsap.registerPlugin(ScrollTrigger);

export function TimeScene() {
  const root = useRef<HTMLDivElement>(null);
  const hour = useRef<SVGGElement>(null);
  const minute = useRef<SVGGElement>(null);
  const ringMid = useRef<SVGGElement>(null);
  const ringInner = useRef<SVGGElement>(null);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(q("[data-date]"), { opacity: 1, "--engrave": "115%" });
        gsap.set(q("[data-sub]"), { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=200%", scrub: 1, pin: true, anticipatePin: 1 },
      });

      tl.fromTo(q("[data-shadow]"), { opacity: 0.1 }, { opacity: 0.85, ease: "none", duration: 1.4 }, 0)
        .fromTo(q("[data-sweep]"), { xPercent: -130, opacity: 0 }, { xPercent: 130, opacity: 1, ease: "sine.inOut", duration: 1.2 }, 0.2)
        .fromTo(minute.current, { rotation: -140 }, { rotation: 168, ease: "power2.out", duration: 1.8 }, 0)
        .fromTo(hour.current, { rotation: -40 }, { rotation: 62, ease: "power2.out", duration: 1.9 }, 0)
        .to(q("[data-clock]"), { scale: 1.18, ease: "power1.inOut", duration: 2.4 }, 0.3)
        .to(ringMid.current, { rotation: 30, ease: "power2.inOut", duration: 2, transformOrigin: "400px 400px" }, 0.3)
        .to(ringInner.current, { rotation: -120, ease: "power2.inOut", duration: 2.2, transformOrigin: "400px 400px" }, 0.3)
        .fromTo(q("[data-aperture]"), { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, ease: "power3.out", duration: 0.8 }, 1.5)
        .fromTo(q("[data-date]"), { opacity: 0, "--engrave": "0%" }, { opacity: 1, "--engrave": "115%", ease: "power1.inOut", duration: 1.2 }, 1.8)
        .fromTo(q("[data-sub]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 2.5);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="scene h-screen w-full velvet-weave" aria-label="The moment written in time">
      <div data-shadow className="absolute inset-0 z-10 bg-midnight/80" />

      <div data-clock className="absolute left-1/2 top-1/2 w-[min(92vw,80vh)] -translate-x-1/2 -translate-y-1/2 will-change-transform">
        <RoyalClock
          initials={invitation.initials}
          className="h-auto w-full opacity-70"
          hourRef={hour}
          minuteRef={minute}
          ringMidRef={ringMid}
          ringInnerRef={ringInner}
        />
      </div>

      <div
        data-sweep
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2 opacity-0"
        style={{ background: "linear-gradient(90deg, transparent, oklch(0.95 0.05 90 / 0.14), transparent)" }}
      />

      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
        <p className="label-caps absolute top-[9vh] left-1/2 -translate-x-1/2 text-gold/70">An hour set down in brass</p>
        <div
          data-aperture
          className="mt-8 origin-center border-y border-gold/35 bg-midnight/70 px-[clamp(1.5rem,6vw,5rem)] py-8 backdrop-blur-[2px] opacity-0"
          style={{ boxShadow: "var(--shadow-gold)" }}
        >
          <p data-date className="engrave font-display text-[clamp(2rem,6.5vw,5rem)] leading-none">
            {invitation.baraatDate}
          </p>
        </div>
        <p data-sub className="mt-8 font-display text-[clamp(1rem,2vw,1.5rem)] italic text-ivory/80 opacity-0">
          A moment we have been waiting for.
        </p>
      </div>
    </section>
  );
}
