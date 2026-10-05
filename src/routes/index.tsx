import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useInvitationSong } from "@/hooks/use-invitation-song";
import { Overture } from "@/components/royal/Overture";
import { SoundToggle } from "@/components/royal/SoundToggle";
import { BallroomScene } from "@/components/royal/scenes/BallroomScene";
import { TimeScene } from "@/components/royal/scenes/TimeScene";
import { PendulumScene } from "@/components/royal/scenes/PendulumScene";
import { DoorwayScene } from "@/components/royal/scenes/DoorwayScene";
import { ChamberScene } from "@/components/royal/scenes/ChamberScene";
import { CelebrationScene } from "@/components/royal/scenes/CelebrationScene";
import { FinaleScene } from "@/components/royal/scenes/FinaleScene";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Crimson Royal Hour — A Royal Baraat Invitation" },
      {
        name: "description",
        content:
          "A cinematic maroon-and-gold Baraat invitation for Fizza & Abdul Qadir: an antique royal clock opens onto a midnight palace, revealing the date, time and venue of the celebration.",
      },
      { property: "og:title", content: "The Crimson Royal Hour — A Royal Baraat Invitation" },
      {
        property: "og:description",
        content:
          "Step through an antique royal clock into a midnight palace and discover the invitation to Fizza & Abdul Qadir's Baraat celebration.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://fizza-wedding.netlify.app" },
      { property: "og:image", content: "https://fizza-wedding.netlify.app/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://fizza-wedding.netlify.app/og-image.jpg" },
    ],
  }),
  component: RoyalHour,
});

function RoyalHour() {
  const [entered, setEntered] = useState(false);
  const [key, setKey] = useState(0);
  const song = useInvitationSong("shaadi");
  const journey = useRef<HTMLDivElement>(null);

  // Lock the page behind the overture, then hand scrolling to Lenis.
  useEffect(() => {
    if (!entered) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    document.body.style.overflow = "";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("orientationchange", refresh);
    requestAnimationFrame(refresh);

    return () => {
      window.removeEventListener("orientationchange", refresh);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [entered, key]);

  const replay = () => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    window.scrollTo(0, 0);
    setEntered(false);
    setKey((k) => k + 1);
  };

  return (
    <main className="relative w-full overflow-x-hidden velvet">
      {entered && <SoundToggle song={song} />}
      {!entered && <Overture key={`overture-${key}`} onEnter={() => setEntered(true)} onStartSound={song.start} />}

      <div ref={journey} key={`journey-${key}`} aria-hidden={!entered}>
        <BallroomScene />
        <TimeScene />
        <PendulumScene />
        <DoorwayScene />
        <ChamberScene />
        <CelebrationScene />
        <FinaleScene onReplay={replay} />
      </div>
    </main>
  );
}