import { useState } from 'react';
import api, { getErrorMessage } from '../../api/client';
import Alert from '../../components/Alert';
import StepIndicator from './StepIndicator';
import DetailsStep from './DetailsStep';
import CenterImageStep from './CenterImageStep';
import BoardAssetsStep from './BoardAssetsStep';

const STEPS = ['Details', 'Center image', 'Board'];
// Leaving this step saves the draft game to the server
const SAVE_STEP = 1;

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
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const isLastStep = currentStep === STEPS.length - 1;
  const busy = uploading || saving;
  const canGoNext = !isLastStep && !busy && (currentStep !== 0 || name.trim().length > 0);

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

    setSaving(true);
    setSaveError('');
    try {
      const { data } = gameId
        ? await api.patch(`/api/games/${gameId}`, details)
        : await api.post('/api/games', details);
      setGameId(data.game.id);
      setSavedDetails({ name: data.game.name, centerImage: data.game.boardData.centerImage });
      return true;
    } catch (err) {
      setSaveError(getErrorMessage(err));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const goNext = async (e) => {
    e.preventDefault();
    if (!canGoNext) return;
    if (currentStep === SAVE_STEP && !(await saveDraft())) return;
    setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    setSaveError('');
    setCurrentStep(currentStep - 1);
  };

  let nextLabel = currentStep === 1 && !centerImage ? 'Skip' : 'Next';
  if (saving) nextLabel = 'Saving...';

  return (
    <div className="rounded-2xl bg-white p-6 shadow sm:p-8">
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      {/* A form so pressing Enter in the name field moves to the next step */}
      <form onSubmit={goNext}>
        {currentStep === 0 && <DetailsStep name={name} onNameChange={setName} />}
        {currentStep === 1 && (
          <CenterImageStep image={centerImage} onImageChange={setCenterImage} onUploadingChange={setUploading} />
        )}
        {currentStep === 2 && <BoardAssetsStep name={name.trim()} image={centerImage} saved={Boolean(gameId)} />}

        {saveError && (
          <div className="mt-6">
            <Alert type="error">Could not save your game: {saveError}</Alert>
          </div>
        )}

        <div className="mt-8 flex justify-between gap-3 border-t border-gray-100 pt-6">
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
          {!isLastStep && (
            <button
              type="submit"
              disabled={!canGoNext}
              className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {nextLabel}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default GameWizard;
