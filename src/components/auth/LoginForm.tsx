import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
}

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
}) => {
  const navigate = useNavigate();
  const { login, isAuthenticated, error: authError } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleOnSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h2>
          <p className="text-gray-600">Ingresa tus credenciales para acceder</p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <Input
            label="Correo electrónico"
            type="text"
            placeholder="ejemplo@correo.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="********"
            {...register('password')}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="mt-6"
          >
            Iniciar sesión
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
