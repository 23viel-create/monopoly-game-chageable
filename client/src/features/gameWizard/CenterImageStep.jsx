import { useRef, useState } from 'react';
import api, { getErrorMessage } from '../../api/client';
import Alert from '../../components/Alert';

// Same limits as the server (services/uploadService.js), checked here for faster feedback
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function CenterImageStep({ image, onImageChange, onUploadingChange }) {
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(null);
  const inputRef = useRef(null);
  const uploading = progress !== null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    // Reset the input so choosing the same file again still triggers a change
    e.target.value = '';
    if (!file) return;

    setError('');
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, WebP and GIF images are allowed');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Image is too large (max 5 MB)');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setProgress(0);
    onUploadingChange(true);
    try {
      const { data } = await api.post('/api/upload', formData, {
        onUploadProgress: (event) => {
          if (event.total) setProgress(Math.round((event.loaded / event.total) * 100));
        },
      });
      onImageChange({ url: data.url, publicId: data.publicId });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setProgress(null);
      onUploadingChange(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800">Center image</h2>
      <p className="mt-1 mb-6 text-sm text-gray-500">
        This picture goes in the middle of the board. JPEG, PNG, WebP or GIF, up to 5 MB. Optional.
      </p>

      <Alert type="error">{error}</Alert>

      <input
        ref={inputRef}
        id="centerImage"
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        onChange={handleFileChange}
        disabled={uploading}
        className="sr-only"
      />

      {image ? (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <img
            src={image.url}
            alt="Center image preview"
            className="h-40 w-40 rounded-xl border border-gray-200 object-cover shadow-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current.click()}
              disabled={uploading}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
            >
              {uploading ? `Uploading ${progress}%...` : 'Replace'}
            </button>
            <button
              type="button"
              onClick={() => onImageChange(null)}
              disabled={uploading}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor="centerImage"
          className={`flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-500 transition hover:border-emerald-500 hover:text-emerald-700 ${
            uploading ? 'pointer-events-none opacity-70' : ''
          }`}
        >
          {uploading ? (
            <>
              <span className="font-medium">Uploading... {progress}%</span>
              <span className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-gray-200">
                <span className="block h-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} />
              </span>
            </>
          ) : (
            <>
              <span className="text-3xl">🖼️</span>
              <span className="mt-2 font-medium">Click to choose an image</span>
            </>
          )}
        </label>
      )}
    </div>
  );
}

export default CenterImageStep;
