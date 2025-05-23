import { useState, useEffect } from 'react';
import { useSedeStore } from '../store/sedeStore';
import { useTurnoStore } from '../store/turnoStore';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

const Turnos = () => {
  const [filtro, setFiltro] = useState('todos'); // todos, pendientes, atendidos, ausentes
  const [isLoading, setIsLoading] = useState(true);
  const { currentSede } = useSedeStore();
  const { historialTurnos: turnos, fetchTurnos } = useTurnoStore();
  
  useEffect(() => {
    const loadTurnos = async () => {
      try {
        if (currentSede) {
          await fetchTurnos(currentSede.id, filtro !== 'todos' ? filtro : undefined);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTurnos();
  }, [currentSede, fetchTurnos, filtro]);
  
  const getEstadoClass = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'text-yellow-600 bg-yellow-100';
      case 'atendido': return 'text-green-600 bg-green-100';
      case 'ausente': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Turnos</h1>
          
          <div className="flex gap-4">
            <Select
              label="Filtrar por estado"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              options={[
                { value: 'todos', label: 'Todos' },
                { value: 'pendiente', label: 'Pendientes' },
                { value: 'atendido', label: 'Atendidos' },
                { value: 'ausente', label: 'Ausentes' }
              ]}
              className="w-48"
            />
            <Button variant="primary">Nuevo Turno</Button>
          </div>
        </div>
        
        <Card>
          {isLoading ? (
            <div className="p-4 text-center">Cargando turnos...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-sm">
                    <th className="py-3 px-4 text-left">Nº Turno</th>
                    <th className="py-3 px-4 text-left">Motivo</th>
                    <th className="py-3 px-4 text-left">Módulo</th>
                    <th className="py-3 px-4 text-left">Estado</th>
                    <th className="py-3 px-4 text-left">Hora</th>
                    <th className="py-3 px-4 text-left">Espera</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {turnos.length > 0 ? (
                    turnos.map(turno => (
                      <tr key={turno.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{turno.numero_turno}</td>
                        <td className="py-3 px-4">{turno.motivo?.nombre || '-'}</td>
                        <td className="py-3 px-4">{turno.modulo?.numero || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoClass(turno.estado)}`}>
                            {turno.estado}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(turno.fecha_creacion).toLocaleTimeString()}</td>
                        <td className="py-3 px-4">{turno.tiempoEspera || '0'} min</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                              Ver
                            </button>
                            <button className="p-1 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200">
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-4 text-center text-gray-500">
                        No hay turnos que mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Turnos;
