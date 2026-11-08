// The route map: a stylised sheet of the roads from Chang'an to Venice, drawn with hatching
// for deserts, ridge lines for mountains, tufts for steppe, and a caravan token that walks
// along the current leg.
import { STOPS, LEGS, TERRAIN } from '../game/data.js';
import { Camel } from './art.jsx';

const VB_W = 1000;
const VB_H = 620;

// Convert 0..100 game coordinates to viewbox space.
const P = (s) => ({ x: (s.x / 100) * VB_W, y: (s.y / 100) * VB_H });

function curveBetween(a, b) {
  const p1 = P(a);
  const p2 = P(b);
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2 - 26;
  return { p1, p2, mx, my };
}

function legPath(i) {
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const { p1, p2, mx, my } = curveBetween(a, b);
  return `M${p1.x} ${p1.y} Q${mx} ${my} ${p2.x} ${p2.y}`;
}

// A point along the quadratic curve at t.
function pointOnLeg(i, t) {
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const { p1, p2, mx, my } = curveBetween(a, b);
  const u = 1 - t;
  return {
    x: u * u * p1.x + 2 * u * t * mx + t * t * p2.x,
    y: u * u * p1.y + 2 * u * t * my + t * t * p2.y,
  };
}

// Dune hatching: rows of small arcs. Seeded by position so it never jitters between renders.
function duneRows(x, y, w, h, step = 18) {
  const out = [];
  for (let row = 0; row < h; row += step) {
    const yy = y + row;
    for (let col = 0; col < w; col += step * 1.6) {
      const xx = x + col + ((row / step) % 2) * step * 0.8;
      out.push(`M${xx} ${yy}q${step * 0.3} -6 ${step * 0.6} 0`);
    }
  }
  return out.join(' ');
}

// Mountain ridge glyphs.
function ridges(x, y, w, h, step = 22) {
  const out = [];
  for (let row = 0; row < h; row += step * 0.8) {
    for (let col = 0; col < w; col += step) {
      const xx = x + col + ((row / step) % 2) * step * 0.5;
      const yy = y + row;
      out.push(`M${xx} ${yy}l${step * 0.32} ${-step * 0.5}l${step * 0.32} ${step * 0.5}`);
    }
  }
  return out.join(' ');
}

function steppeTufts(x, y, w, h, step = 26) {
  const out = [];
  for (let row = 0; row < h; row += step) {
    for (let col = 0; col < w; col += step) {
      const xx = x + col + ((row / step) % 2) * step * 0.5;
      const yy = y + row;
      out.push(`M${xx} ${yy}v-5M${xx - 3} ${yy}v-3M${xx + 3} ${yy}v-4`);
    }
  }
  return out.join(' ');
}

export default function RouteMap({ state, compact = false }) {
  const legIndex = state.legIndex;
  const progress = Math.min(100, state.legProgress || 0) / 100;
  const token = pointOnLeg(Math.min(legIndex, STOPS.length - 2), progress);

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Map of the Silk Roads from Chang'an to Venice. The caravan is between ${STOPS[legIndex].name} and ${STOPS[legIndex + 1].name}.`}
    >
      <defs>
        <linearGradient id="mapPaper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--map-sand)" />
          <stop offset="100%" stopColor="var(--map-sand)" stopOpacity="0.82" />
        </linearGradient>
        <linearGradient id="seaWash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--map-water)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--map-water)" stopOpacity="0.6" />
        </linearGradient>
        <filter id="inkRough">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.2" />
        </filter>
      </defs>

      <rect width={VB_W} height={VB_H} fill="url(#mapPaper)" />

      {/* Sea: Mediterranean to the west, Black Sea, Caspian, Aral, Persian Gulf, Indian Ocean south. */}
      <g>
        <path d="M0 120c60 0 120-10 190 0 40 6 70 26 90 46 20 22-10 40-60 34-60-8-120-24-220-20Z" fill="url(#seaWash)" opacity=".85" />
        <path d="M40 236c40-16 110-8 150 6 26 10 20 30-10 34-50 6-110-4-150-14Z" fill="url(#seaWash)" opacity=".7" />
        <path d="M188 96c26-14 66-10 82 6 12 14-4 28-30 28-28 0-56-18-52-34Z" fill="url(#seaWash)" opacity=".75" />
        <path d="M352 104c14-8 34-6 40 4 4 8-4 14-18 14-16 0-30-10-22-18Z" fill="url(#seaWash)" opacity=".7" />
        <path d="M296 150c10-6 26-4 30 6 4 10-6 18-18 16-14-2-22-14-12-22Z" fill="url(#seaWash)" opacity=".6" />
        <path d="M0 620c120-50 240-70 380-40 140 30 260 60 400 40 80-12 160-40 220-20v20H0Z" fill="url(#seaWash)" opacity=".45" />
      </g>
      <g stroke="var(--accent)" strokeWidth="1" opacity=".25" strokeLinecap="round" fill="none">
        <path d="M60 150h24M100 166h30M150 178h22M74 196h30M120 210h26M210 214h24M244 130h26M356 122h20M304 162h18" />
      </g>

      {/* Desert hatching: Taklamakan + Gobi band, and the Khorasan/Syrian desert. */}
      <g stroke="var(--gold)" strokeWidth="1.1" opacity=".45" fill="none" strokeLinecap="round">
        <path d={duneRows(520, 150, 260, 200)} />
        <path d={duneRows(680, 90, 220, 120)} />
        <path d={duneRows(180, 300, 170, 130)} />
        <path d={duneRows(90, 210, 120, 90)} />
      </g>

      {/* Mountains: Pamir, Taurus, Zagros, Caucasus. */}
      <g stroke="var(--ink)" strokeWidth="1.2" opacity=".5" fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d={ridges(500, 230, 130, 90)} />
        <path d={ridges(360, 260, 130, 80)} />
        <path d={ridges(120, 160, 120, 60)} />
        <path d={ridges(230, 190, 110, 60)} />
        <path d={ridges(300, 120, 100, 50)} />
      </g>

      {/* Steppe tufts. */}
      <g stroke="var(--ok)" strokeWidth="1.1" opacity=".38" fill="none" strokeLinecap="round">
        <path d={steppeTufts(560, 90, 180, 60)} />
        <path d={steppeTufts(380, 130, 160, 60)} />
        <path d={steppeTufts(700, 210, 140, 70)} />
      </g>

      {/* Rivers: the Tigris, the Oxus, the Yellow River. */}
      <g stroke="var(--map-water)" strokeWidth="2.2" opacity=".8" fill="none" strokeLinecap="round">
        <path d="M248 250c6 30 2 60-10 88s-6 50 8 66" />
        <path d="M400 250c14 20 16 50 8 78" />
        <path d="M880 250c-10 40-40 70-60 110" />
      </g>

      {/* Route line: travelled in solid ink, ahead as dotted ink. */}
      <g fill="none">
        {STOPS.slice(0, -1).map((_, i) => (
          <path
            key={`base-${i}`}
            d={legPath(i)}
            stroke="var(--line-strong)"
            strokeWidth="2.4"
            strokeDasharray="1 7"
            strokeLinecap="round"
            opacity=".8"
          />
        ))}
        {STOPS.slice(0, -1).map((_, i) => i < legIndex && (
          <path key={`done-${i}`} d={legPath(i)} stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" />
        ))}
        {legIndex < STOPS.length - 1 && (
          <path
            d={legPath(legIndex)}
            stroke="var(--accent)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeDasharray="6 5"
          />
        )}
      </g>

      {/* Compass rose, top left over the sea. */}
      <g transform="translate(70 66)" stroke="var(--ink)" fill="none" opacity=".55">
        <circle r="26" strokeWidth="1" />
        <circle r="19" strokeWidth=".6" />
        <path d="M0-30 5-6 0 0-5-6Z" fill="var(--gold)" stroke="none" />
        <path d="M0 30 4 8 0 0-4 8Z" fill="var(--ink)" stroke="none" opacity=".6" />
        <path d="M30 0 6 4 0 0 6-4Z" fill="var(--ink)" stroke="none" opacity=".6" />
        <path d="M-30 0-6-4 0 0-6 4Z" fill="var(--ink)" stroke="none" opacity=".6" />
        <text x="0" y="-34" textAnchor="middle" fontSize="11" fill="var(--ink)" stroke="none" fontFamily="Cormorant, serif" opacity=".9">N</text>
      </g>

      {/* Stops. */}
      {STOPS.map((stop, i) => {
        const p = P(stop);
        const reached = i < legIndex;
        const current = i === legIndex;
        const isLast = i === STOPS.length - 1;
        const labelBelow = i % 2 === 1;
        return (
          <g key={stop.id}>
            {current && (
              <circle cx={p.x} cy={p.y} r="15" fill="none" stroke="var(--gold)" strokeWidth="1.4" className="glow-pulse" />
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={isLast ? 7 : 5.5}
              fill={reached ? 'var(--accent)' : current ? 'var(--gold)' : 'var(--surface)'}
              stroke="var(--ink)"
              strokeWidth="1.4"
            />
            {isLast && <circle cx={p.x} cy={p.y} r="11" fill="none" stroke="var(--ink)" strokeWidth="1" opacity=".6" />}
            <text
              x={p.x}
              y={labelBelow ? p.y + 24 : p.y - 14}
              textAnchor="middle"
              fontSize={compact ? 15 : 17}
              fontFamily="Cormorant, serif"
              fontWeight="600"
              fill="var(--ink)"
              style={{ letterSpacing: '0.02em' }}
            >
              {stop.name}
            </text>
            <text
              x={p.x}
              y={labelBelow ? p.y + 38 : p.y - 1}
              textAnchor="middle"
              fontSize="11"
              fontFamily="Alegreya Sans, sans-serif"
              fill="var(--ink-3)"
              style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              {stop.region}
            </text>
          </g>
        );
      })}

      {/* Caravan token. */}
      {legIndex < STOPS.length - 1 && (
        <g transform={`translate(${token.x - 18} ${token.y - 30})`}>
          <circle cx="18" cy="14" r="17" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.4" opacity=".95" />
          <g transform="translate(2 2) scale(0.42)">
            <Camel size={80} tint="var(--ink)" className="camel-bob" />
          </g>
        </g>
      )}

      {/* Leg labels along the middle of each route. */}
      {LEGS.map((leg, i) => {
        const mid = pointOnLeg(i, 0.5);
        const done = i < legIndex;
        return (
          <text
            key={leg.from + leg.to}
            x={mid.x}
            y={mid.y - 18}
            textAnchor="middle"
            fontSize="12"
            fontFamily="Alegreya Sans, sans-serif"
            fill={done ? 'var(--ink-3)' : 'var(--ink-2)'}
            style={{ letterSpacing: '0.04em' }}
            opacity={done ? 0.55 : 0.9}
          >
            {leg.name}
          </text>
        );
      })}

      <rect x="1" y="1" width={VB_W - 2} height={VB_H - 2} fill="none" stroke="var(--line-strong)" strokeWidth="2" />
      <rect x="8" y="8" width={VB_W - 16} height={VB_H - 16} fill="none" stroke="var(--line)" strokeWidth="1" />
    </svg>
  );
}

export function TerrainBadge({ terrain }) {
  const t = TERRAIN[terrain] || TERRAIN.city;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs smallcaps text-ink-2">
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: t.colour }} />
      {t.name}
    </span>
  );
}
