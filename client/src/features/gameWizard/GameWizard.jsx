import { useState } from 'react';
import StepIndicator from './StepIndicator';
import DetailsStep from './DetailsStep';
import CenterImageStep from './CenterImageStep';
import BoardAssetsStep from './BoardAssetsStep';

const STEPS = ['Details', 'Center image', 'Board'];

// Multi-step form for creating a game. All answers live in this component's
// state so going back and forth between steps keeps them.
function GameWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [centerImage, setCenterImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const isLastStep = currentStep === STEPS.length - 1;
  const canGoNext = !isLastStep && !uploading && (currentStep !== 0 || name.trim().length > 0);

  const goNext = (e) => {
    e.preventDefault();
    if (canGoNext) setCurrentStep(currentStep + 1);
  };

  const goBack = () => setCurrentStep(currentStep - 1);

  return (
    <div className="rounded-2xl bg-white p-6 shadow sm:p-8">
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      {/* A form so pressing Enter in the name field moves to the next step */}
      <form onSubmit={goNext}>
        {currentStep === 0 && <DetailsStep name={name} onNameChange={setName} />}
        {currentStep === 1 && (
          <CenterImageStep image={centerImage} onImageChange={setCenterImage} onUploadingChange={setUploading} />
        )}
        {currentStep === 2 && <BoardAssetsStep name={name.trim()} image={centerImage} />}

        <div className="mt-8 flex justify-between gap-3 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 0 || uploading}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 disabled:invisible"
          >
            Back
          </button>
          {!isLastStep && (
            <button
              type="submit"
              disabled={!canGoNext}
              className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {currentStep === 1 && !centerImage ? 'Skip' : 'Next'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default GameWizard;
