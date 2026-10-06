// Standard 40-tile Monopoly layout (US edition), in board order starting at GO.
// Keep in sync with server/config/defaultBoard.js - the server rejects boards
// whose tile positions or types don't match its copy.

export const CUSTOM_NAME_MAX_LENGTH = 40;
export const PRICE_MIN = 1;
export const PRICE_MAX = 9999;

// Street colour groups, in board order
export const COLOR_GROUPS = {
  brown: { label: 'Brown', hex: '#8B4513' },
  lightblue: { label: 'Light blue', hex: '#87CEEB' },
  pink: { label: 'Pink', hex: '#D93A96' },
  orange: { label: 'Orange', hex: '#F7941D' },
  red: { label: 'Red', hex: '#ED1B24' },
  yellow: { label: 'Yellow', hex: '#FEF200' },
  green: { label: 'Green', hex: '#1FB25A' },
  darkblue: { label: 'Dark blue', hex: '#0072BB' },
};

export const TILE_TYPES = {
  go: { label: 'Start', icon: '🏁' },
  property: { label: 'Property', icon: '🏠' },
  railroad: { label: 'Station', icon: '🚂' },
  utility: { label: 'Utility', icon: '💡' },
  chance: { label: 'Chance', icon: '❓' },
  community_chest: { label: 'Community Chest', icon: '🎁' },
  tax: { label: 'Tax', icon: '💰' },
  jail: { label: 'Jail', icon: '🔒' },
  free_parking: { label: 'Free Parking', icon: '🅿️' },
  go_to_jail: { label: 'Go To Jail', icon: '👮' },
};

// Tiles that can be bought, and so have a price
export const isBuyable = (tile) => ['property', 'railroad', 'utility'].includes(tile.type);
// Only streets belong to a colour group
export const hasColor = (tile) => tile.type === 'property';

const tile = (type, defaultName, extra = {}) => ({
  type,
  defaultName,
  customName: '',
  color: null,
  price: null,
  amount: null,
  image: null,
  ...extra,
});
const property = (defaultName, color, price) => tile('property', defaultName, { color, price });

export const DEFAULT_TILES = Object.freeze(
  [
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
  ].map((t, position) => Object.freeze({ position, ...t }))
);

// A fresh, editable copy of the default board
export const createDefaultTiles = () => DEFAULT_TILES.map((t) => ({ ...t }));

// True if a tile differs from the standard board
export const isCustomized = (tile) => {
  const base = DEFAULT_TILES[tile.position];
  return tile.customName !== '' || tile.price !== base.price || tile.color !== base.color;
};
