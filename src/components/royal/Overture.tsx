import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RoyalClock } from "./RoyalClock";
import { royalAudio } from "@/lib/royal-audio";
import { invitation } from "@/config/invitation";

export function Overture({ onEnter, onStartSound }: { onEnter: () => void; onStartSound: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const clockWrap = useRef<HTMLDivElement>(null);
  const hour = useRef<SVGGElement>(null);
  const minute = useRef<SVGGElement>(null);
  const emblem = useRef<SVGGElement>(null);
  const ringOuter = useRef<SVGGElement>(null);
  const ringMid = useRef<SVGGElement>(null);
  const ringInner = useRef<SVGGElement>(null);
  const aperture = useRef<SVGCircleElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Slow reveal of the clock out of near-darkness.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set([clockWrap.current, copy.current], { opacity: 1, scale: 1 });
        return;
      }
      gsap.set(clockWrap.current, { opacity: 0, scale: 1.14, filter: "brightness(0.35)" });
      gsap.set(copy.current, { opacity: 0, y: 18 });
      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .to(clockWrap.current, { opacity: 1, scale: 1, filter: "brightness(1)", duration: 4.4 })
        .to(copy.current, { opacity: 1, y: 0, duration: 1.8 }, "-=1.6");
      gsap.to([ringOuter.current], { rotation: 360, duration: 420, repeat: -1, ease: "none", transformOrigin: "400px 400px" });
      gsap.to(minute.current, { rotation: 360, duration: 180, repeat: -1, ease: "none" });
      gsap.to(hour.current, { rotation: 30, duration: 90, repeat: -1, ease: "none" });
    }, root);
    return () => ctx.revert();
  }, []);

  const finish = () => {
    tl.current?.kill();
    onEnter();
  };

  const enter = () => {
    if (running) return;
    setRunning(true);
    royalAudio.start();
    onStartSound(); // start the song right on the tap (browsers only allow sound inside a tap)
    royalAudio.gears();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onEnter();
      return;
    }
    gsap.killTweensOf([hour.current, minute.current, ringOuter.current]);
    tl.current = gsap
      .timeline({ onComplete: onEnter })
      .to(copy.current, { opacity: 0, y: -14, duration: 0.6, ease: "power2.in" })
      // hands accelerate with convincing weight
      .to(minute.current, { rotation: 1440, duration: 3.4, ease: "power2.inOut" }, 0)
      .to(hour.current, { rotation: 300, duration: 3.6, ease: "power2.inOut" }, 0)
      // gears engage, engraving catches light
      .to(ringInner.current, { rotation: -68, duration: 2.6, ease: "power3.inOut", transformOrigin: "400px 400px" }, 0.2)
      .to(ringMid.current, { rotation: 22, duration: 3, ease: "power3.inOut", transformOrigin: "400px 400px" }, 0.35)
      .to(ringOuter.current, { rotation: -14, duration: 3.2, ease: "power2.inOut", transformOrigin: "400px 400px" }, 0.35)
      .to(emblem.current, { scale: 1.08, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: 1 }, 1.2)
      // concentric layers separate
      .to(ringOuter.current, { scale: 1.1, opacity: 0.55, duration: 2, ease: "power2.inOut" }, 2.6)
      .to(ringMid.current, { scale: 1.28, opacity: 0.3, duration: 2, ease: "power2.inOut" }, 2.7)
      .to(ringInner.current, { scale: 1.5, opacity: 0, duration: 2, ease: "power2.inOut" }, 2.8)
      .to(emblem.current, { scale: 0.2, opacity: 0, duration: 1.6, ease: "power2.in" }, 2.9)
      .to([hour.current, minute.current], { opacity: 0, duration: 1 }, 2.9)
      // the aperture opens and the camera travels through
      .fromTo(aperture.current, { attr: { r: 0 } }, { attr: { r: 420 }, duration: 2.2, ease: "power3.inOut" }, 3)
      .to(clockWrap.current, { scale: 6.5, duration: 2.6, ease: "power2.in" }, 3.6)
      .to(root.current, { opacity: 0, duration: 1.1, ease: "power1.in" }, 5.1);
  };

  return (
    <div
      ref={root}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden velvet-weave"
    >
      <div className="pointer-events-none absolute inset-0 vignette z-10" />

      <div
        ref={clockWrap}
        className="relative w-[min(112vw,92vh)] max-w-none will-change-transform"
      >
        <RoyalClock
          initials={invitation.initials}
          className="h-auto w-full drop-shadow-[0_30px_90px_oklch(0.09_0.04_12/0.85)]"
          hourRef={hour}
          minuteRef={minute}
          emblemRef={emblem}
          ringOuterRef={ringOuter}
          ringMidRef={ringMid}
          ringInnerRef={ringInner}
          apertureRef={aperture}
        />
      </div>

      <div
        ref={copy}
        className="absolute inset-x-0 bottom-[8vh] z-20 flex flex-col items-center gap-6 px-6 text-center"
      >
        <p className="font-display text-[clamp(1.1rem,2.4vw,1.75rem)] italic text-ivory/85">
          Some moments are written in time.
        </p>
        <button
          onClick={enter}
          className="group relative cursor-pointer px-2 py-3 label-caps transition-opacity duration-500 hover:opacity-100"
        >
          <span className="relative z-10 text-champagne/90 group-hover:text-champagne">
            Enter the Royal Hour
          </span>
          <span className="absolute -bottom-0.5 left-0 h-px w-full gold-rule opacity-60 transition-opacity duration-700 group-hover:opacity-100" />
        </button>
      </div>

      {running && (
        <button
          onClick={finish}
          className="absolute bottom-6 right-6 z-30 label-caps text-[0.6rem] text-gold/60 transition-colors hover:text-champagne"
        >
          Skip Intro
        </button>
      )}
    </div>
  );
}