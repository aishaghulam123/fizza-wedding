import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import desk from "@/assets/desk.jpg";
import { invitation } from "@/config/invitation";
import { royalAudio } from "@/lib/royal-audio";

gsap.registerPlugin(ScrollTrigger);

export function ChamberScene() {
  const root = useRef<HTMLDivElement>(null);
  const opened = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    if (opened.current || !root.current) return;
    opened.current = true;
    setIsOpen(true);
    royalAudio.wax();
    const q = gsap.utils.selector(root.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(q("[data-seal]"), { opacity: 0 });
      gsap.set(q("[data-flap]"), { rotateX: -172 });
      gsap.set(q("[data-card]"), { opacity: 1, yPercent: -12 });
      return;
    }

    gsap
      .timeline()
      .to(q("[data-envelope]"), { scale: 1.06, duration: 1.2, ease: "power2.out" }, 0)
      .to(q("[data-seal-sheen]"), { opacity: 1, duration: 0.4 }, 0)
      .to(q("[data-crack]"), { scaleY: 1, opacity: 1, duration: 0.35, ease: "power4.out" }, 0.35)
      .to(q("[data-seal-core]"), { opacity: 0, duration: 0.2 }, 0.65)
      .to(q("[data-shard]"), {
        opacity: 1,
        duration: 0.05,
      }, 0.6)
      .to(q("[data-shard-1]"), { x: -34, y: 42, rotate: -38, duration: 0.9, ease: "power2.in" }, 0.65)
      .to(q("[data-shard-2]"), { x: 12, y: 54, rotate: 24, duration: 1, ease: "power2.in" }, 0.68)
      .to(q("[data-shard-3]"), { x: 38, y: 36, rotate: 62, duration: 0.85, ease: "power2.in" }, 0.7)
      .to(q("[data-shard]"), { opacity: 0.4, duration: 0.5 }, 1.2)
      .to(q("[data-seal-sheen]"), { opacity: 0, duration: 0.5 }, 1)
      .add(() => royalAudio.paper(), 1.1)
      .to(q("[data-flap]"), { rotateX: -172, duration: 1.5, ease: "power3.inOut" }, 1.1)
      .fromTo(q("[data-card]"), { yPercent: 6, opacity: 0 }, { yPercent: -12, opacity: 1, duration: 1.8, ease: "power3.out" }, 1.6)
      .fromTo(q("[data-foil]"), { "--engrave": "0%" }, { "--engrave": "115%", duration: 1.6, ease: "power1.inOut" }, 2.4);
  }, []);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          // the invitation must not be lost if the guest scrolls straight past
          onLeave: open,
        },
      })
        .fromTo(q("[data-bg]"), { scale: 1.2, yPercent: -3 }, { scale: 1.04, yPercent: 2, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, [open]);

  return (
    <section ref={root} className="scene min-h-screen w-full bg-midnight py-[14vh]" aria-label="The royal invitation chamber">
      <img
        data-bg
        src={desk}
        alt="A royal writing desk of dark wood and maroon velvet holding a gold-edged envelope"
        width={1920}
        height={1088}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-70 will-change-transform"
      />
      <div className="absolute inset-0 vignette" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5">
        <p className="label-caps text-gold/70">The invitation chamber</p>

        <div className="relative mt-[6vh] w-full max-w-xl" style={{ perspective: "1600px" }}>
          {/* the invitation itself rises out of the envelope */}
          <article
            data-card
            className="relative z-0 mx-auto w-[94%] border border-gold/30 bg-gradient-to-b from-[oklch(0.96_0.015_85)] to-[oklch(0.9_0.02_85)] px-[clamp(1.5rem,5vw,3.5rem)] py-[clamp(2rem,5vw,3.5rem)] text-center text-midnight opacity-0"
            style={{ boxShadow: "var(--shadow-chamber)" }}
          >
            <div className="mx-auto h-px w-20 gold-rule" />
            <p className="mt-6 label-caps text-[0.6rem] text-[oklch(0.48_0.05_72)]">Together with their families</p>
            <h2 data-foil className="engrave-deep mt-5 font-display text-[clamp(1.9rem,6vw,3.4rem)] leading-tight">
              {invitation.brideName}
              <span className="mx-3 italic">&amp;</span>
              {invitation.groomName}
            </h2>
            <p className="mx-auto mt-5 max-w-sm text-balance text-sm leading-relaxed text-[oklch(0.35_0.03_40)]">
              Request the pleasure of your presence at their Baraat celebration.
            </p>

            <dl className="mx-auto mt-9 grid max-w-sm grid-cols-1 gap-5 border-y border-[oklch(0.48_0.05_72/0.3)] py-7 text-left sm:grid-cols-2">
              <div>
                <dt className="label-caps text-[0.55rem] text-[oklch(0.48_0.05_72)]">Date</dt>
                <dd className="mt-2 font-display text-lg">{invitation.baraatDate}</dd>
              </div>
              <div>
                <dt className="label-caps text-[0.55rem] text-[oklch(0.48_0.05_72)]">Time</dt>
                <dd className="mt-2 font-display text-lg">{invitation.eventTime}</dd>
              </div>
              {invitation.showVenue && (
                <>
                  <div>
                    <dt className="label-caps text-[0.55rem] text-[oklch(0.48_0.05_72)]">Venue</dt>
                    <dd className="mt-2 font-display text-lg">{invitation.venueName}</dd>
                  </div>
                  <div>
                    <dt className="label-caps text-[0.55rem] text-[oklch(0.48_0.05_72)]">Location</dt>
                    <dd className="mt-2 font-display text-lg">{invitation.venueLocation}</dd>
                    
                  </div>
                  {invitation.showVenue && (
  <div className="col-span-full flex justify-center">
    <button
      onClick={() => window.open(invitation.venueMapUrl, "_blank", "noopener,noreferrer")}
      className="label-caps mt-1 inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2 text-[0.55rem] text-gold transition-colors hover:border-gold hover:bg-gold/10"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
      Get Directions
    </button>
  </div>
)}
                </>
              )}
            </dl>

            <p className="mt-7 font-display text-base italic text-[oklch(0.4_0.04_40)]">{invitation.closingNote}</p>
            <div className="mx-auto mt-7 h-px w-20 gold-rule" />
          </article>

          {/* envelope */}
          <div data-envelope className="relative z-10 -mt-[8rem] will-change-transform" style={{ transformStyle: "preserve-3d" }}>
            <div className="relative aspect-[3/2] w-full velvet-weave border border-gold/35" style={{ boxShadow: "var(--shadow-chamber)" }}>
              <div className="absolute inset-3 border border-gold/20" />
              <div
                className="pointer-events-none absolute inset-x-3 bottom-3 top-1/2 border-t border-gold/15"
                style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }}
              />
              <div
                data-flap
                className="absolute inset-x-0 top-0 h-1/2 origin-top velvet-weave border-b border-gold/25 will-change-transform"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              />
              <button
                onClick={open}
                disabled={isOpen}
                aria-label="Break the wax seal and open the invitation"
                className="absolute left-1/2 top-1/2 z-20 h-[clamp(4rem,11vw,5.5rem)] w-[clamp(4rem,11vw,5.5rem)] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full disabled:pointer-events-none"
              >
                <span
                  data-seal-core
                  className="absolute inset-0 rounded-full border border-gold/45"
                  style={{
                    background: "radial-gradient(60% 60% at 35% 30%, oklch(0.52 0.145 14), oklch(0.33 0.105 14))",
                    boxShadow: "0 10px 26px -10px oklch(0.09 0.04 12 / 0.9)",
                  }}
                >
                  <span className="absolute inset-0 flex items-center justify-center font-display text-lg text-champagne/90">
                    {invitation.initials}
                  </span>
                  <span
                    data-crack
                    className="absolute left-1/2 top-0 h-full w-[2px] origin-top -translate-x-1/2 scale-y-0 bg-midnight/80 opacity-0"
                  />
                </span>
                <span
                  data-seal-sheen
                  className="pointer-events-none absolute inset-0 rounded-full opacity-0"
                  style={{ background: "linear-gradient(130deg, transparent 40%, oklch(0.95 0.05 90 / 0.3), transparent 62%)" }}
                />
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    data-shard=""
                    {...{ [`data-shard-${n}`]: "" }}
                    className="absolute left-1/2 top-1/2 h-4 w-3 -translate-x-1/2 -translate-y-1/2 opacity-0"
                    style={{
                      background: "linear-gradient(140deg, oklch(0.52 0.145 14), oklch(0.31 0.105 14))",
                      clipPath: n === 2 ? "polygon(0 0, 100% 30%, 60% 100%)" : "polygon(10% 0, 100% 45%, 30% 100%)",
                    }}
                  />
                ))}
              </button>
            </div>
          </div>

          {!isOpen && (
            <p className="mt-8 text-center label-caps text-[0.55rem] text-gold/70">Break the seal</p>
          )}
        </div>
      </div>
    </section>
  );
}
