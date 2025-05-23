import { useState, useEffect } from 'react';
import { useSedeStore } from '../store/sedeStore';
import { useTurnoStore } from '../store/turnoStore';

const PantallaTV = () => {
  const [turnos, setTurnos] = useState<Array<{
    id: string;
    codigo: string;
    modulo: number;
    estado: string;
    tiempoEspera: number;
    animacion?: boolean;
  }>>([]);
  const [ultimoLlamado, setUltimoLlamado] = useState<{
    codigo: string;
    modulo: number;
    timestamp: number;
  } | null>(null);
  
  const { currentSede } = useSedeStore();
  
  // Simulamos la recepción de turnos (esto debería venir de WebSockets)
  useEffect(() => {
    // Datos iniciales
    setTurnos([
      { id: '1', codigo: 'A001', modulo: 1, estado: 'llamando', tiempoEspera: 12 },
      { id: '2', codigo: 'A002', modulo: 2, estado: 'espera', tiempoEspera: 8 },
      { id: '3', codigo: 'A003', modulo: 3, estado: 'espera', tiempoEspera: 5 },
      { id: '4', codigo: 'A004', modulo: 0, estado: 'espera', tiempoEspera: 2 }
    ]);
    
    // Simulamos un nuevo turno cada X segundos
    const interval = setInterval(() => {
      const nuevoModulo = Math.floor(Math.random() * 3) + 1;
      const nuevoTurno = {
        id: Date.now().toString(),
        codigo: `A00${Math.floor(Math.random() * 9) + 1}`,
        modulo: nuevoModulo,
        estado: 'llamando',
        tiempoEspera: Math.floor(Math.random() * 15),
        animacion: true
      };
      
      setUltimoLlamado({
        codigo: nuevoTurno.codigo,
        modulo: nuevoTurno.modulo,
        timestamp: Date.now()
      });
      
      // Actualizamos la lista de turnos
      setTurnos(prevTurnos => {
        // Convertimos turnos anteriores a estado 'espera'
        const turnosActualizados = prevTurnos.map(turno => ({
          ...turno,
          estado: 'espera',
          animacion: false
        }));
        
        // Añadimos el nuevo turno al principio
        return [nuevoTurno, ...turnosActualizados.slice(0, 9)];
      });
      
      // Eliminamos la animación después de un tiempo
      setTimeout(() => {
        setTurnos(prev => 
          prev.map(turno => 
            turno.id === nuevoTurno.id ? { ...turno, animacion: false } : turno
          )
        );
      }, 5000);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Efecto para video/animación aleatorios
  const videoUrls = [
    'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761',
    'https://player.vimeo.com/external/207590826.hd.mp4?s=a338e8bac807b4fee7ff7bc969320cd1bb67c2c1&profile_id=119&oauth2_token_id=57447761',
    'https://player.vimeo.com/external/384761655.sd.mp4?s=383ab4dbc773cd0d5ece3af208d8f963368f67e4&profile_id=165&oauth2_token_id=57447761'
  ];
  
  const [videoIndex, setVideoIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setVideoIndex(prev => (prev + 1) % videoUrls.length);
    }, 60000); // Cambiar video cada minuto
    
    return () => clearInterval(interval);
  }, []);
  
  // Fecha y hora actual
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden">
      <div className="grid grid-cols-3 grid-rows-5 h-full">
        {/* Encabezado */}
        <header className="col-span-3 bg-primary flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="text-3xl font-bold">DigiTurno</div>
            <div className="ml-4 text-xl">{currentSede?.nombre || 'Sede Principal'}</div>
          </div>
          <div className="text-2xl">
            {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
          </div>
        </header>
        
        {/* Área principal de turnos */}
        <div className="col-span-2 row-span-3 p-6 overflow-hidden">
          <h2 className="text-2xl font-bold mb-6 uppercase">Turnos en atención</h2>
          
          <div className="grid grid-cols-3 gap-6">
            {Array.from({length: 3}, (_, i) => i + 1).map(moduloNum => (
              <div key={moduloNum} className="bg-gray-800 rounded-lg shadow-lg p-4 border-2 border-primary">
                <div className="text-lg text-gray-300 mb-2">Módulo</div>
                <div className="text-5xl font-bold mb-6">{moduloNum}</div>
                
                {turnos.find(t => t.modulo === moduloNum && t.estado === 'llamando') ? (
                  <div 
                    className={`text-6xl font-bold ${
                      turnos.find(t => t.modulo === moduloNum && t.animacion) 
                        ? 'animate-pulse text-yellow-400' 
                        : 'text-white'
                    }`}
                  >
                    {turnos.find(t => t.modulo === moduloNum)?.codigo || '-'}
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-gray-600">Libre</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-12">
            <h3 className="text-xl mb-4 font-bold uppercase">Próximos turnos</h3>
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr className="text-left text-gray-400">
                  <th className="py-2 px-4">Turno</th>
                  <th className="py-2 px-4">Espera</th>
                  <th className="py-2 px-4">Estado</th>
                </tr>
              </thead>
              <tbody>
                {turnos
                  .filter(turno => turno.estado === 'espera')
                  .slice(0, 5)
                  .map((turno) => (
                    <tr key={turno.id} className="border-b border-gray-800">
                      <td className="py-3 px-4 text-2xl font-bold">{turno.codigo}</td>
                      <td className="py-3 px-4">{turno.tiempoEspera} min</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded bg-blue-900 text-blue-300">
                          En espera
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Área lateral con video/multimedia */}
        <div className="row-span-3 bg-black">
          <video 
            src={videoUrls[videoIndex]} 
            className="w-full h-full object-cover"
            autoPlay 
            muted 
            loop
          />
        </div>
        
        {/* Área inferior para alertas y último llamado */}
        <div className="col-span-3 bg-gray-800 p-4 flex items-center">
          {ultimoLlamado && Date.now() - ultimoLlamado.timestamp < 20000 ? (
            <div className="flex-1 flex items-center animate-pulse">
              <div className="text-yellow-400 text-4xl font-bold mr-4">
                ¡ATENCIÓN!
              </div>
              <div className="text-3xl">
                Turno <span className="font-bold text-yellow-400">{ultimoLlamado.codigo}</span> 
                {' '}pase a módulo{' '}
                <span className="font-bold text-yellow-400">{ultimoLlamado.modulo}</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 text-2xl text-center">
              Gracias por su preferencia
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PantallaTV;
