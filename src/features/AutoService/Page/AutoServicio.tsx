import { useEffect, useState } from 'react';
import { useSedeStore } from '../../../store/sedeStore';
// import { useTurnoStore } from '../../../store/turnoStore';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useReasonStore } from '@/store/reasonStore';
import { useTurnoStore } from '@/store/turnoStore';
import { useInstallation } from '@/contexts/InstallationContext';

const AutoServicio = () => {
  const [cedula, setCedula] = useState('');
  const [motivoId, setMotivoId] = useState('');
  console.log(motivoId)
  const [step, setStep] = useState(1); // 1: Cedula, 2: Motivo, 3: Confirmación
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<any>(null);
  
  const { installation } = useInstallation();
  const { currentSede, fetchCurrentSede } = useSedeStore();
  const { reasons, fetchReasonsByHeadquarter } = useReasonStore();
  const { createTurno } = useTurnoStore();
  
  useEffect(() => {

    const initializeAutoService = async () => {
      if (installation.sedeId) {
        try {

          await fetchCurrentSede(installation.sedeId);
          await fetchReasonsByHeadquarter(installation.sedeId);

        } catch (error) {
          console.log('Error al inicializar el servicio de turnos:', error);
          setError('Error al cargar la sede o motivos de visita');
        }
      }
    }

    initializeAutoService();
  }, [installation.sedeId, fetchCurrentSede, fetchReasonsByHeadquarter]);

  const handleSubmitCedula = (e: React.FormEvent) => {
    e.preventDefault();
    if (cedula.length < 5) {
      setError('Por favor ingrese una cédula válida');
      return;
    }
    setError(null);
    setStep(2);
  };
  
  const handleSelectMotivo = async (id: string) => {
    setMotivoId(id);
    setLoading(true);
    
    try {
      // Simulamos la creación del turno
      const nuevoTurno = await createTurno({
        sede_id: installation.sedeId,
        motivo_id: id,
        cedula,
      });
      
      const reasonSelected = reasons.find((r) => r.id === id);
      setTicket({
        codigo: nuevoTurno?.numero_turno || '0001',
        motivo: reasonSelected?.nombre || 'desconocido',
        prefijo: reasonSelected?.prefijo || 'T',
        sede: currentSede?.nombre || installation.nombre,
      })
      
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Error al generar el turno');
    } finally {
      setLoading(false);
    }
  };

  // filter reasons by sede
  const reasonsFree = reasons.filter(r => 
    r.activo && 
    (installation.configuration.motivosPermitidos.length === 0 ||
      installation.configuration.motivosPermitidos.includes(r.id)
    )
  );
  
  const resetForm = () => {
    setCedula('');
    setMotivoId('');
    setError(null);
    setTicket(null);
    setStep(1);
  };
  
  // Simulamos la impresión del ticket
  const handlePrint = () => {
    window.print();
    // Después de imprimir, reiniciamos el formulario tras un breve retraso
    setTimeout(resetForm, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <header className="bg-primary text-white p-4 text-center">
          <h1 className="text-3xl font-bold">DigiTurno</h1>
          <p className="text-xl">Sistema de turnos digitales</p>
          <p>{currentSede?.nombre || installation.nombre}</p>
          {installation.ubicacion && (
            <p className="text-sm text-gray-200">{installation.ubicacion}</p>
          )

          }
        </header>
        
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">Bienvenido al sistema de turnos</h2>
              <p className="mb-8 text-gray-600">Para comenzar, por favor ingrese su número de cédula</p>
              
              <form onSubmit={handleSubmitCedula} className="max-w-sm mx-auto">
                <Input
                  label="Número de cédula"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="Ej: 12345678"
                  required
                  className="text-center text-2xl"
                  autoFocus
                />
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="mt-6 text-xl py-4"
                  fullWidth
                >
                  Continuar
                </Button>
              </form>
            </div>
          )}
          {/* ? selecciona el motivo de la visita */}
          {step === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">Seleccione el motivo de su visita</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {reasonsFree.map((motivo) => (
                  <Button
                    key={motivo.id}
                    variant="secondary"
                    className="p-6 text-xl h-24 flex items-center justify-center"
                    onClick={() => handleSelectMotivo(motivo.id)}
                    disabled={loading}
                  >
                    <div className='text-center'>
                      <div className='font-bold'>{motivo.prefijo}</div>
                      <div className='text-sm'>{motivo.nombre}</div>
                    </div>
                  </Button>
                ))}
              </div>

              {reasonsFree.length === 0 && (
                <div className='text-gray-500 mt-4'>
                  No hay motivos disponibles para su sede. Por favor, intente más tarde.
                </div>
              )}
              
              <Button 
                variant="text"
                onClick={() => setStep(1)}
                className="mt-6"
                disabled={loading}
              >
                Volver
              </Button>
            </div>
          )}
          
          {step === 3 && ticket && (
            <div className="text-center" id="ticket-para-imprimir">
              <h2 className="text-2xl font-bold mb-6">¡Turno generado exitosamente!</h2>
              
              <Card className="max-w-sm mx-auto mb-8 p-6 border-2 border-dashed border-gray-300 print:border-none">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold">{currentSede?.nombre || 'Sede principal'}</h3>
                  <p className="text-gray-500">{ticket.fecha} - {ticket.hora}</p>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">Su número de turno es:</p>
                  <p className="text-6xl font-bold text-primary mb-3">{ticket.codigo}</p>
                  <p className="text-gray-600">{ticket.motivo}</p>
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>Por favor, espere a ser llamado</p>
                  <p>Gracias por su visita</p>
                </div>
              </Card>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  variant="primary"
                  onClick={handlePrint}
                  className="print:hidden"
                >
                  Imprimir ticket
                </Button>
                <Button 
                  variant="secondary"
                  onClick={resetForm}
                  className="print:hidden"
                >
                  Nuevo turno
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <footer className="bg-gray-50 p-4 text-center text-gray-500 text-sm print:hidden">
          &copy; {new Date().getFullYear()} DigiTurno - Sistema de turnos digitales
        </footer>
      </div>
    </div>
  );
};

export default AutoServicio;
