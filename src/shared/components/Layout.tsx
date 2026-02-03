import { Outlet, Link } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">Pet App</div>
            <ul className="flex gap-6">
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
