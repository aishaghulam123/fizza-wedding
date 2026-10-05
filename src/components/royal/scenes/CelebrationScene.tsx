import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { invitation } from "@/config/invitation";

gsap.registerPlugin(ScrollTrigger);

/**
 * A quiet, standalone breath between the invitation and the closing scene.
 * Deliberately NOT using the shared "scene" utility (which sets overflow:hidden) —
 * height is left to grow naturally with the text so nothing is ever clipped,
 * and every measurement below is fluid so it holds together down to ~300px wide.
 */
export function CelebrationScene() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        gsap.set(q("[data-celebrate], [data-celebrate-rule], [data-celebrate-mark]"), {
          opacity: 1,
          y: 0,
          scaleX: 1,
          scale: 1,
          rotate: 45,
          filter: "blur(0px)",
        });
        gsap.set(q("[data-celebrate-heading]"), { opacity: 1, "--engrave": "115%" });
        return;
      }

      // slow ambient glow behind the plaque, breathing the whole time the section is on screen
      gsap.to(q("[data-celebrate-glow]"), {
        opacity: 0.55,
        scale: 1.12,
        duration: 3.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        startAt: { opacity: 0.22, scale: 0.94 },
      });

      gsap.set(q("[data-celebrate-rule]"), { scaleX: 0, transformOrigin: "50% 50%" });
      gsap.set(q("[data-celebrate-mark]"), { scale: 0, rotate: 0, opacity: 0 });
      gsap.set(q("[data-celebrate-heading]"), { opacity: 0, "--engrave": "0%" });
      gsap.set(q("[data-celebrate-plaque]"), { opacity: 0, y: 18, scale: 0.97 });
      gsap.set(q("[data-celebrate-paragraph]"), { opacity: 0, y: 14, filter: "blur(6px)" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });

      tl.fromTo(
        q("[data-celebrate]"),
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" },
      )
        .to(q("[data-celebrate-rule-top]"), { scaleX: 1, duration: 0.85, ease: "power2.out" }, 0.3)
        .to(
          q("[data-celebrate-mark]"),
          { scale: 1, rotate: 45, opacity: 1, duration: 0.7, ease: "back.out(2.4)" },
          0.75,
        )
        .to(
          q("[data-celebrate-heading]"),
          { opacity: 1, "--engrave": "115%", duration: 1.3, ease: "power1.inOut" },
          1,
        )
        .to(
          q("[data-celebrate-plaque]"),
          { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power2.out" },
          1.5,
        )
        .to(
          q("[data-celebrate-paragraph]"),
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out" },
          1.75,
        )
        .to(q("[data-celebrate-rule-bottom]"), { scaleX: 1, duration: 0.85, ease: "power2.out" }, 2.15);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative isolate w-full bg-midnight px-5 py-[max(4rem,12vh)] sm:px-8"
      aria-label="The grandest celebration awaits"
    >
      <div className="pointer-events-none absolute inset-0 vignette" />
      <div
        data-celebrate-glow
        className="pointer-events-none absolute left-1/2 top-1/2 h-[46vh] w-[min(70vw,34rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, oklch(0.72 0.115 83 / 0.28), transparent 72%)" }}
      />
      <div
        data-celebrate
        className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center text-center opacity-0"
      >
        <p className="label-caps text-gold/75">A Royal Celebration</p>
        <div data-celebrate-rule data-celebrate-rule-top className="mt-6 h-px w-16 gold-rule" />
        <div
          data-celebrate-mark
          className="mt-5 h-2.5 w-2.5 border border-gold/70"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        />
        <h2
          data-celebrate-heading
          className="engrave mt-5 text-balance font-display text-[clamp(1.5rem,6vw,2.75rem)] italic leading-tight"
        >
          {invitation.celebrationHeading}
        </h2>
        <div
          data-celebrate-plaque
          className="mt-8 w-full max-w-md border border-gold/30 bg-gradient-to-b from-maroon/80 to-midnight/80 px-[clamp(1.25rem,4.5vw,2.5rem)] py-[clamp(1.5rem,4vw,2rem)]"
          style={{ boxShadow: "var(--shadow-gold)" }}
        >
          <p
            data-celebrate-paragraph
            className="text-balance text-[clamp(0.95rem,3.4vw,1.1rem)] leading-relaxed text-ivory/85"
          >
            {invitation.celebrationParagraph}
          </p>
        </div>
        <div data-celebrate-rule data-celebrate-rule-bottom className="mt-8 h-px w-16 gold-rule" />
      </div>
    </section>
  );
}
