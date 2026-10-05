// Centered card used by the login and register pages
function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-700">Monopoly</h1>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{title}</h2>
          {children}
        </div>
        {footer && <p className="mt-6 text-center text-sm text-gray-600">{footer}</p>}
      </div>
    </div>
  );
}

export default AuthCard;
