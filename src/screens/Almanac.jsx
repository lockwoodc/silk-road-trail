// The caravan almanac: the learning layer. Everything in the game, explained against the AP
// World History content it is built from, with a short practice prompt on each entry.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Ornament, Icon, Camel } from '../components/art.jsx';
import { Btn, Coin } from '../components/parts.jsx';
import { STOPS, GOODS, ERAS, TRAVELER_POOL, TERRAIN } from '../game/data.js';
import { EVENTS } from '../game/events.js';
import { CONCEPTS, STOP_FACTS, GOOD_FACTS, ROLE_FACTS, ERA_FACTS, UNIT } from '../game/learning.js';
import { cx } from '../components/cx.js';

const TABS = [
  { id: 'concepts', label: 'Concepts' },
  { id: 'stops', label: 'The stops' },
  { id: 'goods', label: 'Goods & people' },
  { id: 'events', label: 'The road\'s events' },
];

export default function Almanac({ state, onClose }) {
  const [tab, setTab] = useState('concepts');
  const [open, setOpen] = useState(null);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      <header className="border-b border-line bg-surface/95 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="smallcaps text-[11px] text-gold">{UNIT.unit}</p>
            <h1 className="font-display text-xl font-semibold leading-tight text-ink sm:text-2xl">The caravan almanac</h1>
          </div>
          <div className="flex items-center gap-2">
            <Btn variant="secondary" size="sm" onClick={onClose} icon="close">Back to the road</Btn>
          </div>
        </div>
        <nav className="mx-auto mt-3 flex max-w-5xl gap-1.5 overflow-x-auto pb-1" aria-label="Almanac sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTab(t.id); setOpen(null); }}
              aria-current={tab === t.id ? 'page' : undefined}
              className={cx(
                'min-h-[40px] shrink-0 rounded-md border px-3 text-sm font-medium transition-colors duration-150',
                tab === t.id ? 'border-gold bg-gold-soft text-ink' : 'border-line bg-surface text-ink-2 hover:bg-surface-2 hover:text-ink',
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-7">
          {tab === 'concepts' && <ConceptsTab state={state} />}
          {tab === 'stops' && <StopsTab state={state} />}
          {tab === 'goods' && <GoodsTab />}
          {tab === 'events' && <EventsTab />}
        </div>
      </div>
    </div>
  );
}

function Card({ children, className = '', tone = 'plain' }) {
  return (
    <article className={cx('rounded-lg border p-4', tone === 'active' ? 'border-gold bg-gold-soft/40' : 'border-line bg-surface', className)}>
      {children}
    </article>
  );
}

function ConceptLabel({ id }) {
  const c = CONCEPTS[id];
  if (!c) return null;
  return <span className="smallcaps text-[10px] text-gold">{c.tag} · {c.name}</span>;
}

function Prompt({ children }) {
  return (
    <p className="mt-3 rounded-md border border-line bg-surface-2/50 px-3 py-2 text-sm leading-relaxed text-ink-2">
      <span className="smallcaps mr-2 text-[10px] text-gold">Practice</span>
      {children}
    </p>
  );
}

function ConceptsTab({ state }) {
  const eraId = state?.era?.id;
  const keys = Object.keys(CONCEPTS);
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line bg-surface p-4 sm:p-5">
        <p className="smallcaps text-[11px] text-gold">{UNIT.unit}</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink">{UNIT.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-2 sm:text-base">{UNIT.lede}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-3">
          Each concept below is one piece of the unit. The game is built on them: the year you chose, the goods you carry,
          the people you took on and the events on the road all come from this content.
        </p>
      </div>

      {eraId && ERA_FACTS[eraId] && (
        <Card tone="active">
          <ConceptLabel id="pax-mongolica" />
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">{ERA_FACTS[eraId].label}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{ERA_FACTS[eraId].fact}</p>
          <Prompt>{ERA_FACTS[eraId].prompt}</Prompt>
        </Card>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {keys.map((id) => {
          const c = CONCEPTS[id];
          return (
            <Card key={id}>
              <ConceptLabel id={id} />
              <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-ink">{c.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{c.summary}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-2"><span className="smallcaps mr-1 text-[10px] text-ink-3">Evidence</span>{c.evidence}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-3"><span className="smallcaps mr-1 text-[10px] text-gold">In the game</span>{c.game}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function StopsTab({ state }) {
  const currentLeg = state?.legIndex ?? -1;
  const here = useRef(null);
  // Open the list at the stop the caravan is standing in, not at Chang'an.
  useEffect(() => {
    if (here.current) here.current.scrollIntoView({ block: 'center' });
  }, []);
  return (
    <div className="space-y-4">
      <p className="max-w-3xl text-sm leading-relaxed text-ink-2">
        The caravan runs west from Chang'an to Venice. Nine cities, each one a real place on the Silk Roads.
        Your current stop is marked.
      </p>
      <ol className="space-y-3">
        {STOPS.map((stop, i) => {
          const f = STOP_FACTS[stop.id];
          const leg = i > 0 ? STOPS[i].leg : null;
          return (
            <li key={stop.id}>
              <div ref={i === currentLeg ? here : null}>
              <Card tone={i === currentLeg ? 'active' : 'plain'}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold/70 font-display text-xs text-gold">{i + 1}</span>
                      <h3 className="font-display text-xl font-semibold text-ink">{stop.name}</h3>
                      {i === currentLeg && <span className="smallcaps rounded-full border border-gold px-2 py-0.5 text-[10px] text-gold">you are here</span>}
                    </div>
                    <p className="mt-0.5 text-sm text-ink-2">{f.period}</p>
                  </div>
                  <ConceptLabel id={f.concept} />
                </div>
                <ul className="mt-3 space-y-1.5">
                  {f.facts.map((fact) => (
                    <li key={fact} className="flex gap-2 text-sm leading-relaxed text-ink-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                      {fact}
                    </li>
                  ))}
                </ul>
                <Prompt>{f.prompt}</Prompt>
              </Card>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function GoodsTab() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-display text-2xl font-semibold text-ink">What you trade</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ink-2">
          Each good comes from a real place and illustrates a real idea from the unit. This is why the game's prices rise
          as you go west: the goods were worth more the further they travelled from where they were made.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {Object.keys(GOODS).map((id) => {
            const g = GOOD_FACTS[id];
            return (
              <Card key={id}>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink">{GOODS[id].name}</h3>
                  <span className="smallcaps text-[10px] text-ink-3">{g.origin}</span>
                </div>
                <div className="mt-0.5"><ConceptLabel id={g.concept} /></div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{g.fact}</p>
                <Prompt>{g.prompt}</Prompt>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold text-ink">The people on the road</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ink-2">
          In the game you take three to five travellers and give them names. In history, the road was worked by many kinds of
          specialists, and their knowledge travelled with them.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {TRAVELER_POOL.map((t) => (
            <Card key={t.id}>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-ink">{t.role}</h3>
                <span className="smallcaps text-[10px] text-ink-3">{t.origin}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{ROLE_FACTS[t.id]}</p>
              <p className="mt-2 text-sm text-ink-3"><span className="smallcaps mr-1 text-[10px] text-gold">In the game</span>{t.perk}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold text-ink">The years you can travel</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {ERAS.map((e) => {
            const f = ERA_FACTS[e.id];
            return (
              <Card key={e.id}>
                <ConceptLabel id={e.id === 'pax' ? 'yuan' : e.id === 'plague' ? 'plague' : 'timur'} />
                <h3 className="mt-1 font-display text-lg font-semibold text-ink">{f.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{f.fact}</p>
                <Prompt>{f.prompt}</Prompt>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function EventsTab() {
  const [concept, setConcept] = useState('all');
  const list = useMemo(() => {
    if (concept === 'all') return EVENTS;
    return EVENTS.filter((e) => e.concept === concept);
  }, [concept]);
  const counts = useMemo(() => {
    const c = {};
    EVENTS.forEach((e) => { c[e.concept] = (c[e.concept] || 0) + 1; });
    return c;
  }, []);
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">Every event on the road</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ink-2">
          {EVENTS.length} things can happen on the road. Each one is drawn from the history of the period, and each one is
          tagged with the concept it shows. Click a concept chip to filter, or a tag to jump to it.
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <FilterChip active={concept === 'all'} onClick={() => setConcept('all')} label={`All ${EVENTS.length}`} />
        {Object.keys(CONCEPTS).filter((id) => counts[id]).map((id) => (
          <FilterChip key={id} active={concept === id} onClick={() => setConcept(id)} label={`${CONCEPTS[id].name} ${counts[id]}`} />
        ))}
      </div>
      <ul className="space-y-2">
        {list.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              onClick={() => setConcept(e.concept)}
              className="w-full rounded-md border border-line bg-surface p-3 text-left transition-colors hover:border-line-strong"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-ink">{e.title}</h3>
                <ConceptLabel id={e.concept} />
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">{e.note}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterChip({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'min-h-[36px] rounded-full border px-3 text-xs transition-colors duration-150',
        active ? 'border-gold bg-gold-soft text-ink' : 'border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink',
      )}
    >
      {label}
    </button>
  );
}
