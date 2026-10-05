const ROMAN = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

type Props = {
  initials: string;
  className?: string;
  hourRef?: React.Ref<SVGGElement>;
  minuteRef?: React.Ref<SVGGElement>;
  emblemRef?: React.Ref<SVGGElement>;
  ringOuterRef?: React.Ref<SVGGElement>;
  ringMidRef?: React.Ref<SVGGElement>;
  ringInnerRef?: React.Ref<SVGGElement>;
  apertureRef?: React.Ref<SVGCircleElement>;
};

/** Engraved astronomical clock, drawn as layered concentric mechanical rings. */
export function RoyalClock({
  initials,
  className,
  hourRef,
  minuteRef,
  emblemRef,
  ringOuterRef,
  ringMidRef,
  ringInnerRef,
  apertureRef,
}: Props) {
  return (
    <svg viewBox="0 0 800 800" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="rc-face" cx="42%" cy="34%" r="78%">
          <stop offset="0%" stopColor="oklch(0.42 0.095 16)" />
          <stop offset="55%" stopColor="oklch(0.3 0.08 16)" />
          <stop offset="100%" stopColor="oklch(0.19 0.045 14)" />
        </radialGradient>
        <linearGradient id="rc-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.58 0.115 78)" />
          <stop offset="34%" stopColor="oklch(0.95 0.08 92)" />
          <stop offset="62%" stopColor="oklch(0.72 0.13 83)" />
          <stop offset="100%" stopColor="oklch(0.42 0.09 68)" />
        </linearGradient>
        <radialGradient id="rc-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.97 0.075 92)" />
          <stop offset="70%" stopColor="oklch(0.7 0.13 82)" />
          <stop offset="100%" stopColor="oklch(0.38 0.085 64)" />
        </radialGradient>
      </defs>

      <circle cx="400" cy="400" r="392" fill="url(#rc-face)" />
      <circle cx="400" cy="400" r="392" fill="none" stroke="url(#rc-gold)" strokeWidth="6" />

      {/* outer engraved ring with fine astronomical ticks */}
      <g ref={ringOuterRef}>
        <circle cx="400" cy="400" r="368" fill="none" stroke="url(#rc-gold)" strokeWidth="1.2" opacity="0.7" />
        <circle cx="400" cy="400" r="352" fill="none" stroke="url(#rc-gold)" strokeWidth="0.6" opacity="0.45" />
        {Array.from({ length: 180 }).map((_, i) => (
          <line
            key={i}
            x1="400"
            y1="32"
            x2="400"
            y2={i % 5 === 0 ? 54 : 44}
            stroke="url(#rc-gold)"
            strokeWidth={i % 5 === 0 ? 1.6 : 0.7}
            opacity={i % 5 === 0 ? 0.85 : 0.4}
            transform={`rotate(${i * 2} 400 400)`}
          />
        ))}
      </g>

      {/* numeral ring */}
      <g ref={ringMidRef}>
        <circle cx="400" cy="400" r="300" fill="none" stroke="url(#rc-gold)" strokeWidth="1.6" opacity="0.6" />
        {ROMAN.map((n, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180);
          return (
            <text
              key={n}
              x={Math.round((400 + Math.cos(a) * 266) * 100) / 100}
              y={Math.round((400 + Math.sin(a) * 266) * 100) / 100}
              textAnchor="middle"
              dominantBaseline="central"
              fill="url(#rc-gold)"
              style={{ fontFamily: "var(--font-display)", fontSize: 40, letterSpacing: "0.06em" }}
            >
              {n}
            </text>
          );
        })}
      </g>

      {/* inner mechanism ring */}
      <g ref={ringInnerRef}>
        <circle cx="400" cy="400" r="210" fill="none" stroke="url(#rc-gold)" strokeWidth="1" opacity="0.5" />
        <circle cx="400" cy="400" r="176" fill="none" stroke="url(#rc-gold)" strokeWidth="0.7" opacity="0.35" strokeDasharray="3 9" />
        {Array.from({ length: 48 }).map((_, i) => (
          <path
            key={i}
            d="M400 190 l7 -14 l-14 0 z"
            fill="url(#rc-gold)"
            opacity="0.55"
            transform={`rotate(${i * 7.5} 400 400)`}
          />
        ))}
      </g>

      {/* aperture that opens into the palace */}
      <circle ref={apertureRef} cx="400" cy="400" r="0" fill="oklch(0.23 0.06 14)" />

      {/* hands */}
      <g ref={hourRef} style={{ transformOrigin: "400px 400px" }}>
        <path d="M400 400 L392 218 L400 196 L408 218 Z" fill="url(#rc-gold)" />
      </g>
      <g ref={minuteRef} style={{ transformOrigin: "400px 400px" }}>
        <path d="M400 400 L395 118 L400 96 L405 118 Z" fill="url(#rc-gold)" opacity="0.92" />
      </g>

      {/* central royal emblem with initials */}
      <g ref={emblemRef} style={{ transformOrigin: "400px 400px" }}>
        <circle cx="400" cy="400" r="74" fill="oklch(0.26 0.065 14)" stroke="url(#rc-gold)" strokeWidth="2.5" />
        <circle cx="400" cy="400" r="62" fill="none" stroke="url(#rc-core)" strokeWidth="0.9" opacity="0.7" />
        {Array.from({ length: 16 }).map((_, i) => (
          <path key={i} d="M400 330 l5 -11 l-10 0 z" fill="url(#rc-gold)" opacity="0.6" transform={`rotate(${i * 22.5} 400 400)`} />
        ))}
        <text
          x="400"
          y="404"
          textAnchor="middle"
          dominantBaseline="central"
          fill="url(#rc-core)"
          style={{ fontFamily: "var(--font-display)", fontSize: 34, letterSpacing: "0.08em" }}
        >
          {initials}
        </text>
      </g>
    </svg>
  );
}
