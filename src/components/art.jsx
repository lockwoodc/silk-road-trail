// Hand-drawn SVG pieces in one style: fine dark lines, flat washes, a woodcut feel.
// Nothing here is a placeholder box; every panel gets a drawing.

export function Ornament({ className = '', width = 220 }) {
  return (
    <svg className={className} width={width} height="18" viewBox="0 0 220 18" fill="none" aria-hidden="true">
      <path d="M2 9h64" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".55" />
      <path d="M154 9h64" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity=".55" />
      <path d="M110 2.5 117 9l-7 6.5L103 9l7-6.5Z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="110" cy="9" r="1.6" fill="currentColor" />
      <path d="M92 9c3-4 6-4 9 0-3 4-6 4-9 0Z" stroke="currentColor" strokeWidth="1" />
      <path d="M128 9c-3-4-6-4-9 0 3 4 6 4 9 0Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="78" cy="9" r="1.4" fill="currentColor" opacity=".7" />
      <circle cx="142" cy="9" r="1.4" fill="currentColor" opacity=".7" />
    </svg>
  );
}

export function Diamond({ className = '' }) {
  return (
    <svg className={className} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M5 .8 9.2 5 5 9.2.8 5 5 .8Z" fill="currentColor" />
    </svg>
  );
}

// A camel, side view, walking. Used on the map token, the travel strip and the title.
export function Camel({ className = '', size = 56, tint = 'currentColor' }) {
  return (
    <svg className={className} width={size} height={size * 0.78} viewBox="0 0 80 62" fill="none" aria-hidden="true">
      <path d="M18 40c-3-8 1-16 8-18 4-1 7 1 9 3 3-8 9-12 15-10 5 2 6 8 5 13 4-1 8 1 9 5 1 5-3 8-8 9" stroke={tint} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 40c-2 5-2 10 1 14M32 40c-2 5-2 10 0 14M48 41c-1 5-1 9 1 13M58 40c1 4 2 8 1 12" stroke={tint} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 40h40" stroke={tint} strokeWidth="1.4" strokeLinecap="round" opacity=".6" />
      <circle cx="23" cy="21" r="1.4" fill={tint} />
      <path d="M14 18c-3-3-4-6-2-8M9 13c-2-1-3-3-2-5" stroke={tint} strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
      <path d="M20 8c3-3 7-4 10-2" stroke={tint} strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
    </svg>
  );
}

// A full caravan profile for the travel strip: camels, a rider, a cart.
export function CaravanScene({ className = '', weather = 'clear' }) {
  return (
    <svg className={className} viewBox="0 0 640 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sky-1, #f0dcb4)" />
          <stop offset="100%" stopColor="var(--sky-2, #e9d5ae)" />
        </linearGradient>
        <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sand-1, #ddc79b)" />
          <stop offset="100%" stopColor="var(--sand-2, #c9ae7e)" />
        </linearGradient>
      </defs>
      <rect width="640" height="200" fill="url(#sky)" />
      <circle cx="520" cy="54" r="22" fill="var(--gold)" opacity=".28" />
      <circle cx="520" cy="54" r="14" fill="var(--gold)" opacity=".5" />
      {/* distant ridges */}
      <path d="M0 96 46 74 90 92 132 66 180 94 236 72 292 96 344 80 402 98 460 76 520 96 578 78 640 98V200H0Z" fill="var(--ridge-far, #c2a877)" opacity=".5" />
      <path d="M0 122 60 104 120 120 190 100 250 124 320 106 380 126 450 104 520 124 590 108 640 124V200H0Z" fill="var(--ridge-near, #b8975f)" opacity=".55" />
      <path d="M0 146c90-10 180 6 270-2s190-14 370-4v60H0Z" fill="url(#sand)" />
      {/* ground hatching */}
      <g stroke="var(--line-strong)" strokeWidth="1" opacity=".35" strokeLinecap="round">
        <path d="M20 164h36M90 174h30M150 160h44M260 176h40M330 166h52M430 178h36M500 162h44M580 174h40" />
        <path d="M56 186h40M200 190h46M380 188h50M540 190h40" />
      </g>
      {/* caravan: three camels and a rider, drawn small */}
      <g fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <g className="camel-bob">
          <path d="M150 150c-3-8 0-15 6-17 4-1 6 1 8 3 3-7 8-10 13-8 4 2 5 7 4 11 4-1 7 1 8 5 1 4-2 7-7 8" />
          <path d="M150 150c-2 4-2 9 0 13M163 150c-2 4-2 9 0 13M177 151c-1 4-1 8 1 12M186 150c1 4 2 8 1 11" />
          <path d="M140 128c-3-2-4-5-2-7M134 124c-2-1-3-2-2-4" opacity=".8" />
        </g>
        <g className="camel-bob" style={{ animationDelay: '.25s' }}>
          <path d="M238 148c-3-8 0-15 6-17 4-1 6 1 8 3 3-7 8-10 13-8 4 2 5 7 4 11 4-1 7 1 8 5 1 4-2 7-7 8" />
          <path d="M238 148c-2 4-2 9 0 13M251 148c-2 4-2 9 0 13M265 149c-1 4-1 8 1 12M274 148c1 4 2 8 1 11" />
          <path d="M228 126c-3-2-4-5-2-7M222 122c-2-1-3-2-2-4" opacity=".8" />
        </g>
        <g className="camel-bob" style={{ animationDelay: '.5s' }}>
          <path d="M330 146c-3-8 0-15 6-17 4-1 6 1 8 3 3-7 8-10 13-8 4 2 5 7 4 11 4-1 7 1 8 5 1 4-2 7-7 8" />
          <path d="M330 146c-2 4-2 9 0 13M343 146c-2 4-2 9 0 13M357 147c-1 4-1 8 1 12M366 146c1 4 2 8 1 11" />
          <path d="M320 124c-3-2-4-5-2-7M314 120c-2-1-3-2-2-4" opacity=".8" />
        </g>
        {/* rider figure walking beside */}
        <path d="M412 168v-20c0-4 3-7 7-7s7 3 7 7v20M412 152h14M419 141v-4" />
        <circle cx="419" cy="132" r="5" />
        <path d="M426 148c6-3 10 0 10 6" opacity=".85" />
      </g>
      {/* dust puffs behind */}
      <g fill="var(--ink)" opacity=".1">
        <circle cx="120" cy="158" r="6" />
        <circle cx="104" cy="162" r="9" />
        <circle cx="86" cy="166" r="5" />
      </g>
      {weather === 'rain' && (
        <g stroke="var(--accent)" strokeWidth="1.2" opacity=".35" strokeLinecap="round">
          <path d="M60 40l-6 14M110 30l-6 14M170 46l-6 14M230 28l-6 14M300 42l-6 14M360 32l-6 14M420 46l-6 14M480 30l-6 14M540 44l-6 14M600 34l-6 14" />
        </g>
      )}
      {weather === 'snow' && (
        <g fill="var(--surface)" opacity=".8">
          <circle cx="70" cy="40" r="2" /><circle cx="140" cy="70" r="2.4" /><circle cx="210" cy="34" r="2" />
          <circle cx="280" cy="62" r="2.2" /><circle cx="350" cy="40" r="2" /><circle cx="420" cy="72" r="2.4" />
          <circle cx="490" cy="38" r="2" /><circle cx="560" cy="66" r="2.2" /><circle cx="610" cy="44" r="2" />
        </g>
      )}
    </svg>
  );
}

// A caravanserai: arched gate, walls, a tower. Used on the town screen.
export function Caravanserai({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 320 150" aria-hidden="true" fill="none">
      <path d="M0 128c40-8 80 4 120-2s100-10 200-2v26H0Z" fill="var(--sand-1, #ddc79b)" opacity=".7" />
      <g stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 128V62h34v66M80 128V50h36v78M186 128V54h34v74M224 128V64h30v64" />
        <path d="M40 62 57 46l17 16M80 50 98 32l18 18M186 54l17-16 17 16M224 64l15-14 15 14" />
        <path d="M116 128V86c0-16 10-26 24-26s24 10 24 26v42" />
        <path d="M132 128V96c0-9 4-14 8-14s8 5 8 14v32" />
        <path d="M40 128h240" />
        <path d="M120 60h40M120 60l20 16 20-16" opacity=".8" />
        <path d="M254 128V40h8v88M252 40h12" />
        <path d="M258 40v-8c0-4 3-6 6-4" />
      </g>
      <g fill="var(--ink)" opacity=".35">
        <rect x="88" y="62" width="6" height="10" rx="3" />
        <rect x="100" y="62" width="6" height="10" rx="3" />
        <rect x="196" y="66" width="6" height="10" rx="3" />
        <rect x="208" y="66" width="6" height="10" rx="3" />
      </g>
      <g stroke="var(--ink)" strokeWidth="1.2" opacity=".45" strokeLinecap="round">
        <path d="M16 134h20M48 140h18M270 136h22M300 142h14M8 142h12" />
      </g>
    </svg>
  );
}

// A market stall for the town screen.
export function MarketStall({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 220 130" fill="none" aria-hidden="true">
      <g stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 44h160l-14-20H44Z" />
        <path d="M30 44v66M190 44v66M52 44v46M168 44v46" />
        <path d="M52 90h116" />
        <path d="M30 44c8 8 16 8 24 0 8 8 16 8 24 0 8 8 16 8 24 0 8 8 16 8 24 0 8 8 16 8 24 0 8 8 16 8 24 0" />
        <path d="M74 90v-10c0-6 4-10 10-10s10 4 10 10v10M126 90v-10c0-6 4-10 10-10s10 4 10 10v10" opacity=".8" />
        <circle cx="84" cy="72" r="4" opacity=".7" />
        <circle cx="136" cy="72" r="4" opacity=".7" />
        <path d="M196 30v-8M200 22c-4-2-8 0-8 4M200 22c4-2 8 0 8 4" opacity=".6" />
      </g>
      <g fill="var(--gold)" opacity=".5">
        <circle cx="66" cy="56" r="2" /><circle cx="94" cy="56" r="2" /><circle cx="122" cy="56" r="2" /><circle cx="150" cy="56" r="2" />
      </g>
    </svg>
  );
}

// Tiny line icons for resources and goods, all stroke 1.5.
const ICON_PATHS = {
  sun: 'M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  water: 'M12 3s5 6 5 10a5 5 0 0 1-10 0c0-4 5-10 5-10Z',
  food: 'M4 9h16M6 9c0-3 2-5 6-5s6 2 6 5M8 9v7a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3V9',
  fodder: 'M12 21V9M12 12c-4 0-6-3-6-6 4 0 6 3 6 6ZM12 15c4 0 6-3 6-6-4 0-6 3-6 6Z',
  medicine: 'M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z',
  rope: 'M4 16c4-8 12-8 16 0M4 12c4-8 12-8 16 0M6 20c3-6 9-6 12 0',
  camel: 'M3 16c0-4 3-6 6-5 1-3 4-4 6-2 2 1 2 4 1 6 2 0 3 2 3 4M3 16h16M7 16v3M11 16v3M15 16v3',
  coin: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM8 10h8M8 14h8M12 7v10',
  silk: 'M4 8c4 4 12 4 16 0M4 12c4 4 12 4 16 0M4 16c4 4 12 4 16 0',
  spice: 'M6 9h12l-2 11H8L6 9ZM9 9V6a3 3 0 0 1 6 0v3M10 13h4',
  vase: 'M9 3h6M10 3c0 4-4 5-4 10s3 8 6 8 6-3 6-8-4-6-4-10M8 14h8',
  paper: 'M5 4h9l5 5v11H5V4ZM14 4v5h5M8 13h8M8 17h6',
  horse: 'M4 18c0-4 2-6 5-6l3-4 2 2c3 0 5 2 5 5v3M4 18h16M9 18v3M15 18v3M14 4l2 2-2 2',
  glass: 'M8 3h8l-1 7c0 3-2 5-3 6v5h-2v-5c-1-1-3-3-3-6L8 3ZM7 8h10',
  incense: 'M9 21h6M10 21v-4h4v4M12 17v-3M12 12c-2-2-2-4 0-6M15 13c1-2 1-4-1-6M9 12c-1-2-1-4 1-6',
  dust: 'M3 10h10M8 14h12M4 18h8M14 6h6',
  rain: 'M7 14a4 4 0 1 1 1-8 5 5 0 0 1 9 2 3 3 0 0 1-1 6M8 18l-1 3M12 18l-1 3M16 18l-1 3',
  snow: 'M12 3v18M5 7l14 10M19 7 5 17',
  heat: 'M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2ZM9 4v14M15 6v14',
  people: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-4 3-6 6-6s6 2 6 6M17 11a3 3 0 1 0 0-6M16 14c3 0 6 2 6 6',
  bag: 'M6 8h12l-1 12H7L6 8ZM9 8V6a3 3 0 0 1 6 0v2',
  scroll: 'M6 4h12v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM8 8h8M8 12h8M8 16h5',
  pause: 'M9 5v14M15 5v14',
  play: 'M7 4l13 8-13 8V4Z',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  sound: 'M4 9v6h4l5 4V5L8 9H4ZM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
  mute: 'M4 9v6h4l5 4V5L8 9H4ZM16 9l5 6M21 9l-5 6',
  chevron: 'M9 6l6 6-6 6',
  sun2: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z',
  party: 'M9 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2 21c0-4.4 3.1-7 7-7s7 2.6 7 7M17 5.5a3.5 3.5 0 0 1 0 6.9M18 21c0-2.6-.7-4.6-2-6',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM15.5 8.5l-2 5-5 2 2-5 5-2Z',
  diamond: 'M12 3l7 6-7 12-7-12 7-6ZM5 9h14',
  heart: 'M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z',
  flag: 'M6 21V4M6 4h11l-2 4 2 4H6',
  book: 'M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5ZM18 17H6M8 7h6',
};

export function Icon({ name, size = 18, className = '', strokeWidth = 1.5 }) {
  const d = ICON_PATHS[name] || ICON_PATHS.diamond || ICON_PATHS.sun2;
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function goodIconName(id) {
  return { silk: 'silk', spices: 'spice', porcelain: 'vase', paper: 'paper', horses: 'horse', glass: 'glass', frankincense: 'incense' }[id] || 'bag';
}
