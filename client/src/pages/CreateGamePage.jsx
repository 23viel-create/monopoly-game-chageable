import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import GameWizard from '../features/gameWizard/GameWizard';

function CreateGamePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/dashboard" className="text-sm font-medium text-emerald-700 hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="mt-2 mb-6 text-2xl font-bold text-gray-800">Create a new game</h1>
        <GameWizard />
      </main>
    </div>
  );
}

export default CreateGamePage;
