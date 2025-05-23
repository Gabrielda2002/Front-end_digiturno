import { useState, useCallback } from 'react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notificacion {
  id: string;
  mensaje: string;
  tipo: NotificationType;
  duracion?: number;
}

export const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const agregarNotificacion = useCallback(
    (mensaje: string, tipo: NotificationType = 'info', duracion: number = 5000) => {
      const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setNotificaciones((prev) => [...prev, { id, mensaje, tipo, duracion }]);
      return id;
    },
    []
  );

  const eliminarNotificacion = useCallback((id: string) => {
    setNotificaciones((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const limpiarNotificaciones = useCallback(() => {
    setNotificaciones([]);
  }, []);

  return {
    notificaciones,
    agregarNotificacion,
    eliminarNotificacion,
    limpiarNotificaciones,
    // Atajos para tipos comunes
    info: (mensaje: string, duracion?: number) => agregarNotificacion(mensaje, 'info', duracion),
    exito: (mensaje: string, duracion?: number) => agregarNotificacion(mensaje, 'success', duracion),
    advertencia: (mensaje: string, duracion?: number) => agregarNotificacion(mensaje, 'warning', duracion),
    error: (mensaje: string, duracion?: number) => agregarNotificacion(mensaje, 'error', duracion)
  };
};
