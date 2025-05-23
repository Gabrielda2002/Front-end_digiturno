import { FC } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Turno } from '../../types/api.types';

interface TurnoCardProps {
  turno: Turno;
  onLlamar?: () => void;
  onAtender?: () => void;
  onDerivar?: () => void;
  onCancelar?: () => void;
  showActions?: boolean;
}

const TurnoCard: FC<TurnoCardProps> = ({
  turno,
  onLlamar,
  onAtender,
  onDerivar,
  onCancelar,
  showActions = true,
}) => {
  // Colores según el estado del turno
  const getStatusColor = () => {
    switch (turno.estado) {
      case 'esperando':
        return 'bg-blue-100 text-blue-800';
      case 'llamando':
        return 'bg-yellow-100 text-yellow-800';
      case 'atendido':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'derivado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (turno.estado) {
      case 'esperando':
        return 'En espera';
      case 'llamando':
        return 'Llamando';
      case 'atendido':
        return 'Atendido';
      case 'cancelado':
        return 'Cancelado';
      case 'derivado':
        return 'Derivado';
      default:
        return turno.estado;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'HH:mm', { locale: es });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-soft p-4 mb-4 border-l-4 border-primary-500">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <span className="text-2xl font-bold text-primary-700">{turno.numero_turno}</span>
            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>
              <span className="font-medium">Cédula:</span> {turno.cedula}
            </p>
            {turno.motivo && (
              <p>
                <span className="font-medium">Motivo:</span> {turno.motivo.nombre}
              </p>
            )}
            {turno.modulo && (
              <p>
                <span className="font-medium">Módulo:</span> {turno.modulo.nombre}
              </p>
            )}
          </div>
          
          <div className="mt-2 text-xs text-gray-400">
            <span>Creado: {formatTime(turno.fecha_creacion)}</span>
            {turno.fecha_llamado && (
              <span className="ml-2">Llamado: {formatTime(turno.fecha_llamado)}</span>
            )}
            {turno.fecha_atencion && (
              <span className="ml-2">Atendido: {formatTime(turno.fecha_atencion)}</span>
            )}
            {turno.tiempoEspera !== undefined && (
              <p className="mt-1">Tiempo de espera: {turno.tiempoEspera} min</p>
            )}
          </div>
        </div>
      </div>
      
      {showActions && turno.estado !== 'atendido' && turno.estado !== 'cancelado' && (
        <div className="mt-4 flex flex-wrap gap-2">
          {turno.estado === 'esperando' && onLlamar && (
            <button
              onClick={onLlamar}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded hover:bg-yellow-200"
            >
              Llamar
            </button>
          )}
          
          {turno.estado === 'llamando' && onAtender && (
            <button
              onClick={onAtender}
              className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded hover:bg-green-200"
            >
              Atender
            </button>
          )}
          
          {(turno.estado === 'esperando' || turno.estado === 'llamando') && onDerivar && (
            <button
              onClick={onDerivar}
              className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded hover:bg-purple-200"
            >
              Derivar
            </button>
          )}
          
          {(turno.estado === 'esperando' || turno.estado === 'llamando') && onCancelar && (
            <button
              onClick={onCancelar}
              className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded hover:bg-red-200"
            >
              Cancelar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TurnoCard;
