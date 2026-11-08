// A town on the road: trade goods at local prices, resupply, rest, and rumours of the next leg.
import { useState } from 'react';
import { Panel, PanelTitle, Btn, Coin, GoodRow, SupplyRow, GameBar, BarBtn, Segmented, StatBar, SupplyChip } from '../components/parts.jsx';
import { Icon, Caravanserai } from '../components/art.jsx';
import { GOODS, SUPPLIES, ANIMAL, LEGS, TERRAIN } from '../game/data.js';
import {
  currentStop, nextStop, priceAt, sellAt, buyGood, sellGood, buySupply, supplyPrice,
  restInTown, aliveParty, goodsValueOf, legOf, partyHealth, partyMorale,
} from '../game/engine.js';
import { RUMOURS, TOWN_WHISPERS } from '../game/events.js';
import { STOP_FACTS, CONCEPTS } from '../game/learning.js';
import { pick } from '../game/engine.js';

const TABS = [
  { id: 'goods', label: 'Goods' },
  { id: 'supplies', label: 'Supplies' },
  { id: 'rest', label: 'Rest & help' },
];

export default function Town({ state, setState, onDepart, sfx, muted, onToggleMute, openPanel, setOpenPanel, showHowTo, showAlmanac, onTitle }) {
  const [tab, setTab] = useState('goods');
  const [rumour, setRumour] = useState(null);
  const [note, setNote] = useState(null);
  const stop = currentStop(state);
  const next = nextStop(state);
  const leg = legOf(state);

  const act = (fn) => {
    const clone = JSON.parse(JSON.stringify(state));
    const ok = fn(clone);
    if (ok === false) {
      sfx.error();
      setNote('Not enough coin for that.');
      window.setTimeout(() => setNote(null), 1800);
      return;
    }
    sfx.coin();
    setState(clone);
  };

  const depart = () => {
    const clone = JSON.parse(JSON.stringify(state));
    clone.screen = 'travel';
    sfx.select();
    setState(clone);
    onDepart && onDepart();
  };

  const hearRumour = () => {
    sfx.click();
    setRumour(pick(RUMOURS));
  };

  return (
    <div className="min-h-dvh px-3 pb-10 sm:px-5">
      <GameBar state={state}>
        <BarBtn icon="people" label="Party" onClick={() => setOpenPanel(openPanel === 'party' ? null : 'party')} active={openPanel === 'party'} aria-expanded={openPanel === 'party'} />
        <BarBtn icon="bag" label="Cargo" onClick={() => setOpenPanel(openPanel === 'bag' ? null : 'bag')} active={openPanel === 'bag'} aria-expanded={openPanel === 'bag'} />
        <BarBtn icon="book" label="Almanac" onClick={showAlmanac} />
        <BarBtn icon={muted ? 'mute' : 'sound'} label="Sound" onClick={onToggleMute} aria-pressed={muted} />
        <BarBtn icon="scroll" label="How to" onClick={showHowTo} />
        <BarBtn icon="close" label="Leave" onClick={onTitle} />
      </GameBar>

      <div className="mx-auto max-w-7xl">
      {/* Town header: the name, a line of local colour, and the way out. */}
      <Panel className="mb-3 overflow-hidden !p-0">
        <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-44 text-gold/30 sm:block">
            <Caravanserai className="h-full w-full" />
          </div>
          <div className="relative z-10 min-w-0 flex-1">
            <p className="smallcaps text-[10px] tracking-[0.18em] text-gold">Stop {state.legIndex + 1} of 9 · {stop.region}</p>
            <h1 className="mt-0.5 font-display text-3xl font-semibold leading-none text-ink sm:text-4xl">{stop.name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">{stop.line}</p>
            <p className="mt-1 max-w-2xl font-display text-sm italic leading-snug text-ink-3">{TOWN_WHISPERS[stop.id]}</p>
          </div>
          <div className="relative z-10 flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
            <Btn variant="primary" onClick={depart} icon="camel">Take the road west</Btn>
            {next && <p className="smallcaps text-[10px] text-ink-3">next: {next.name}</p>}
          </div>
        </div>
      </Panel>

      <div className="grid gap-3 lg:grid-cols-[1fr_340px]">
        {/* Trade */}
        <Panel>
          <PanelTitle icon="coin" right={<Coin amount={goodsValueOf(state.goods)} className="text-sm" />}>
            The suq
          </PanelTitle>
          <div className="mb-3">
            <Segmented
              value={tab}
              onChange={(id) => { setTab(id); sfx.click(); }}
              options={TABS}
            />
          </div>

          {tab === 'goods' && (
            <div>
              <p className="mb-2 text-sm text-ink-2">
                Prices shift from town to town. Buy where a thing is common, sell where it is rare.
                {stop.id === 'venice' ? '' : ' Your own goods fetch the left-hand price.'}
              </p>
              {Object.keys(GOODS).map((id) => {
                const buy = priceAt(state, stop.id, id);
                const sell = sellAt(state, stop.id, id);
                const qty = state.goods[id] || 0;
                return (
                  <GoodRow
                    key={id}
                    id={id}
                    qty={qty}
                    price={buy}
                    sellPrice={sell}
                    onBuy={state.coin >= buy ? () => act((s) => buyGood(s, id, 1)) : null}
                    onSell={qty > 0 ? () => act((s) => sellGood(s, id, 1)) : null}
                  />
                );
              })}
            </div>
          )}

          {tab === 'supplies' && (
            <div>
              <p className="mb-2 text-sm text-ink-2">Food and water are sold by the day. Camels are dear everywhere.</p>
              {Object.keys(SUPPLIES).map((id) => {
                const p = supplyPrice(state, id);
                return (
                  <SupplyRow
                    key={id}
                    id={id}
                    qty={state[id] || 0}
                    price={p}
                    onBuy={state.coin >= p ? () => act((s) => buySupply(s, id, 1)) : null}
                    onSell={(state[id] || 0) > 0 && id !== 'medicine' && id !== 'rope' ? () => act((s) => buySupply(s, id, -1)) : null}
                    disabled={state.coin < p}
                  />
                );
              })}
              <SupplyRow
                id="fodder"
                title="Camels"
                blurb={ANIMAL.blurb}
                qty={state.camels}
                price={supplyPrice(state, 'camel')}
                unit="camel"
                onBuy={state.coin >= supplyPrice(state, 'camel') ? () => act((s) => buySupply(s, 'camel', 1)) : null}
                disabled={state.coin < supplyPrice(state, 'camel')}
              />
              <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-ink-3">
                <Icon name="camel" size={14} className="mt-0.5 shrink-0 text-ink-3" />
                {ANIMAL.blurb}
              </p>
            </div>
          )}

          {tab === 'rest' && (
            <div className="space-y-2.5">
              <RestRow
                icon="moon"
                title="A night at the caravanserai"
                price={6}
                text="Beds, hot food, water for the animals. The party recovers health and morale."
                disabled={state.coin < 6}
                onClick={() => act((s) => restInTown(s, 'night'))}
              />
              <RestRow
                icon="medicine"
                title="Dose the sick with medicine"
                price={0}
                priceLabel={state.medicine > 0 ? `1 dose (${state.medicine} left)` : 'no doses left'}
                text="A physician is best; without one it is bark and prayer, but it works."
                disabled={state.medicine < 1}
                onClick={() => act((s) => restInTown(s, 'heal'))}
              />
              <div className="rounded-md border border-line bg-surface-2/60 p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink">Ask in the tea house</h3>
                  <Btn size="sm" onClick={hearRumour} icon="scroll">Listen</Btn>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">
                  {rumour || 'Someone here has been further west than you and wants to tell you about it.'}
                </p>
              </div>
            </div>
          )}

          {note && <p className="mt-3 text-sm text-danger" role="status">{note}</p>}
        </Panel>

        {/* Next leg */}
        <div className="space-y-4">
          <Panel>
            <PanelTitle icon="compass">The road ahead</PanelTitle>
            {next ? (
              <>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-display text-2xl font-semibold text-ink">{next.name}</p>
                  <span className="smallcaps text-xs text-ink-3">{next.region}</span>
                </div>
                <p className="mt-1 text-sm text-ink-2">{leg && leg.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">{leg && leg.text}</p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <Fact label="Terrain" value={leg ? TERRAIN[leg.terrain].name : '—'} />
                  <Fact label="Roughly" value={leg ? `${leg.days} days` : '—'} />
                  <Fact label="Hazards" value={leg ? leg.hazards.join(', ') : '—'} />
                  <Fact label="You have" value={`${state.food} days food · ${state.water} water`} />
                </dl>
              </>
            ) : (
              <p className="text-sm text-ink-2">The road ends at the lagoon. Sell what you carry.</p>
            )}
          </Panel>

          {STOP_FACTS[stop.id] && (
            <Panel>
              <PanelTitle icon="scroll" right={<span className="smallcaps text-[10px] text-gold">{CONCEPTS[STOP_FACTS[stop.id].concept].tag}</span>}>
                What the historians know
              </PanelTitle>
              <p className="smallcaps text-[10px] text-gold">{CONCEPTS[STOP_FACTS[stop.id].concept].name}</p>
              <ul className="mt-2 space-y-1.5">
                {STOP_FACTS[stop.id].facts.slice(0, 3).map((fact) => (
                  <li key={fact} className="flex gap-2 text-sm leading-relaxed text-ink-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                    {fact}
                  </li>
                ))}
              </ul>
              <p className="mt-3 rounded-md border border-line bg-surface-2/50 px-2.5 py-2 text-sm leading-relaxed text-ink-2">
                <span className="smallcaps mr-1.5 text-[10px] text-gold">Practice</span>
                {STOP_FACTS[stop.id].prompt}
              </p>
              <p className="mt-2 text-xs text-ink-3">The rest, and every other stop, is in the almanac.</p>
            </Panel>
          )}

          <Panel>
            <PanelTitle icon="party" right={<span className="smallcaps text-[10px] text-ink-3">{aliveParty(state).length} of {state.party.length} alive</span>}>
            The caravan
          </PanelTitle>
          <div className="space-y-2">
            <StatBar label="Health" value={partyHealth(state)} tone="ok" icon="people" />
            <StatBar label="Morale" value={partyMorale(state)} tone="gold" icon="sun2" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            <SupplyChip icon="food" label="Food" value={state.food} />
            <SupplyChip icon="water" label="Water" value={state.water} />
            <SupplyChip icon="fodder" label="Fodder" value={state.fodder} />
            <SupplyChip icon="camel" label="Camels" value={state.camels} />
            <SupplyChip icon="medicine" label="Medicine" value={state.medicine} />
            <SupplyChip icon="rope" label="Rope" value={state.rope} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-3">Pace and rations are set once you take the road. Provisions are sold by the day.</p>
        </Panel>
        </div>
      </div>
      </div>
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="smallcaps text-[10px] text-ink-3">{label}</dt>
      <dd className="truncate font-display text-base font-semibold text-ink">{value}</dd>
    </div>
  );
}

function RestRow({ icon, title, text, price, priceLabel, disabled, onClick }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-line bg-surface-2/50 p-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-gold">
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-lg font-semibold leading-tight text-ink">{title}</h3>
        <p className="text-xs leading-relaxed text-ink-3">{text}</p>
      </div>
      <Btn size="sm" onClick={onClick} disabled={disabled}>
        {priceLabel || <><Icon name="coin" size={12} className="text-gold" />{price}</>}
      </Btn>
    </div>
  );
}
