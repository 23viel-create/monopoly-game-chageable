import { COLOR_GROUPS, TILE_TYPES, isCustomized } from './boardConfig';

// One tile in the board editor grid
function TileCard({ tile, onSelect }) {
  const type = TILE_TYPES[tile.type];
  const color = tile.color ? COLOR_GROUPS[tile.color] : null;
  const customized = isCustomized(tile);
  const displayName = tile.customName || tile.defaultName;

  return (
    <button
      type="button"
      onClick={() => onSelect(tile.position)}
      data-position={tile.position}
      aria-label={`Edit tile ${tile.position}: ${displayName}`}
      className={`group relative flex h-full w-full flex-col overflow-hidden rounded-xl border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
        customized ? 'border-emerald-300' : 'border-gray-200'
      }`}
    >
      <span
        className="block h-3 w-full shrink-0"
        style={{ backgroundColor: color ? color.hex : '#E5E7EB' }}
        aria-hidden="true"
      />
      <span className="flex flex-1 flex-col gap-1 p-2.5">
        <span className="flex items-center justify-between text-[11px] text-gray-400">
          <span>#{tile.position}</span>
          <span aria-hidden="true">{type.icon}</span>
        </span>
        <span
          className={`text-sm leading-snug [overflow-wrap:anywhere] ${
            tile.customName ? 'font-semibold text-gray-800' : 'text-gray-600'
          }`}
        >
          {displayName}
        </span>
        {tile.customName && (
          <span className="text-[11px] leading-tight text-gray-400 [overflow-wrap:anywhere]">{tile.defaultName}</span>
        )}
        <span className="mt-auto pt-1 text-xs font-medium text-gray-500">
          {tile.price !== null ? `$${tile.price}` : tile.amount !== null ? `Pay $${tile.amount}` : type.label}
        </span>
      </span>
      {customized && (
        <span className="absolute right-1.5 top-4 h-2 w-2 rounded-full bg-emerald-500" title="Customised" />
      )}
    </button>
  );
}

export default TileCard;
