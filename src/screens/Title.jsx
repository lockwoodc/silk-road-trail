// Title screen: the caravan at dusk, the name of the game, and the way in.
import { CaravanScene, Ornament, Icon, Diamond } from '../components/art.jsx';
import { Btn, Panel, OrnamentalHeading, Coin } from '../components/parts.jsx';
import { STOPS, LEGS } from '../game/data.js';
import { bestScore } from '../game/engine.js';

export default function Title({ onStart, onHowTo, onAlmanac, hasSave, onContinue, onAbandon, muted, onToggleMute }) {
  const best = bestScore();
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <CaravanScene className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/40 to-bg" />
      </div>

      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-6 sm:px-8 sm:py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-ink-2">
            <Diamond className="text-gold" />
            <span className="smallcaps text-xs">A caravan game, 1200–1450</span>
          </div>
          <button
            type="button"
            onClick={onToggleMute}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-line-strong bg-surface/70 text-ink-2 hover:text-ink"
            aria-label={muted ? 'Unmute sound' : 'Mute sound'}
            aria-pressed={muted}
          >
            <Icon name={muted ? 'mute' : 'sound'} size={18} />
          </button>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <p className="smallcaps mb-3 text-sm text-gold">Chang'an to Venice, one season at a time</p>
          <OrnamentalHeading>
            <span className="block text-5xl leading-[0.95] sm:text-6xl">Silk Road</span>
            <span className="mt-1 block font-display text-4xl italic leading-none text-accent sm:text-5xl">Trail</span>
          </OrnamentalHeading>
          <p className="mx-auto mt-6 max-w-xl font-display text-lg italic text-ink-2 sm:text-xl">
            You have four camels, a strongbox of bezants and a paiza good in three empires.
            Eight thousand li of desert, mountain and tax office stand between you and the Rialto.
          </p>

          <div className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3">
            <Btn variant="primary" size="lg" onClick={onStart} icon="play">Load the camels</Btn>
            {hasSave && (
              <Btn variant="gold" size="md" onClick={onContinue} icon="map">Continue the journey</Btn>
            )}
            <Btn variant="ghost" size="md" onClick={onHowTo} icon="scroll">How to travel</Btn>
            <Btn variant="ghost" size="md" onClick={onAlmanac} icon="book">The caravan almanac</Btn>
            <p className="text-center text-xs leading-relaxed text-ink-3">
              Built on AP World History Unit 2: networks of exchange, the Mongols, the Indian Ocean and the Black Death.
            </p>
            {hasSave && (
              <button type="button" onClick={onAbandon} className="min-h-[44px] text-sm text-ink-3 underline-offset-4 hover:text-danger hover:underline">
                Abandon the saved caravan
              </button>
            )}
          </div>

          {best && (
            <div className="mt-8 flex items-center gap-3 rounded-full border border-line-strong bg-surface/80 px-4 py-2 text-sm text-ink-2">
              <Icon name="scroll" size={15} className="text-gold" />
              <span>
                Best caravan: <strong className="font-display text-base text-ink">{best.caravan}</strong>, {best.total.toLocaleString()} points
              </span>
            </div>
          )}
        </main>

        <footer className="mt-auto">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-ink-3">
            {STOPS.map((s, i) => (
              <span key={s.id} className="flex items-center gap-2">
                {s.name}
                {i < STOPS.length - 1 && <span className="text-gold">·</span>}
              </span>
            ))}
          </div>
          <Ornament className="mx-auto text-gold/70" width={260} />
          <p className="mt-3 text-center text-xs text-ink-3">
            {LEGS.length} legs, {LEGS.reduce((s, l) => s + l.days, 0)} days at a steady pace, one very expensive silk road.
          </p>
        </footer>
      </div>
    </div>
  );
}

export function HowToPlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="howto-title">
      <Panel className="pop-in max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-xl sm:rounded-lg">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h2 id="howto-title" className="font-display text-2xl font-semibold">How to travel</h2>
          <Btn variant="ghost" size="sm" onClick={onClose} icon="close" aria-label="Close">Close</Btn>
        </div>
        <Ornament className="my-3 text-gold" width={180} />
        <div className="space-y-4 text-sm leading-relaxed text-ink-2 sm:text-base">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">The road</h3>
            <p>
              Eight legs from Chang'an to Venice. On each leg you choose a <strong className="text-ink">pace</strong> and
              <strong className="text-ink"> rations</strong>, then let the days run. Every day the caravan eats food, drinks
              water and feeds the animals. Deserts drink more water, mountain passes slow you down, and the season matters.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">Stores</h3>
            <p>
              <strong className="text-ink">Water</strong> is the one that kills. Carry more than you think you need across
              deserts, and buy it at every town. <strong className="text-ink">Fodder</strong> keeps the camels alive;
              fewer camels means a slower caravan, and a slow caravan eats its stores on the road.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">Trade</h3>
            <p>
              Goods are cheap where they are made and dear where they are wanted: silk in Chang'an, frankincense in Baghdad,
              everything in Venice. Buy low, carry it west, sell high. Coin is only worth what you can spend on the road.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">People</h3>
            <p>
              Your travellers each have health and morale, and each brings a skill: a guide finds water, a physician heals,
              a scholar argues down taxes. Low morale makes people sick. Nobody who dies comes back.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">The year matters</h3>
            <p>
              In 1271 the Mongol peace keeps the bandits off the road and adds tax collectors. In 1347 the pestilence is
              everywhere. In 1399 Timur's armies are burning the roads you need. Pick your poison.
            </p>
          </div>
          <div className="rounded-md border border-gold/50 bg-gold-soft/50 p-3">
            <h3 className="font-display text-lg font-semibold text-ink">Winning and losing</h3>
            <p>
              Reach Venice with at least one traveller alive and goods or coin to show. Your score is coin, the value of your
              goods, and the health and morale of whoever is still standing. You lose if everyone dies, or if you have no
              food, no water, no coin and nothing left to sell.
            </p>
          </div>
          <p className="text-xs text-ink-3">
            The journey saves itself after every day and every decision. Close the tab and your caravan waits at the last camp.
          </p>
        </div>
        <div className="mt-5 flex justify-end">
          <Btn variant="primary" onClick={onClose}>To the road</Btn>
        </div>
      </Panel>
    </div>
  );
}

export function EndScreen({ state, score, onNewRun, onTitle }) {
  const win = state.outcome === 'victory';
  const s = score;
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <CaravanScene className="h-full w-full" weather={win ? 'clear' : 'rain'} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/60 to-bg" />
      </div>
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-4 py-10 sm:px-8">
        <Panel className="pop-in">
          <p className="smallcaps text-center text-sm text-gold">{win ? 'The lagoon, and the bells of the Rialto' : 'The road keeps what it takes'}</p>
          <OrnamentalHeading className="mt-2">
            <span className={win ? 'text-ok' : 'text-danger'}>{win ? 'Venice at last' : 'The caravan is lost'}</span>
          </OrnamentalHeading>
          <p className="mx-auto mt-4 max-w-xl text-center font-display text-lg italic text-ink-2">
            {win
              ? `${state.caravanName} arrives with ${s.alive} traveller${s.alive === 1 ? '' : 's'} on ${state.day} days out of Chang'an, and ${state.coin} bezants in the strongbox.`
              : state.defeatReason || 'The last of the caravan has died on the road.'}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Coin', value: s.coin },
              { label: 'Goods value', value: s.goodsVal },
              { label: 'Survivors', value: s.alive },
              { label: 'Days out', value: state.day },
            ].map((row) => (
              <div key={row.label} className="rounded-md border border-line bg-surface-2/70 p-3 text-center">
                <div className="font-display text-2xl font-semibold tabular-nums text-ink">{row.value}</div>
                <div className="smallcaps text-xs text-ink-3">{row.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-gold/50 bg-gold-soft/40 p-4 text-center">
            <div className="smallcaps text-xs text-ink-2">Caravan score</div>
            <div className="font-display text-4xl font-semibold tabular-nums text-ink">{s.total.toLocaleString()}</div>
            <div className="mt-1 text-xs text-ink-3">coin + goods + health × 3 + morale × 2 + survivors × 120</div>
          </div>

          <div className="mt-5">
            <h3 className="font-display text-lg font-semibold">Who made it</h3>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {state.party.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 rounded-md border border-line bg-surface-2/50 px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate font-display text-base font-semibold text-ink">{p.name}</div>
                    <div className="smallcaps text-xs text-ink-3">{p.role}</div>
                  </div>
                  <span className={`smallcaps text-xs ${p.alive ? 'text-ok' : 'text-danger'}`}>{p.alive ? `${Math.round(p.health)} health` : (p.deathNote || 'died on the road')}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Btn variant="primary" size="lg" onClick={onNewRun}>Load the camels again</Btn>
            <Btn variant="secondary" size="lg" onClick={onTitle}>Back to the title</Btn>
          </div>
        </Panel>
      </div>
    </div>
  );
}
