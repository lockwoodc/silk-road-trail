// The event library. Every choice changes the caravan for real: coin, stores, animals,
// a traveller's health or morale, or the days ahead. Resolvers get (state, h) where `h` is a
// small effects helper from engine.js, and return one or more log lines.
import { GOODS } from './data.js';

const all = ['oasis', 'steppe', 'desert', 'mountains', 'river', 'city'];

export const EVENTS = [
  // ---------------------------------------------------------------- weather & road
  {
    id: 'sandstorm', title: 'The yellow wind',
    body: 'A wall of sand stands where the horizon was, taller than a minaret, coming on faster than a horse. The camels have already lain down and turned their backs.',
    tags: ['desert'], eras: 'any', weight: 10,
    concept: 'trade-network',
    note: 'Sandstorms in the Taklamakan and the Gobi could bury a caravan or force it to stop for days. Environmental hazards like this shaped routes and timings: caravans crossed deserts in seasons when the winds were gentler.',
    choices: [
      { label: 'Halt and shelter the animals', hint: 'Lose a day, keep everything else',
        resolve: (s, h) => { h.days(1); h.morale(-2); return ['You wrap every face in cloth and wait out the storm a day and a night. The sand takes a hat and a cooking pot.']; } },
      { label: 'Push through by compass and rope', hint: 'Keep your pace, risk the party',
        resolve: (s, h) => { h.water(-2); h.hurt(12, 'lungs full of dust'); h.morale(-4);
          if (Math.random() < 0.35) { h.loseGoods(1); return ['You rope the camels nose to tail and walk blind. The storm takes one crate and leaves everyone coughing dust.'];
          } return ['You rope the camels nose to tail and walk blind for six hours. Nobody is lost, but everyone is coughing.']; } },
    ],
  },
  {
    id: 'blizzard', title: 'Snow on the pass',
    body: 'The pass is white above you and the wind has a knife in it. Your guide says the far side is three days down, if the snow holds off. It will not hold off.',
    tags: ['mountains'], eras: 'any', weight: 10,
    concept: 'trade-network',
    note: 'Mountain passes such as the Pamirs and the Zagros were only crossable in summer. Snow closed them for months, and caravans planned around the seasons rather than the calendar.',
    choices: [
      { label: 'Camp and wait for a break in the weather', hint: 'Costs food and fodder',
        resolve: (s, h) => { h.days(2); h.food(-4); h.fodder(-3); h.morale(-3); return ['Two days in a stone shelter with the camels huddled against you for warmth. The crossing is clear on the third morning.']; } },
      { label: 'Cross before the light goes', hint: 'Fast, but the cold bites',
        resolve: (s, h) => { h.hurt(14, 'frostbite'); h.morale(-6);
          if (Math.random() < 0.3) { h.camels(-1, 'lost in a crevasse'); return ['You rope the animals and go. The wind takes one camel off the path and the snow closes over it.']; }
          return ['You cross in a white blur and reach the lower slope with fingers the colour of tallow.']; } },
    ],
  },
  {
    id: 'flashflood', title: 'Water where there was none',
    body: 'A sound like a market crowd comes down the wadi and the ground shakes. Flash flood, says the camel driver, already driving the animals uphill.',
    tags: ['river', 'desert'], eras: 'any', weight: 6,
    concept: 'trade-network',
    note: 'Flash floods in Central Asian valleys could wash out a road or a bridge in an hour. Routes shifted with the seasons and with the weather, which is why travellers relied on local guides.',
    choices: [
      { label: 'Scramble to high ground, leave what is slow',
        resolve: (s, h) => { h.loseGoods(1); h.rope(-1); return ['The water takes a crate and two coils of rope. Everyone else is wet, alive, and laughing a little too hard.']; } },
      { label: 'Save the load, form a chain in the shallows',
        resolve: (s, h) => { h.hurt(10, 'swept against the rocks'); h.water(3); return ['You form a chain and drag the packs to the bank. The flood fills your skins and cracks two ribs.']; } },
    ],
  },

  // ---------------------------------------------------------------- bandits & armies
  {
    id: 'bandits', title: 'Riders on the ridge',
    body: 'Nine riders on the skyline, watching. They have been watching since noon. Then one lifts a hand and they come down the slope at a trot, not a gallop. Not yet.',
    tags: all, eras: 'any', weight: 10,
    concept: 'trade-network',
    note: 'Roads were dangerous, and merchants hired guards or travelled in large caravans for protection. The level of banditry depended on how strong the ruling state was along that stretch.',
    choices: [
      { label: 'Pay the toll they will name', hint: 'Coin, but they go away',
        resolve: (s, h) => { const cut = Math.min(s.coin, Math.round(20 + s.coin * 0.12)); h.coin(-cut); h.morale(-2); return [`You hand over ${cut} bezants. The leader counts them twice, nods, and they ride off without a word.`]; } },
      { label: 'Stand your ground', hint: 'A fight. The guard earns his bread',
        resolve: (s, h) => { const armed = s.party.some((p) => p.alive && p.id === 'guard');
          if (Math.random() < (armed ? 0.45 : 0.68)) { h.hurt(16, 'a sword cut'); h.loseGoods(2); h.morale(-5); return ['A short, ugly fight by the water. They take two crates and open a traveller\'s arm before they go.']; }
          h.coin(14); h.morale(6); return ['The guard puts a crossbow bolt through their leader\'s saddle. The rest decide they have business elsewhere. Their packhorse, with 14 bezants, stays behind.']; } },
      { label: 'Scatter the camels and flee into the dunes', hint: 'Risk losing animals',
        resolve: (s, h) => { h.fodder(-2); h.morale(-4);
          if (Math.random() < 0.4) { h.camels(-1, 'run off in the dark'); return ['You scatter and run. In the dark two camels go their own way, and only one comes back at dawn.']; }
          return ['You scatter and run. By dawn the raiders are gone and, miraculously, so is nothing else.']; } },
    ],
  },
  {
    id: 'mongol-toll', title: 'A Mongol patrol',
    body: 'Twelve horsemen in lamellar, a banner of horsehair, and an officer who dismounts with the patience of a man collecting what is owed. He wants to see your paiza.',
    tags: all, eras: 'any', weight: 10,
    concept: 'mongol-toll',
    note: 'Under the Pax Mongolica, Mongol rulers protected merchants but taxed them. Merchants carried a paiza, a tablet of safe conduct, and paid tolls at stations along the road.',
    choices: [
      { label: 'Show the paiza and pay the road tax',
        resolve: (s, h) => { const scholar = s.party.some((p) => p.alive && p.id === 'scholar');
          const cut = Math.round((18 + s.goodsValue * 0.03) * (scholar ? 0.75 : 1));
          h.coin(-Math.min(s.coin, cut)); h.morale(-2);
          return [`The officer reads your paiza, stamps it, and names a tax of ${cut} bezants. ${scholar ? 'Shen argues the rate down a quarter in three languages.' : 'You pay, and he waves you on.'}`]; } },
      { label: 'Offer hospitality first: tea and a gift for his men', hint: 'Food and coin, may buy goodwill',
        resolve: (s, h) => { h.food(-3); h.coin(-8);
          if (Math.random() < 0.55) { h.morale(4); h.rumour(); return ['You brew tea and hand out dried apricots. By the third cup the officer is telling you which wells are dry and which road the bandits use. He forgets the tax.']; }
          return ['You brew tea and hand out apricots. He drinks, thanks you, and still names a tax of 8 bezants, though he rounds it down.']; } },
      { label: "Take the smugglers' track around the post",
        resolve: (s, h) => { h.days(2); h.fodder(-2);
          if (Math.random() < 0.35) { h.coin(-Math.min(s.coin, 30)); h.morale(-4); return ['You take the track. A second patrol waits at the far end and charges a fine of 30 bezants for the detour.']; }
          return ['You take a goat track around the post and rejoin the road two days later, unmolested and unpaid.']; } },
    ],
  },
  {
    id: 'timur-army', title: 'The banners of the Emir',
    body: 'The road ahead is black with men: siege engines in pieces on ox carts, and a line of prisoners roped together. The Emir Timur is moving, and he does not care which road you had planned.',
    tags: ['river', 'steppe', 'desert', 'city'], eras: ['timur'], weight: 14,
    concept: 'timur',
    note: "Timur's armies marched through Central Asia and the Middle East in the late 14th century, sacking cities and disrupting trade. His conquests made the road unsafe after the Mongol peace ended.",
    choices: [
      { label: 'Hide the goods and let the army pass',
        resolve: (s, h) => { h.days(3); h.food(-6); h.fodder(-4); h.morale(-5); return ['You bury the crates, drive the camels into a dry riverbed, and wait three days. The army passes like weather. You dig everything up except one crate you cannot find again.']; } },
      { label: 'Sell to the army commissary at their price',
        resolve: (s, h) => { const gain = Math.round(s.goodsValue * 0.55); h.sellAll(0.55); h.morale(2); return [`The quartermaster takes what you have at a soldier's price and pays in coin, not paper: ${gain} bezants for the lot.`]; } },
      { label: 'Press on and slip past the column',
        resolve: (s, h) => {
          if (Math.random() < 0.5) { h.camels(-2, 'seized by foragers'); h.hurt(10, 'a beating from foragers'); return ['Foragers take two camels and put a boot into the guide. You are let go with your lives and a lesson.']; }
          h.morale(-3); return ['You slip past in the confusion of the baggage train. Nobody notices a small caravan in the middle of an empire.']; } },
    ],
  },
  {
    id: 'ming-envoy', title: 'The envoy of the Son of Heaven',
    body: 'A procession with parasols and drums: an envoy of the Ming court, bound west with silk and porcelain as gifts. His secretary asks, politely, whether your caravan might carry letters for him.',
    tags: ['steppe', 'oasis', 'city'], eras: 'any', weight: 7,
    concept: 'ming-envoy',
    note: "Ming China sent envoys and diplomats westward. After 1368 the Ming state focused on its own borders and, for a time, on Zheng He's voyages, and its role in the overland trade changed.",
    choices: [
      { label: 'Carry the letters', hint: 'Slow, but the court pays well',
        resolve: (s, h) => { h.days(1); h.coin(45); h.morale(3); return ["You carry the envoy's letters in an oiled case. At the next town his agent pays you 45 bezants and a bolt of imperial silk, and asks you to say nothing about it."]; } },
      { label: "Sell him supplies at the court's price",
        resolve: (s, h) => { h.food(-6); h.water(-6); h.coin(38); return ['His quartermaster buys six days of food and water for 38 bezants without haggling. The easiest money of the journey.']; } },
      { label: 'Decline and keep your own pace',
        resolve: (s, h) => { h.morale(1); return ['You bow, decline, and are given tea and a lacquer box of sweets for your trouble.']; } },
    ],
  },
  {
    id: 'paiza-check', title: 'The paiza check',
    body: 'A customs house where the road narrows: a stone gate, a clerk with a brush and a list, and two soldiers bored enough to be dangerous. Your paiza is inspected under a lamp.',
    tags: ['city', 'oasis', 'river'], eras: 'any', weight: 8,
    concept: 'pax-mongolica',
    note: 'The paiza was a tablet issued by Mongol rulers that let its holder travel and claim supplies and horses along the road. Officials checked them at toll stations and gates.',
    choices: [
      { label: 'Let the clerk do his work',
        resolve: (s, h) => { const scholar = s.party.some((p) => p.alive && p.id === 'scholar');
          if (scholar) return ["Shen reads the clerk's list upside down, corrects a date, and the man is so relieved he stamps the paiza for free, with a letter of passage."];
          h.coin(-Math.min(s.coin, 10)); return ['The clerk finds a discrepancy in your paiza and charges 10 bezants to correct it. The soldiers never look up.']; } },
      { label: 'Slip the clerk a small purse',
        resolve: (s, h) => { h.coin(-Math.min(s.coin, 12)); h.morale(-1); return ['You leave 12 bezants on the counter under your hand. The paiza is stamped with unusual speed.']; } },
    ],
  },
  {
    id: 'deserters', title: 'Broken men by the road',
    body: 'Three soldiers sit in the shade of a dead tree with no boots worth the name. Deserters, by their look. One raises a hand, not a weapon. They ask for water.',
    tags: ['mountains', 'desert', 'steppe'], eras: ['timur', 'plague'], weight: 8,
    concept: 'trade-network',
    note: 'Caravan work was hard, poorly paid and dangerous. Guides, drivers and guards could abandon a party in the middle of a journey, leaving it without local knowledge.',
    choices: [
      { label: 'Give them water and food',
        resolve: (s, h) => { h.water(-2); h.food(-3); h.morale(4);
          if (Math.random() < 0.5) { h.coin(12); return ['They drink, they eat, and one of them, a smith, insists on paying with 12 bezants sewn into his coat. Then they walk on, south, toward nothing.']; }
          return ['They drink, they eat, and they tell you which bridge is broken. You leave them the rest of the bread.']; } },
      { label: 'Take them on as hired hands', hint: 'They may be trouble',
        resolve: (s, h) => { h.food(-2);
          if (Math.random() < 0.45) { h.coin(-Math.min(s.coin, 18)); h.morale(-3); return ['By the second night one of them has gone, and so has 18 bezants from the strongbox.']; }
          h.rope(1); h.morale(3); return ['They earn their bread: one mends a cracked axle with a strip of shield iron, and you gain a spare coil of rope.']; } },
      { label: 'Ride past',
        resolve: (s, h) => { h.morale(-3); return ['You ride past with your eyes on the road. Nobody speaks for an hour. The guide says, at last, that he has been that man.']; } },
    ],
  },

  // ---------------------------------------------------------------- water & sickness
  {
    id: 'tainted-water', title: 'A well with a smell',
    body: 'The well is deep, the water is cold, and there is a dead goat floating in the cistern a few feet down. The camels will drink it. The question is whether you will.',
    tags: ['desert', 'steppe', 'river'], eras: 'any', weight: 9,
    concept: 'pandemic',
    note: 'Water from wells and rivers could be contaminated. Dysentery and other waterborne diseases killed more travellers than bandits did, and they travelled the same routes as goods.',
    choices: [
      { label: 'Boil it, then fill every skin', hint: 'Costs fuel and a day',
        resolve: (s, h) => { h.days(1); h.fodder(-1); h.water(8); return ['You burn fodder to boil water all evening and fill every skin. The caravan drinks and nobody sickens.']; } },
      { label: 'Drink it as it is', hint: 'Free water, a real risk',
        resolve: (s, h) => { h.water(6);
          if (Math.random() < 0.55) { h.hurt(18, 'the flux'); h.morale(-5); return ['You drink. By the next night half the caravan has the flux and the camels are trotting to keep up with the people.']; }
          return ['You drink, and nothing happens. The cook says it is his blessing. The physician says it is luck.']; } },
      { label: 'Leave it and ration what you carry',
        resolve: (s, h) => { h.water(-1); h.morale(-2); return ['You leave the well alone. Rations drop by a skin a day and the party walks with dry mouths.']; } },
    ],
  },
  {
    id: 'plague', title: 'The plague in the next village',
    body: 'The village ahead has smoke but no movement. A cart stands in the road with its ox still in the traces, dead a week. The gate is shut, and a man on the wall calls out that they have the pestilence.',
    tags: ['city', 'river', 'oasis'], eras: ['plague', 'any'], weight: 9,
    concept: 'plague',
    note: 'The Black Death reached Europe and the Islamic world in 1346-1353. It travelled along the same trade routes as silk and spices, carried by fleas on rats on ships and in caravans.',
    choices: [
      { label: 'Detour through the hills, away from everyone', hint: 'Slow, safe',
        resolve: (s, h) => { h.days(3); h.water(-3); h.morale(-3); return ['You take the hill road, three days out of your way, and see no living soul.']; } },
      { label: 'Send the physician to offer help',
        resolve: (s, h) => { const doctor = s.party.some((p) => p.alive && p.id === 'physician');
          if (doctor) {
            if (Math.random() < 0.2) { h.hurt(20, 'the pestilence'); h.morale(5); return ['Ibn Sulayman goes in and comes out grey, having saved eleven people and buried nineteen. Two days later he is feverish. It passes. Barely.']; }
            h.morale(7); h.coin(15); return ['Ibn Sulayman goes in with boiled water and a firm hand and comes out alive, having lost four patients out of twenty. The village gives you 15 bezants and all the bread it has.']; }
          h.hurt(22, 'the pestilence'); return ['You send your healthiest man in with food. He comes back grey and feverish and is dead by the third night. The village never opens its gate.']; } },
      { label: 'Pass the village by, at speed, no contact',
        resolve: (s, h) => { h.morale(-2);
          if (Math.random() < 0.22) { h.hurt(16, 'the pestilence'); return ['You pass at a trot with cloth over your faces. A week later one traveller has a swelling under the arm and a fever. Somehow, he lives.']; }
          return ['You pass at a trot with cloth over your faces and touch nothing. The road ahead smells of vinegar and ash.']; } },
    ],
  },
  {
    id: 'fever', title: 'Fever in the night',
    body: 'Someone is shivering under three blankets and the camels are restless. The forehead is hot enough to warm your hand. There is bark in the medicine chest, if the physician remembers where.',
    tags: ['river', 'oasis', 'city'], eras: 'any', weight: 8,
    concept: 'pandemic',
    note: 'Fevers and epidemics spread along trade routes. Merchants, pilgrims and soldiers carried disease as easily as they carried goods.',
    choices: [
      { label: 'Use medicine and nurse them', requires: (s) => s.medicine > 0,
        resolve: (s, h) => { h.medicine(-1); h.heal(24); h.morale(2); return ['A dose of bark and a night of cold cloths. By morning the fever has broken and the patient is complaining about the food, which is a good sign.']; } },
      { label: 'Rest a day and let it run its course',
        resolve: (s, h) => { h.days(1); h.heal(8); h.morale(-2); return ['You make an early camp and let it run. It runs a long way, but it runs out.']; } },
      { label: 'Keep moving, it is only a chill',
        resolve: (s, h) => { h.hurt(20, 'a fever that would not break'); h.morale(-4); return ['You keep moving. By the next camp the fever has a grip and the patient cannot sit a horse.']; } },
    ],
  },
  {
    id: 'lameness', title: 'A camel goes lame',
    body: 'The lead camel is favouring its near forefoot and there is heat in the fetlock. Left alone it will go down, and then it will be a very expensive day.',
    tags: ['desert', 'mountains', 'steppe'], eras: 'any', weight: 8,
    concept: 'camel-adaptation',
    note: 'Camels made the desert routes possible, but they needed care, water and fodder. A lame camel could strand a caravan, and animals were expensive to replace.',
    choices: [
      { label: 'Rest the animal a day and poultice it',
        resolve: (s, h) => { h.days(1); h.fodder(-1); h.morale(-1); return ["A day off the road with a warm poultice of dung and herbs, which is the driver's idea and, unfortunately, works."]; } },
      { label: 'Load it lighter and keep moving',
        resolve: (s, h) => {
          if (Math.random() < 0.4) { h.camels(-1, 'went down on the road'); return ['You lighten the load. Two days later the camel lies down in the road and does not get up.']; }
          return ['You lighten its load and press on. The lameness fades with the miles.']; } },
      { label: 'Trade it to a herder for two pack donkeys',
        resolve: (s, h) => { h.camels(-1, 'traded away'); h.fodder(-1); h.morale(1); return ['A herder swaps you two donkeys for the lame camel. Donkeys are slower, but they will eat anything and complain about all of it.']; } },
    ],
  },
  {
    id: 'horse-thieves', title: 'Thieves in the horse lines',
    body: 'The dogs wake you just before dawn. Two shadows are working at the picket line and one of the horses is already loose.',
    tags: ['steppe', 'oasis', 'city', 'river'], eras: 'any', weight: 7,
    concept: 'trade-network',
    note: 'Horses were among the most valuable goods on the road, and theft of animals was common. Merchants hired guards, and states promised protection they could not always provide.',
    choices: [
      { label: 'Shout and give chase',
        resolve: (s, h) => {
          if (Math.random() < 0.5) { h.camels(-1, 'stolen in the dark'); h.hurt(8, 'a fall in the dark'); return ['You chase them half a mile across the stubble. One gets away with a camel; you get a cut lip from a branch and a story.']; }
          h.coin(10); h.morale(5); return ['You catch one at the picket line and he drops a purse with 10 bezants in his hurry. The caravan is intact and insufferably pleased with itself.']; } },
      { label: 'Let the guard handle it quietly',
        resolve: (s, h) => { const guard = s.party.some((p) => p.alive && p.id === 'guard');
          if (guard) { h.morale(3); return ['Marco is awake before you are, standing in the dark with a crossbow and no expression. Nobody steals anything.']; }
          h.camels(-1, 'gone before the alarm'); return ['By the time anyone is properly awake, a camel and a saddle are gone up the valley.']; } },
    ],
  },

  // ---------------------------------------------------------------- people & trade
  {
    id: 'caravanserai', title: 'A caravanserai',
    body: "A square of stone walls with one gate, a courtyard of camels, and a keeper who charges by the animal and gives the first night's fodder free. There is a fire and someone is singing badly.",
    tags: all, eras: 'any', weight: 9,
    concept: 'caravanserai',
    note: "Caravanserais were walled inns one day's travel apart, with water, fodder and secure storage. They made long-distance overland trade possible.",
    choices: [
      { label: 'Take a room and a hot meal',
        resolve: (s, h) => { h.coin(-Math.min(s.coin, 8)); h.morale(8); h.heal(6); return ['Bread, mutton, a basin of hot water, and a mattress no camel has slept on. The party sleeps like the dead.']; } },
      { label: 'Trade news with the other caravans',
        resolve: (s, h) => { h.rumour(); h.rumour(); h.morale(3); return ['You share tea and lies. Two things you hear are worth money, and one is worth your life.']; } },
      { label: 'Sleep in the courtyard with the animals and save coin',
        resolve: (s, h) => { h.morale(-2); h.heal(2); return ['You sleep in the courtyard, warm enough against the camels, and save your coin for the road.']; } },
    ],
  },
  {
    id: 'merchant-caravan', title: 'A caravan coming the other way',
    body: 'Sixty camels and a hundred people, coming east while you go west. Their master is a courteous man with one eye and a great deal of information about prices.',
    tags: all, eras: 'any', weight: 8,
    concept: 'trade-network',
    note: 'Merchants met other caravans on the road and traded goods, news and prices. Trade networks worked through these repeated encounters between middlemen.',
    choices: [
      { label: 'Trade goods with him at his prices',
        resolve: (s, h) => { const good = h.randomGoodInStock();
          if (!good) { h.coin(6); return ['He buys nothing of yours but sells you a jar of dates and a rumour for six bezants.']; }
          const gain = h.swapGoods(good, 0.2);
          return [`He takes your ${good} at twenty per cent above the local market and you take his coin: a gain of ${gain} bezants, and no argument.`]; } },
      { label: 'Buy his map and his gossip',
        resolve: (s, h) => { h.coin(-Math.min(s.coin, 14)); h.rumour(); h.rumour(); h.rumour(); return ["You buy a copied map with the wells marked in a dead man's hand, three rumours, and a warning about a bridge that is no longer a bridge."]; } },
      { label: 'Share the evening and part friends',
        resolve: (s, h) => { h.food(-2); h.morale(5); h.rumour(); return ['You share supper and part at dawn with a good name in common. His master says he will remember your caravan at Samarkand.']; } },
    ],
  },
  {
    id: 'holy-man', title: 'A holy man at the crossroads',
    body: 'He sits in the dust with a staff and a gourd and blesses every passing animal in a language nobody recognises. The camels seem to like it.',
    tags: all, eras: 'any', weight: 6,
    concept: 'spread-religion',
    note: 'Holy men, monks and pilgrims travelled the trade routes. Merchants often supported them, and religious institutions grew along the roads where traders passed.',
    choices: [
      { label: 'Give alms',
        resolve: (s, h) => { h.coin(-Math.min(s.coin, 6)); h.morale(6); h.heal(5); return ["You give six bezants and he lays a hand on each traveller's head. The party walks lighter all day, and one old backache is simply gone."]; } },
      { label: 'Ask him about the road ahead',
        resolve: (s, h) => { h.rumour(); h.rumour(); return ['He describes a dry well, a flooded ford and a toll that can be argued down. It is more useful than a map.']; } },
      { label: 'Walk on',
        resolve: (s, h) => { h.morale(-2); return ['You walk on. The guide spits in the dust and says nothing for two hours.']; } },
    ],
  },
  {
    id: 'stranded-traveller', title: 'A stranger in the road',
    body: 'A man in good clothes but no shoes, sitting on a fine saddle in the middle of nowhere. His horse has died and he has been walking for two days in the wrong direction.',
    tags: all, eras: 'any', weight: 6,
    concept: 'spread-religion',
    note: 'Hospitality to travellers was a religious duty in much of the Islamic world and among Buddhist communities, and caravanserais were often funded as pious acts.',
    choices: [
      { label: 'Take him on, water and food',
        resolve: (s, h) => { h.water(-2); h.food(-2); h.morale(3);
          if (Math.random() < 0.6) { h.coin(30); return ["He is a factor of a Venetian house, and at the next town he pays you 30 bezants out of his factor's strongbox with great ceremony."]; }
          return ['He travels with you three days, talks incessantly about the price of pepper, and leaves at a fork in the road with your thanks.']; } },
      { label: 'Sell him a horse at a fair price', requires: (s) => s.camels > 2,
        resolve: (s, h) => { h.camels(-1, 'sold to the stranger'); h.coin(25); return ['You sell him a pack horse for 25 bezants. He overpays out of relief and rides off with a wave.']; } },
      { label: 'Give him water and directions and ride on',
        resolve: (s, h) => { h.water(-1); h.morale(1); return ['You give him a skin of water and point him east. He thanks you and starts walking.']; } },
    ],
  },
  {
    id: 'lost-guide', title: 'The guide has lost the road',
    body: 'The guide has stopped at the top of a rise and is turning in a slow circle, and the camels are reading his uncertainty with interest.',
    tags: ['desert', 'steppe', 'mountains'], eras: 'any', weight: 7,
    concept: 'astrolabe',
    note: 'Guides knew the wells, the passes and the winds, and their knowledge was essential. Navigation by stars, compass and astrolabe was a shared technology of the trade routes.',
    choices: [
      { label: 'Stop and find the old caravan tracks',
        resolve: (s, h) => { h.days(1); h.water(-2); h.morale(-2); return ['You spend a day finding the old track: camel dung, a broken axle, and the marks of a rope dragged in the sand.']; } },
      { label: 'Trust the guide and keep going',
        resolve: (s, h) => {
          if (Math.random() < 0.5) { h.days(3); h.water(-4); h.morale(-6); return ['You follow the guide across three days of nothing and come out on the road far west of where you should be.']; }
          h.morale(3); return ['The guide takes a bearing from the stars and walks straight out to the next well. He is unbearable about it for a week.']; } },
      { label: 'Ask the stars, not the man',
        resolve: (s, h) => { const scholar = s.party.some((p) => p.alive && p.id === 'scholar');
          if (scholar) { h.morale(4); return ['Shen takes out an astrolabe and a book of tables, measures the pole star, and sets a course. The guide sulks, then agrees, then claims he said so.']; }
          h.days(2); h.water(-2); return ['You argue about stars for an hour and walk a little south of the right direction. Two days lost.']; } },
    ],
  },
  {
    id: 'bazaar-opportunity', title: 'A man with too much of one thing',
    body: 'A merchant in the suq has bought an entire warehouse of one good and now cannot sell it. He is desperate enough to be rude, which is how you know he is desperate.',
    tags: ['city', 'oasis'], eras: 'any', weight: 7,
    concept: 'trade-network',
    note: 'A merchant who bought too much of one good could be forced to sell cheap. Middlemen like these made their living on the difference between markets.',
    choices: [
      { label: 'Buy a large lot cheap', hint: 'Spends coin, adds goods',
        resolve: (s, h) => { const good = h.randomGoodNotInStock() || h.randomGoodInStock();
          if (!good) return ['You look over his goods and decide you have enough trouble already.'];
          const cost = Math.min(s.coin, Math.round(h.priceOf(good) * 0.55 * 3));
          h.coin(-cost); h.goods(good, 3);
          return [`You take three units of ${GOODS[good].name.toLowerCase()} at nearly half price for ${cost} bezants. He looks as though he has escaped something.`]; } },
      { label: 'Haggle him down further, slowly',
        resolve: (s, h) => {
          if (Math.random() < 0.6) { const g = h.randomGoodNotInStock() || 'paper'; h.coin(-Math.min(s.coin, 12)); h.goods(g, 1); return ['An hour of theatre later you own one unit at a third off. The onlookers applaud, which is the point.']; }
          h.morale(-2); return ['He takes offence at your last offer and sells the whole warehouse to someone else while you are still talking.']; } },
      { label: 'Walk on. Cheap is often a warning',
        resolve: (s, h) => { h.morale(1); return ['You walk on. The merchant shouts something after you that the interpreter declines to translate.']; } },
    ],
  },
  {
    id: 'tax-collector', title: 'A collector with a list',
    body: 'The toll house has a new man who has found a new tax on "goods of eastern origin". He is very pleased with the phrase.',
    tags: ['city', 'river', 'oasis'], eras: 'any', weight: 7,
    concept: 'taxation',
    note: 'States taxed trade and depended on it. Toll collectors, gate officials and rulers all took a cut of the goods that passed through their territory.',
    choices: [
      { label: 'Pay and be done',
        resolve: (s, h) => { const cut = Math.round(12 + s.goodsValue * 0.025); h.coin(-Math.min(s.coin, cut)); return [`You pay ${cut} bezants on the eastern goods and get a receipt you cannot read.`]; } },
      { label: 'Argue that your goods are all local',
        resolve: (s, h) => { const scholar = s.party.some((p) => p.alive && p.id === 'scholar');
          if (scholar || Math.random() < 0.5) { h.morale(2); return ['You explain, at length and with documents, that your silk was bought in Aleppo. The collector loses interest and waves you through.']; }
          h.coin(-Math.min(s.coin, 20)); return ['The argument takes an hour, attracts a crowd, and ends with a fine of 20 bezants for wasting the collector\'s time.']; } },
      { label: 'Hide the best crates under the fodder',
        resolve: (s, h) => {
          if (Math.random() < 0.4) { h.coin(-Math.min(s.coin, 25)); h.morale(-4); return ['A soldier jabs a spear into the fodder and finds the silk. The fine is 25 bezants, and the collector is delighted with his phrase all over again.']; }
          return ['The soldier jabs at the fodder, sneezes, and waves you on. The silk stays hidden.' ]; } },
    ],
  },
  {
    id: 'broken-axle', title: 'A wheel gives way',
    body: 'Two miles past the last village, a cart axle splits with a sound like a gunshot and the load goes sideways into the road.',
    tags: all, eras: 'any', weight: 7,
    concept: 'exchange-technology',
    note: 'Carts, saddles, rope and water skins were the technology of the caravan. A broken part could strand a party, and repairs depended on local craftsmen.',
    choices: [
      { label: 'Repair it with rope and parts', requires: (s) => s.rope > 0,
        resolve: (s, h) => { h.rope(-1); h.morale(1); return ['An hour of rope, wedges and swearing and the axle holds. The driver says it will hold all the way to Venice. He is usually right.']; } },
      { label: 'Unload, carry the load, abandon the cart',
        resolve: (s, h) => { h.days(1); h.morale(-4); h.loseGoods(1); return ['You divide the load among the camels, leave the cart for whoever wants it, and lose a crate in the confusion.']; } },
      { label: 'Wait for a passing caravan to help',
        resolve: (s, h) => { h.days(2); h.coin(-Math.min(s.coin, 10)); h.morale(-2); return ['A caravan comes by on the second day and its smith fixes the axle for 10 bezants and a great deal of advice.']; } },
    ],
  },
  {
    id: 'salt-tax', title: 'The salt monopoly',
    body: 'Salt is a state monopoly here, and the official selling it knows exactly how far the next well is. He names a price for a sack that would feed a village.',
    tags: ['desert', 'steppe', 'city'], eras: 'any', weight: 6,
    concept: 'caravan-trade',
    note: 'Salt was a state monopoly in many regions and essential for preserving food. The trans-Saharan caravan trade was built on salt going south and gold going north.',
    choices: [
      { label: 'Buy the salt at his price',
        resolve: (s, h) => { h.coin(-Math.min(s.coin, 9)); h.food(4); return ['You pay 9 bezants for salt and a sack of dried meat thrown in. The camels will be glad of it in the passes.']; } },
      { label: 'Do without salt',
        resolve: (s, h) => { h.morale(-3); return ['You do without. By the third day the food tastes of nothing and everyone is tired in a way sleep does not fix.']; } },
    ],
  },
  {
    id: 'monsoon', title: 'The rains come early',
    body: 'The sky turns the colour of a bruise and the first drops hit the dust like coins. Within an hour the track is a river of red mud and the camels are refusing it.',
    tags: ['river', 'oasis', 'city'], eras: 'any', weight: 6,
    concept: 'monsoon',
    note: 'The monsoon winds governed travel in the Indian Ocean, blowing one way in summer and the other in winter. Rain and flooding on land followed the same seasonal rhythm.',
    choices: [
      { label: 'Camp and wait for the ground to dry',
        resolve: (s, h) => { h.days(2); h.water(4); h.food(-2); h.morale(-2); return ['Two days under oiled cloth while the rain hammers the tents. The skins are full and everyone is bored to madness.']; } },
      { label: 'Push the camels through the mud',
        resolve: (s, h) => { h.hurt(8, 'a fall in the mud'); h.morale(-4);
          if (Math.random() < 0.3) { h.camels(-1, 'broke a leg in the mud'); return ['The caravan slithers on. One camel goes down in the mud and breaks a leg, and there is only one thing to be done about that.']; }
          return ['The caravan slithers and curses its way through and makes camp wet, cold and ahead of schedule.']; } },
    ],
  },
  {
    id: 'famine-town', title: 'A town with empty granaries',
    body: 'The bread queue outside the gate is longer than the wall. The headman offers you a fortune for grain, and his people watch you unload.',
    tags: ['city', 'oasis'], eras: ['plague', 'timur', 'any'], weight: 6,
    concept: 'trade-network',
    note: 'Cities depended on grain brought in from the countryside and by merchants. When harvests failed, prices rose, and merchants had to decide between profit and reputation.',
    choices: [
      { label: 'Sell them half your food at a fair price',
        resolve: (s, h) => { const sold = Math.min(s.food, 8); h.food(-sold); h.coin(sold * 4); h.morale(4); return [`You sell ${sold} days of food for ${sold * 4} bezants, which is fair and still a fortune to them. People touch your sleeve as you leave.`]; } },
      { label: 'Sell at the price the market will bear',
        resolve: (s, h) => { const sold = Math.min(s.food, 10); h.food(-sold); h.coin(sold * 7); h.morale(-5); return [`You sell ${sold} days of food for ${sold * 7} bezants. You are rich, and the cook will not look at you.`]; } },
      { label: 'Give food away and move on',
        resolve: (s, h) => { h.food(-4); h.morale(7); return ['You give away four days of food and leave before anyone can thank you properly.']; } },
    ],
  },
  {
    id: 'soldier-scout', title: 'A man who knows the road',
    body: 'A rider overtakes you at dusk and asks to travel with the caravan. He knows the road ahead, he says, and he does not want to be asked where he came from.',
    tags: ['mountains', 'steppe', 'river'], eras: ['timur'], weight: 7,
    concept: 'timur',
    note: 'Deserters, scouts and soldiers moved along the trade routes during the wars of the late 14th century. Local knowledge was valuable, and loyalties were uncertain.',
    choices: [
      { label: 'Take him on as a scout',
        resolve: (s, h) => { h.food(-1); h.morale(2);
          if (Math.random() < 0.4) { h.coin(-Math.min(s.coin, 20)); return ['He guides you past two patrols and steals 20 bezants on the last night. The guide says, without sympathy, that he told you so.']; }
          h.days(-1); return ['He takes you by a side valley that saves a day and a toll, and is gone before dawn with only his thanks.']; } },
      { label: 'Send him on his way',
        resolve: (s, h) => { h.morale(-1); return ['You send him on. He rides off without argument, which is somehow worse.']; } },
    ],
  },
  {
    id: 'well-festival', title: 'A wedding at the oasis',
    body: 'The oasis is lit with lamps and the whole village is at a wedding. Someone presses a cup of tea into your hand before you have even watered the camels.',
    tags: ['oasis', 'desert'], eras: 'any', weight: 5,
    concept: 'caravan-trade',
    note: 'Oases were the lifeline of desert travel. Their wells and festivals tied caravans to local communities, and hospitality was a two-way obligation.',
    choices: [
      { label: 'Join the feast and give a gift',
        resolve: (s, h) => { h.coin(-Math.min(s.coin, 5)); h.morale(9); h.food(3); h.water(3); return ["You give five bezants and are fed for two days. The bride's uncle fills your skins and refuses payment."]; } },
      { label: 'Water the camels and press on',
        resolve: (s, h) => { h.water(2); h.morale(-2); return ['You water the animals and press on while the drums start. The party grumbles for miles.']; } },
    ],
  },
  {
    id: 'white-gold', title: 'A trader in a hurry',
    body: 'A man on a lathered horse wants your goods and does not want to discuss price. He has a letter of credit and no patience.',
    tags: ['steppe', 'city', 'oasis'], eras: 'any', weight: 6,
    concept: 'trade-network',
    note: 'Prices varied sharply between markets, and a merchant who could move goods quickly made a fortune. This price gap is the engine of the Silk Road trade.',
    choices: [
      { label: 'Sell everything you carry at once',
        resolve: (s, h) => { if (s.goodsValue < 1) return ['He looks at your load, sneers, and rides on.'];
          const gain = Math.round(s.goodsValue * 0.85); h.sellAll(0.85); h.morale(2); return [`He pays ${gain} bezants for the whole load without haggling, which should worry you. But the coin is good.`]; } },
      { label: 'Sell only the bulky goods',
        resolve: (s, h) => { const gain = h.swapGoods('porcelain', 0.3) + h.swapGoods('horses', 0.3); return gain > 0 ? [`You sell the bulky goods at thirty per cent over market for ${gain} bezants.`] : ['He has no interest in what you carry and rides on.']; } },
      { label: 'Refuse: Venice will pay more',
        resolve: (s, h) => { h.morale(1); return ['You refuse. He curses you in three languages and rides away.']; } },
    ],
  },
  {
    id: 'pilgrims', title: 'Pilgrims going west',
    body: 'A dozen pilgrims on foot, with staffs and a single donkey, bound for a shrine. They ask only to walk with you for the safe part of the road.',
    tags: all, eras: 'any', weight: 6,
    concept: 'spread-religion',
    note: 'Pilgrims travelled the same roads as merchants. Buddhism spread from India into China, Islam spread through merchants and Sufis, and pilgrimage carried both faith and news.',
    choices: [
      { label: 'Let them walk with you',
        resolve: (s, h) => { h.food(-3); h.morale(6); h.rumour(); return ['They sing badly and walk slowly and tell you the prices at every town ahead. Nobody regrets it.']; } },
      { label: 'Point the way and ride ahead',
        resolve: (s, h) => { h.morale(-2); return ['You point out the road and ride ahead. The guide looks back at them for a long time.']; } },
    ],
  },
  {
    id: 'toll-bridge', title: 'The bridge is out',
    body: 'The stone bridge has lost two arches to the spring floods. The ferryman is the only way across, and he has clearly done this before.',
    tags: ['river', 'city'], eras: 'any', weight: 7,
    concept: 'taxation',
    note: 'Bridges, ferries and passes were natural toll points, and local rulers charged for crossing. Merchants often had to choose between paying and finding a way around.',
    choices: [
      { label: 'Pay the ferryman',
        resolve: (s, h) => { const fee = Math.min(s.coin, 9 + s.camels); h.coin(-fee); h.days(1); return [`The ferry takes three crossings and ${fee} bezants, and the camels hate every minute of it.`]; } },
      { label: 'Ford the river downstream',
        resolve: (s, h) => {
          if (Math.random() < 0.4) { h.loseGoods(2); h.water(-2); h.hurt(8, 'a soaking and a chill'); return ['You ford the river. Two crates float off downstream, and everyone arrives cold to the bone.']; }
          return ['You ford the river at a shallow bend and arrive muddy, triumphant and dry of coin.']; } },
    ],
  },
  {
    id: 'old-friend', title: "A face from Chang'an",
    body: "A man at the tea house stands up so fast he knocks over his stool. He was your father's agent in the east, twenty years ago, and he remembers you.",
    tags: ['city', 'oasis'], eras: 'any', weight: 5,
    concept: 'trade-network',
    note: 'Merchants built networks of agents, partners and correspondents across cities. Trust and family connections were as important as goods.',
    choices: [
      { label: 'Sit and hear his news',
        resolve: (s, h) => { h.morale(5); h.rumour(); h.rumour(); return ['He talks for three hours, buys you supper, and presses a letter of introduction on you for a merchant in Baghdad.']; } },
      { label: 'Ask him for a loan',
        resolve: (s, h) => { if (Math.random() < 0.6) { h.coin(40); h.morale(-2); return ['He lends you 40 bezants without a receipt and says you were never good with money, which is true.']; }
          h.morale(-3); return ['He says, kindly, that he has his own troubles, and pays for supper instead.']; } },
    ],
  },
  {
    id: 'plague-rumour', title: 'A traveller with news',
    body: 'A man coming from the west says the towns ahead are closed, the markets shut, and the dead are carted out at night. He also says there is money to be made.',
    tags: ['river', 'city', 'oasis'], eras: ['plague'], weight: 8,
    concept: 'plague',
    note: 'People knew plague travelled with trade. Vinegar, herbs and quarantines were attempts to protect cities and caravans, long before anyone understood the cause.',
    choices: [
      { label: 'Buy vinegar and herbs to guard the caravan',
        resolve: (s, h) => { h.coin(-Math.min(s.coin, 15)); h.medicine(2); h.morale(2); return ['You buy vinegar, rue and a bundle of herbs for 15 bezants. It may do nothing, but everyone sleeps better.']; } },
      { label: 'Turn back to the last town and wait',
        resolve: (s, h) => { h.days(2); h.morale(-2); return ['You turn back, lose two days, and hear from a priest that the pestilence is in every town but yours.']; } },
      { label: 'Press on: the road is the road',
        resolve: (s, h) => { h.morale(-3); return ['You press on. The road is the road, and the caravan is not a thing that turns around.']; } },
    ],
  },
  {
    id: 'silver-mine', title: 'Smoke in the hills',
    body: 'Charcoal smoke and the sound of hammers. A silver mine works the hillside and its overseer will buy anything the miners want.',
    tags: ['mountains', 'steppe'], eras: 'any', weight: 5,
    concept: 'taxation',
    note: 'Silver and gold moved along the trade routes and paid for goods. Mining towns created demand for food and supplies from passing merchants.',
    choices: [
      { label: 'Sell food to the miners',
        resolve: (s, h) => { const sold = Math.min(s.food, 6); h.food(-sold); h.coin(sold * 5); h.morale(1); return [`The miners pay ${sold * 5} bezants for ${sold} days of food without a murmur.`]; } },
      { label: "Buy silver at a smuggler's price",
        resolve: (s, h) => { const spend = Math.min(s.coin, 25); h.coin(-spend); h.coin(Math.round(spend * 1.35)); return [`You buy silver for ${spend} bezants, and by the next town it has become ${Math.round(spend * 1.35)} bezants of good coin.`]; } },
      { label: 'Keep moving',
        resolve: (s, h) => { h.morale(1); return ['You keep moving. The guide does not trust mines.']; } },
    ],
  },
  {
    id: 'mountain-passage', title: 'A pass with a price',
    body: 'A local lord holds the only pass and his men have built a gate where the road narrows. His herald asks whether you are merchants of consequence.',
    tags: ['mountains'], eras: 'any', weight: 7,
    concept: 'trade-network',
    note: 'Mountain passes were choke points, and local lords charged for safe passage. Control of a pass was worth as much as control of a market.',
    choices: [
      { label: 'Present the caravan as a great embassy',
        resolve: (s, h) => { const interp = s.party.some((p) => p.alive && p.id === 'interpreter');
          if (interp || Math.random() < 0.5) { h.morale(2); return ['Elena delivers a speech about distant courts and her own high blood. The herald is impressed, the gate opens, and nobody asks for a tax.']; }
          h.coin(-Math.min(s.coin, 22)); return ['The performance is good but the herald has seen better. You pay 22 bezants for the gate.']; } },
      { label: 'Pay the passage toll',
        resolve: (s, h) => { h.coin(-Math.min(s.coin, 16)); return ['You pay 16 bezants and are waved through with a salute from the gate.']; } },
      { label: 'Go around by the goat track',
        resolve: (s, h) => { h.days(2); h.hurt(9, 'a fall on the goat track');
          if (Math.random() < 0.3) { h.camels(-1, 'lost on the goat track'); return ['You take the track. It costs two days, a sprained wrist, and a camel that goes over the edge.']; }
          return ['You take the track. Two days, a sprained wrist, and the satisfaction of not paying.']; } },
    ],
  },
  {
    id: 'vision', title: 'A dream at the evening fire',
    body: 'The cook says he dreamed of a walled city with gold roofs, and that it means the caravan will arrive. The guide says he dreamed of a dry well and says nothing about what that means.',
    tags: all, eras: 'any', weight: 4,
    concept: 'spread-religion',
    note: 'Dreams and omens were part of the religious world of travellers. Merchants, monks and pilgrims interpreted signs as guidance on the road.',
    choices: [
      { label: 'Take the dream as a sign and push on',
        resolve: (s, h) => { h.morale(4); h.days(-1); return ['You push on an extra hour past dark on the strength of it, and make the next well before noon.']; } },
      { label: 'Make camp early and tell stories',
        resolve: (s, h) => { h.morale(7); h.heal(4); return ['You make camp early, build the fire up, and tell stories until the stars are all out. Everyone sleeps well.']; } },
    ],
  },
  {
    id: 'bribe-guide', title: 'The guide wants more',
    body: 'The guide stops in the middle of the road, in the middle of nowhere, and says his contract did not mention the passes. He would like more.',
    tags: all, eras: 'any', weight: 5,
    concept: 'trade-network',
    note: 'Guides and drivers negotiated their pay as they went. A caravan depended on local expertise and had little power to enforce a contract far from any court.',
    choices: [
      { label: 'Pay him',
        resolve: (s, h) => { h.coin(-Math.min(s.coin, 18)); h.morale(2); return ['You pay 18 bezants. He pockets it without embarrassment and is much more cheerful about the next leg.']; } },
      { label: 'Refuse and remind him of his word',
        resolve: (s, h) => { if (Math.random() < 0.5) { h.morale(-6); h.days(1); return ['He walks the rest of the day in silence, takes a wrong turn on purpose, and everyone knows it.']; }
          h.morale(-2); return ['He grumbles, but he leads. His word means something to him after all.']; } },
      { label: 'Threaten to leave him at the next town',
        resolve: (s, h) => { h.morale(-3); return ['He laughs at that, which is unsettling, then leads on without another word about money.']; } },
    ],
  },
  {
    id: 'ghost-caravan', title: 'A caravan that does not move',
    body: 'A caravan ahead on the road, camels still loaded and standing, people seated in the shade. Nobody moves. The animals turn their heads as one when you call out.',
    tags: ['desert', 'steppe'], eras: 'any', weight: 4,
    concept: 'pandemic',
    note: 'Caravans did sometimes die of thirst or disease on the road. The same routes that made trade possible made disaster possible, and travellers knew it.',
    choices: [
      { label: 'Approach carefully',
        resolve: (s, h) => {
          if (Math.random() < 0.5) { h.rope(2); h.food(3); h.coin(20); h.morale(-3); return ['The caravan is dead of thirst, every one of them, a week gone. You take rope, food and 20 bezants, and bury what can be buried. Nobody sleeps well.']; }
          h.morale(-4); return ['They are dead of thirst, every one. You leave them their goods and say a prayer, and the guide walks ahead alone for the rest of the day.']; } },
      { label: 'Pass by on the other side of the road',
        resolve: (s, h) => { h.morale(-2); return ['You pass on the other side of the road, and do not look, and nobody speaks.']; } },
    ],
  },
];

// Rumours heard in towns and from travellers: small mechanical hints in period voice.
export const RUMOURS = [
  'A factor in the suq swears silk is worth double in Venice, and that his own brother is carrying twenty bolts.',
  'The wells at the third station are dry, they say. Carry extra skins.',
  'The mountain pass is open, but the lord who holds it charges by the animal.',
  'They are buying paper in every chancery west of the rivers. Bring bales if you can carry them.',
  'Bandits have moved off the main road since the patrol came through. The side roads are another matter.',
  'A physician in the next town sells bark that breaks a fever. It costs, and it works.',
  'Camels are cheap at the horse fair beyond the pass, if you can feed them.',
  'The plague is in the river towns. Do not drink from the wells inside the walls.',
  'There is a caravan master who pays cash for porcelain and does not open the crates.',
  'An envoy of the Ming court is travelling west. He pays well for letters carried quietly.',
  'A toll collector at the gate takes a bribe and gives a receipt. The receipt is worthless, the bribe is not.',
  'Fodder is dear in the mountains. Buy in the valley before you climb.',
  'The ferry is out and the ford is deep. Someone will get rich on that bridge.',
  'Frankincense is worth nothing in the east and everything in the churches of the west.',
  'A woman at the caravanserai says the guide you want is the one with the astrolabe, not the one with the loud voice.',
];

export const TOWN_WHISPERS = {
  xian: "The wardens of the western gate count camels, not people. Beyond the wall, the roads are the emperor's in name only.",
  dunhuang: 'Everything past here is desert and rumour. Buy water before you leave, whatever the price.',
  kashgar: 'Two roads around the sand sea. The southern one is longer; the northern one has more wells and more thieves.',
  samarkand: 'Paper from the mills here is finer than anything in the west. Buy low, carry light.',
  merv: 'The orchards go on for miles and then stop entirely. The desert past Merv is the worst of the whole road.',
  baghdad: 'Whatever the year, the Tigris has a market on it. And whatever the year, someone is at war upriver.',
  aleppo: 'The suq here has vaults older than the religion. A man can find anything and be cheated honestly.',
  constantinople: 'The walls have held for a thousand years. The Venetians, mind, are the ones who will really tax you.',
  venice: 'Salt water and church bells. Sell here, or sell nowhere.',
};
