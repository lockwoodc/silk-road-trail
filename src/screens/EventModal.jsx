// The event modal: a piece of the road stops you, and you choose.
import { useEffect, useState } from 'react';
import { Ornament, Icon } from '../components/art.jsx';
import { chooseEventOption } from '../game/engine.js';
import { CONCEPTS } from '../game/learning.js';

export default function EventModal({ event, state, setState, sfx }) {
  const [showLesson, setShowLesson] = useState(false);
  useEffect(() => {
    sfx.chime();
  }, []);
  const concept = CONCEPTS[event.concept];

  // Compute the result outside the updater: in StrictMode an updater can run twice,
  // which would apply the choice (and its side effects) twice.
  const choose = (index) => {
    sfx.select();
    const clone = JSON.parse(JSON.stringify(state));
    clone.event = event;
    chooseEventOption(clone, index);
    setState(clone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/55 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="event-title">
      <div className="pop-in frame max-h-[94dvh] w-full max-w-xl overflow-y-auto rounded-t-xl p-5 sm:rounded-lg sm:p-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-gold">
            <Icon name="scroll" size={16} />
            <span className="smallcaps text-xs">On the road · day {state.day + 1}</span>
          </div>
          <h2 id="event-title" className="mt-1 font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">{event.title}</h2>
          <Ornament className="my-3 text-gold" width={190} />
          <p className="font-display text-lg leading-snug text-ink-2 sm:text-xl">{event.body}</p>

          {concept && (
            <div className="mt-4 rounded-md border border-line bg-surface-2/50 px-3 py-2.5">
              <button
                type="button"
                onClick={() => setShowLesson((v) => !v)}
                aria-expanded={showLesson}
                className="flex w-full items-center justify-between gap-2 text-left"
              >
                <span className="smallcaps text-[10px] text-gold">{concept.tag} · {concept.name}</span>
                <span className="smallcaps text-[10px] text-ink-3">{showLesson ? 'Hide the history' : 'What is this?'}</span>
              </button>
              {showLesson ? (
                <div className="mt-2 space-y-1.5">
                  <p className="text-sm leading-relaxed text-ink-2">{event.note}</p>
                  <p className="text-sm leading-relaxed text-ink-3">{concept.summary}</p>
                </div>
              ) : (
                <p className="mt-1 text-sm leading-relaxed text-ink-3">{event.note}</p>
              )}
            </div>
          )}

          <div className="mt-5 space-y-2">
            {event.choices.map((choice, i) => {
              const locked = choice.requires && !choice.requires(state);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => choose(i)}
                  disabled={locked}
                  className="group flex w-full min-h-[52px] items-start gap-3 rounded-md border border-line-strong bg-surface-2/50 px-3 py-2.5 text-left transition-colors hover:border-gold hover:bg-gold-soft/40 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-line-strong disabled:hover:bg-surface-2/50"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/60 font-display text-xs font-semibold text-gold">{i + 1}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-base font-semibold leading-snug text-ink sm:text-lg">{choice.label}</span>
                    {choice.hint && <span className="mt-0.5 block text-xs text-ink-3">{locked ? 'You do not have what this needs.' : choice.hint}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
