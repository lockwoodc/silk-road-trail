// The road: the map as the hero, one compact card about this leg, and the controls that move the
// caravan. The log sits beside the controls so you always see what the last day did to you.
import { useEffect, useRef, useState } from 'react';
import { Panel, PanelTitle, StatBar, SupplyChip, Coin, Btn, Segmented, GameBar, BarBtn } from '../components/parts.jsx';
import { Icon, Ornament as Orn, CaravanScene, Camel, Diamond } from '../components/art.jsx';
import RouteMap, { TerrainBadge } from '../components/RouteMap.jsx';
import { STOPS, LEGS, PACES, RATIONS, TERRAIN, GOODS, ERAS } from '../game/data.js';
import {
  advanceDay, arriveAtStop, legOf, currentStop, nextStop, dailyUse, partyHealth, partyMorale,
  dateLabel, seasonOf, weatherName, scoreOf, goodsValueOf, aliveParty, caravanSpeed,
} from '../game/engine.js';
import EventModal from './EventModal.jsx';

const PACE_ICONS = { rest: 'snow', steady: 'camel', hard: 'heat' };

export default function Game({ state, setState, onEnd, onTitle, sfx, muted, onToggleMute, openPanel, setOpenPanel, showHowTo, showAlmanac }) {
  const [travelling, setTravelling] = useState(false);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const stop = currentStop(state);
  const next = nextStop(state);
  const leg = legOf(state);
  const use = dailyUse(state);
  const health = partyHealth(state);
  const morale = partyMorale(state);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Save whenever the state changes, so a refresh keeps the run.
  useEffect(() => {
    if (state.event || state.finished) return;
    import('../game/engine.js').then((m) => m.saveRun(state));
  }, [state]);

  // A short toast for any change the player might otherwise miss.
  const flash = (text) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 2200);
  };

  const update = (patch) => {
    sfx.click();
    setState((s) => ({ ...s, ...patch }));
  };

  // Travel one day at a time. Each step is computed from the latest state, outside the
  // setState updater, so a double-invoked render never advances the calendar twice.
  const stateRef = useRef(state);
  stateRef.current = state;

  const travel = (days = 1) => {
    if (travelling) return;
    setTravelling(true);
    let remaining = days;
    const run = () => {
      const current = stateRef.current;
      if (!current || current.finished || current.screen === 'town') { setTravelling(false); return; }
      const clone = JSON.parse(JSON.stringify(current));
      advanceDay(clone);
      if (clone.legProgress >= 100) {
        arriveAtStop(clone);
        sfx.good();
      } else if (clone.event) {
        sfx.chime();
      }
      remaining -= 1;
      stateRef.current = clone;
      setState(clone);
      const halt = clone.finished || clone.event || clone.screen === 'town' || remaining <= 0;
      if (halt) {
        setTravelling(false);
        if (clone.finished) onEnd && onEnd(clone);
      } else {
        timer.current = setTimeout(run, 240);
      }
    };
    timer.current = setTimeout(run, 40);
  };

  const restDay = () => {
    const clone = JSON.parse(JSON.stringify(stateRef.current));
    clone.pace = 'rest';
    advanceDay(clone);
    clone.pace = 'steady';
    stateRef.current = clone;
    setState(clone);
    sfx.good();
    flash('A day of rest. Health and spirits recover.');
  };

  const progress = Math.min(100, state.legProgress || 0);
  const daysLeft = Math.max(1, Math.ceil(((100 - progress) / 100) * (state.legDays || 1)));

  return (
    <div className="min-h-dvh px-3 pb-8 sm:px-5">
      <GameBar state={state}>
        <BarBtn icon="people" label="Party" onClick={() => setOpenPanel(openPanel === 'party' ? null : 'party')} active={openPanel === 'party'} aria-expanded={openPanel === 'party'} />
        <BarBtn icon="bag" label="Cargo" onClick={() => setOpenPanel(openPanel === 'bag' ? null : 'bag')} active={openPanel === 'bag'} aria-expanded={openPanel === 'bag'} />
        <BarBtn icon="book" label="Almanac" onClick={showAlmanac} />
        <BarBtn icon={muted ? 'mute' : 'sound'} label="Sound" onClick={onToggleMute} aria-pressed={muted} />
        <BarBtn icon="scroll" label="How to" onClick={showHowTo} />
        <BarBtn icon="close" label="Leave" onClick={onTitle} />
      </GameBar>

      <div className="mx-auto grid max-w-7xl gap-3 lg:grid-cols-[1fr_380px]">
        {/* Map: the hero of the screen, with a thin travel ribbon under it. */}
        <section className="frame overflow-hidden rounded-lg" aria-label="The road west">
          <div className="relative z-10">
            <div className="relative overflow-hidden bg-surface-2">
              <RouteMap state={state} />
            </div>
            <div className="relative h-14 overflow-hidden border-t border-line sm:h-16">
              <CaravanScene className="absolute inset-0 h-full w-full" weather={state.weather === 'rain' ? 'rain' : state.weather === 'snow' ? 'snow' : 'clear'} />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent" />
              <div className="relative flex h-full items-center gap-3 px-3">
                <span className="smallcaps flex shrink-0 items-center gap-1.5 text-xs text-ink-2">
                  <Icon name={state.weather === 'clear' ? 'sun' : state.weather} size={13} className="text-gold" />
                  {weatherName(state.weather)} · {seasonOf(state)}
                </span>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="bar-track h-1.5 flex-1">
                    <div className="bar-fill" style={{ width: `${progress}%`, background: 'var(--gold)' }} />
                  </div>
                  <span className="smallcaps shrink-0 tabular-nums text-xs text-ink-2">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The leg, in one card: where you are, how fast, how much you eat. */}
        <Panel className="!p-3.5 sm:!p-4 lg:col-start-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <div className="smallcaps text-[10px] text-ink-3">
                Leg {state.legIndex + 1} of {STOPS.length - 1} · {leg.name}
              </div>
              <h2 className="font-display text-xl font-semibold leading-tight text-ink">
                {stop.name} <span className="text-gold">→</span> {next?.name}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <TerrainBadge terrain={leg.terrain} />
                <span className="text-xs text-ink-3">·</span>
                <span className="text-xs text-ink-2">{daysLeft} days of road left</span>
              </div>
            </div>
            <div className="flex shrink-0 gap-4 border-l border-line pl-4">
              <Figure label="Speed" value={`${Math.round(caravanSpeed(state) * TERRAIN[leg.terrain].paceMul * 100)}%`} />
              <Figure label="Eats / day" value={`${use.food}·${use.water}·${use.fodder}`} hint="food · water · fodder" />
            </div>
          </div>
          <p className="mt-2 font-display text-sm italic leading-snug text-ink-2">{leg.text}</p>
        </Panel>

        {/* Controls and log: the working column. */}
        <div className="space-y-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Panel className="!p-3.5 sm:!p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-semibold text-ink">Days pass</h2>
              <span className="smallcaps text-[10px] text-ink-3">day {state.day + 1}</span>
            </div>
            <div className="mt-2.5 space-y-2.5">
              <Segmented
                label="Pace"
                value={state.pace}
                onChange={(id) => update({ pace: id })}
                icon={(id) => PACE_ICONS[id]}
                options={Object.entries(PACES).map(([id, p]) => ({ id, label: p.label, blurb: p.blurb }))}
              />
              <Segmented
                label="Rations"
                value={state.rations}
                onChange={(id) => update({ rations: id })}
                icon={() => 'food'}
                options={Object.entries(RATIONS).map(([id, r]) => ({ id, label: r.label, blurb: r.blurb }))}
              />
            </div>
            <p className="mt-2 min-h-[1.5rem] text-xs leading-snug text-ink-3">
              <span className="text-gold">Pace.</span> {PACES[state.pace].blurb}
            </p>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <Btn variant="primary" onClick={() => travel(1)} disabled={travelling} icon="play">
                {travelling ? 'On the road…' : 'Travel a day'}
              </Btn>
              <Btn variant="gold" onClick={() => travel(5)} disabled={travelling} icon="chevron">
                Five days
              </Btn>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-line pt-2">
              <Btn variant="ghost" size="sm" onClick={restDay} disabled={travelling} icon="snow">Rest a day</Btn>
              <Btn variant="ghost" size="sm" onClick={() => travel(20)} disabled={travelling} icon="heat">Until we arrive</Btn>
            </div>
          </Panel>

          <Panel className="!p-3.5 sm:!p-4">
            <PanelTitle icon="scroll" right={<span className="smallcaps text-[10px] text-ink-3">{aliveParty(state).length} alive</span>}>
              The road log
            </PanelTitle>
            <ol className="max-h-[300px] space-y-1.5 overflow-y-auto pr-1 lg:max-h-[calc(100dvh-30rem)] lg:min-h-[160px]">
              {[...state.log].slice(-40).reverse().map((entry, i) => (
                <li key={`${entry.day}-${i}-${entry.text.slice(0, 12)}`} className={`fade-up flex gap-2 text-sm leading-snug ${entry.kind === 'good' ? 'text-ok' : entry.kind === 'bad' || entry.kind === 'death' ? 'text-danger' : entry.kind === 'rumour' ? 'italic text-ink-3' : 'text-ink-2'}`}>
                  <span className="smallcaps shrink-0 pt-0.5 text-[10px] tabular-nums text-ink-3">{entry.day + 1}</span>
                  <span className="min-w-0">{entry.text}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 space-y-1.5 border-t border-line pt-2.5">
              <StatBar label="Health" value={health} tone={health > 60 ? 'ok' : health > 30 ? 'warn' : 'danger'} icon="people" />
              <StatBar label="Morale" value={morale} tone={morale > 60 ? 'gold' : morale > 30 ? 'warn' : 'danger'} icon="sun2" />
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
              <SupplyChip icon="food" label="Food" value={state.food} warnAt={use.food * 2} />
              <SupplyChip icon="water" label="Water" value={state.water} warnAt={use.water * 2} />
              <SupplyChip icon="fodder" label="Fodder" value={state.fodder} warnAt={use.fodder * 2} />
              <SupplyChip icon="camel" label="Camels" value={state.camels} warnAt={3} />
              <SupplyChip icon="medicine" label="Medicine" value={state.medicine} warnAt={0} />
              <SupplyChip icon="rope" label="Rope" value={state.rope} warnAt={0} />
            </div>
          </Panel>
        </div>
      </div>

      {toast && (
        <div className="pop-in fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm text-ink shadow-card">
          {toast}
        </div>
      )}

      {state.event && <EventModal event={state.event} state={state} setState={setState} sfx={sfx} />}

      {openPanel === 'party' && <PartyPanel state={state} onClose={() => setOpenPanel(null)} />}
      {openPanel === 'bag' && <BagPanel state={state} onClose={() => setOpenPanel(null)} />}
    </div>
  );
}

function Figure({ label, value, hint }) {
  return (
    <div title={hint}>
      <div className="smallcaps text-[10px] text-ink-3">{label}</div>
      <div className="font-display text-xl font-semibold leading-tight tabular-nums text-ink">{value}</div>
    </div>
  );
}

export function PartyPanel({ state, onClose }) {
  return (
    <Drawer title="The caravan" onClose={onClose} icon="people">
      <ul className="space-y-2">
        {state.party.map((p) => (
          <li key={p.id} className={`rounded-md border p-3 ${p.alive ? 'border-line bg-surface-2/40' : 'border-danger/40 bg-danger-soft/40'}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-display text-base font-semibold text-ink">{p.name}</div>
                <div className="smallcaps text-[10px] text-ink-3">{p.role} · {p.origin}</div>
              </div>
              {!p.alive && <span className="smallcaps rounded-full border border-danger/50 px-2 py-0.5 text-[10px] text-danger">died</span>}
            </div>
            {p.alive && (
              <div className="mt-2 space-y-1.5">
                <StatBar label="Health" value={p.health} compact tone={p.health > 60 ? 'ok' : p.health > 30 ? 'warn' : 'danger'} />
                <StatBar label="Morale" value={p.morale} compact tone={p.morale > 60 ? 'gold' : p.morale > 30 ? 'warn' : 'danger'} />
              </div>
            )}
            <p className="mt-1.5 text-xs text-ink-2"><span className="text-gold">{p.skill}:</span> {p.perk}</p>
          </li>
        ))}
      </ul>
    </Drawer>
  );
}

export function BagPanel({ state, onClose }) {
  const val = goodsValueOf(state.goods);
  return (
    <Drawer title="The cargo" onClose={onClose} icon="bag">
      <div className="mb-3 flex items-center justify-between rounded-md border border-gold/40 bg-gold-soft/40 px-3 py-2">
        <span className="smallcaps text-xs text-ink-2">Value at base prices</span>
        <Coin amount={val} />
      </div>
      <ul className="space-y-1.5">
        {Object.entries(GOODS).map(([id, g]) => (
          <li key={id} className={`flex items-center gap-2 rounded-md border px-2.5 py-2 ${state.goods[id] ? 'border-line bg-surface-2/40' : 'border-line/50 opacity-60'}`}>
            <Icon name={{ silk: 'silk', spices: 'spice', porcelain: 'vase', paper: 'paper', horses: 'horse', glass: 'glass', frankincense: 'incense' }[id]} size={16} className="text-ink-3" />
            <div className="min-w-0 flex-1">
              <div className="font-display text-sm font-semibold text-ink">{g.name}</div>
              <div className="smallcaps text-[10px] text-ink-3">{g.unit}</div>
            </div>
            <span className="font-display text-lg font-semibold tabular-nums text-ink">{state.goods[id] || 0}</span>
          </li>
        ))}
      </ul>
      <h3 className="mt-4 font-display text-base font-semibold">Supplies</h3>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <SupplyChip icon="food" label="Food" value={state.food} />
        <SupplyChip icon="water" label="Water" value={state.water} />
        <SupplyChip icon="fodder" label="Fodder" value={state.fodder} />
        <SupplyChip icon="camel" label="Camels" value={state.camels} />
        <SupplyChip icon="medicine" label="Medicine" value={state.medicine} />
        <SupplyChip icon="rope" label="Rope" value={state.rope} />
      </div>
      {state.rumours?.length > 0 && (
        <>
          <h3 className="mt-4 font-display text-base font-semibold">Rumours worth remembering</h3>
          <ul className="mt-1 space-y-1.5">
            {state.rumours.slice(-5).map((r, i) => (
              <li key={i} className="border-l-2 border-gold/50 pl-2 font-display text-sm italic text-ink-2">{r}</li>
            ))}
          </ul>
        </>
      )}
    </Drawer>
  );
}

export function Drawer({ title, children, onClose, icon }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-ink/40" onClick={onClose} role="presentation">
      <div
        className="pop-in h-full w-full max-w-md overflow-y-auto border-l border-line-strong bg-surface p-4 shadow-card sm:p-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold"><span className="text-gold"><Icon name={icon} size={20} /></span>{title}</h2>
          <Btn variant="ghost" size="sm" onClick={onClose} icon="close" aria-label="Close">Close</Btn>
        </div>
        <Orn className="mb-4 text-gold" width={170} />
        {children}
      </div>
    </div>
  );
}
