import { useState, useEffect } from "react";
import { useTurnoStore } from "../store/turnoStore";
import DashboardLayout from "../components/layout/DashboardLayout";
import TurnoCard from "../components/turnos/TurnoCard";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useInstallation } from "@/contexts/InstallationContext";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { installation } = useInstallation();
  const {
    activeTurnos,
    fetchActiveTurnos,
    currentTurno,
    setCurrentTurno,
    updateTurnoStatus,
  } = useTurnoStore();

  useEffect(() => {
    const loadTurnos = async () => {
      try {
        if (installation.sedeId) {
          // await fetchCurrentSede(installation.sedeId);
          await fetchActiveTurnos(installation.sedeId);
        }
      } catch (error: any) {
        console.log("Error al cargar turnos:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTurnos();

    // Configurar actualización periódica o via websocket
    const interval = setInterval(() => {
      if (installation.sedeId) {
        fetchActiveTurnos(installation.sedeId);
      }
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [installation.sedeId, fetchActiveTurnos]);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Panel de Control de Turnos
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
                {activeTurnos?.length > 0 ? (
                  activeTurnos.map((turno) => (
                    <TurnoCard key={turno.id} turno={turno} onLlamar={() => setCurrentTurno(turno)} />
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
            {currentTurno ? (
            <div className="text-center py-8">
              <div className="text-5xl font-bold text-primary mb-2">{currentTurno?.numero_turno}</div>
              <p className="text-gray-500">{currentTurno?.cedula}</p>
              <p className="text-gray-500">Tiempo de espera: {currentTurno?.tiempoEspera}m</p>
              <div className="mt-4 space-y-2">
                <Button
                  variant="success"
                  fullWidth
                  onClick={() =>
                    updateTurnoStatus(currentTurno?.id || '', { estado: "atendido" })
                  }
                >
                  Atendido
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() =>
                    updateTurnoStatus(currentTurno?.id || '', { estado: "cancelado" })
                  }
                >
                  Ausente
                </Button>
                <Button variant="danger" fullWidth>
                  Reasignar
                </Button>
              </div>
            </div>
            ): (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay turno actual</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
