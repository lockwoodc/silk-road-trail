// Balance harness: plays the engine headlessly with a competent-but-not-optimal policy.
// Run: node scripts/sim.mjs [runs]
import {
  createRun, makeParty, makePrices, advanceDay, arriveAtStop, legOf, currentStop, nextStop,
  buyGood, sellGood, buySupply, supplyPrice, restInTown, aliveParty, goodsValueOf, scoreOf,
  priceAt, sellAt, dailyUse, chooseEventOption, checkRunEnd,
} from '../src/game/engine.js';
import { GOODS, ERAS, STOPS } from '../src/game/data.js';

const RUNS = Number(process.argv[2] || 200);
const CASUAL = process.argv[3] === 'casual';

function buildRun(eraId) {
  const party = makeParty(['merchant', 'guide', 'driver', 'cook']);
  const state = createRun({
    caravanName: 'The Golden Bell', eraId, startGood: 'silk',
    camels: 5, food: 40, water: 30, fodder: 24, medicine: 3, rope: 2,
    goods: { silk: 8, spices: 2, porcelain: 1, paper: 3 }, party,
  });
  state.coin = 200;
  state.startCapital = 560;
  state.startGoods = { ...state.goods };
  state.screen = 'travel';
  return state;
}

// Buy enough to cross the next leg comfortably, then invest spare coin in the best margin good.
function shop(state) {
  const leg = legOf(state);
  if (!leg) return;
  const use = dailyUse(state);
  const days = Math.ceil((leg.days / 1.2) * (CASUAL ? 1.15 : 1.5));
  const target = { food: days * use.food + 8, water: days * use.water + 8, fodder: days * use.fodder + 8 };
  const stop = currentStop(state);
  const nextStopId = nextStop(state) ? nextStop(state).id : stop.id;
  const holdValue = (id) => priceAt(state, nextStopId, id);
  const here = (id) => sellAt(state, stop.id, id);
  const provisionCost = (s) => {
    const u = dailyUse(s);
    const t = { food: days * u.food + 8, water: days * u.water + 8, fodder: days * u.fodder + 8 };
    return ['food', 'water', 'fodder'].reduce((sum, k) => sum + Math.max(0, t[k] - s[k]) * supplyPrice(s, k), 0);
  };

  // 1. Sell what this town pays well for, and enough more to fund the next leg's provisions.
  let guard = 160;
  while (guard-- > 0) {
    const cost = provisionCost(state);
    const sellable = Object.keys(GOODS)
      .filter((id) => state.goods[id] > 0 && (here(id) >= holdValue(id) * (CASUAL ? 0.7 : 0.95) || state.coin < cost + 20))
      .sort((a, b) => (here(b) - holdValue(b)) - (here(a) - holdValue(a)));
    if (!sellable.length) break;
    if (!sellGood(state, sellable[0], 1)) break;
  }

  // 2. Provisions for the whole leg, cheapest gap first.
  guard = 900;
  while (guard-- > 0) {
    const needs = Object.keys(target)
      .map((k) => ({ k, gap: target[k] - state[k], price: supplyPrice(state, k) }))
      .filter((n) => n.gap > 0)
      .sort((a, b) => a.price - b.price);
    if (!needs.length) break;
    const n = needs[0];
    if (state.coin < n.price + (CASUAL ? 30 : 8)) break;
    if (!buySupply(state, n.k, 1)) break;
  }
  if (!CASUAL && state.medicine < 2) for (let i = 0; i < 2; i++) if (state.coin > supplyPrice(state, 'medicine') + 15) buySupply(state, 'medicine', 1);
  if (state.camels < 3) for (let i = 0; i < 2; i++) if (state.coin > supplyPrice(state, 'camel') + 40) buySupply(state, 'camel', 1);

  // 3. Invest what is left in the best onward margin.
  const ranked = Object.keys(GOODS)
    .map((id) => ({ id, margin: holdValue(id) - priceAt(state, stop.id, id) }))
    .filter((g) => g.margin > 2)
    .sort((a, b) => b.margin - a.margin);
  let inv = 60;
  while (state.coin > (CASUAL ? 120 : 60) && ranked.length && inv-- > 0) {
    if (!buyGood(state, ranked[0].id, 1)) break;
  }
  if (aliveParty(state).some((p) => p.health < 45) && state.coin > 40) restInTown(state, 'night');
  if (process.env.TRACE) console.log('SHOP', stop.name, 'd'+state.day, 'coin', state.coin, 'stores', state.food+'/'+state.water+'/'+state.fodder, 'target', target.food+'/'+target.water+'/'+target.fodder, 'goods', JSON.stringify(state.goods));
}

function autoChoose(state) {
  const ev = state.event;
  if (!ev) return;
  let best = 0;
  let bestScore = -Infinity;
  ev.choices.forEach((c, i) => {
    if (c.requires && !c.requires(state)) return;
    const clone = JSON.parse(JSON.stringify(state));
    const before = scoreOf(clone).total;
    try { chooseEventOption(clone, i); } catch (e) { return; }
    if (clone.event) return; // blocked choice
    const delta = scoreOf(clone).total - before;
    const risk = clone.finished ? -1e6 : 0;
    const val = delta + risk;
    if (val > bestScore) { bestScore = val; best = i; }
  });
  chooseEventOption(state, best);
}

function playOnce(eraId) {
  const s = buildRun(eraId);
  let guard = 2500;
  let loops = 0;
  while (!s.finished && guard-- > 0) {
    loops++;
    if (s.event) { const before = s.event.id; autoChoose(s); if (s.event && s.event.id === before) { if (process.env.TRACE) console.log('BLOCKED event', before, JSON.stringify(s.event.choices.map(c=>!!c.requires))); s.event = null; } continue; }
    if (s.finished) break;
    if (s.screen === 'town') { shop(s); s.screen = 'travel'; continue; }
    if (s.legProgress >= 100) { arriveAtStop(s); continue; }
    // Pace: hard in the mountains/desert only if healthy, rest when low.
    const health = aliveParty(s).reduce((a, p) => a + p.health, 0) / Math.max(1, aliveParty(s).length);
    s.pace = health < (CASUAL ? 40 : 55) && s.pace !== 'rest' && s.day % 4 === 0 ? 'rest' : health > 75 && s.day % (CASUAL ? 2 : 3) === 0 ? 'hard' : 'steady';
    s.rations = health < 50 ? 'generous' : s.food < 8 ? 'meagre' : 'normal';
    advanceDay(s);
    if (s.legProgress >= 100) arriveAtStop(s);
  }
  if (!s.finished) { if (process.env.TRACE) console.log('stalled at', {day:s.day, leg:s.legIndex, prog:s.legProgress, screen:s.screen, event:!!s.event, loops, guard}); return { outcome: 'stalled' }; }
  if (process.env.TRACE) { const deaths = s.log.filter(l=>l.kind==='death').map(l=>'d'+l.day+' '+l.text.slice(0,60)); console.log('DEATHS', deaths.slice(0,6)); console.log('LAST', s.log.slice(-12).map(l=>'d'+l.day+' '+l.kind+' '+l.text.slice(0,70))); }
  return {
    outcome: s.outcome,
    reason: s.defeatReason,
    alive: aliveParty(s).length,
    day: s.day,
    score: scoreOf(s).total,
    coin: s.coin,
  };
}

for (const era of ERAS) {
  const results = [];
  for (let i = 0; i < RUNS; i++) results.push(playOnce(era.id));
  const wins = results.filter((r) => r.outcome === 'victory').length;
  const stalls = results.filter((r) => r.outcome === 'stalled').length;
  const defeats = results.filter((r) => r.outcome === 'defeat');
  const reasons = {};
  defeats.forEach((d) => { reasons[d.reason] = (reasons[d.reason] || 0) + 1; });
  const avgDay = Math.round(results.reduce((a, r) => a + (r.day || 0), 0) / results.length);
  const avgAlive = (results.reduce((a, r) => a + (r.alive || 0), 0) / results.length).toFixed(1);
  const avgScore = Math.round(results.reduce((a, r) => a + (r.score || 0), 0) / results.length);
  console.log(`\n${era.name} (${era.year}): ${wins}/${RUNS} wins = ${(100 * wins / RUNS).toFixed(0)}%  stalls=${stalls}`);
  console.log(`  avg days ${avgDay}, avg survivors ${avgAlive}, avg score ${avgScore}`);
  Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 4).forEach(([r, n]) => console.log(`  lose ${n}: ${r}`));
}
