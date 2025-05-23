import { useState, useEffect } from "react";
import { useSedeStore } from "../store/sedeStore";
import { useTurnoStore } from "../store/turnoStore";
import DashboardLayout from "../components/layout/DashboardLayout";
import TurnoCard from "../components/turnos/TurnoCard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentSede } = useSedeStore();
  const { historialTurnos: turnos, fetchActiveTurnos: fetchTurnosPendientes } =
    useTurnoStore();

  useEffect(() => {
    const loadTurnos = async () => {
      try {
        if (currentSede) {
          await fetchTurnosPendientes(currentSede.id);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTurnos();

    // Configurar actualización periódica o via websocket
    const interval = setInterval(() => {
      if (currentSede) {
        fetchTurnosPendientes(currentSede.id);
      }
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [currentSede, fetchTurnosPendientes]);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Panel de Operador
          </h1>
          <Button variant="primary">Llamar siguiente turno</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="col-span-full lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Turnos en espera</h2>
            {isLoading ? (
              <div className="p-4 text-center">Cargando turnos...</div>
            ) : (
              <div className="space-y-4">
                {turnos?.length > 0 ? (
                  turnos.map((turno) => (
                    <TurnoCard key={turno.id} turno={turno} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No hay turnos en espera
                  </p>
                )}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Turno actual</h2>
            <div className="text-center py-8">
              <div className="text-5xl font-bold text-primary mb-2">A001</div>
              <p className="text-gray-500">Módulo: 1</p>
              <p className="text-gray-500">Tiempo de espera: 5 min</p>
              <div className="mt-4 space-y-2">
                <Button variant="success" fullWidth>
                  Atendido
                </Button>
                <Button variant="danger" fullWidth>
                  Ausente
                </Button>
                <Button variant="danger" fullWidth>
                  Reasignar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
