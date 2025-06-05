import { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { ConfigUsers } from '@/features/Configuration/Components/ConfigUsers';
import ConfigModulos from '../Components/ConfigModulos';
import ConfigHeadquarters from '../Components/ConfigHeadquarters';
import ConfigReason from '../Components/ConfigReason';

const Configuracion = () => {
  const [activeTab, setActiveTab] = useState('sedes');
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Configuración del Sistema</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar de navegación */}
          <div className="w-full md:w-64 shrink-0">
            <Card>
              <nav className="space-y-1">
                <button 
                  className={`w-full text-left px-4 py-2 rounded ${activeTab === 'sedes' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('sedes')}
                >
                  Sedes
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 rounded ${activeTab === 'motivos' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('motivos')}
                >
                  Motivos de visita
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 rounded ${activeTab === 'modulos' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('modulos')}
                >
                  Módulos
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 rounded ${activeTab === 'usuarios' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('usuarios')}
                >
                  Usuarios
                </button>
                <button 
                  className={`w-full text-left px-4 py-2 rounded ${activeTab === 'general' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('general')}
                >
                  Configuración general
                </button>
              </nav>
            </Card>
          </div>
          
          {/* Contenido principal */}
          <div className="flex-1">
            {activeTab === 'sedes' && <ConfigHeadquarters />}
            {activeTab === 'motivos' && <ConfigReason />}
            {activeTab === 'modulos' && <ConfigModulos />}
            {activeTab === 'usuarios' && <ConfigUsers />}
            {activeTab === 'general' && <ConfigGeneral />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const ConfigGeneral = () => {
  const [formData, setFormData] = useState({
    nombreEmpresa: 'Empresa Demo',
    logo: '',
    colorPrimario: '#3B82F6',
    tiempoRefrescoPantalla: '30',
    alertaSonora: true,
    impresionAutomatica: true,
    mantenerHistorial: '30',
    mensajeBienvenida: 'Bienvenido al sistema de turnos digitales'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí enviaríamos los cambios al backend
    alert('Configuración guardada correctamente');
  };
  
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Configuración General</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Información de la Empresa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Nombre de la empresa" 
                name="nombreEmpresa"
                value={formData.nombreEmpresa} 
                onChange={handleChange} 
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo de la empresa
                </label>
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color primario
                </label>
                <input
                  type="color"
                  name="colorPrimario"
                  value={formData.colorPrimario}
                  onChange={handleChange}
                  className="h-10 w-full p-1 border border-gray-300 rounded focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Configuración de Pantalla</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Tiempo de refresco de pantalla (seg)" 
                name="tiempoRefrescoPantalla"
                type="number"
                min="5"
                value={formData.tiempoRefrescoPantalla} 
                onChange={handleChange} 
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="alertaSonora"
                  name="alertaSonora"
                  checked={formData.alertaSonora}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="alertaSonora" className="ml-2 block text-sm text-gray-700">
                  Activar alerta sonora al llamar turno
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Configuración de Tickets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="impresionAutomatica"
                  name="impresionAutomatica"
                  checked={formData.impresionAutomatica}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="impresionAutomatica" className="ml-2 block text-sm text-gray-700">
                  Imprimir ticket automáticamente
                </label>
              </div>
              <Input 
                label="Días para mantener historial" 
                name="mantenerHistorial"
                type="number"
                min="1"
                value={formData.mantenerHistorial} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Mensajes</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje de bienvenida
              </label>
              <textarea
                name="mensajeBienvenida"
                value={formData.mensajeBienvenida}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Guardar configuración
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default Configuracion;
