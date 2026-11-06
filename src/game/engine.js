// The rules of the road. Pure functions over a plain state object so a run can be saved as JSON.
import { GOODS, STOPS, LEGS, ERAS, PACES, RATIONS, PRICE_MULT, GOOD_VOLATILITY, TRAVELER_POOL, GOOD_WEAR } from './data.js';
import { EVENTS, RUMOURS } from './events.js';

export const SAVE_KEY = 'silk-road-trail:save:v1';
export const BEST_KEY = 'silk-road-trail:best:v1';

// ------------------------------------------------------------------ helpers

export function rng(n) { return Math.floor(Math.random() * n); }
export function pick(arr) { return arr[rng(arr.length)]; }
export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function dateOf(state) {
  const d = new Date(Date.UTC(2020, 2, 1));
  d.setUTCDate(d.getUTCDate() + state.day);
  return { month: MONTHS[d.getUTCMonth()], year: state.era.year, dayNum: d.getUTCDate(), monthIndex: d.getUTCMonth() };
}
export function dateLabel(state) {
  const d = dateOf(state);
  return `${d.dayNum} ${d.month} ${state.era.year}`;
}
export function seasonOf(state) {
  const m = dateOf(state).monthIndex;
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 11 || m <= 1) return 'winter';
  return 'spring';
}

export function goodsValueOf(goods) {
  return Object.entries(goods || {}).reduce((sum, [id, qty]) => sum + (GOODS[id] ? GOODS[id].base * qty : 0), 0);
}

export function aliveParty(state) {
  return state.party.filter((p) => p.alive);
}

export function partyHealth(state) {
  const alive = aliveParty(state);
  if (!alive.length) return 0;
  return Math.round(alive.reduce((s, p) => s + p.health, 0) / alive.length);
}
export function partyMorale(state) {
  const alive = aliveParty(state);
  if (!alive.length) return 0;
  return Math.round(alive.reduce((s, p) => s + p.morale, 0) / alive.length);
}

export function caravanSpeed(state) {
  const camels = Math.max(0, state.camels);
  const animalFactor = clamp(0.45 + camels * 0.085, 0.45, 1.3);
  const healthFactor = 0.55 + (partyHealth(state) / 100) * 0.55;
  const moraleFactor = 0.75 + (partyMorale(state) / 100) * 0.35;
  const guide = state.party.some((p) => p.alive && p.id === 'guide') ? 1.12 : 1;
  return animalFactor * healthFactor * moraleFactor * guide;
}

export function legOf(state) {
  return LEGS[state.legIndex] || null;
}
export function nextStop(state) {
  return STOPS[state.legIndex + 1] || null;
}
export function currentStop(state) {
  return STOPS[state.legIndex] || null;
}

// Daily consumption before modifiers.
export function dailyUse(state) {
  const mouths = aliveParty(state).length;
  const animals = Math.max(1, state.camels);
  const cook = state.party.some((p) => p.alive && p.id === 'cook') ? 0.85 : 1;
  const ration = RATIONS[state.rations] || RATIONS.normal;
  const pace = PACES[state.pace] || PACES.steady;
  const terrain = legOf(state) ? legOf(state).terrain : 'city';
  const leg = legOf(state);
  const waterMul = leg ? (terrainWaterMul(terrain) * seasonWaterMul(state)) : 1;
  return {
    food: Math.max(1, Math.round(mouths * 0.7 * ration.foodMul * pace.foodMul * cook)),
    water: Math.max(1, Math.round(mouths * 0.5 * waterMul * (state.pace === 'hard' ? 1.2 : 1))),
    fodder: Math.max(1, Math.round(animals * 0.4 * (state.pace === 'hard' ? 1.2 : 1))),
  };
}

function terrainWaterMul(terrain) {
  return { oasis: 1, steppe: 0.9, desert: 1.9, mountains: 1.05, river: 0.85, city: 0.8 }[terrain] || 1;
}
function seasonWaterMul(state) {
  const s = seasonOf(state);
  return s === 'summer' ? 1.35 : s === 'winter' ? 0.85 : 1;
}

// ------------------------------------------------------------------ run creation

export function createRun({ caravanName, eraId, startGood, camels, food, water, fodder, medicine, rope, goods, party }) {
  const era = ERAS.find((e) => e.id === eraId) || ERAS[0];
  return {
    v: 1,
    caravanName: caravanName.trim() || 'The Golden Bell',
    era,
    eraId: era.id,
    day: 0,
    legIndex: 0,
    legProgress: 0,
    legDays: 0,
    pace: 'steady',
    rations: 'normal',
    coin: 0,
    camels,
    food,
    water,
    fodder,
    medicine,
    rope,
    goods: { ...goods },
    party: party.map((p) => ({ ...p, health: 100, morale: 72, alive: true })),
    log: [],
    rumours: [],
    screen: 'map',
    event: null,
    pendingEvent: null,
    eventCooldown: 2,
    usedEvents: [],
    flags: {},
    startGood,
    deaths: 0,
    reachedVenice: false,
    finished: false,
    outcome: null,
    weather: 'clear',
    prices: makePrices(),
    tick: 0,
  };
}

// Per-run price wobble, so two journeys are never identical.
export function makePrices() {
  const prices = {};
  for (const stop of STOPS) {
    prices[stop.id] = {};
    for (const id of Object.keys(GOODS)) {
      const base = PRICE_MULT[stop.id][id];
      const vol = GOOD_VOLATILITY[id];
      const wobble = 1 + (Math.random() * 2 - 1) * vol;
      prices[stop.id][id] = Math.max(0.25, +(base * wobble).toFixed(3));
    }
  }
  return prices;
}

export function priceAt(state, stopId, goodId) {
  const mult = state.prices?.[stopId]?.[goodId] ?? PRICE_MULT[stopId][goodId];
  const merchant = state.party.some((p) => p.alive && p.id === 'merchant');
  return Math.max(1, Math.round(GOODS[goodId].base * mult * (merchant ? 0.92 : 1)));
}
export function sellAt(state, stopId, goodId) {
  const mult = state.prices?.[stopId]?.[goodId] ?? PRICE_MULT[stopId][goodId];
  const merchant = state.party.some((p) => p.alive && p.id === 'merchant');
  return Math.max(1, Math.round(GOODS[goodId].base * mult * (merchant ? 1.08 : 1) * 0.95));
}

// ------------------------------------------------------------------ party

export function makeParty(ids, names = {}) {
  return ids.map((id) => {
    const t = TRAVELER_POOL.find((p) => p.id === id);
    const custom = (names[id] || '').trim();
    return { ...t, name: custom || t.name };
  });
}

// Apply a health/morale change to the party, weighted so a random member suffers.
function changeHealth(state, delta, reason) {
  const alive = aliveParty(state);
  if (!alive.length) return;
  if (delta >= 0) {
    alive.forEach((p) => { p.health = clamp(p.health + delta, 0, 100); });
    return;
  }
  // Bad luck spreads across the caravan: one or two travellers take the blow, chosen by
  // chance, so no single person soaks every hardship the road throws at you.
  const sorted = [...alive].sort((a, b) => a.health - b.health);
  const target = Math.random() < 0.3 ? sorted[0] : pick(sorted);
  const spread = alive.length > 1 && Math.random() < 0.4 ? Math.round(delta * 0.35) : 0;
  target.health = clamp(target.health + delta - spread, 0, 100);
  if (spread) alive.filter((p) => p !== target).forEach((p) => { p.health = clamp(p.health + spread, 0, 100); });
  if (target.health <= 0) {
    target.alive = false;
    target.health = 0;
    target.deathNote = reason ? `died of ${reason}` : 'died on the road';
    state.deaths += 1;
    state.log.push({ day: state.day, kind: 'death', text: `${target.name} the ${target.role.toLowerCase()} has died${reason ? ` of ${reason}` : ''}. The caravan buries them beside the road and carries on.` });
  }
}
function changeMorale(state, delta) {
  aliveParty(state).forEach((p) => { p.morale = clamp(p.morale + delta, 0, 100); });
}

// The effects helper handed to event resolvers.
export function effects(state) {
  // `state.goodsValue` is kept in step with the packs so event text can price the load.
  const syncValue = () => { state.goodsValue = goodsValueOf(state.goods); };
  syncValue();
  const h = {
    // Time spent on an event: the calendar moves, the caravan does not. (A delay is a cost.)
    days: (n) => { state.day += n; state.legDays += n; },
    coin: (n) => { state.coin = Math.max(0, Math.round(state.coin + n)); },
    food: (n) => { state.food = Math.max(0, state.food + n); },
    water: (n) => { state.water = Math.max(0, state.water + n); },
    fodder: (n) => { state.fodder = Math.max(0, state.fodder + n); },
    medicine: (n) => { state.medicine = Math.max(0, state.medicine + n); },
    rope: (n) => { state.rope = Math.max(0, state.rope + n); },
    camels: (n, why) => {
      const before = state.camels;
      state.camels = Math.max(0, state.camels + n);
      if (n < 0 && state.camels < before) state.log.push({ day: state.day, kind: 'bad', text: `One camel ${why || 'is lost'} (${state.camels} left).` });
    },
    hurt: (amount, reason) => {
      changeHealth(state, -Math.abs(amount), reason);
      const hurt = state.party.filter((p) => p.alive).sort((a, b) => a.health - b.health)[0];
      if (hurt) state.log.push({ day: state.day, kind: 'bad', text: `${hurt.name} is hurt${reason ? `: ${reason}` : ''}.` });
    },
    heal: (amount) => {
      aliveParty(state).forEach((p) => { p.health = clamp(p.health + amount, 0, 100); });
    },
    morale: (delta) => {
      changeMorale(state, delta);
      if (delta <= -4) state.log.push({ day: state.day, kind: 'bad', text: 'The caravan is out of spirits.' });
      if (delta >= 5) state.log.push({ day: state.day, kind: 'good', text: 'The caravan is in good heart.' });
    },
    health: (delta) => changeHealth(state, delta),
    goods: (id, n) => { if (GOODS[id]) state.goods[id] = Math.max(0, (state.goods[id] || 0) + n); syncValue(); },
    loseGoods: (n) => {
      for (let i = 0; i < n; i++) {
        const ids = Object.keys(state.goods).filter((g) => state.goods[g] > 0);
        if (!ids.length) break;
        const g = pick(ids);
        state.goods[g] -= 1;
        state.log.push({ day: state.day, kind: 'bad', text: `A ${GOODS[g].unit} of ${GOODS[g].name.toLowerCase()} is lost.` });
      }
    },
    sellAll: (mult) => {
      Object.keys(state.goods).forEach((g) => {
        const qty = state.goods[g];
        if (qty > 0 && GOODS[g]) state.coin += Math.round(GOODS[g].base * qty * mult);
        state.goods[g] = 0;
      });
      syncValue();
    },
    swapGoods: (goodName, bonus) => {
      const id = Object.keys(GOODS).find((k) => GOODS[k].name.toLowerCase() === String(goodName).toLowerCase());
      if (!id || !state.goods[id]) return 0;
      const stop = currentStop(state) || STOPS[0];
      const unit = Math.round(sellAt(state, stop.id, id) * (1 + bonus));
      const qty = state.goods[id];
      state.coin += unit * qty;
      state.goods[id] = 0;
      syncValue();
      return unit * qty;
    },
    randomGoodInStock: () => {
      const ids = Object.keys(GOODS).filter((g) => state.goods[g] > 0);
      return ids.length ? pick(ids) : null;
    },
    randomGoodNotInStock: () => {
      const ids = Object.keys(GOODS).filter((g) => !state.goods[g]);
      return ids.length ? pick(ids) : null;
    },
    priceOf: (goodName) => {
      const id = Object.keys(GOODS).find((k) => GOODS[k].name.toLowerCase() === String(goodName).toLowerCase());
      const stop = currentStop(state) || STOPS[0];
      return id ? priceAt(state, stop.id, id) : 10;
    },
    rumour: () => {
      const r = pick(RUMOURS);
      state.rumours = [...(state.rumours || []).slice(-8), r];
      state.log.push({ day: state.day, kind: 'rumour', text: `A rumour: ${r}` });
    },
  };
  return h;
}

// ------------------------------------------------------------------ events

export function rollEvent(state, { town = false } = {}) {
  const leg = legOf(state);
  const terrain = leg ? leg.terrain : 'city';
  const era = state.era.effects;
  const candidates = EVENTS.filter((ev) => {
    if (state.usedEvents.includes(ev.id) && Math.random() < 0.75) return false;
    const eraOk = ev.eras === 'any' || ev.eras.includes(state.eraId);
    if (!eraOk) return false;
    if (town) return ev.tags.includes('city') || ev.tags.includes('oasis') || ev.tags.includes('river');
    return ev.tags.includes(terrain) || ev.tags.includes('steppe') && terrain === 'oasis';
  });
  if (!candidates.length) return null;
  // Weight hazards by era: bandits rarer under the Mongols, plague rarer in 1271.
  const weighted = [];
  candidates.forEach((ev) => {
    let w = ev.weight;
    if (ev.id === 'bandits') w *= era.banditMul;
    if (ev.id === 'mongol-toll' || ev.id === 'paiza-check') w *= era.mongolMul;
    if (ev.id === 'plague') w *= era.plagueMul;
    if (ev.id === 'timur-army') w *= era.warMul;
    for (let i = 0; i < Math.max(1, Math.round(w)); i++) weighted.push(ev);
  });
  const ev = pick(weighted);
  if (!ev) return null;
  state.usedEvents = [...state.usedEvents, ev.id];
  return ev;
}

export function eventChance(state) {
  const base = 0.3;
  const pace = state.pace === 'hard' ? 0.06 : state.pace === 'rest' ? -0.05 : 0;
  return clamp(base + pace, 0.1, 0.55);
}

export function chooseEventOption(state, index) {
  const ev = state.event;
  if (!ev) return;
  let choice = ev.choices[index];
  if (choice && choice.requires && !choice.requires(state)) return;
  // Safety net: if every choice is blocked, the caravan simply moves on.
  if (!choice) choice = ev.choices.find((c) => !c.requires);
  if (!choice) {
    state.event = null;
    state.eventCooldown = 2;
    state.log.push({ day: state.day, kind: 'info', text: 'There is nothing to be done. The caravan moves on.' });
    return;
  }
  const h = effects(state);
  const lines = choice.resolve(state, h) || [];
  lines.forEach((text) => state.log.push({ day: state.day, kind: 'event', text }));
  state.event = null;
  state.eventCooldown = 2;
  checkRunEnd(state);
}

// ------------------------------------------------------------------ travel

const WEATHERS = {
  clear: { name: 'Clear', icon: 'sun' },
  dust: { name: 'Dust haze', icon: 'dust' },
  rain: { name: 'Rain', icon: 'rain' },
  snow: { name: 'Snow', icon: 'snow' },
  heat: { name: 'Great heat', icon: 'heat' },
};

export function weatherName(id) { return (WEATHERS[id] || WEATHERS.clear).name; }

function rollWeather(state) {
  const leg = legOf(state);
  if (!leg) return 'clear';
  const season = seasonOf(state);
  const r = Math.random();
  if (leg.terrain === 'desert') {
    if (season === 'summer' && r < 0.45) return 'heat';
    if (r < 0.28) return 'dust';
    return 'clear';
  }
  if (leg.terrain === 'mountains') {
    if (season === 'winter' && r < 0.5) return 'snow';
    if (r < 0.3) return 'rain';
    return 'clear';
  }
  if (leg.terrain === 'river' && season === 'spring' && r < 0.4) return 'rain';
  if (r < 0.2) return 'rain';
  if (r < 0.32) return 'dust';
  return 'clear';
}

// Advance exactly one day on the road. Returns the log lines produced.
export function advanceDay(state) {
  const leg = legOf(state);
  if (!leg) return [];
  if (state.finished || state.event) return [];
  const lines = [];
  const push = (text, kind = 'info') => {
    const entry = { day: state.day, kind, text };
    state.log.push(entry);
    lines.push(entry);
  };

  state.day += 1;
  state.legDays += 1;

  // Rest day: no progress, recovery instead.
  if (state.pace === 'rest') {
    const use = dailyUse(state);
    state.food = Math.max(0, state.food - Math.round(use.food * 0.9));
    state.water = Math.max(0, state.water - Math.round(use.water * 0.9));
    state.fodder = Math.max(0, state.fodder - use.fodder);
    changeMorale(state, 6);
    aliveParty(state).forEach((p) => { p.health = clamp(p.health + 5, 0, 100); });
    push('You make camp and rest. The animals graze, the cook makes something that is not gruel, and people mend what is broken.', 'good');
    checkRunEnd(state);
    return lines;
  }

  // Weather for the day.
  state.weather = rollWeather(state);
  const season = seasonOf(state);
  const use = dailyUse(state);
  let speed = caravanSpeed(state) * (1 / 1.0);
  const terrainMul = { oasis: 1, steppe: 1.15, desert: 0.8, mountains: 0.6, river: 1.05, city: 1.2 }[leg.terrain] || 1;
  speed *= terrainMul;
  if (state.weather === 'heat') speed *= 0.85;
  if (state.weather === 'snow') speed *= 0.8;
  if (state.weather === 'rain') speed *= 0.9;
  if (state.weather === 'dust') speed *= 0.92;

  // Stores.
  state.food = Math.max(0, state.food - use.food);
  state.water = Math.max(0, state.water - use.water);
  state.fodder = Math.max(0, state.fodder - use.fodder);

  const pace = PACES[state.pace];
  changeMorale(state, pace.morale + (RATIONS[state.rations] || RATIONS.normal).morale);
  aliveParty(state).forEach((p) => { p.health = clamp(p.health + pace.health + (RATIONS[state.rations] || RATIONS.normal).health, 0, 100); });

  if (state.weather === 'heat') push('The sun is a hammer all day. The camels walk with their heads low and the water goes fast.', 'bad');
  if (state.weather === 'snow') push('Snow on the road and a wind off the peaks. Everyone walks to keep warm.', 'bad');

  // Hardship: no water or no food.
  if (state.water <= 0) {
    changeHealth(state, -8);
    changeMorale(state, -7);
    push('There is no water left. Tongues swell, the camels stagger, and the party begins to break.', 'bad');
  }
  if (state.food <= 0) {
    changeHealth(state, -6);
    changeMorale(state, -6);
    push('The food is gone. People chew on leather straps and say nothing.', 'bad');
  }
  if (state.fodder <= 0 && state.camels > 0) {
    if (Math.random() < 0.3) {
      state.camels -= 1;
      push('With no fodder, a camel goes down in the road and does not get up.', 'bad');
    } else {
      changeMorale(state, -2);
    }
  }

  // Fatigue: hard pace and low morale erode health, a little at a time.
  if (state.pace === 'hard' && Math.random() < 0.25) changeHealth(state, -2);
  if (partyMorale(state) < 25 && Math.random() < 0.25) {
    push('The party is close to mutiny. People argue about nothing.', 'bad');
    changeHealth(state, -2);
  }

  // A traveller at the end of their strength either gets medicine or does not survive the night.
  aliveParty(state).filter((p) => p.health <= 0).forEach((p) => {
    if (state.medicine > 0) {
      state.medicine -= 1;
      p.health = 22;
      push(`There is no pulse to speak of in ${p.name}. You spend a dose of medicine and the night praying, and by morning the fever has turned.`, 'good');
    } else {
      p.alive = false;
      p.deathNote = state.water <= 0 ? 'died of thirst' : state.food <= 0 ? 'starved on the road' : 'died of exhaustion';
      state.deaths = (state.deaths || 0) + 1;
      push(`${p.name} the ${p.role.toLowerCase()} died in the night. The caravan buries them beside the road and carries on.`, 'death');
    }
  });

  // Progress in li.
  const need = leg.days;
  const liPerDay = 100 / need;
  state.legProgress = Math.min(100, state.legProgress + liPerDay * speed);
  state.liPerDay = Math.round(liPerDay * speed);

  // Random event.
  state.eventCooldown = Math.max(0, state.eventCooldown - 1);
  if (state.eventCooldown === 0 && state.legProgress < 100 && Math.random() < eventChance(state)) {
    const ev = rollEvent(state);
    if (ev) state.event = ev;
  }

  // Wear and loss on the road: carried goods are not safe until they are sold.
  Object.keys(state.goods).forEach((g) => {
    if (state.goods[g] > 0 && GOODS[g] && Math.random() < GOOD_WEAR) {
      state.goods[g] -= 1;
      push(`A ${GOODS[g].unit} of ${GOODS[g].name.toLowerCase()} does not survive the day's road.`, 'bad');
    }
  });

  // A quiet day still goes in the diary, so the log always reads like a journey.
  if (lines.length === 0) {
    const quiet = [
      `A day of dust and a dry wind. The caravan makes ${state.liPerDay} li and camps at a well with no water in it.`,
      `The road runs flat and empty. ${state.liPerDay} li on, and the camels walk in their own rhythm.`,
      `Camels, creaking harness, the odd song. ${state.liPerDay} li, ${state.weather === 'clear' ? 'clear sky' : 'grey sky'} above, and camp made before dark.`,
      `A day of small things: a lost strap, a mended sandal, ${state.liPerDay} li of road behind you.`,
      `You pass a cairn of stones and every traveller adds one. ${state.liPerDay} li, and the next well by evening.`,
    ];
    push(pick(quiet), 'info');
  }

  checkRunEnd(state);
  return lines;
}

// Reaching a stop.
export function arriveAtStop(state) {
  if (state.screen === 'town') return; // already there
  state.legProgress = 0;
  state.legDays = 0;
  state.legIndex += 1;
  state.screen = 'town';
  state.event = null;
  const stop = currentStop(state);
  if (stop) {
    state.log.push({ day: state.day, kind: 'good', text: `The caravan reaches ${stop.name}. ${stop.line}` });
  }
  if (state.legIndex >= STOPS.length - 1) {
    state.reachedVenice = true;
    state.finished = true;
    state.outcome = 'victory';
    state.screen = 'end';
  }
}

// ------------------------------------------------------------------ win / lose

export function scoreOf(state) {
  const alive = aliveParty(state);
  const goodsVal = goodsValueOf(state.goods);
  const health = alive.reduce((s, p) => s + p.health, 0);
  const morale = alive.reduce((s, p) => s + p.morale, 0);
  const survivors = alive.length * 120;
  const total = state.coin + goodsVal + health * 3 + morale * 2 + survivors;
  return { coin: state.coin, goodsVal, health, morale, survivors, total: Math.round(total), alive: alive.length };
}

export function profitOf(state) {
  return state.coin + goodsValueOf(state.goods) - (state.startCapital || 0);
}

export function checkRunEnd(state) {
  if (state.finished) return;
  const alive = aliveParty(state);
  if (!alive.length) {
    state.finished = true;
    state.outcome = 'defeat';
    state.defeatReason = 'The last of the caravan has died on the road.';
    state.screen = 'end';
    return;
  }
  const stranded = state.food <= 0 && state.water <= 0 && state.coin < 4 && goodsValueOf(state.goods) === 0;
  if (stranded) {
    state.finished = true;
    state.outcome = 'defeat';
    state.defeatReason = 'No food, no water, no coin and nothing left to sell. The caravan cannot go on.';
    state.screen = 'end';
  }
}

// ------------------------------------------------------------------ town actions

export function buyGood(state, goodId, qty = 1) {
  const stop = currentStop(state);
  const price = priceAt(state, stop.id, goodId) * qty;
  if (state.coin < price) return false;
  state.coin -= price;
  state.goods[goodId] = (state.goods[goodId] || 0) + qty;
  return true;
}
export function sellGood(state, goodId, qty = 1) {
  if ((state.goods[goodId] || 0) < qty) return false;
  const stop = currentStop(state);
  const price = sellAt(state, stop.id, goodId) * qty;
  state.goods[goodId] -= qty;
  state.coin += price;
  return true;
}
export function buySupply(state, key, qty = 1) {
  const price = supplyPrice(state, key) * Math.abs(qty);
  if (qty < 0 && key !== 'camel' && state[key] + qty < 0) return false;
  if (qty > 0 && !(state.coin >= price)) return false;
  state.coin = Math.max(0, state.coin - price);
  if (key === 'camel') state.camels = Math.max(0, state.camels + qty);
  else state[key] = Math.max(0, state[key] + qty);
  return true;
}
// The merchant's haggling cuts a fifth off every purchase.
function merchantIn(state) {
  return state.party.some((p) => p.alive && p.id === 'merchant');
}

export function supplyPrice(state, key) {
  const base = { food: 2, water: 1, fodder: 1, medicine: 6, rope: 3, camel: 30 }[key] || 1;
  const stop = currentStop(state);
  const dear = stop && ['kashgar', 'merv', 'constantinople'].includes(stop.id) ? 1.25 : 1;
  return Math.max(1, Math.round(base * dear * (merchantIn(state) ? 0.8 : 1)));
}

export function restInTown(state, kind) {
  if (kind === 'night') {
    if (state.coin < 6) return false;
    state.coin -= 6;
    state.day += 1;
    aliveParty(state).forEach((p) => { p.health = clamp(p.health + 18, 0, 100); p.morale = clamp(p.morale + 10, 0, 100); });
    state.food = Math.max(0, state.food - aliveParty(state).length);
    return true;
  }
  if (kind === 'heal') {
    if (state.medicine < 1) return false;
    state.medicine -= 1;
    const physician = state.party.some((p) => p.alive && p.id === 'physician');
    aliveParty(state).forEach((p) => { p.health = clamp(p.health + (physician ? 45 : 26), 0, 100); });
    return true;
  }
  return false;
}

export function saveRun(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) { /* storage full or blocked: play on */ }
}
export function loadRun() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || s.v !== 1) return null;
    return s;
  } catch (e) { return null; }
}
export function clearRun() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
}
export function bestScore() {
  try { return JSON.parse(localStorage.getItem(BEST_KEY) || 'null'); } catch (e) { return null; }
}
export function saveBest(state, score) {
  const prev = bestScore();
  const entry = { total: score.total, caravan: state.caravanName, year: state.era.year, day: state.day, alive: score.alive };
  if (!prev || entry.total > prev.total) {
    try { localStorage.setItem(BEST_KEY, JSON.stringify(entry)); } catch (e) {}
    return true;
  }
  return false;
}
