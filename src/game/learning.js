// The learning layer. Every entry is written against AP World History Unit 2 (1200-1450) and
// the content this game is built from: trade networks and their consequences, exchange in the
// Indian Ocean, the Mongol Empire and the Pax Mongolica, the spread of crops, peoples, religions
// and disease, and the Black Death. Each entry names the concept and the historical fact in plain
// language a student can use on a SAQ or in an LEQ.

export const UNIT = {
  unit: 'Unit 2 · Networks of Exchange (1200–1450)',
  title: 'What this caravan is carrying',
  lede:
    'A caravan is a classroom that moves. Every day on the road shows one of the causes and consequences of exchange: goods, ideas, crops, peoples and germs travelling the same routes.',
};

// The concepts the game is built around. Keys are used by the almanac and by event "concept" tags.
export const CONCEPTS = {
  'trade-network': {
    name: 'Networks of exchange',
    tag: '2.1–2.4',
    summary:
      'From 1200 to 1450 Afro-Eurasia was joined by overlapping trade networks: the Silk Roads overland, the Indian Ocean maritime routes, and the trans-Saharan caravan routes. They connected to each other, so goods changed hands many times rather than moving directly from China to Europe.',
    evidence:
      'No single merchant usually travelled the whole road. Goods moved in relays between middlemen, and each stop added cost: a bolt of silk bought in Chang\'an sold for many times its price in Venice.',
    game: 'Your caravan is one link in the relay. You buy in one town and sell in the next; you almost never deal directly with the far end of the road.',
  },
  'caravanserai': {
    name: 'Caravanserais and the cost of travel',
    tag: '2.1',
    summary:
      'Merchants could not travel cheaply or safely alone. Caravanserais were walled inns one day\'s travel apart along the Silk Roads, with water, fodder, storage and a guarded courtyard. They made long-distance land trade possible at all.',
    evidence:
      'Caravanserais were built by rulers, guilds and merchants themselves, and were found from Anatolia to Central Asia. Overland transport still cost far more per mile than sea transport, which is why the Indian Ocean routes carried far more bulk.',
    game: 'Caravanserai events restore water, fodder and spirits. Without them, a caravan crossing the Taklamakan or the Iranian plateau could not survive.',
  },
  'pax-mongolica': {
    name: 'The Pax Mongolica',
    tag: '2.2',
    summary:
      'After the Mongol conquests of the 13th century, most of the Silk Roads came under one empire. The Mongols protected merchants, taxed them, and issued a paiza, a tablet of safe conduct. For about a century, the overland route was safer than it had been in centuries.',
    evidence:
      'The Pax Mongolica made Marco Polo\'s and Ibn Battuta\'s travels possible. It also made the Black Death\'s westward journey possible. Protection came with Mongol demands: tolls, tribute and documents.',
    game: 'Choose the year 1271 and banditry drops while tolls and paiza checks rise. The road is safe; it is also expensive.',
  },
  'mongol-toll': {
    name: 'Tolls, tribute and safe conduct',
    tag: '2.2',
    summary:
      'Mongol and local rulers charged tolls for the right to travel and trade. Merchants paid in coin or in goods. A ruler who protected a road could also squeeze it.',
    evidence:
      'The Mongol officer in the game demanding a paiza is historically accurate: merchants travelled with written safe-conduct documents and were checked at toll stations.',
    game: 'Mongol patrol events charge coin or goods. Paying the toll is often cheaper than fighting or fleeing.',
  },
  'indian-ocean': {
    name: 'Exchange in the Indian Ocean',
    tag: '2.3',
    summary:
      'The Indian Ocean carried more goods than the Silk Roads. Monsoon winds made round trips predictable, which allowed ports to specialise: Gujarati and Arab merchants in the western Indian Ocean, Tamil merchants in the Bay of Bengal, Malay and Javanese in the southeast.',
    evidence:
      'Key Indian Ocean exports were cotton textiles, spices, and goods from East Africa and India to China and the Mediterranean. The routes moved more bulk than the overland roads because ships could carry far more.',
    game: 'Your Silk Road stops end at the Mediterranean. The same goods you carry on land would have gone by dhow from Calicut or Hormuz, cheaper and in far greater volume.',
  },
  'monsoon': {
    name: 'The monsoon wind system',
    tag: '2.3',
    summary:
      'Sailors in the Indian Ocean timed voyages to the monsoon winds: they blew one way in summer and the other in winter. Knowledge of the monsoon was the single most valuable skill in the region.',
    evidence:
      'The monsoon made predictable two-way trade possible and helped create the dense, cosmopolitan port cities of the Indian Ocean rim.',
    game: 'Rain events on the road reflect the same environmental rhythm that governed the sea.',
  },
  'dhow': {
    name: 'Dhows and maritime technology',
    tag: '2.3',
    summary:
      'The Indian Ocean was sailed by dhows, with lateen sails that could catch the wind from either side. Combined with the astrolabe and the compass, these technologies made long ocean voyages reliable.',
    evidence:
      'The dhow and lateen sail were in use for centuries before 1200. Chinese junks joined the Indian Ocean trade in the 10th to 15th centuries and could carry huge cargoes.',
    game: 'The overland caravan is slow and expensive by comparison. This is the trade-off at the heart of Unit 2.',
  },
  'caravan-trade': {
    name: 'The caravan trade in the Sahara',
    tag: '2.4',
    summary:
      'The trans-Saharan routes were carried by camels, which made the desert crossable. Camel caravans carried salt south and gold north, and Islam travelled with the merchants into West Africa.',
    evidence:
      'Salt was as valuable as gold in West Africa, because a diet without salt could not be sustained and salt was scarce south of the desert.',
    game: 'Your camel caravan is modelled on these desert caravans: animals, water, fodder, and a leader who knows the wells.',
  },
  'camel-adaptation': {
    name: 'The camel and the trade routes',
    tag: '2.4',
    summary:
      'The camel was the technology that made long desert crossings possible. Its hump stores fat, it tolerates days without water, and it could carry far more than a person or a horse.',
    evidence:
      'The spread of the camel from the Arabian Peninsula into Africa and Central Asia is itself an example of a technology spreading along trade routes.',
    game: 'Fewer than four camels and the caravan crawls. Each camel also eats a bale of fodder a day, which is why fodder is a real cost on the road.',
  },
  'spread-crops': {
    name: 'The spread of crops and peoples',
    tag: '2.1–2.2',
    summary:
      'Trade moved plants as well as goods. Bananas reached Africa, and Islam and the Arab world spread through merchants. In China, new crops and Central Asian horses changed farming and warfare.',
    evidence:
      'The game\'s horses are Central Asian. Silk was made in China, paper reached the Islamic world through Central Asia, and spices travelled from Southeast Asia and India into China and the Mediterranean.',
    game: 'Every good you buy has a real origin. The almanac marks where each one was actually made.',
  },
  'spread-religion': {
    name: 'The spread of religion and culture',
    tag: '2.2',
    summary:
      'The Silk Roads carried ideas: Buddhism spread from India into China, Islam spread through merchants and Sufis, and Nestorian Christianity reached China. Culture moved with the people who traded.',
    evidence:
      'Merchants funded and used monasteries and caravanserais; travellers such as Ibn Battuta described a Muslim world from Morocco to China. The trade networks were also networks of faith.',
    game: 'Pilgrims, monks and holy men appear on the road. How you treat them affects your caravan\'s spirits.',
  },
  'plague': {
    name: 'The Black Death',
    tag: '2.2 / Unit 3',
    summary:
      'The Black Death (1346–1353) travelled from Central Asia along trade routes to the Black Sea and the Mediterranean, carried by fleas on rats that lived on merchant ships and in caravans. It killed a large share of Europe and the Islamic world.',
    evidence:
      'The disease moved at the speed of trade, not at the speed of armies. The Genoese colony of Caffa on the Black Sea is one documented point of entry into Europe.',
    game: 'Choose the year 1347 and plague events become frequent. Medicine and rest are your only defences.',
  },
  'pandemic': {
    name: 'Disease as a consequence of connectivity',
    tag: '2.2 / Unit 3',
    summary:
      'Disease is one of the consequences of connectivity. The same roads that carried silk and ideas carried germs. Where trade was denser and ports larger, disease moved faster.',
    evidence:
      'Plague pandemics recurred along trade routes for centuries. The connection between connectivity and pandemics is a standard comparison in the AP course.',
    game: 'Tainted water, plague rumours, and sick travellers all connect the day-to-day road to the largest consequence of exchange.',
  },
  'exchange-technology': {
    name: 'Technology moving along the routes',
    tag: '2.1–2.3',
    summary:
      'Gunpowder, papermaking, the compass and printing all moved west along the trade routes. Each changed the societies that received it, sometimes centuries after it left China.',
    evidence:
      'Paper reached the Islamic world through Central Asia in the 8th century and Europe by the 12th. The paper in your packs is a technology, not just a good.',
    game: 'Paper is one of the cheapest goods in Chang\'an and one of the most valuable things you can carry west.',
  },
  'astrolabe': {
    name: 'Navigation and knowledge',
    tag: '2.3',
    summary:
      'Astrolabes, compasses and star charts spread with the merchants who depended on them. Navigational knowledge was a shared technology of the Indian Ocean and the Mediterranean.',
    evidence:
      'A guide with an astrolabe is not a game invention: merchants and pilots used instruments to find latitude and to time voyages to the monsoon.',
    game: 'Your guide\'s skill is the game\'s stand-in for this accumulated knowledge.',
  },
  'taxation': {
    name: 'States and trade: taxing the routes',
    tag: '2.2',
    summary:
      'Trade networks made states rich, and states shaped trade in return. Rulers taxed goods, protected roads, built caravanserais, and competed for the best ports and passes.',
    evidence:
      'The toll collectors, gate officials and Mongol patrols in the game all represent the same historical relationship: merchants needed states, and states charged for the protection they provided.',
    game: 'Tolls, bribes, taxes and gate fees are the price of moving goods through someone else\'s territory.',
  },
  'timur': {
    name: 'Timur and the fragmentation of the roads',
    tag: '2.2 / Unit 3',
    summary:
      'After the Mongol Empire broke up, the road fragmented. Timur (Tamerlane) built an empire through conquest in the late 14th century, and his campaigns disrupted trade, destroyed cities, and moved artisans by force.',
    evidence:
      'Timur\'s conquests made Samarkand a great centre again, but they made the road from Central Asia to the Mediterranean dangerous for a generation.',
    game: 'Choose the year 1399 and war events multiply. The road that was safe under the Mongols is now contested.',
  },
  'ming-envoy': {
    name: 'Chinese states and the western road',
    tag: '2.2',
    summary:
      'After 1368 the Ming dynasty turned much of its attention inward. Zheng He\'s voyages (1405–1433) showed the reach of Chinese power at sea, but the state largely withdrew from overseas expansion, and the overland route\'s importance began to shift.',
    evidence:
      'The Ming envoy in the game reflects a real pattern: Chinese officials and diplomats travelling the western road with letters, gifts and demands.',
    game: 'A Ming envoy event can raise or lower the value of your goods depending on how you answer him.',
  },
  'yuan': {
    name: 'The Mongol Yuan dynasty in China',
    tag: '2.2',
    summary:
      'The Mongols ruled China as the Yuan dynasty (1271–1368). That rule connected China more closely than ever to Central Asia and the Islamic world, and made travel across Eurasia unusually easy for a century.',
    evidence:
      'The 1271 start is the year Kublai Khan proclaimed the Yuan dynasty. Under Yuan rule, merchants and envoys from across Eurasia reached China.',
    game: 'The 1271 caravan travels under a Mongol-secured peace. Expect safe roads and heavy tolls.',
  },
};

// Stops: what a student should know about each town on the route.
export const STOP_FACTS = {
  xian: {
    period: 'Chang\'an (modern Xi\'an), the Tang capital and the eastern end of the Silk Roads',
    facts: [
      'Chang\'an was the great eastern terminus of the Silk Roads under the Tang (618–907), when it was one of the largest cities in the world.',
      'The city was a cosmopolitan capital: merchants from Central Asia, Persian and Arab traders, and Buddhist monks all lived there.',
      'Silk production began in China and was for centuries a Chinese state secret; silk was used as a form of payment and tribute, not only as cloth.',
      'Paper was invented in China (around 105 CE) and would travel west along these routes over the next thousand years.',
    ],
    concept: 'trade-network',
    prompt: 'Explain one way Chang\'an\'s location shaped its role in Silk Road trade.',
  },
  dunhuang: {
    period: 'Dunhuang, the "Gate of the Jade Pass", where the road leaves China for the Taklamakan',
    facts: [
      'Dunhuang sat where the Hexi Corridor met the desert. Travellers passed through its gate to enter or leave China.',
      'The nearby Mogao Caves (Caves of the Thousand Buddhas) hold Buddhist art and manuscripts from the 4th to 14th centuries.',
      'Buddhism travelled the Silk Roads from India through Central Asia to China. Dunhuang was a major point in that transmission.',
      'The caves\' manuscripts include documents in many languages, showing how diverse the travellers along the road were.',
    ],
    concept: 'spread-religion',
    prompt: 'Explain one example of a religion spreading along the Silk Roads using evidence from Dunhuang.',
  },
  kashgar: {
    period: 'Kashgar, the trading city where the northern and southern routes around the Taklamakan met',
    facts: [
      'The Taklamakan Desert is one of the harshest in the world. Caravans avoided its centre and travelled along its edges.',
      'Kashgar was the meeting point of the routes around the desert, and a major market for Central Asian goods.',
      'Central Asian horses were prized in China for warfare; China traded silk and tea for them.',
      'The Sogdians, a merchant people from Central Asia, dominated the overland trade from roughly the 4th to the 8th century.',
    ],
    concept: 'trade-network',
    prompt: 'Explain one cause of the growth of trading cities like Kashgar.',
  },
  samarkand: {
    period: 'Samarkand, the great city of Transoxiana and a Silk Road crossroads',
    facts: [
      'Samarkand sat on the Zarafshan River and connected China, Persia and the Mediterranean.',
      'Genghis Khan\'s armies sacked Samarkand in 1220; under the Mongols it recovered and became a major trade centre again.',
      'Timur (Tamerlane) made Samarkand his capital in 1370 and moved artisans and scholars there by force.',
      'The city\'s paper mills were among the finest in the world; papermaking had reached the Islamic world through Central Asia.',
    ],
    concept: 'timur',
    prompt: 'Explain one way Mongol conquest both disrupted and promoted trade in Central Asia.',
  },
  merv: {
    period: 'Merv, an oasis city of Khurasan on the edge of the Karakum Desert',
    facts: [
      'Merv was one of the largest cities in the medieval Islamic world, watered by the Murghab River.',
      'It lay on the routes linking Persia, Central Asia and the Indian Ocean.',
      'The city was destroyed by the Mongols in 1221; the ruins are a UNESCO World Heritage site.',
      'Desert crossing depended on wells and oases; the road from Merv westward was among the hardest stretches.',
    ],
    concept: 'camel-adaptation',
    prompt: 'Explain how environmental factors shaped trade routes in Central Asia.',
  },
  baghdad: {
    period: 'Baghdad, Abbasid capital and the great market of Mesopotamia',
    facts: [
      'Baghdad was founded in 762 and became the centre of the Abbasid Caliphate, a hub of trade, scholarship and Islamic learning.',
      'The city sat on the Tigris, linking the Silk Roads to the Indian Ocean through the Persian Gulf.',
      'Mongol forces sacked Baghdad in 1258, ending the Abbasid Caliphate and disrupting trade routes for years.',
      'Islamic merchants and scholars carried Islam along the trade routes into Central Asia, India and West Africa.',
    ],
    concept: 'spread-religion',
    prompt: 'Explain one way the Mongol conquest of Baghdad affected trade in the 13th century.',
  },
  aleppo: {
    period: 'Aleppo, the great market of northern Syria between the desert and the sea',
    facts: [
      'Aleppo was a major trading city on the routes between Mesopotamia, Anatolia and the Mediterranean.',
      'Its suq and citadel made it a centre of trade and craft for centuries; the city was a crossroads of Muslim and Christian worlds.',
      'By the 14th century the Black Death had reached the Middle East through these trade routes; Aleppo and Damascus suffered heavily.',
      'Venetian and Genoese merchants traded through Syrian ports, connecting the Silk Roads to Mediterranean shipping.',
    ],
    concept: 'plague',
    prompt: 'Explain one way the Black Death spread along trade routes in the 14th century.',
  },
  constantinople: {
    period: 'Constantinople, capital of the Byzantine Empire and the gate to Europe',
    facts: [
      'Constantinople controlled the straits between the Black Sea and the Mediterranean, so goods passing into Europe came through it.',
      'Byzantine emperors tried to control the silk trade; silk production was eventually smuggled into the Byzantine Empire in the 6th century.',
      'The Fourth Crusade sacked the city in 1204, weakening the Byzantine Empire long before its fall in 1453.',
      'Genoese and Venetian merchants had trading quarters here, and their ships carried goods, people and disease into the Mediterranean.',
    ],
    concept: 'trade-network',
    prompt: 'Explain one way Constantinople\'s location gave it economic importance.',
  },
  venice: {
    period: 'Venice, the Italian maritime republic at the western end of the road',
    facts: [
      'Venice grew rich on the spice and silk trade; its merchants bought from the Islamic world and sold into Europe.',
      'Venetian and Genoese ships were the main link between Mediterranean ports and the goods of Asia.',
      'The same ships and caravans that carried goods carried plague. The Black Death reached Europe through Mediterranean ports in 1347–1348.',
      'After 1453 and the Ottoman conquest of Constantinople, European states looked for sea routes to Asia, beginning the Age of Exploration.',
    ],
    concept: 'pandemic',
    prompt: 'Explain one consequence of the Black Death for European society in the 14th century.',
  },
};

// Goods: origin, and the concept each illustrates.
export const GOOD_FACTS = {
  silk: {
    origin: 'China',
    concept: 'exchange-technology',
    fact: 'Silk was produced in China from at least the 2nd millennium BCE and was for centuries a Chinese monopoly. It was used as tribute and currency as well as luxury cloth, and it gave the trade network its modern name.',
    prompt: 'Explain one reason silk was valuable enough to be traded across Eurasia.',
  },
  spices: {
    origin: 'Southeast Asia, India, the Moluccas',
    concept: 'indian-ocean',
    fact: 'Spices such as pepper, cinnamon, cloves and nutmeg came from South and Southeast Asia. They were far cheaper by sea than by land, which is why the Indian Ocean carried far more of them than the Silk Roads did.',
    prompt: 'Explain one way the Indian Ocean trade differed from the overland Silk Roads.',
  },
  porcelain: {
    origin: 'China (Jingdezhen)',
    concept: 'exchange-technology',
    fact: 'Chinese porcelain was prized across the Islamic world and Europe. Its technology spread only slowly, so genuine Chinese ware stayed a luxury for centuries.',
    prompt: 'Explain one effect of Chinese manufactured goods on trade in the Indian Ocean.',
  },
  paper: {
    origin: 'China',
    concept: 'exchange-technology',
    fact: 'Paper was invented in China around 105 CE. It reached the Islamic world through Central Asia in the 8th century and Europe by the 12th, and helped make books, administration and scholarship cheaper.',
    prompt: 'Explain one way the spread of papermaking affected societies in Afro-Eurasia.',
  },
  horses: {
    origin: 'Central Asia',
    concept: 'spread-crops',
    fact: 'Central Asian horses were prized in China for cavalry. Trade in horses was a two-way exchange: China sent silk and tea west, and horses came east.',
    prompt: 'Explain one example of goods moving in both directions along the Silk Roads.',
  },
  glass: {
    origin: 'Syria, Egypt, Italy',
    concept: 'trade-network',
    fact: 'Glassware from the Islamic world and the Mediterranean travelled east. Chinese tombs have yielded Roman and Islamic glass, evidence of the road\'s reach in both directions.',
    prompt: 'Explain one piece of evidence that the Silk Roads carried goods west to east.',
  },
  frankincense: {
    origin: 'Arabian Peninsula, Horn of Africa',
    concept: 'caravan-trade',
    fact: 'Frankincense and myrrh came from the Arabian Peninsula and the Horn of Africa. They were carried by camel caravan long before 1200, on routes that connected to the Indian Ocean and the Mediterranean.',
    prompt: 'Explain one way the trans-Saharan and Arabian caravan trade differed from Silk Road trade.',
  },
};

// People you can take with you: the role and the history behind it.
export const ROLE_FACTS = {
  merchant: 'Merchants were the engine of the trade networks. Many were middlemen who bought in one market and sold in the next rather than travelling the whole road.',
  guide: 'Guides and pilots carried knowledge of routes, wells and winds. Their expertise was a technology in itself, passed between generations.',
  driver: 'Camel drivers made the desert crossings possible. Camels were the main transport of the caravan trade, from the Sahara to the Taklamakan.',
  cook: 'Caravan cooks turned stored food into meals and kept the party fed on long stretches between markets. Food was a supply problem before it was a pleasure.',
  scholar: 'Scholars travelled with merchants and diplomats, and carried ideas, texts and languages between courts.',
  guard: 'Merchants hired guards because roads were dangerous and states did not always protect them.',
  interpreter: 'Interpreters were essential at borders, toll stations and markets, where merchants negotiated in several languages.',
  physician: 'Physicians treated fevers, wounds and plague. Their knowledge of herbs and contagion travelled with them along the same routes as the diseases.',
};

// Historical note for each era.
export const ERA_FACTS = {
  pax: {
    label: '1271 · Pax Mongolica',
    fact: 'Kublai Khan proclaimed the Yuan dynasty in 1271. Under Mongol rule, the overland routes from China to the Black Sea were unusually safe, which is why travellers like Marco Polo and Ibn Battuta could cross Eurasia.',
    prompt: 'Explain one way the Mongol Empire affected trade between 1200 and 1450.',
  },
  plague: {
    label: '1347 · The Black Death',
    fact: 'The Black Death reached Europe in 1347, carried along trade routes from Central Asia through the Black Sea and the Mediterranean. It killed a large share of the population of Europe and the Islamic world.',
    prompt: 'Explain one consequence of the spread of the Black Death along trade routes.',
  },
  timur: {
    label: '1399 · Timur\'s campaigns',
    fact: 'Timur (Tamerlane) built an empire from Samarkand through conquest. His campaigns disrupted the roads the Mongols had protected, and the unity of the Mongol peace was gone.',
    prompt: 'Explain one way the breakup of the Mongol Empire affected Eurasian trade.',
  },
};
