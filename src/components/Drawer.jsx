// Slide-over drawer: the party's health and morale, and everything in the packs.
import { useEffect, useRef } from 'react';
import { Icon, Ornament, Camel } from './art.jsx';
import { Btn, Coin } from './parts.jsx';
import { GOODS, SUPPLIES } from '../game/data.js';
import { goodsValueOf, partyHealth, partyMorale } from '../game/engine.js';
import { cx } from './cx.js';

function toneFor(v) {
  if (v >= 65) return 'ok';
  if (v >= 35) return 'warn';
  return 'danger';
}

export default function Drawer({ open, onClose, tab, setTab, state }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current && closeRef.current.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const alive = state.party.filter((p) => p.alive);
  const goodsVal = goodsValueOf(state.goods);
  const carried = Object.entries(state.goods || {}).filter(([, n]) => n > 0);

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[1px]" onClick={onClose} aria-hidden="true" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={tab === 'party' ? 'The party' : 'The packs'}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line-strong bg-surface shadow-card"
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex gap-1.5" role="tablist" aria-label="Caravan details">
            {[{ id: 'party', label: 'Party', icon: 'party' }, { id: 'packs', label: 'Packs', icon: 'bag' }].map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cx(
                  'inline-flex min-h-[40px] items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors duration-150',
                  tab === t.id ? 'border-gold bg-gold-soft text-ink' : 'border-line bg-surface text-ink-2 hover:bg-surface-2 hover:text-ink',
                )}
              >
                <Icon name={t.icon} size={15} />{t.label}
              </button>
            ))}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <Icon name="close" size={20} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {tab === 'party' ? (
            <>
              <div className="mb-3 grid grid-cols-2 gap-2">
                <Summary label="Party health" value={partyHealth(state)} />
                <Summary label="Spirits" value={partyMorale(state)} />
              </div>
              <p className="mb-3 text-sm leading-relaxed text-ink-2">{state.caravanName}, bound west. {alive.length} of {state.party.length} still walking.</p>
              <ul className="space-y-2.5">
                {state.party.map((p) => (
                  <li key={p.id} className={cx('rounded-md border p-3', p.alive ? 'border-line bg-surface-2/40' : 'border-line/60 bg-surface-2/20 opacity-60')}>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold leading-tight text-ink">{p.name}</h3>
                      <span className="smallcaps shrink-0 text-[11px] text-ink-3">{p.role}</span>
                    </div>
                    <p className="text-xs text-ink-3">{p.origin} · {p.skill}</p>
                    {p.alive ? (
                      <>
                        <div className="mt-2 space-y-1.5">
                          <MiniBar label="Health" value={p.health} />
                          <MiniBar label="Spirits" value={p.morale} />
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-ink-2">{p.perk}</p>
                        {p.ailment && <p className="mt-1 text-xs font-medium text-danger">{p.ailment}</p>}
                      </>
                    ) : (
                      <p className="mt-2 text-xs italic text-ink-3">{p.deathNote || 'Died on the road.'}</p>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <Coin amount={state.coin} />
                <span className="smallcaps text-xs text-ink-3">goods worth {goodsVal}</span>
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-ink">Trade goods</h3>
              {carried.length === 0 ? (
                <p className="mb-4 rounded-md border border-dashed border-line-strong p-3 text-sm text-ink-3">
                  Nothing in the packs but crumbs. Buy goods in a town and sell them further west.
                </p>
              ) : (
                <ul className="mb-4 divide-y divide-line/70 rounded-md border border-line">
                  {carried.map(([id, n]) => (
                    <li key={id} className="flex items-center gap-3 px-3 py-2">
                      <Icon name={{ silk: 'silk', spices: 'spice', porcelain: 'vase', paper: 'paper', horses: 'horse', glass: 'glass', frankincense: 'incense' }[id]} size={16} className="text-ink-2" />
                      <span className="min-w-0 flex-1 truncate font-display text-base text-ink">{GOODS[id].name}</span>
                      <span className="tabular-nums text-ink-2">{n} × {GOODS[id].unit}</span>
                    </li>
                  ))}
                </ul>
              )}
              <h3 className="mb-2 font-display text-lg font-semibold text-ink">Provisions</h3>
              <ul className="divide-y divide-line/70 rounded-md border border-line">
                {['food', 'water', 'fodder', 'medicine', 'rope'].map((k) => (
                  <li key={k} className="flex items-center gap-3 px-3 py-2">
                    <Icon name={k} size={16} className="text-ink-2" />
                    <span className="min-w-0 flex-1 truncate font-display text-base text-ink">{SUPPLIES[k].name}</span>
                    <span className="tabular-nums text-ink-2">{state[k]} <span className="text-xs text-ink-3">{SUPPLIES[k].unit}s</span></span>
                  </li>
                ))}
                <li className="flex items-center gap-3 px-3 py-2">
                  <Icon name="camel" size={16} className="text-ink-2" />
                  <span className="min-w-0 flex-1 font-display text-base text-ink">Camels</span>
                  <span className="tabular-nums text-ink-2">{state.camels}</span>
                </li>
              </ul>
              <Ornament className="mx-auto mt-5 text-gold/70" width={200} />
              <p className="mt-2 text-center text-xs text-ink-3">Each camel carries more, moves faster and eats a bale a day.</p>
            </>
          )}
        </div>
        <footer className="border-t border-line px-4 py-3">
          <Btn variant="secondary" className="w-full" onClick={onClose}>Back to the road</Btn>
        </footer>
      </aside>
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div className="rounded-md border border-line bg-surface-2/50 p-2.5">
      <p className="smallcaps text-[11px] text-ink-3">{label}</p>
      <p className="font-display text-2xl font-semibold leading-none text-ink">{value}</p>
    </div>
  );
}

function MiniBar({ label, value }) {
  const tone = toneFor(value);
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="smallcaps text-ink-3">{label}</span>
        <span className="tabular-nums text-ink-2">{Math.round(value)}</span>
      </div>
      <div className="bar-track" role="progressbar" aria-label={`${label}`} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
        <div className="bar-fill" style={{ width: `${value}%`, background: `var(--${tone})` }} />
      </div>
    </div>
  );
}
