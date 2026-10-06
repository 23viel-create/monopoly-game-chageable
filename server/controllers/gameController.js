const gameModel = require('../models/gameModel');
const { isOwnUploadUrl } = require('../services/uploadService');
const { normalizeTiles } = require('../services/boardService');

const NAME_MAX_LENGTH = 100;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

//Shape sent to the client (camelCase, like the user endpoints)
const toGameResponse = (game) => ({
    id: game.id,
    name: game.name,
    status: game.status,
    joinCode: game.join_code,
    boardData: game.board_data,
    createdAt: game.created_at,
});

//Returns an error message, or null if the name is valid
const validateName = (name) => {
    if (typeof name !== 'string' || !name.trim()) {
        return 'Game name is required';
    }
    if (name.trim().length > NAME_MAX_LENGTH) {
        return `Game name must be at most ${NAME_MAX_LENGTH} characters`;
    }
    return null;
};

//Returns an error message, or null if centerImage is empty or one of the user's uploads
const validateCenterImage = (centerImage, userId) => {
    if (centerImage === undefined || centerImage === null || centerImage === '') {
        return null;
    }
    if (!isOwnUploadUrl(centerImage, userId)) {
        return 'Center image must be an image you uploaded';
    }
    return null;
};

//POST /api/games - creates a draft game owned by the logged-in user
const createGame = async (req, res) => {
    const { name, centerImage } = req.body || {};

    const error = validateName(name) || validateCenterImage(centerImage, req.user.id);
    if (error) {
        return res.status(400).json({ message: error });
    }

    const boardData = {
        centerImage: centerImage || null,
        tiles: [],
        cards: {},
    };

    try {
        const game = await gameModel.createGame(req.user.id, name.trim(), boardData);
        res.status(201).json({ game: toGameResponse(game) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

//PATCH /api/games/:id - updates the name, center image and/or tiles of the user's own game
const updateGameDetails = async (req, res) => {
    const { id } = req.params;
    const { name, centerImage, tiles } = req.body || {};

    //Not found rather than "forbidden", so other users' game ids aren't revealed
    if (!UUID_REGEX.test(id)) {
        return res.status(404).json({ message: 'Game not found' });
    }
    if (name === undefined && centerImage === undefined && tiles === undefined) {
        return res.status(400).json({ message: 'Nothing to update' });
    }
    const error = (name !== undefined && validateName(name)) || validateCenterImage(centerImage, req.user.id);
    if (error) {
        return res.status(400).json({ message: error });
    }
    let normalizedTiles;
    if (tiles !== undefined) {
        const board = normalizeTiles(tiles);
        if (board.error) {
            return res.status(400).json({ message: board.error });
        }
        normalizedTiles = board.tiles;
    }

    try {
        const game = await gameModel.updateGameDetails(id, req.user.id, {
            name: name === undefined ? undefined : name.trim(),
            centerImage: centerImage === undefined ? undefined : centerImage || null,
            tiles: normalizedTiles,
        });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json({ game: toGameResponse(game) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createGame, updateGameDetails };
