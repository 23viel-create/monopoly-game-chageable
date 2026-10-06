const { DEFAULT_LAYOUT, COLOR_GROUPS, BUYABLE_TYPES } = require('../config/defaultBoard');

const CUSTOM_NAME_MAX_LENGTH = 40;
const PRICE_MIN = 1;
const PRICE_MAX = 9999;

//Validates tiles sent by the client and rebuilds them from the standard layout.
//Only customName, price (buyable tiles) and color (street properties) are taken
//from the client; position, type, defaultName and amount always come from the
//server, so a client can't reorder tiles or change what a tile does.
//Returns { tiles } on success or { error } with a message for the client.
const normalizeTiles = (tiles) => {
    if (!Array.isArray(tiles) || tiles.length !== DEFAULT_LAYOUT.length) {
        return { error: `Board must have exactly ${DEFAULT_LAYOUT.length} tiles` };
    }

    const result = [];
    for (let i = 0; i < DEFAULT_LAYOUT.length; i++) {
        const base = DEFAULT_LAYOUT[i];
        const input = tiles[i];
        const where = `Tile ${i} (${base.defaultName})`;

        if (!input || typeof input !== 'object' || input.position !== i || input.type !== base.type) {
            return { error: `${where} does not match the standard board layout` };
        }

        const customName = input.customName ?? '';
        if (typeof customName !== 'string' || customName.trim().length > CUSTOM_NAME_MAX_LENGTH) {
            return { error: `${where}: name must be at most ${CUSTOM_NAME_MAX_LENGTH} characters` };
        }

        let price = null;
        if (BUYABLE_TYPES.includes(base.type)) {
            price = input.price;
            if (!Number.isInteger(price) || price < PRICE_MIN || price > PRICE_MAX) {
                return { error: `${where}: price must be a whole number from ${PRICE_MIN} to ${PRICE_MAX}` };
            }
        }

        let color = null;
        if (base.type === 'property') {
            color = input.color;
            if (!COLOR_GROUPS.includes(color)) {
                return { error: `${where}: unknown colour group` };
            }
        }

        result.push({
            position: i,
            type: base.type,
            defaultName: base.defaultName,
            customName: customName.trim(),
            color,
            price,
            amount: base.amount,
            //Tile images come in a later step
            image: null,
        });
    }
    return { tiles: result };
};

module.exports = { normalizeTiles, CUSTOM_NAME_MAX_LENGTH, PRICE_MIN, PRICE_MAX };
