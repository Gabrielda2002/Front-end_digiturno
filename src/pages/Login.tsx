import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import Card from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-primary">DigiTurno</h1>
          <h2 className="mt-6 text-xl font-bold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingrese sus credenciales para acceder al sistema
          </p>
        </div>
        <Card>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          <LoginForm onSubmit={handleLogin} />
        </Card>
      </div>
    </div>
  );
};

export default Login;
