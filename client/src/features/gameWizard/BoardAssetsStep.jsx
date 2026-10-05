// Placeholder until board setup is built; shows what has been chosen so far
function BoardAssetsStep({ name, image }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">Board assets</h2>
      <div className="mt-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50 p-6 text-center">
        <p className="font-medium text-emerald-800">Coming next: Board setup</p>
        <p className="mt-1 text-sm text-emerald-700">Properties, cards and tile images will be set up here.</p>
      </div>
      <div className="mt-6 flex items-center gap-4 rounded-xl bg-gray-50 p-4">
        {image ? (
          <img src={image.url} alt="" className="h-14 w-14 rounded-lg object-cover" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">No image</div>
        )}
        <div>
          <p className="text-sm text-gray-500">So far</p>
          <p className="font-medium text-gray-800 break-all">{name}</p>
        </div>
      </div>
    </div>
  );
}

export default BoardAssetsStep;
