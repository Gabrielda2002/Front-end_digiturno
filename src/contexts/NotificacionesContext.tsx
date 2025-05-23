import React, { createContext, useContext, ReactNode } from 'react';
import { useNotificaciones } from '../hooks/useNotificaciones';
import Notificacion, { NotificacionContainer } from '../components/ui/Notificacion';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificacionesContextType {
  notificaciones: {
    id: string;
    mensaje: string;
    tipo: NotificationType;
    duracion?: number;
  }[];
  agregarNotificacion: (mensaje: string, tipo: NotificationType, duracion?: number) => string;
  eliminarNotificacion: (id: string) => void;
  limpiarNotificaciones: () => void;
  info: (mensaje: string, duracion?: number) => string;
  exito: (mensaje: string, duracion?: number) => string;
  advertencia: (mensaje: string, duracion?: number) => string;
  error: (mensaje: string, duracion?: number) => string;
}

const NotificacionesContext = createContext<NotificacionesContextType | undefined>(undefined);

interface NotificacionesProviderProps {
  children: ReactNode;
}

export const NotificacionesProvider: React.FC<NotificacionesProviderProps> = ({ children }) => {
  const notificacionesHook = useNotificaciones();

  return (
    <NotificacionesContext.Provider value={notificacionesHook}>
      {children}
      <NotificacionContainer>
        {notificacionesHook.notificaciones.map((notif) => (
          <Notificacion
            key={notif.id}
            mensaje={notif.mensaje}
            tipo={notif.tipo}
            duracion={notif.duracion}
            onClose={() => notificacionesHook.eliminarNotificacion(notif.id)}
          />
        ))}
      </NotificacionContainer>
    </NotificacionesContext.Provider>
  );
};

export const useNotificacionesContext = (): NotificacionesContextType => {
  const context = useContext(NotificacionesContext);
  if (context === undefined) {
    throw new Error('useNotificacionesContext debe ser utilizado dentro de un NotificacionesProvider');
  }
  return context;
};
