import { useState } from 'react';
import Modal from '../../components/Modal';
import {
  COLOR_GROUPS,
  CUSTOM_NAME_MAX_LENGTH,
  DEFAULT_TILES,
  PRICE_MAX,
  PRICE_MIN,
  TILE_TYPES,
  hasColor,
  isBuyable,
} from './boardConfig';

// Edits a copy of one tile; changes reach the board only when "Apply" is pressed
function TileEditorModal({ tile, onApply, onClose }) {
  const base = DEFAULT_TILES[tile.position];
  const [customName, setCustomName] = useState(tile.customName);
  // Kept as text while typing so the field can be cleared
  const [price, setPrice] = useState(tile.price === null ? '' : String(tile.price));
  const [color, setColor] = useState(tile.color);

  const priceNumber = Number(price);
  const priceValid = !isBuyable(tile) || (/^\d+$/.test(price) && priceNumber >= PRICE_MIN && priceNumber <= PRICE_MAX);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!priceValid) return;
    onApply({
      ...tile,
      customName: customName.trim(),
      price: isBuyable(tile) ? priceNumber : tile.price,
      color: hasColor(tile) ? color : tile.color,
    });
  };

  const resetToDefault = () => {
    setCustomName('');
    setPrice(base.price === null ? '' : String(base.price));
    setColor(base.color);
  };

  return (
    <Modal title={`Tile #${tile.position} · ${TILE_TYPES[tile.type].label}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="tileName" className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="tileName"
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            maxLength={CUSTOM_NAME_MAX_LENGTH}
            placeholder={base.defaultName}
            data-autofocus
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
          <p className="mt-1 flex justify-between text-xs text-gray-400">
            <span>Leave empty to use “{base.defaultName}”</span>
            <span>
              {customName.length}/{CUSTOM_NAME_MAX_LENGTH}
            </span>
          </p>
        </div>

        {isBuyable(tile) && (
          <div>
            <label htmlFor="tilePrice" className="mb-1 block text-sm font-medium text-gray-700">
              Price
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">$</span>
              <input
                id="tilePrice"
                type="number"
                inputMode="numeric"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                aria-invalid={!priceValid}
                aria-describedby="tilePriceHelp"
                className={`w-full rounded-lg border py-2 pl-7 pr-3 text-gray-900 focus:outline-none focus:ring-2 ${
                  priceValid
                    ? 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/40'
                    : 'border-red-400 focus:border-red-500 focus:ring-red-500/30'
                }`}
              />
            </div>
            <p id="tilePriceHelp" className={`mt-1 text-xs ${priceValid ? 'text-gray-400' : 'text-red-600'}`}>
              {priceValid
                ? `Standard price: $${base.price}`
                : `Enter a whole number from ${PRICE_MIN} to ${PRICE_MAX.toLocaleString()}`}
            </p>
          </div>
        )}

        {hasColor(tile) && (
          <fieldset>
            <legend className="mb-2 block text-sm font-medium text-gray-700">Colour group</legend>
            <div className="grid grid-cols-4 gap-2" role="radiogroup">
              {Object.entries(COLOR_GROUPS).map(([key, group]) => (
                <label
                  key={key}
                  className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg border p-2 text-[11px] text-gray-600 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-500 ${
                    color === key ? 'border-emerald-500 bg-emerald-50 font-semibold' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="tileColor"
                    value={key}
                    checked={color === key}
                    onChange={() => setColor(key)}
                    className="sr-only"
                  />
                  <span className="h-5 w-full rounded" style={{ backgroundColor: group.hex }} aria-hidden="true" />
                  {group.label}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {!isBuyable(tile) && (
          <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
            {tile.amount !== null
              ? `Players who land here pay $${tile.amount}. Only the name can be changed.`
              : 'Only the name of this tile can be changed.'}
          </p>
        )}

        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={resetToDefault}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            Reset to default
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 sm:flex-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!priceValid}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              Apply
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default TileEditorModal;
