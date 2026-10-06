//Standard 40-tile Monopoly layout (US edition), in board order starting at GO.
//The server is the source of truth for tile positions and types; players can
//only customise the name, price and colour group (see services/boardService.js).
//Keep in sync with client/src/features/gameWizard/boardConfig.js.

const COLOR_GROUPS = ['brown', 'lightblue', 'pink', 'orange', 'red', 'yellow', 'green', 'darkblue'];

//Tile types that can be bought, and so have a price
const BUYABLE_TYPES = ['property', 'railroad', 'utility'];

const tile = (type, defaultName, extra = {}) => ({ type, defaultName, color: null, price: null, amount: null, ...extra });
const property = (defaultName, color, price) => tile('property', defaultName, { color, price });

const DEFAULT_LAYOUT = [
    tile('go', 'GO'),
    property('Mediterranean Avenue', 'brown', 60),
    tile('community_chest', 'Community Chest'),
    property('Baltic Avenue', 'brown', 60),
    tile('tax', 'Income Tax', { amount: 200 }),
    tile('railroad', 'Reading Railroad', { price: 200 }),
    property('Oriental Avenue', 'lightblue', 100),
    tile('chance', 'Chance'),
    property('Vermont Avenue', 'lightblue', 100),
    property('Connecticut Avenue', 'lightblue', 120),
    tile('jail', 'Jail / Just Visiting'),
    property('St. Charles Place', 'pink', 140),
    tile('utility', 'Electric Company', { price: 150 }),
    property('States Avenue', 'pink', 140),
    property('Virginia Avenue', 'pink', 160),
    tile('railroad', 'Pennsylvania Railroad', { price: 200 }),
    property('St. James Place', 'orange', 180),
    tile('community_chest', 'Community Chest'),
    property('Tennessee Avenue', 'orange', 180),
    property('New York Avenue', 'orange', 200),
    tile('free_parking', 'Free Parking'),
    property('Kentucky Avenue', 'red', 220),
    tile('chance', 'Chance'),
    property('Indiana Avenue', 'red', 220),
    property('Illinois Avenue', 'red', 240),
    tile('railroad', 'B&O Railroad', { price: 200 }),
    property('Atlantic Avenue', 'yellow', 260),
    property('Ventnor Avenue', 'yellow', 260),
    tile('utility', 'Water Works', { price: 150 }),
    property('Marvin Gardens', 'yellow', 280),
    tile('go_to_jail', 'Go To Jail'),
    property('Pacific Avenue', 'green', 300),
    property('North Carolina Avenue', 'green', 300),
    tile('community_chest', 'Community Chest'),
    property('Pennsylvania Avenue', 'green', 320),
    tile('railroad', 'Short Line', { price: 200 }),
    tile('chance', 'Chance'),
    property('Park Place', 'darkblue', 350),
    tile('tax', 'Luxury Tax', { amount: 100 }),
    property('Boardwalk', 'darkblue', 400),
].map((t, position) => Object.freeze({ position, ...t }));

module.exports = { DEFAULT_LAYOUT, COLOR_GROUPS, BUYABLE_TYPES };
