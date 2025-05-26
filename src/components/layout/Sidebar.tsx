import { FC, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  HomeIcon,
  UserGroupIcon,
  QueueListIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  Cog8ToothIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface NavItemProps {
  to: string;
  icon: React.ReactElement;
  label: string;
  active: boolean;
}

const NavItem: FC<NavItemProps> = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={clsx(
        'group flex items-center px-2 py-2 text-base font-medium rounded-md',
        active
          ? 'bg-primary-700 text-white'
          : 'text-gray-100 hover:bg-primary-600 hover:text-white'
      )}
    >
      <div className="mr-3 h-6 w-6">{icon}</div>
      {label}
    </Link>
  );
};

const Sidebar: FC = () => {
  const location = useLocation();
  const { usuario } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = usuario?.rol === 'admin';
  const isSupervisor = usuario?.rol === 'supervisor';

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: HomeIcon, show: true },
    { name: 'Gestionar Turnos', to: '/turnos', icon: QueueListIcon, show: true },
    { name: 'Módulos', to: '/modulos', icon: BuildingOfficeIcon, show: isAdmin || isSupervisor },
    { name: 'Motivos de Visita', to: '/motivos', icon: ClipboardDocumentListIcon, show: isAdmin || isSupervisor },
    { name: 'Usuarios', to: '/usuarios', icon: UserGroupIcon, show: isAdmin || isSupervisor },
    { name: 'Reportes', to: '/reportes', icon: ChartBarIcon, show: isAdmin || isSupervisor },
    { name: 'Configuración', to: '/configuracion', icon: Cog8ToothIcon, show: isAdmin }
  ];

  // const filteredNavigation = navigation.filter(item => item.show);

  return (
    <>
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-primary-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-white font-bold text-xl">DigiTurno</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavItem
                    key={item.name}
                    to={item.to}
                    icon={<item.icon />}
                    label={item.name}
                    active={location.pathname === item.to}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de navegación móvil */}
      <div className="md:hidden">
        <button
          className="fixed bottom-4 right-4 z-50 bg-primary-600 text-white p-3 rounded-full shadow-lg"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Sidebar content */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-primary-800">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Cerrar sidebar</span>
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <span className="text-white font-bold text-xl">DigiTurno</span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navigation.map((item) => (
                    <NavItem
                      key={item.name}
                      to={item.to}
                      icon={<item.icon />}
                      label={item.name}
                      active={location.pathname === item.to}
                    />
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
