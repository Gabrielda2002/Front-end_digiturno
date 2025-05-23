import { useState, useEffect, FC } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface NotificacionProps {
  mensaje: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  duracion?: number;
  onClose: () => void;
}

const Notificacion: FC<NotificacionProps> = ({ 
  mensaje, 
  tipo, 
  duracion = 5000, 
  onClose 
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Para que la animación termine antes de eliminar
    }, duracion);

    return () => clearTimeout(timer);
  }, [duracion, onClose]);

  // Colores según el tipo
  const getTypeStyles = () => {
    switch (tipo) {
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800';
      default:
        return 'bg-blue-50 border-blue-500 text-blue-800';
    }
  };

  return (
    <div 
      className={`fixed top-5 right-5 max-w-sm w-full border-l-4 p-4 shadow-lg rounded transform transition-all duration-300 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
      } ${getTypeStyles()}`}
      role="alert"
    >
      <div className="flex justify-between">
        <div className="flex-grow">
          <p className="font-medium">{mensaje}</p>
        </div>
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }}>
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

interface NotificacionContainerProps {
  children?: React.ReactNode;
}

export const NotificacionContainer: FC<NotificacionContainerProps> = ({ children }) => {
  return (
    <div className="fixed top-0 right-0 p-4 space-y-4 z-50">
      {children}
    </div>
  );
};

export default Notificacion;
