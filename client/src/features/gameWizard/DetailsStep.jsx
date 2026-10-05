import FormInput from '../../components/FormInput';

export const GAME_NAME_MAX_LENGTH = 100;

function DetailsStep({ name, onNameChange }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">Game details</h2>
      <p className="mt-1 mb-6 text-sm text-gray-500">Give your board a name. You can change it later.</p>
      <FormInput
        label="Game name"
        id="gameName"
        type="text"
        placeholder="e.g. Avi's 30th Birthday Monopoly"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        maxLength={GAME_NAME_MAX_LENGTH}
        autoFocus
        required
      />
      <p className="mt-1 text-right text-xs text-gray-400">
        {name.length}/{GAME_NAME_MAX_LENGTH}
      </p>
    </div>
  );
}

export default DetailsStep;
