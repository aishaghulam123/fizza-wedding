import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import corridor from "@/assets/corridor.jpg";
import { invitation } from "@/config/invitation";
import { royalAudio } from "@/lib/royal-audio";

gsap.registerPlugin(ScrollTrigger);

export function PendulumScene() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(q("[data-time]"), { opacity: 1, "--engrave": "115%" });
        gsap.set(q("[data-sub]"), { opacity: 1 });
        return;
      }

      // Continuous, weighted swing with the light on the wall following it.
      gsap.to(q("[data-rod]"), {
        rotation: 13,
        transformOrigin: "50% 0%",
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        startAt: { rotation: -13 },
      });
      gsap.to(q("[data-wall-light]"), {
        xPercent: 16,
        opacity: 0.5,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        startAt: { xPercent: -16, opacity: 0.22 },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=170%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onEnter: () => royalAudio.chime(),
        },
      });

      tl.fromTo(q("[data-bg]"), { scale: 1.16, xPercent: 3 }, { scale: 1.02, xPercent: 0, ease: "none", duration: 2 }, 0)
        .fromTo(q("[data-case]"), { xPercent: 22, opacity: 0.4 }, { xPercent: 0, opacity: 1, ease: "power2.out", duration: 1.4 }, 0)
        .fromTo(q("[data-plaque]"), { opacity: 0, y: 26 }, { opacity: 1, y: 0, ease: "power3.out", duration: 0.9 }, 1.2)
        .fromTo(q("[data-time]"), { opacity: 0, "--engrave": "0%" }, { opacity: 1, "--engrave": "115%", ease: "power1.inOut", duration: 1.1 }, 1.5)
        .fromTo(q("[data-sub]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 2.2);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="scene h-screen w-full velvet" aria-label="When the clock strikes">
      <img
        data-bg
        src={corridor}
        alt="A candlelit palace corridor with carved archways and antique gold lanterns"
        width={1920}
        height={1088}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-85 will-change-transform"
      />
      <div className="absolute inset-0 bg-midnight/22" />
      <div
        data-wall-light
        className="pointer-events-none absolute inset-y-0 left-1/4 w-1/2"
        style={{ background: "radial-gradient(45% 55% at 50% 45%, oklch(0.9 0.05 88 / 0.16), transparent 70%)" }}
      />
      <div className="absolute inset-0 vignette" />

      {/* carved pendulum case */}
      <div data-case className="absolute left-1/2 top-[12vh] z-10 flex -translate-x-1/2 flex-col items-center">
        <div className="relative h-[46vh] w-[clamp(9rem,17vw,14rem)] border border-gold/30 bg-midnight/65 shadow-[var(--shadow-chamber)]">
          <div className="absolute inset-2 border border-gold/15" />
          <div className="absolute left-1/2 top-4 h-[3px] w-10 -translate-x-1/2 gold-rule" />
          <div data-rod className="absolute left-1/2 top-8 h-[70%] w-px origin-top -translate-x-1/2 bg-gold/50">
            <div
              className="absolute -left-[1.35rem] bottom-0 h-11 w-11 rounded-full border border-gold/50"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[10vh] z-20 flex flex-col items-center px-6 text-center">
        <p className="label-caps text-gold/70">When the clock strikes</p>
        <div data-plaque className="mt-6 border border-gold/30 bg-gradient-to-b from-maroon/80 to-midnight/80 px-[clamp(1.5rem,5vw,4rem)] py-6" style={{ boxShadow: "var(--shadow-gold)" }}>
          <p data-time className="engrave font-display text-[clamp(1.9rem,5.5vw,4rem)] leading-none">
            {invitation.eventTime}
          </p>
        </div>
        <p data-sub className="mt-6 font-display text-[clamp(1rem,2vw,1.4rem)] italic text-ivory/80 opacity-0">
          The evening awaits your presence.
        </p>
      </div>
    </section>
  );
}
