import { useEffect, useState } from "react";
import { royalAudio } from "@/lib/royal-audio";

type SongControls = { ready: boolean; playing: boolean; toggle: () => void };

/**
 * One Sound On/Off button.
 * - If a song is uploaded for this invitation, it plays/pauses that song.
 * - If not, it falls back to the original synthesized soundscape (ticks, chimes).
 */
export function SoundToggle({ song }: { song: SongControls }) {
  const [synthOn, setSynthOn] = useState(false);
  const useSong = song.ready;
  const on = useSong ? song.playing : synthOn;

  // The synthesized soundscape stays silent whenever the real song is available.
  useEffect(() => {
    royalAudio.setEnabled(!useSong && synthOn);
  }, [useSong, synthOn]);

  useEffect(() => () => royalAudio.setEnabled(false), []);

  return (
    <button
      onClick={() => {
        if (useSong) {
          song.toggle();
        } else {
          royalAudio.start();
          setSynthOn((v) => !v);
        }
      }}
      aria-pressed={on}
      aria-label={on ? "Mute the palace soundscape" : "Enable the palace soundscape"}
      className="fixed right-5 top-5 z-40 flex items-center gap-3 border border-gold/30 bg-midnight/55 px-3 py-2 backdrop-blur-sm transition-colors hover:border-gold/60"
    >
      <span className="flex h-3 items-end gap-[3px]" aria-hidden="true">
        {[0.45, 1, 0.7].map((h, i) => (
          <span
            key={i}
            className="w-[2px] bg-gold transition-all duration-500"
            style={{ height: on ? `${h * 12}px` : "2px", opacity: on ? 1 : 0.5 }}
          />
        ))}
      </span>
      <span className="label-caps text-[0.55rem] text-champagne/75">{on ? "Sound On" : "Sound Off"}</span>
    </button>
  );
}