const STYLES = {
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
};

function Alert({ type = 'error', children }) {
  if (!children) return null;
  return (
    <div role="alert" className={`mb-4 rounded-lg border px-4 py-3 text-sm ${STYLES[type]}`}>
      {children}
    </div>
  );
}

export default Alert;
