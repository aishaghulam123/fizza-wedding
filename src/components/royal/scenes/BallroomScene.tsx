import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ballroom from "@/assets/ballroom.jpg";
import couple from "@/assets/couple.png";
import { invitation } from "@/config/invitation";

gsap.registerPlugin(ScrollTrigger);

export function BallroomScene() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(q("[data-couple]"), { opacity: 1 });
        gsap.set(q("[data-engrave]"), { "--engrave": "115%" });
        gsap.set(q("[data-sub]"), { opacity: 1 });
        return;
      }

      // The reveal plays once the camera lands in the ballroom — never scroll-gated,
      // so the names are legible immediately.
      gsap
        .timeline({ delay: 0.35 })
        .fromTo(q("[data-couple]"), { opacity: 0, yPercent: 12, scale: 0.95 }, { opacity: 1, yPercent: 0, scale: 1, duration: 2.4, ease: "power2.out" }, 0)
        .fromTo(q("[data-beam]"), { xPercent: -150, opacity: 0 }, { xPercent: 150, opacity: 1, duration: 2.6, ease: "sine.inOut" }, 0.5)
        .to(q("[data-beam]"), { opacity: 0, duration: 0.5 }, 2.6)
        .fromTo(q("[data-engrave]"), { "--engrave": "0%" }, { "--engrave": "115%", duration: 2.4, ease: "power1.inOut" }, 0.7)
        .fromTo(q("[data-sub]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.2 }, 2.2)
        .fromTo(q("[data-hint]"), { opacity: 0 }, { opacity: 1, duration: 1 }, 3);

      // Scroll drives the camera push-in and the curtains parting.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        })
        .to(q("[data-bg]"), { scale: 1.2, yPercent: -4, ease: "none" }, 0)
        .to(q("[data-curtain-l]"), { xPercent: -70, ease: "none" }, 0)
        .to(q("[data-curtain-r]"), { xPercent: 70, ease: "none" }, 0)
        .to(q("[data-couple]"), { yPercent: -8, scale: 1.08, ease: "none" }, 0)
        .to(q("[data-hint]"), { opacity: 0, duration: 0.2 }, 0)
        .to(q("[data-title]"), { yPercent: -6, opacity: 0.9, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="scene h-screen w-full velvet" aria-label="The palace beyond midnight">
      <img
        data-bg
        src={ballroom}
        alt="A royal palace ballroom at midnight lit by antique gold chandeliers"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full scale-105 object-cover opacity-100 will-change-transform"
      />
      <div className="absolute inset-0 vignette" />
      <div className="absolute inset-0 bg-maroon/12 mix-blend-multiply" />

      {/* foreground velvet curtains for parallax depth */}
      <div
        data-curtain-l
        className="absolute -left-1 top-0 h-full w-[15vw] velvet-weave will-change-transform"
        style={{ boxShadow: "50px 0 110px oklch(0.09 0.04 12 / 0.8)" }}
      />
      <div
        data-curtain-r
        className="absolute -right-1 top-0 h-full w-[15vw] velvet-weave will-change-transform"
        style={{ boxShadow: "-50px 0 110px oklch(0.09 0.04 12 / 0.8)" }}
      />

      <img
        data-couple
        src={couple}
        alt="Faceless royal bride and groom in maroon and gold wedding attire"
        width={1024}
        height={1408}
        loading="lazy"
        className="absolute bottom-0 left-1/2 h-[58vh] w-auto -translate-x-1/2 object-contain opacity-0 will-change-transform"
        style={{ filter: "drop-shadow(0 30px 60px oklch(0.09 0.04 12 / 0.85))" }}
      />

      <div data-title className="absolute inset-x-0 top-[8vh] z-10 px-6 text-center">
        <p className="label-caps text-gold/70">The Crimson Royal Hour</p>
        <div className="relative mx-auto mt-8 max-w-4xl">
          <div
            data-beam
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-0"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.95 0.05 90 / 0.2), transparent)" }}
          />
          <h1
            data-engrave
            className="engrave font-display text-[clamp(2.4rem,7vw,5.5rem)] leading-[1.02] tracking-tight"
          >
            {invitation.brideName}
            <span className="mx-4 italic text-gold">&amp;</span>
            {invitation.groomName}
          </h1>
        </div>
        <p
          data-sub
          className="mx-auto mt-7 max-w-xl text-balance text-[clamp(0.9rem,1.4vw,1.05rem)] leading-relaxed text-ivory/85 opacity-0"
          style={{ textShadow: "0 2px 18px oklch(0.09 0.04 12 / 0.9)" }}
        >
          Together with their families, invite you to celebrate their Baraat.
        </p>
      </div>

      <p data-hint className="absolute inset-x-0 bottom-6 z-20 text-center label-caps text-[0.55rem] text-gold/60 opacity-0">
        Scroll to walk the palace
      </p>
    </section>
  );
}
