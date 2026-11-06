// The world of Silk Road Trail: nine stops from Chang'an to Venice, the goods traded between
// them, and the eras you can travel in. Distances are in li (roughly half a kilometre).

export const GOODS = {
  silk: { name: 'Silk', unit: 'bolt', base: 22, icon: 'silk', blurb: 'Weightless wealth. Sells dear in the west.' },
  spices: { name: 'Spices', unit: 'sack', base: 14, icon: 'spice', blurb: 'Pepper and cinnamon. Small, light, always wanted.' },
  porcelain: { name: 'Porcelain', unit: 'crate', base: 18, icon: 'vase', blurb: 'Celadon from the kilns. Fragile, worth the care.' },
  paper: { name: 'Paper', unit: 'bale', base: 9, icon: 'paper', blurb: 'Cheap in China, dear in every chancery west.' },
  horses: { name: 'Horses', unit: 'head', base: 30, icon: 'horse', blurb: 'Ferghana stallions. They need fodder, and they bite.' },
  glass: { name: 'Glassware', unit: 'case', base: 20, icon: 'glass', blurb: 'Damascus glass. Sells well in the east, never in Venice.' },
  frankincense: { name: 'Frankincense', unit: 'chest', base: 16, icon: 'incense', blurb: 'Resin from the Hadramawt. Every temple and church wants it.' },
};

export const SUPPLIES = {
  food: { name: 'Food', unit: 'meal', price: 1, blurb: 'Grain, dried fruit, hard cheese. One per mouth per day.' },
  water: { name: 'Water', unit: 'skin', price: 1, blurb: 'A skin holds a day of drinking for the caravan.' },
  fodder: { name: 'Fodder', unit: 'bale', price: 1, blurb: 'Barley and straw. Every animal eats a bale a day.' },
  medicine: { name: 'Medicine', unit: 'dose', price: 6, blurb: 'Cures what the road gives you, if you reach it in time.' },
  rope: { name: 'Rope & parts', unit: 'coil', price: 5, blurb: 'Axles, ropes, patched saddles. Breakdowns eat these.' },
};

export const ANIMAL = { name: 'Camels', price: 32, blurb: 'Each pair of camels carries the caravan faster. Fewer than four and you crawl.' };

// Terrain shapes the pace, the water drain and which events can find you.
export const TERRAIN = {
  oasis: { name: 'Oasis road', waterMul: 1, paceMul: 1, colour: '#7d9b6a' },
  steppe: { name: 'Steppe', waterMul: 0.9, paceMul: 1.15, colour: '#a8a45c' },
  desert: { name: 'Desert', waterMul: 1.9, paceMul: 0.8, colour: '#c9a765' },
  mountains: { name: 'Mountain pass', waterMul: 1.05, paceMul: 0.6, colour: '#8a7a6a' },
  river: { name: 'River valley', waterMul: 0.85, paceMul: 1.05, colour: '#7d9a9a' },
  city: { name: 'City road', waterMul: 0.8, paceMul: 1.2, colour: '#b6a07a' },
};

// Westbound. x/y are map coordinates in a 0..100 viewbox space.
export const STOPS = [
  {
    id: 'xian', name: "Chang'an", region: 'Tang China', x: 88, y: 52,
    line: 'The eastern gate of the trade. Silk by the mile, and the last easy markets.',
  },
  { id: 'dunhuang', name: 'Dunhuang', region: 'Hexi Corridor', x: 73, y: 42, line: 'The Gate of the Jade Pass. Beyond the wall, the desert takes over.' },
  { id: 'kashgar', name: 'Kashgar', region: 'Tarim Basin', x: 58, y: 43, line: 'Two roads around the Taklamakan meet here. So do every rumour on earth.' },
  { id: 'samarkand', name: 'Samarkand', region: 'Transoxiana', x: 44, y: 40, line: 'Blue domes and paper mills. The finest scholars between the rivers.' },
  { id: 'merv', name: 'Merv', region: 'Khorasan', x: 33, y: 44, line: 'An oasis the size of a city, ringed by orchards and old walls.' },
  { id: 'baghdad', name: 'Baghdad', region: 'Iraq', x: 24, y: 52, line: 'The round city on the Tigris. Whatever the year, someone is selling something.' },
  { id: 'aleppo', name: 'Aleppo', region: 'Bilad al-Sham', x: 17, y: 42, line: 'A stone suq under vaulted roofs, cool even in August.' },
  { id: 'constantinople', name: 'Constantinople', region: 'Byzantium', x: 12, y: 33, line: 'The city of the Golden Horn, walls within walls, and the sea road west.' },
  { id: 'venice', name: 'Venice', region: 'The Lagoon', x: 6, y: 27, line: 'Salt water, church bells and the Rialto. The end of the road, and of your ledger.' },
];

// Legs between stops. `days` is the base travel time at steady pace with a full caravan.
// Travel times are deliberately generous: the road is measured in seasons, not weeks.
export const LEGS = [
  {
    from: 'xian', to: 'dunhuang', days: 5, terrain: 'steppe',
    name: 'The Hexi Corridor',
    text: 'Garrison towns and the Great Wall on your right, the Gobi creeping in on your left.',
    hazards: ['sandstorm', 'bandits', 'toll'],
  },
  {
    from: 'dunhuang', to: 'kashgar', days: 8, terrain: 'desert',
    name: 'The Taklamakan',
    text: 'The "place of no return". Salt flats, dead rivers, and bones of caravans that guessed wrong.',
    hazards: ['sandstorm', 'water', 'bandits', 'lameness'],
  },
  {
    from: 'kashgar', to: 'samarkand', days: 6, terrain: 'mountains',
    name: 'The Pamir passes',
    text: 'The Roof of the World. Snow even in summer, and thin air that makes the camels groan.',
    hazards: ['blizzard', 'lameness', 'bandits'],
  },
  {
    from: 'samarkand', to: 'merv', days: 4, terrain: 'river',
    name: 'The Zarafshan road',
    text: 'Irrigated fields, mulberry orchards, and the ruins of cities older than your language.',
    hazards: ['bandits', 'fever', 'toll'],
  },
  {
    from: 'merv', to: 'baghdad', days: 6, terrain: 'desert',
    name: 'The Khorasan desert',
    text: 'Two hundred miles of thorn and salt pan between you and the Tigris.',
    hazards: ['sandstorm', 'water', 'bandits', 'plague'],
  },
  {
    from: 'baghdad', to: 'aleppo', days: 5, terrain: 'river',
    name: 'The Euphrates',
    text: 'River towns, palm groves, and soldiers who want to see your papers.',
    hazards: ['toll', 'bandits', 'fever', 'plague'],
  },
  {
    from: 'aleppo', to: 'constantinople', days: 7, terrain: 'mountains',
    name: 'The Taurus passes',
    text: 'The Cilician Gates, then the Anatolian plateau, cold and full of wolves.',
    hazards: ['blizzard', 'bandits', 'lameness', 'toll'],
  },
  {
    from: 'constantinople', to: 'venice', days: 6, terrain: 'city',
    name: 'The sea road',
    text: 'Coastal towns, Venetian galleys, and a last stretch of water between you and the Rialto.',
    hazards: ['storm', 'toll', 'fever'],
  },
];

// What a day on the road costs in stock: the odd crate broken, a bale soaked, a bolt snagged.
export const GOOD_WEAR = 0.03;

export const PACES = {
  rest: { name: 'Make camp', label: 'Rest', days: 0, foodMul: 1, morale: +6, health: +2, blurb: 'A day of mending and sleep. Nothing moves but the shadows.' },
  steady: { name: 'Steady', label: 'Steady', days: 1, foodMul: 1, morale: 0, health: 0, blurb: 'The usual march. Eight hours on the road, camels in step.' },
  hard: { name: 'Hard', label: 'Hard', days: 1, foodMul: 1.25, morale: -4, health: -1, blurb: 'You push until dark. Faster, but the animals suffer and the people grumble.' },
};

export const RATIONS = {
  meager: { name: 'Meagre', label: 'Meagre', foodMul: 0.6, morale: -4, health: -1, blurb: 'Half a bowl of grain. Bellies tighten by noon.' },
  normal: { name: 'Normal', label: 'Normal', foodMul: 1, morale: 0, health: 0, blurb: 'Bread, dried apricots, a little meat on good days.' },
  generous: { name: 'Generous', label: 'Generous', foodMul: 1.45, morale: +4, health: +1, blurb: 'Full bowls, tea with honey, a story after supper.' },
};

export const ERAS = [
  {
    id: 'pax', year: 1271, name: 'The Pax Mongolica', tag: '1271',
    line: 'The Mongol peace holds from Korea to the Danube. Roads are patrolled, paizas honoured, bandits hunted.',
    effects: {
      banditMul: 0.5, tollMul: 1.1, plagueMul: 0.15, warMul: 0.05, mongolMul: 1.4,
      note: 'Bandits rarer, Mongol tolls common, plague almost unheard of.',
    },
  },
  {
    id: 'plague', year: 1347, name: 'The Great Pestilence', tag: '1347',
    line: 'A sickness out of the east is emptying towns from the Crimea to the Rhine. Nobody knows why.',
    effects: {
      banditMul: 1.2, tollMul: 0.8, plagueMul: 3.4, warMul: 0.3, mongolMul: 0.35,
      note: 'Plague stalks every city road. Tolls are cheap because there is no one to collect them.',
    },
  },
  {
    id: 'timur', year: 1399, name: "Timur's Wars", tag: '1399',
    line: 'The Emir Timur is burning his way through Persia and Syria. Whole roads are emptying.',
    effects: {
      banditMul: 1.4, tollMul: 1.0, plagueMul: 0.6, warMul: 1.7, mongolMul: 0.15,
      note: 'Armies, sieges and deserters. Trade is dear and dangerous.',
    },
  },
];

export const START_GOODS = [
  { id: 'silk', blurb: 'Cheapest here, dear in the west. The classic wager.' },
  { id: 'spices', blurb: 'Light and always wanted, but the margins are thinner.' },
  { id: 'porcelain', blurb: 'Rare and costly. One dropped crate is a month of travel.' },
  { id: 'paper', blurb: 'Cheap in Chang\'an. Every chancery west will pay for it.' },
];

// Prices per stop, as a multiplier on base price. Buying low and selling high across these is the game.
export const PRICE_MULT = {
  xian: { silk: 0.45, spices: 0.8, porcelain: 0.5, paper: 0.35, horses: 1.2, glass: 1.9, frankincense: 2.0 },
  dunhuang: { silk: 0.6, spices: 0.78, porcelain: 0.65, paper: 0.5, horses: 1.1, glass: 1.6, frankincense: 1.7 },
  kashgar: { silk: 0.85, spices: 0.75, porcelain: 0.8, paper: 0.6, horses: 0.55, glass: 1.3, frankincense: 1.4 },
  samarkand: { silk: 0.95, spices: 0.78, porcelain: 0.9, paper: 0.62, horses: 0.7, glass: 1.05, frankincense: 1.15 },
  merv: { silk: 1.15, spices: 0.9, porcelain: 1.2, paper: 0.9, horses: 0.9, glass: 0.9, frankincense: 0.95 },
  baghdad: { silk: 1.35, spices: 0.72, porcelain: 1.4, paper: 1.15, horses: 1.2, glass: 0.6, frankincense: 0.55 },
  aleppo: { silk: 1.25, spices: 0.85, porcelain: 1.35, paper: 1.2, horses: 1.1, glass: 0.72, frankincense: 0.68 },
  constantinople: { silk: 1.65, spices: 1.4, porcelain: 1.75, paper: 1.4, horses: 1.0, glass: 0.8, frankincense: 0.78 },
  venice: { silk: 2.1, spices: 2.0, porcelain: 2.2, paper: 1.5, horses: 0.6, glass: 0.95, frankincense: 1.1 },
};

// Price drift per town, per run: a small seeded wobble so two runs are not identical.
export const GOOD_VOLATILITY = { silk: 0.12, spices: 0.15, porcelain: 0.14, paper: 0.1, horses: 0.2, glass: 0.14, frankincense: 0.12 };

// Goods prices run through the game at these spreads (see PRICE_MULT): silk and paper are cheap
// in China, glass and incense cheap in the west, horses cheap on the steppe. Sell high, buy low.

// Named travellers: a pool; the caravan picks a mix with distinct skills.
export const TRAVELER_POOL = [
  { id: 'merchant', role: 'Merchant', name: 'Yusuf al-Tabrizi', origin: 'Tabriz', skill: 'Haggler', perk: 'Buys goods 8% cheaper, sells 8% dearer.', blurb: 'Keeps two ledgers: one for his partners, one for himself.' },
  { id: 'guide', role: 'Guide', name: 'Bahram the Khorasani', origin: 'Merv', skill: 'Pathfinder', perk: 'Travels 12% faster and finds water where others see salt.', blurb: 'Says he has crossed the Taklamakan eleven times. Nobody has checked.' },
  { id: 'driver', role: 'Camel driver', name: 'Temur of the Naiman', origin: 'Almaliq', skill: 'Animal keeper', perk: 'Camels tire half as fast and lose lameness rarely.', blurb: 'Sings to the camels. Claims they prefer it to prayer.' },
  { id: 'scholar', role: 'Scholar', name: 'Shen the Copyist', origin: "Chang'an", skill: 'Letters', perk: 'Tolls and bribes cost 25% less. Can read every passport on the road.', blurb: 'Carries forty jin of paper and calls it essential.' },
  { id: 'guard', role: 'Guard', name: 'Marco of Ancona', origin: 'Ancona', skill: 'Sword arm', perk: 'Bandits take less, and fights end better.', blurb: 'A Genoese crossbowman with a Venetian grudge and no fixed allegiance.' },
  { id: 'physician', role: 'Physician', name: 'Ibn Sulayman', origin: 'Baghdad', skill: 'Physick', perk: 'Medicine heals twice as much. The plague is a little less fatal.', blurb: 'Trusts Galen, distrusts water he has not boiled.' },
  { id: 'cook', role: 'Cook', name: 'Mei the Steward', origin: 'Dunhuang', skill: 'Victualler', perk: 'The caravan eats 15% less and grumbles 15% less.', blurb: 'Can make eight men fed on six men\'s rice and no one notices.' },
  { id: 'interpreter', role: 'Interpreter', name: 'Elena the Frank', origin: 'Constantinople', skill: 'Tongues', perk: 'Speaks Latin, Greek, Arabic and enough Persian to haggle. Events go better.', blurb: 'Daughter of a Venetian father and a Byzantine mother, at home in neither city.' },
];

export const NAMES_FIRST = ['Kaya', 'Hasan', 'Amina', 'Jochi', 'Nur', 'Wei', 'Dilnoza', 'Rashid', 'Zahra', 'Arslan', 'Lucia', 'Mahtar', 'Toghrul', 'Ismat', 'Chen', 'Soraya', 'Bahadir', 'Maryam'];
export const CARAVAN_SUGGESTIONS = [
  'The Golden Bell', 'The Salt Wind', 'Two Rivers Trading Co.', 'The Silk Lantern',
  'House of the Blue Dome', 'The Patient Camel', 'The Thousand Li', 'The Amber Road',
];
