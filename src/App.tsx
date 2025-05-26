import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Turnos from './pages/Turnos';
import Reportes from './pages/Reportes';
import Configuracion from './features/Configuration/Page/Configuracion';
import AutoServicio from './pages/AutoServicio';
import PantallaTV from './pages/PantallaTV';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Store
import { useAuthStore } from './store/authStore';
import { useSedeStore } from './store/sedeStore';

function App() {
  const { isAuthenticated, authChecked, checkAuth } = useAuthStore();
  const { fetchSedes } = useSedeStore();
  
  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la app
    checkAuth();
    
    // Cargar sedes disponibles
    if (isAuthenticated) {
      fetchSedes();
    }
  }, [isAuthenticated, checkAuth, fetchSedes]);
  
  // Página de carga mientras se verifica la autenticación
  if (!authChecked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
      <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/autoservicio" element={<AutoServicio />} />
        <Route path="/pantalla" element={<PantallaTV />} />
        
        {/* Rutas protegidas - requieren autenticación */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/turnos" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Turnos />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/reportes" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Reportes />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/configuracion" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="admin">
              <Configuracion />
            </ProtectedRoute>
          }
        />
        
        {/* Redireccionar al dashboard si está autenticado, o al login si no */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        
        {/* Ruta para página no encontrada */}
        <Route path="*" element={
          <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
              <button 
                onClick={() => window.history.back()} 
                className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
              >
                Volver atrás
              </button>
            </div>
          </div>
        } />
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
