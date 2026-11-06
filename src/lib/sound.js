// Sound: recorded CC0 ambience and effects, with a mute toggle that survives a refresh.
// Browsers block audio until the first gesture, so everything starts from a click.
const FILES = {
  wind: 'audio/looping-gentle-wind-ambience-on-an-open-desert-pla.mp3',
  market: 'audio/dark-sahara-egypt.mp3',
  click: 'audio/menu-fx-01.mp3',
  select: 'audio/select-granted-04.mp3',
  chime: 'audio/ping.mp3',
  win: 'audio/achievement-happy-beeps-jingle.mp3',
  lose: 'audio/you-failed-game-jingle.mp3',
};

const VOL = { wind: 0.42, market: 0.24, click: 0.35, select: 0.5, chime: 0.2, win: 0.5, lose: 0.5 };
const MUTE_KEY = 'silk-road-trail:muted';

let muted = false;
try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) {}

export function isMuted() { return muted; }
export function setMuted(v) {
  muted = !!v;
  try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (e) {}
  if (muted) stopAmbience();
}

const beds = {};
const cache = {};

function element(name) {
  if (!cache[name]) {
    const el = new Audio(FILES[name]);
    el.preload = 'auto';
    cache[name] = el;
  }
  return cache[name];
}

export function playSfx(name, { rate = 1, volume } = {}) {
  if (muted || typeof window === 'undefined') return;
  try {
    const el = element(name).cloneNode(true);
    el.volume = Math.min(1, volume ?? VOL[name] ?? 0.4);
    el.playbackRate = rate;
    el.play().catch(() => {});
  } catch (e) { /* audio blocked: stay silent */ }
}

let currentBed = null;
export function startAmbience(track = 'wind') {
  if (muted || typeof window === 'undefined') return;
  if (currentBed === track) return;
  stopAmbience();
  try {
    const el = new Audio(FILES[track]);
    el.loop = true;
    el.volume = 0;
    el.play().catch(() => {});
    let v = 0;
    const target = VOL[track] ?? 0.3;
    const timer = setInterval(() => {
      v = Math.min(target, v + 0.02);
      el.volume = v;
      if (v >= target) clearInterval(timer);
    }, 90);
    beds[track] = { el, timer };
    currentBed = track;
  } catch (e) { /* no audio */ }
}

export function stopAmbience() {
  Object.values(beds).forEach(({ el, timer }) => {
    clearInterval(timer);
    try { el.pause(); el.currentTime = 0; } catch (e) {}
  });
  Object.keys(beds).forEach((k) => delete beds[k]);
  currentBed = null;
}

export function ambienceFor(track) {
  if (!muted) startAmbience(track);
}

export function makeSfx() {
  return {
    click: () => playSfx('click', { rate: 0.95 + Math.random() * 0.1, volume: 0.3 }),
    select: () => playSfx('select', { rate: 0.98 + Math.random() * 0.06 }),
    coin: () => playSfx('select', { rate: 1.12, volume: 0.45 }),
    good: () => playSfx('select', { rate: 1.18, volume: 0.55 }),
    bad: () => playSfx('click', { rate: 0.72, volume: 0.55 }),
    error: () => playSfx('click', { rate: 0.6, volume: 0.5 }),
    chime: () => playSfx('chime', { volume: 0.2 }),
    win: () => { stopAmbience(); playSfx('win'); },
    lose: () => { stopAmbience(); playSfx('lose'); },
  };
}
