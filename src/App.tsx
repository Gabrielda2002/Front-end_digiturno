// src/App.tsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Turnos from "./pages/Turnos";
import Reportes from "./pages/Reportes";
import Configuracion from "./features/Configuration/Page/Configuracion";
import AutoServicio from "./features/AutoService/Page/AutoServicio";
import PantallaTV from "./pages/PantallaTV";
import Setup from "./pages/Setup";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Store
import { useAuthStore } from "./store/authStore";
import { useSedeStore } from "./store/sedeStore";
import { InstallationProvider, useInstallation } from "./contexts/InstallationContext";

function AppContent() {
  const { isAuthenticated, authChecked, checkAuth } = useAuthStore();
  const { fetchSedes } = useSedeStore();
  const { isConfigured } = useInstallation();
  console.log("isconfigured", isConfigured);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la app
    checkAuth();

    // Cargar sedes disponibles solo si está autenticado
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
        {/* Ruta de configuración inicial - DEBE ir primero */}
        <Route path="/setup" element={<Setup />} />
        
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : isConfigured ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/setup" replace />
            )
          }
        />
        <Route path="/autoservicio" element={<AutoServicio />} />
        <Route path="/pantalla" element={<PantallaTV />} />

        {/* Rutas protegidas - requieren autenticación Y configuración */}
        <Route
          path="/dashboard"
          element={
            isConfigured ? (
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            ) : (
              <Navigate to="/setup" replace />
            )
          }
        />
        <Route
          path="/turnos"
          element={
            isConfigured ? (
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Turnos />
              </ProtectedRoute>
            ) : (
              <Navigate to="/setup" replace />
            )
          }
        />
        <Route
          path="/reportes"
          element={
            isConfigured ? (
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Reportes />
              </ProtectedRoute>
            ) : (
              <Navigate to="/setup" replace />
            )
          }
        />
        <Route
          path="/configuracion"
          element={
            isConfigured ? (
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                requiredRole="admin"
              >
                <Configuracion />
              </ProtectedRoute>
            ) : (
              <Navigate to="/setup" replace />
            )
          }
        />

        {/* Ruta raíz con lógica de redirección */}
        <Route
          path="/"
          element={
            !isConfigured ? (
              <Navigate to="/setup" replace />
            ) : !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Ruta para página no encontrada */}
        <Route
          path="*"
          element={
            <div className="flex h-screen items-center justify-center bg-gray-100">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-6">
                  Página no encontrada
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700"
                >
                  Volver atrás
                </button>
              </div>
            </div>
          }
        />
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

function App() {
  return (
    <InstallationProvider>
      <AppContent />
    </InstallationProvider>
  );
}

export default App;