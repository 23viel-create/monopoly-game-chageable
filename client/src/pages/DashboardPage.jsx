import { useNavigate } from 'react-router-dom';
import { clearSession, getUser } from '../auth';

// Placeholder until the game lobby is built
function DashboardPage() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-emerald-700">Monopoly</h1>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl bg-white p-6 shadow sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome, {user?.username || 'player'}!
          </h2>
          <p className="mt-2 text-gray-600">The game lobby is coming soon.</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="font-medium text-gray-800 break-all">{user?.email}</dd>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <dt className="text-sm text-gray-500">Email verified</dt>
              <dd className="font-medium text-gray-800">{user?.isVerified ? 'Yes' : 'Not yet'}</dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
