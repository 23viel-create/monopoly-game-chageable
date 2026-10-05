import { Link, useNavigate } from 'react-router-dom';
import { clearSession } from '../auth';

// Top bar for pages that require a logged-in user
function AppHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link to="/dashboard" className="text-xl font-bold text-emerald-700">
          Monopoly
        </Link>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          Log out
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
