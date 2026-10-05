import { Link } from 'react-router-dom';
import { getUser } from '../auth';
import AppHeader from '../components/AppHeader';

// Placeholder until the game lobby is built
function DashboardPage() {
  const user = getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl bg-white p-6 shadow sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome, {user?.username || 'player'}!
              </h2>
              <p className="mt-2 text-gray-600">Create a custom board for your next game night.</p>
            </div>
            <Link
              to="/create-game"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              + Create new game
            </Link>
          </div>
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
