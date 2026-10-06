import { useState } from 'react';
import TileCard from './TileCard';
import TileEditorModal from './TileEditorModal';
import { isCustomized } from './boardConfig';

// Step 3: grid of all 40 tiles; clicking one opens the tile editor
function BoardPropertiesStep({ name, image, tiles, onTileChange }) {
  const [editingPosition, setEditingPosition] = useState(null);
  const customizedCount = tiles.filter(isCustomized).length;

  const handleApply = (updatedTile) => {
    onTileChange(updatedTile);
    setEditingPosition(null);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        {image ? (
          <img src={image.url} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl" aria-hidden="true">
            🎲
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-gray-800">Board properties</h2>
          <p className="text-sm text-gray-500 [overflow-wrap:anywhere]">{name}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Click a tile to rename it or change its price and colour.{' '}
        <span className="font-medium text-emerald-700">
          {customizedCount} of {tiles.length} tiles customised
        </span>
      </p>

      <div className="mt-4 max-h-[60vh] overflow-y-auto rounded-xl bg-gray-50 p-2 sm:p-3" data-testid="tile-grid">
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5">
          {tiles.map((tile) => (
            <li key={tile.position}>
              <TileCard tile={tile} onSelect={setEditingPosition} />
            </li>
          ))}
        </ol>
      </div>

      {editingPosition !== null && (
        <TileEditorModal
          tile={tiles[editingPosition]}
          onApply={handleApply}
          onClose={() => setEditingPosition(null)}
        />
      )}
    </div>
  );
}

export default BoardPropertiesStep;
