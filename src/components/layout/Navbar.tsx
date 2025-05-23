import { FC } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, Cog6ToothIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Navbar: FC = () => {
  const { usuario, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard">
                <img
                  className="h-8 w-auto"
                  src="/logo.png"
                  alt="DigiTurno Logo"
                  onError={(e) => {
                    // Si la imagen no existe, usar un texto como respaldo
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling!.style.display = 'block';
                  }}
                />
                <span className="hidden text-xl font-semibold text-primary-600">DigiTurno</span>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:items-center">
              <div className="text-right mr-4">
                <p className="text-sm font-medium text-gray-900">{usuario?.nombre}</p>
                <p className="text-xs text-gray-500">{usuario?.rol}</p>
              </div>

              <div className="ml-3 relative flex">
                <Link
                  to="/perfil"
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                >
                  <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
                </Link>

                {usuario?.rol === 'admin' && (
                  <Link
                    to="/admin"
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none ml-2"
                  >
                    <Cog6ToothIcon className="h-6 w-6" aria-hidden="true" />
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none ml-2"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
