import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { useSedeStore } from '../store/sedeStore';

const Reportes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reporteTipo, setReporteTipo] = useState('diario');
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);
  const { currentSede } = useSedeStore();
  
  // Datos de ejemplo para el gráfico/tabla
  const reporteData = {
    totalTurnos: 120,
    atendidos: 98,
    ausentes: 15,
    pendientes: 7,
    tiempoPromedioEspera: 12, // minutos
    motivosVisita: [
      { nombre: 'Pagos', cantidad: 45, porcentaje: 37.5 },
      { nombre: 'Consultas', cantidad: 35, porcentaje: 29.2 },
      { nombre: 'Reclamos', cantidad: 25, porcentaje: 20.8 },
      { nombre: 'Otros', cantidad: 15, porcentaje: 12.5 }
    ],
    modulosRendimiento: [
      { numero: 1, atendidos: 30, tiempoPromedio: 10 },
      { numero: 2, atendidos: 28, tiempoPromedio: 11 },
      { numero: 3, atendidos: 40, tiempoPromedio: 9 }
    ]
  };

  const generarReporte = () => {
    setIsLoading(true);
    // Simulación de carga
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    generarReporte();
  }, [currentSede]);
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h1>
        </div>
        
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Filtros del reporte</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Tipo de reporte"
              value={reporteTipo}
              onChange={(e) => setReporteTipo(e.target.value)}
              options={[
                { value: 'diario', label: 'Reporte Diario' },
                { value: 'semanal', label: 'Reporte Semanal' },
                { value: 'mensual', label: 'Reporte Mensual' },
                { value: 'personalizado', label: 'Personalizado' }
              ]}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="flex items-end">
              <Button 
                variant="primary" 
                onClick={generarReporte} 
                fullWidth 
                disabled={isLoading}
              >
                {isLoading ? 'Generando...' : 'Generar reporte'}
              </Button>
            </div>
          </div>
        </Card>
        
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-blue-50">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total turnos</h3>
                <p className="text-2xl font-bold text-blue-700">{reporteData.totalTurnos}</p>
              </Card>
              <Card className="p-4 bg-green-50">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Atendidos</h3>
                <p className="text-2xl font-bold text-green-700">{reporteData.atendidos} <span className="text-sm font-normal">({Math.round(reporteData.atendidos / reporteData.totalTurnos * 100)}%)</span></p>
              </Card>
              <Card className="p-4 bg-red-50">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Ausentes</h3>
                <p className="text-2xl font-bold text-red-700">{reporteData.ausentes} <span className="text-sm font-normal">({Math.round(reporteData.ausentes / reporteData.totalTurnos * 100)}%)</span></p>
              </Card>
              <Card className="p-4 bg-yellow-50">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Tiempo promedio</h3>
                <p className="text-2xl font-bold text-yellow-700">{reporteData.tiempoPromedioEspera} min</p>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <h2 className="text-lg font-semibold mb-4">Distribución por motivo de visita</h2>
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Motivo</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Cantidad</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporteData.motivosVisita.map((motivo, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4">{motivo.nombre}</td>
                        <td className="py-2 px-4">{motivo.cantidad}</td>
                        <td className="py-2 px-4">{motivo.porcentaje}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
              
              <Card>
                <h2 className="text-lg font-semibold mb-4">Rendimiento de módulos</h2>
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Módulo</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Atendidos</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">Tiempo promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporteData.modulosRendimiento.map((modulo, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4">Módulo {modulo.numero}</td>
                        <td className="py-2 px-4">{modulo.atendidos}</td>
                        <td className="py-2 px-4">{modulo.tiempoPromedio} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
            
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Historial detallado de turnos</h2>
                <Button variant="secondary" size="sm">Exportar a Excel</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-xs uppercase">
                      <th className="py-2 px-2 text-left font-medium text-gray-500">Código</th>
                      <th className="py-2 px-2 text-left font-medium text-gray-500">Fecha</th>
                      <th className="py-2 px-2 text-left font-medium text-gray-500">Hora</th>
                      <th className="py-2 px-2 text-left font-medium text-gray-500">Motivo</th>
                      <th className="py-2 px-2 text-left font-medium text-gray-500">Módulo</th>
                      <th className="py-2 px-2 text-left font-medium text-gray-500">Estado</th>
                      <th className="py-2 px-2 text-left font-medium text-gray-500">T. Espera</th>
                      <th className="py-2 px-2 text-left font-medium text-gray-500">T. Atención</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {Array(10).fill(0).map((_, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-2 font-medium">A{String(index + 1).padStart(3, '0')}</td>
                        <td className="py-2 px-2">{fechaInicio}</td>
                        <td className="py-2 px-2">10:{String(index * 5).padStart(2, '0')}</td>
                        <td className="py-2 px-2">{reporteData.motivosVisita[index % 4].nombre}</td>
                        <td className="py-2 px-2">Módulo {(index % 3) + 1}</td>
                        <td className="py-2 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            index % 5 === 0 ? 'bg-yellow-100 text-yellow-800' : 
                            index % 5 === 4 ? 'bg-red-100 text-red-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {index % 5 === 0 ? 'Pendiente' : index % 5 === 4 ? 'Ausente' : 'Atendido'}
                          </span>
                        </td>
                        <td className="py-2 px-2">{5 + (index % 15)} min</td>
                        <td className="py-2 px-2">{index % 5 === 0 ? '-' : index % 5 === 4 ? '-' : `${3 + (index % 10)} min`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reportes;
