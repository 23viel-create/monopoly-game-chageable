// Numbered progress bar showing which wizard step is active
function StepIndicator({ steps, currentStep }) {
  return (
    <ol className="mb-8 flex items-center">
      {steps.map((label, index) => {
        const done = index < currentStep;
        const active = index === currentStep;
        return (
          <li key={label} className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
              <span
                aria-current={active ? 'step' : undefined}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  done ? 'bg-emerald-600 text-white' : active ? 'border-2 border-emerald-600 text-emerald-700' : 'border-2 border-gray-300 text-gray-400'
                }`}
              >
                {done ? '✓' : index + 1}
              </span>
              <span className={`text-xs sm:text-sm ${active ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>{label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 sm:mx-4 ${done ? 'bg-emerald-600' : 'bg-gray-200'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default StepIndicator;
