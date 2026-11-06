# Web app starter (React 18 + Tailwind 4 + Vite)

A designed baseline for websites and web apps. The example product is "Harbor", class booking for
small studios: replace its name, copy and data, keep the system. Run: `npm install`, then `npm run dev`
(port from $PORT, default 5173). `npm run build` writes `dist/`.

Design direction: warm editorial. Instrument Serif for display headings (italic for one accent
phrase), Instrument Sans for everything else, one clay accent hue on warm neutrals, light + dark.

## Files
- `index.html`: title, meta description, favicon, pre-paint theme script.
- `src/main.jsx`: mounts App. `src/App.jsx`: route table, skip link, Nav/Footer frame.
- `src/site.js`: product name, tagline, nav and footer links.
- `src/lib/router.jsx`: tiny history router: `<Link href="/x">`, `useRouter()` gives `{ path, navigate }`.
- `src/lib/theme.js`: `useTheme()` (system / light / dark on `<html data-theme>`).
- `src/lib/store.js`: example data hook `useClasses()` (localStorage + fake delay). Replace with fetch().
- `src/styles/tokens.css`: ALL colours (light + dark) and @font-face. `src/styles/app.css`: Tailwind theme mapping, type scale, radii, base styles.
- `src/components/ui/`: primitives, import from `components/ui/index.js`.
- `src/components/`: Nav (desktop links + mobile menu), Footer, Logo, ThemeToggle.
- `src/pages/`: Home (landing), Classes (app page: list, filters, form), NotFound.
- `src/assets/fonts/`: vendored woff2 files (OFL).

## Tokens (use these classes, nothing else)
The stock Tailwind palette, fonts, radii and text sizes are switched OFF in app.css, so `bg-blue-500`
or `rounded-2xl` silently do nothing. Use:
- Colours: `bg`, `surface` (cards/inputs), `surface-2` (subtle fills), `line`, `line-strong`, `ink`
  (text), `ink-2` (secondary), `ink-3` (hints), `accent`, `accent-hover`, `accent-ink` (text on
  accent), `accent-soft`, and `ok|warn|danger` + `-soft`. e.g. `bg-surface text-ink-2 border-line`.
- Type: `font-display` (serif headings) / `font-sans`; sizes `text-xs sm base lg xl 2xl 3xl 4xl 5xl`.
  Page title `font-display text-3xl sm:text-4xl`; hero `text-4xl sm:text-5xl`; card title `text-lg font-medium`.
- Weights: only `font-normal` and `font-medium` (two per screen).
- Radius: `rounded-sm` (4) `rounded-md` (8, controls) `rounded-lg` (12, cards) `rounded-full` (badges).
- Shadow: `shadow-card` only, on Card. Spacing: Tailwind's default 4px scale.
- Light/dark: never write `dark:` classes; tokens swap. A new colour = add the var to BOTH theme
  blocks in tokens.css (there are two dark blocks: system and pinned) and map it in app.css `@theme inline`.
- Rebrand: change `--accent*` values (keep AA contrast: accent text on bg >= 4.5:1) and the fonts.

## Components (`components/ui`)
- `<Button variant="primary|secondary|ghost|danger" size="md|sm" href?>`: `href` makes it a link.
  Don't pass display utilities (`hidden`, `flex`) in className, they clash with its `inline-flex`: wrap it.
- `<Input label hint? error? ...inputProps>`, `<Select label ...>`: label, hint and error wired with ids/aria.
- `<Card as?>`, `<Badge tone="neutral|accent|ok|warn|danger">`, `<Skeleton className="h-4 w-1/2">`.
- `<Container>` (max width + gutters), `<Section tone="tint"? id?>` (page band), `<Eyebrow>` (label over a heading).
- `cx(...)` joins class names.

## Common changes
- New page: `src/pages/Pricing.jsx` returning `<Section>`s, add `'/pricing': Pricing` in App.jsx routes,
  add it to `site.nav`. Routes are one level deep (`/pricing`, not `/a/b`) because `base: './'`
  makes asset paths relative; for deeper routes set `base: '/'` in vite.config.js.
- Landing sections: alternate plain and `tone="tint"` Sections; use the label-left / content-right
  grid (`grid grid-cols-1 lg:grid-cols-[1fr_2fr]`) instead of rows of identical feature cards.
- Forms: copy NewClassForm in Classes.jsx: `noValidate`, a `validate()` returning field messages,
  errors shown under fields, focus the first invalid field, a disabled "Saving…" button.
- Lists: always handle loading (Skeleton rows), empty (icon + one sentence + action), no-results
  (clear filters) and the filled state, as Classes.jsx does.
- Real backend: replace `useClasses` internals with fetch(); keep the same `{ items, loading }` shape.

## Keep the quality
- No gradients, glass, glow shadows, emoji icons or em dashes. Icons are inline SVG, stroke 1.5, currentColor.
- Real, specific copy; never lorem or "Empower your workflow".
- Every interactive element: hover, visible focus (global :focus-visible), disabled; touch targets 44px.
- Phone first: check 360px wide, no horizontal scroll (`grid-cols-1` on grids, `min-w-0` on flex text).
- Motion 150-200ms on things the user touches; reduced motion is respected globally.

# Silk Road Trail (React 18 + Tailwind 4 + Vite)

A caravan survival/trading game on the Silk Roads, 1200-1450. Chang'an to Venice in 8 legs, 9 towns.
Run: `npm run dev -- --host 0.0.0.0 --port 5173` (use preview_app). `npm run build` for production.

## Design direction
Warm parchment + deep indigo + gold. Cormorant Garamond (`font-display`) + Alegreya Sans (body).
Paper grain and ornamental frames live in `src/styles/app.css` (`.frame`, `.smallcaps`,
`.bar-track/.bar-fill`, `.pop-in`, `.fade-up`). All colours are tokens in `src/styles/tokens.css`;
stock Tailwind colours are switched off, so never use `bg-blue-500`-style classes.

## Files
- `src/game/data.js`: GOODS, SUPPLIES, TERRAIN, STOPS (map x/y in a 0..100 box), LEGS (days per leg),
  PACES, RATIONS, ERAS (1271 pax / 1347 plague / 1399 Timur), PRICE_MULT per town, GOOD_WEAR,
  TRAVELER_POOL (8 named travellers with perks).
- `src/game/events.js`: 37 EVENTS (each `tags`, `eras`, `weight`, 2-3 choices with `resolve(state, h)`),
  RUMOURS, TOWN_WHISPERS. `h` is the effects helper from engine.js; return an array of log lines.
- `src/game/engine.js`: pure functions over a plain JSON state. createRun, advanceDay (mutates a
  clone), arriveAtStop, rollEvent/chooseEventOption, buyGood/sellGood/buySupply/supplyPrice,
  scoreOf/checkRunEnd, save/load in localStorage (`silk-road-trail:save:v1`).
- `src/screens/`: Title (+ HowToPlay, EndScreen), Setup (4 steps), Game (map + travel), Town, EventModal.
- `src/components/`: art.jsx (hand-drawn SVGs + Icon), RouteMap.jsx, parts.jsx (Panel, StatBar, Btn),
  Drawer.jsx (party / packs). `src/lib/sound.js` plays recorded CC0 audio from `public/audio`.
- `scripts/sim.mjs`: balance harness: `node scripts/sim.mjs 40` (skilled) or `... 40 casual`.

## Interface (revamped)
- One shared bar, `GameBar` + `BarBtn` in `src/components/parts.jsx`, on travel and town: caravan name, year,
  date, coin, then icon buttons (Party, Cargo, Almanac, Sound, How to, Leave). 44px on phones. Do not add
  floating buttons in App.jsx; there are none, deliberately.
- `Segmented` is the control for any exclusive choice (pace, rations, town tabs).
- Travel screen: map is the hero (left, full column), the leg card sits under it, and the right column is
  "Days pass" (pace, rations, the four travel buttons) above "The road log" (log, health/morale, six supplies).
- Town: header is name + colour + "Take the road west"; the suq holds prices, the right column holds the road
  ahead, the history panel and the caravan's health/supplies. Do not repeat coin or dates in panels.
- Setup step 4 is a hiring pool on the left (toggle rows) and "Your caravan" on the right, where only the
  chosen get a name field. `Fact` in Town.jsx is still used by "The road ahead"; keep it.

## Rules to keep true
- Never mutate state inside a `setState` updater (StrictMode runs it twice): clone first, then setState.
- Arriving at a town sets `state.screen='town'`; App.jsx watches that and switches screens.
- Event `h.days(n)` advances the calendar, not the caravan. Do not add legProgress there.
- Damage spreads across the party (changeHealth); a traveller at 0 health is saved by medicine or dies
  in advanceDay's "hanging on" beat.
- If you retune the economy, run the sim: target ~45-60% wins for the casual policy.

## Balance as tuned
START_COIN 460. Provisions: food 2 / water 1 / fodder 1 / medicine 6 / rope 3 / camel 30 (merchant -20%).
Daily use ~0.7 food and 0.5 water per person (x1.9 desert, x1.35 summer), 0.4 fodder per animal.
Legs 4-8 days at steady pace.

«3574 chars — already sent»
