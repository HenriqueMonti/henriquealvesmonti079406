import { Outlet, Link, useNavigate } from 'react-router-dom';
import { authService } from '@/core/facades/auth.facade';

export const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">🐾 Pet App</div>
            <ul className="flex gap-6 items-center">
              <li>
                <Link to="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pets" className="text-gray-700 hover:text-blue-600">
                  Pets
                </Link>
              </li>
              <li>
                <Link to="/tutores" className="text-gray-700 hover:text-blue-600">
                  Tutores
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  🚪 Sair
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
