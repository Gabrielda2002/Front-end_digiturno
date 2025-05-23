import { FC, ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Navbar />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          {/* Contenido de la página */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
