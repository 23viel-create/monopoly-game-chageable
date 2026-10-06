import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../../api/client';
import Alert from '../../components/Alert';
import StepIndicator from './StepIndicator';
import DetailsStep from './DetailsStep';
import CenterImageStep from './CenterImageStep';
import BoardPropertiesStep from './BoardPropertiesStep';
import { DEFAULT_TILES, createDefaultTiles } from './boardConfig';

const STEPS = ['Details', 'Center image', 'Board'];
// Leaving this step saves the draft game to the server
const SAVE_STEP = 1;
const DEFAULT_TILES_JSON = JSON.stringify(DEFAULT_TILES);

// Multi-step form for creating a game. All answers live in this component's
// state so going back and forth between steps keeps them.
function GameWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [centerImage, setCenterImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  // Set once the draft exists in the database; later steps update this game
  const [gameId, setGameId] = useState(null);
  // What the server last saved, to skip saving when nothing changed
  const [savedDetails, setSavedDetails] = useState(null);
  const [tiles, setTiles] = useState(createDefaultTiles);
  // JSON of the tiles as last saved; null until the board is saved once
  const [savedTilesJson, setSavedTilesJson] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [boardMessage, setBoardMessage] = useState('');

  const isLastStep = currentStep === STEPS.length - 1;
  const busy = uploading || saving;
  const canGoNext = !isLastStep && !busy && (currentStep !== 0 || name.trim().length > 0);

  const tilesJson = JSON.stringify(tiles);
  const boardSaved = savedTilesJson !== null;
  const hasUnsavedTileEdits = tilesJson !== (savedTilesJson ?? DEFAULT_TILES_JSON);

  // Warn before closing the tab with tile edits that aren't saved
  useEffect(() => {
    if (!hasUnsavedTileEdits) return undefined;
    const warn = (e) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsavedTileEdits]);

  // Sends a PATCH (or the first POST) and returns the saved game, or null on error
  const sendSave = async (request) => {
    setSaving(true);
    setSaveError('');
    setBoardMessage('');
    try {
      const { data } = await request();
      return data.game;
    } catch (err) {
      setSaveError(getErrorMessage(err));
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Creates the draft the first time, then only sends changes
  const saveDraft = async () => {
    const details = { name: name.trim(), centerImage: centerImage?.url ?? null };
    if (
      gameId &&
      savedDetails.name === details.name &&
      savedDetails.centerImage === details.centerImage
    ) {
      return true;
    }
    const game = await sendSave(() =>
      gameId ? api.patch(`/api/games/${gameId}`, details) : api.post('/api/games', details)
    );
    if (!game) return false;
    setGameId(game.id);
    setSavedDetails({ name: game.name, centerImage: game.boardData.centerImage });
    return true;
  };

  const saveBoard = async () => {
    const game = await sendSave(() => api.patch(`/api/games/${gameId}`, { tiles }));
    if (!game) return;
    // Use the server's copy so the "unsaved changes" check compares like with like
    setTiles(game.boardData.tiles);
    setSavedTilesJson(JSON.stringify(game.boardData.tiles));
    setBoardMessage('Board saved');
  };

  const updateTile = (updatedTile) => {
    setTiles((current) => current.map((t) => (t.position === updatedTile.position ? updatedTile : t)));
    setBoardMessage('');
  };

  const goNext = async (e) => {
    e.preventDefault();
    if (!canGoNext) return;
    if (currentStep === SAVE_STEP && !(await saveDraft())) return;
    setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    setSaveError('');
    setBoardMessage('');
    setCurrentStep(currentStep - 1);
  };

  let nextLabel = currentStep === 1 && !centerImage ? 'Skip' : 'Next';
  if (saving) nextLabel = 'Saving...';

  let boardStatus = 'All changes saved';
  if (hasUnsavedTileEdits) boardStatus = 'Unsaved changes';
  else if (!boardSaved) boardStatus = 'Board not saved yet';

  // Steps 1-2 are a form so pressing Enter moves on. The board step isn't,
  // because its tile editor has a form of its own.
  const Container = isLastStep ? 'div' : 'form';

  return (
    <div className="rounded-2xl bg-white p-6 shadow sm:p-8">
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <Container {...(isLastStep ? {} : { onSubmit: goNext })}>
        {currentStep === 0 && <DetailsStep name={name} onNameChange={setName} />}
        {currentStep === 1 && (
          <CenterImageStep image={centerImage} onImageChange={setCenterImage} onUploadingChange={setUploading} />
        )}
        {currentStep === 2 && (
          <BoardPropertiesStep name={name.trim()} image={centerImage} tiles={tiles} onTileChange={updateTile} />
        )}

        {saveError && (
          <div className="mt-6">
            <Alert type="error">Could not save your game: {saveError}</Alert>
          </div>
        )}
        {boardMessage && !saveError && (
          <div className="mt-6">
            <Alert type="success">{boardMessage}</Alert>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 0 || busy}
            className={`rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 ${
              currentStep === 0 ? 'invisible' : ''
            }`}
          >
            Back
          </button>
          {isLastStep ? (
            <div className="flex items-center gap-3">
              <span
                className={`hidden text-sm sm:inline ${hasUnsavedTileEdits ? 'text-amber-600' : 'text-gray-400'}`}
                data-testid="board-status"
              >
                {boardStatus}
              </span>
              <button
                type="button"
                onClick={saveBoard}
                disabled={saving || (boardSaved && !hasUnsavedTileEdits)}
                className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Board'}
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!canGoNext}
              className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {nextLabel}
            </button>
          )}
        </div>
        {isLastStep && (
          <p className={`mt-2 text-right text-xs sm:hidden ${hasUnsavedTileEdits ? 'text-amber-600' : 'text-gray-400'}`}>
            {boardStatus}
          </p>
        )}
      </Container>
    </div>
  );
}

export default GameWizard;
