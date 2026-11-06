// Caravan setup: name it, choose the year, choose what you are carrying, and who is coming.
import { useMemo, useState } from 'react';
import { ERAS, GOODS, TRAVELER_POOL, CARAVAN_SUGGESTIONS, STOPS, START_GOODS } from '../game/data.js';
import { Btn, Panel, OrnamentalHeading, Coin } from '../components/parts.jsx';
import { Icon, Ornament, Ornament as Orn, Caravanserai } from '../components/art.jsx';
import { makeParty, createRun, saveRun } from '../game/engine.js';

const START_COIN = 460;
const SUPPLY_PRICES = { camels: 34, food: 1, water: 1, fodder: 1, medicine: 8, rope: 6 };
const GOOD_PRICE = { silk: 13, spices: 12, porcelain: 11, paper: 5 };

const STEPS = ['The caravan', 'The year', 'The cargo', 'The people'];

export default function Setup({ onBegin, onBack }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(CARAVAN_SUGGESTIONS[0]);
  const [eraId, setEraId] = useState('pax');
  const [startGood, setStartGood] = useState('silk');
  const [camels, setCamels] = useState(4);
  const [food, setFood] = useState(40);
  const [water, setWater] = useState(30);
  const [fodder, setFodder] = useState(25);
  const [medicine, setMedicine] = useState(3);
  const [rope, setRope] = useState(2);
  const [goods, setGoods] = useState({ silk: 8, spices: 2, porcelain: 1, paper: 3 });
  const [partyIds, setPartyIds] = useState(['merchant', 'guide', 'driver', 'guard']);
  // Names the player gives their travellers, like the original Oregon Trail's party screen.
  const [names, setNames] = useState({});

  const spent = useMemo(() => {
    let total = 0;
    total += camels * SUPPLY_PRICES.camels;
    total += food * SUPPLY_PRICES.food;
    total += water * SUPPLY_PRICES.water;
    total += fodder * SUPPLY_PRICES.fodder;
    total += medicine * SUPPLY_PRICES.medicine;
    total += rope * SUPPLY_PRICES.rope;
    Object.entries(goods).forEach(([id, qty]) => { total += qty * (GOOD_PRICE[id] || 10); });
    return total;
  }, [camels, food, water, fodder, medicine, rope, goods]);

  const remaining = START_COIN - spent;
  const over = remaining < 0;

  const canAfford = (price) => remaining >= price;

  const bump = (setter, value, delta, min = 0, max = 999, price = 0) => {
    const next = Math.max(min, Math.min(max, value + delta));
    if (delta > 0 && price > 0 && !canAfford(price * delta)) return;
    setter(next);
  };

  const era = ERAS.find((e) => e.id === eraId);
  const toggleParty = (id) => {
    setPartyIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 3) return prev;
        return prev.filter((p) => p !== id);
      }
      if (prev.length >= 5) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const begin = () => {
    if (over || partyIds.length < 3) return;
    const party = makeParty(partyIds, names);
    const state = createRun({
      caravanName: name,
      eraId,
      startGood,
      camels,
      food,
      water,
      fodder,
      medicine,
      rope,
      goods,
      party,
    });
    state.coin = remaining;
    state.startCapital = START_COIN;
    state.startGoods = { ...goods };
    state.screen = 'map';
    state.log.push({ day: 0, kind: 'good', text: `${state.caravanName} leaves Chang'an in ${era.year} with ${camels} camels, ${party.length} travellers and ${remaining} bezants. The road west begins.` });
    saveRun(state);
    onBegin(state);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <button type="button" onClick={onBack} className="mb-4 inline-flex min-h-[44px] items-center gap-2 text-sm text-ink-2 hover:text-ink">
        <span className="rotate-180"><Icon name="chevron" size={14} /></span> Back to the title
      </button>

      <OrnamentalHeading>Load the camels</OrnamentalHeading>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-ink-2 sm:text-base">
        You leave Chang'an with {START_COIN} bezants. Spend them well: everything on the road is dearer, and some of it cannot be bought at all.
      </p>

      {/* Step rail: a thin progress line under numbered steps, not four stray buttons. */}
      <div className="mx-auto mt-6 max-w-2xl">
        <ol className="flex items-center gap-1.5">
          {STEPS.map((label, i) => (
            <li key={label} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setStep(i)}
                aria-current={i === step ? 'step' : undefined}
                className="group flex w-full min-h-[44px] flex-col gap-1.5 text-left"
              >
                <span className={`h-0.5 w-full rounded-full transition-colors ${i <= step ? 'bg-gold' : 'bg-line'}`} />
                <span className={`flex items-center gap-1.5 truncate text-xs transition-colors ${i === step ? 'text-ink' : 'text-ink-3 group-hover:text-ink-2'}`}>
                  <span className="smallcaps tabular-nums">{i + 1}</span>
                  <span className="truncate">{label}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
        <Panel className="min-h-[420px]">
          {step === 0 && (
            <div className="space-y-4 fade-up">
              <h2 className="font-display text-2xl font-semibold">Name your caravan</h2>
              <p className="text-sm text-ink-2">
                The name goes on the paiza, in the toll books, and on the lips of every caravanserai keeper between here and the sea.
              </p>
              <label className="block">
                <span className="smallcaps mb-1 block text-xs text-ink-2">Caravan name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 32))}
                  maxLength={32}
                  className="min-h-[48px] w-full rounded-md border border-line-strong bg-surface-2/60 px-3 font-display text-xl text-ink focus:border-gold"
                  aria-label="Caravan name"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {CARAVAN_SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => setName(s)} className="min-h-[36px] rounded-full border border-line bg-surface-2 px-3 text-sm text-ink-2 hover:border-gold hover:text-ink">
                    {s}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <Caravanserai className="h-32 w-full opacity-80" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 fade-up">
              <h2 className="font-display text-2xl font-semibold">Choose the year</h2>
              <p className="text-sm text-ink-2">The road is the same. What is on it is not.</p>
              <div className="space-y-3">
                {ERAS.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setEraId(e.id)}
                    className={`block w-full rounded-md border p-3 text-left transition-colors sm:p-4 ${eraId === e.id ? 'border-gold bg-gold-soft/50' : 'border-line bg-surface-2/40 hover:border-line-strong'}`}
                    aria-pressed={eraId === e.id}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-display text-lg font-semibold text-ink">{e.name}</span>
                      <span className="smallcaps text-xs text-gold">{e.tag}</span>
                    </div>
                    <p className="mt-1 font-display text-base italic text-ink-2">{e.line}</p>
                    <p className="mt-1.5 text-xs text-ink-3">{e.effects.note}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 fade-up">
              <div>
                <h2 className="font-display text-2xl font-semibold">The cargo</h2>
                <p className="mt-1 text-sm text-ink-2">Prices in Chang'an are the lowest on the road. Whatever you carry west, sell it dear.</p>
              </div>

              <div>
                <h3 className="smallcaps mb-2 text-xs text-ink-2">The wager: what are you carrying west?</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {START_GOODS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => { setStartGood(g.id); setGoods((prev) => ({ ...prev, [g.id]: (prev[g.id] || 0) + 2 })); }}
                      className={`rounded-md border p-2.5 text-left transition-colors ${startGood === g.id ? 'border-gold bg-gold-soft/50' : 'border-line bg-surface-2/40 hover:border-line-strong'}`}
                      aria-pressed={startGood === g.id}
                    >
                      <span className="flex items-center gap-2 font-display text-base font-semibold text-ink">
                        <Icon name={{ silk: 'silk', spices: 'spice', porcelain: 'vase', paper: 'paper' }[g.id]} size={15} className="text-gold" />
                        {GOODS[g.id].name}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-3">{g.blurb}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="smallcaps mb-2 text-xs text-ink-2">Camels and stores</h3>
                  <div className="space-y-1.5">
                    {[
                      { key: 'camels', label: 'Camels', price: SUPPLY_PRICES.camels, value: camels, set: setCamels, min: 2, max: 10 },
                      { key: 'food', label: 'Food (days)', price: SUPPLY_PRICES.food, value: food, set: setFood, min: 0, max: 90 },
                      { key: 'water', label: 'Water (skins)', price: SUPPLY_PRICES.water, value: water, set: setWater, min: 0, max: 90 },
                      { key: 'fodder', label: 'Fodder (bales)', price: SUPPLY_PRICES.fodder, value: fodder, set: setFodder, min: 0, max: 90 },
                      { key: 'medicine', label: 'Medicine (doses)', price: SUPPLY_PRICES.medicine, value: medicine, set: setMedicine, min: 0, max: 12 },
                      { key: 'rope', label: 'Rope & parts (coils)', price: SUPPLY_PRICES.rope, value: rope, set: setRope, min: 0, max: 8 },
                    ].map((row) => (
                      <div key={row.key} className="flex items-center gap-2 rounded-md border border-line bg-surface-2/40 px-2 py-1.5">
                        <span className="smallcaps min-w-0 flex-1 truncate text-xs text-ink-2">{row.label}</span>
                        <span className="smallcaps text-[10px] text-ink-3">{row.price}b</span>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => bump(row.set, row.value, -1, row.min)} className="flex h-8 w-8 items-center justify-center rounded border border-line-strong text-ink-2 hover:bg-surface-3" aria-label={`One less ${row.label}`} disabled={row.value <= row.min}>−</button>
                          <span className="w-7 text-center font-display text-base font-semibold tabular-nums">{row.value}</span>
                          <button type="button" onClick={() => bump(row.set, row.value, 1, row.min, row.max, row.price)} className="flex h-8 w-8 items-center justify-center rounded border border-line-strong text-ink-2 hover:bg-surface-3" aria-label={`One more ${row.label}`} disabled={row.value >= row.max || remaining < row.price}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="smallcaps mb-2 text-xs text-ink-2">Trade goods</h3>
                  <div className="space-y-1.5">
                    {Object.keys(GOOD_PRICE).map((id) => (
                      <div key={id} className="flex items-center gap-2 rounded-md border border-line bg-surface-2/40 px-2 py-1.5">
                        <Icon name={{ silk: 'silk', spices: 'spice', porcelain: 'vase', paper: 'paper' }[id]} size={15} className="text-ink-3" />
                        <span className="smallcaps min-w-0 flex-1 truncate text-xs text-ink-2">{GOODS[id].name}</span>
                        <span className="smallcaps text-[10px] text-ink-3">{GOOD_PRICE[id]}b</span>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => setGoods((g) => ({ ...g, [id]: Math.max(0, (g[id] || 0) - 1) }))} className="flex h-8 w-8 items-center justify-center rounded border border-line-strong text-ink-2 hover:bg-surface-3" aria-label={`One less ${GOODS[id].name}`} disabled={!goods[id]}>−</button>
                          <span className="w-7 text-center font-display text-base font-semibold tabular-nums">{goods[id] || 0}</span>
                          <button type="button" onClick={() => setGoods((g) => ({ ...g, [id]: (g[id] || 0) + 1 }))} className="flex h-8 w-8 items-center justify-center rounded border border-line-strong text-ink-2 hover:bg-surface-3" aria-label={`One more ${GOODS[id].name}`} disabled={remaining < GOOD_PRICE[id]}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 rounded-md border border-line bg-surface-2/30 p-2 text-xs text-ink-3">
                    A caravan with fewer than four camels crawls, and a slow caravan eats its stores on the road. Four is the minimum for a living.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 fade-up">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="font-display text-2xl font-semibold">Who comes with you</h2>
                  <p className="mt-1 max-w-xl text-sm text-ink-2">Three to five travellers. Each has a skill that changes how the road treats you.</p>
                </div>
                <span className="smallcaps text-xs text-gold">{partyIds.length} chosen · 3 to 5</span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {/* The roster: everyone you could hire. */}
                <div>
                  <h3 className="smallcaps mb-2 text-[10px] text-ink-3">The hiring pool</h3>
                  <ul className="divide-y divide-line/70 rounded-md border border-line">
                    {TRAVELER_POOL.map((t) => {
                      const chosen = partyIds.includes(t.id);
                      return (
                        <li key={t.id}>
                          <button
                            type="button"
                            onClick={() => toggleParty(t.id)}
                            aria-pressed={chosen}
                            className={`flex w-full min-h-[52px] items-center gap-2.5 px-2.5 py-2 text-left transition-colors ${chosen ? 'bg-gold-soft/60' : 'hover:bg-surface-2/70'}`}
                          >
                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border ${chosen ? 'border-gold bg-gold text-surface' : 'border-line-strong text-transparent'}`}>
                              <Icon name="check" size={12} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-baseline gap-x-2">
                                <span className="font-display text-base font-semibold text-ink">{t.name}</span>
                                <span className="smallcaps text-[10px] text-ink-3">{t.role}</span>
                              </span>
                              <span className="block truncate text-xs text-ink-2" title={t.perk}>{t.perk}</span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-2 text-xs leading-relaxed text-ink-3">A caravan of three travels lighter; five keeps more hands on the ropes and more mouths at the pot.</p>
                </div>

                {/* The chosen: only these get a name of their own. */}
                <div>
                  <h3 className="smallcaps mb-2 text-[10px] text-ink-3">Your caravan</h3>
                  {partyIds.length === 0 ? (
                    <p className="rounded-md border border-dashed border-line-strong p-3 text-sm text-ink-3">Nobody hired yet. Pick three from the pool.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {partyIds.map((id) => {
                        const t = TRAVELER_POOL.find((p) => p.id === id);
                        if (!t) return null;
                        return (
                          <li key={id} className="rounded-md border border-line bg-surface-2/40 p-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="min-w-0 truncate font-display text-base font-semibold text-ink">{names[id]?.trim() || t.name}</span>
                              <button
                                type="button"
                                onClick={() => toggleParty(id)}
                                disabled={partyIds.length <= 3}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-ink-3 hover:bg-surface-3 hover:text-danger disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-3"
                                aria-label={`Send ${t.name} back${partyIds.length <= 3 ? ' (three is the minimum)' : ''}`}
                              >
                                <Icon name="close" size={14} />
                              </button>
                            </div>
                            <input
                              value={names[id] ?? ''}
                              onChange={(e) => setNames((n) => ({ ...n, [id]: e.target.value.slice(0, 24) }))}
                              placeholder={`Name your ${t.role.toLowerCase()} (or keep ${t.name})`}
                              maxLength={24}
                              className="mt-1 min-h-[36px] w-full rounded-sm border border-line bg-surface px-2 text-sm text-ink placeholder:text-ink-3/80 focus:border-gold"
                              aria-label={`Name for the ${t.role.toLowerCase()}`}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <Btn variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Btn>
            {step < STEPS.length - 1 ? (
              <Btn variant="primary" onClick={() => setStep((s) => s + 1)}>Continue</Btn>
            ) : (
              <Btn variant="primary" size="lg" onClick={begin} disabled={over || partyIds.length < 3} icon="play">
                Leave Chang'an
              </Btn>
            )}
          </div>
        </Panel>

        <aside className="space-y-4">
          <Panel className="lg:sticky lg:top-4">
            <h2 className="font-display text-lg font-semibold">The ledger</h2>
            <Orn className="my-2 text-gold" width={150} />
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-2"><dt className="text-ink-2">Starting coin</dt><dd className="font-display font-semibold tabular-nums">{START_COIN}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-ink-2">Spent</dt><dd className="font-display font-semibold tabular-nums">{spent}</dd></div>
              <div className={`flex justify-between gap-2 border-t border-line pt-1.5 ${over ? 'text-danger' : 'text-ink'}`}>
                <dt>In the strongbox</dt>
                <dd className="font-display text-lg font-semibold tabular-nums">{remaining}</dd>
              </div>
            </dl>
            {over && <p className="mt-2 rounded border border-danger/50 bg-danger-soft p-2 text-xs text-danger">You are {Math.abs(remaining)} bezants over. Take something off the camels.</p>}
            <div className="mt-3 space-y-1 border-t border-line pt-3 text-xs text-ink-3">
              <p>{camels} camels · {partyIds.length} travellers</p>
              <p>{era.name}, {era.year}</p>
              <p>Route: {STOPS[0].name} → {STOPS[STOPS.length - 1].name}, {STOPS.length - 1} legs</p>
            </div>
            <div className="mt-3 rounded-md border border-line bg-surface-2/50 p-2 text-xs text-ink-2">
              <span className="smallcaps block text-[10px] text-ink-3">Rough daily use</span>
              {partyIds.length} food · {Math.round(partyIds.length * 0.8)} water · {Math.round(camels * 0.7)} fodder per day
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
