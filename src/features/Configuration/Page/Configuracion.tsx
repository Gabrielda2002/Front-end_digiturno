import { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { ConfigUsers } from '@/features/Configuration/Components/ConfigUsers';
import ConfigModulos from '../Components/ConfigModulos';

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
            {activeTab === 'sedes' && <ConfigSedes />}
            {activeTab === 'motivos' && <ConfigMotivos />}
            {activeTab === 'modulos' && <ConfigModulos />}
            {activeTab === 'usuarios' && <ConfigUsers />}
            {activeTab === 'general' && <ConfigGeneral />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Componentes para cada sección de configuración
const ConfigSedes = () => {
  const [sedes, setSedes] = useState<any[]>([
    { id: '1', nombre: 'Sede Principal', direccion: 'Calle 123, Ciudad', telefono: '123456789', activo: true },
    { id: '2', nombre: 'Sede Norte', direccion: 'Av. Norte 456, Ciudad', telefono: '987654321', activo: true }
  ]);
  const [formData, setFormData] = useState({ id: '', nombre: '', direccion: '', telefono: '', activo: true });
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setSedes(prev => prev.map(sede => 
        sede.id === formData.id ? formData : sede
      ));
    } else {
      setSedes(prev => [...prev, { ...formData, id: Date.now().toString() }]);
    }
    resetForm();
  };
  
  const handleEdit = (sede: any) => {
    setFormData(sede);
    setIsEditing(true);
  };
  
  const resetForm = () => {
    setFormData({ id: '', nombre: '', direccion: '', telefono: '', activo: true });
    setIsEditing(false);
  };
  
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Gestión de Sedes</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input 
            label="Nombre de la sede" 
            name="nombre"
            value={formData.nombre} 
            onChange={handleChange} 
            required
          />
          <Input 
            label="Dirección" 
            name="direccion"
            value={formData.direccion} 
            onChange={handleChange} 
            required
          />
          <Input 
            label="Teléfono" 
            name="telefono"
            value={formData.telefono} 
            onChange={handleChange} 
            required
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="activo" className="ml-2 block text-sm text-gray-700">
              Sede activa
            </label>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button type="submit" variant="primary">
            {isEditing ? 'Actualizar sede' : 'Agregar sede'}
          </Button>
          {isEditing && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
      
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sedes.map((sede) => (
              <tr key={sede.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{sede.nombre}</td>
                <td className="px-4 py-3">{sede.direccion}</td>
                <td className="px-4 py-3">{sede.telefono}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${sede.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {sede.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(sede)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const ConfigMotivos = () => {
  const [motivos, setMotivos] = useState<any[]>([
    { id: '1', nombre: 'Información general', prefijo: 'A', color: '#3B82F6', prioridad: 1, tiempoEstimado: 5, activo: true },
    { id: '2', nombre: 'Pagos', prefijo: 'B', color: '#10B981', prioridad: 2, tiempoEstimado: 10, activo: true },
    { id: '3', nombre: 'Reclamos', prefijo: 'C', color: '#EF4444', prioridad: 3, tiempoEstimado: 15, activo: true }
  ]);
  const [formData, setFormData] = useState({
    id: '', 
    nombre: '', 
    prefijo: '', 
    color: '#3B82F6',
    prioridad: 1,
    tiempoEstimado: 5,
    activo: true 
  });
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setMotivos(prev => prev.map(motivo => 
        motivo.id === formData.id ? formData : motivo
      ));
    } else {
      setMotivos(prev => [...prev, { ...formData, id: Date.now().toString() }]);
    }
    resetForm();
  };
  
  const handleEdit = (motivo: any) => {
    setFormData(motivo);
    setIsEditing(true);
  };
  
  const resetForm = () => {
    setFormData({
      id: '', 
      nombre: '', 
      prefijo: '', 
      color: '#3B82F6',
      prioridad: 1,
      tiempoEstimado: 5,
      activo: true 
    });
    setIsEditing(false);
  };
  
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Gestión de Motivos de Visita</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input 
            label="Nombre del motivo" 
            name="nombre"
            value={formData.nombre} 
            onChange={handleChange} 
            required
          />
          <Input 
            label="Prefijo (para tickets)" 
            name="prefijo"
            value={formData.prefijo} 
            onChange={handleChange} 
            required
            maxLength={1}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="h-10 w-full p-1 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            />
          </div>
          <Input 
            label="Prioridad (1-5)" 
            name="prioridad"
            type="number"
            min={1}
            max={5}
            value={formData.prioridad.toString()} 
            onChange={handleChange} 
            required
          />
          <Input 
            label="Tiempo estimado (min)" 
            name="tiempoEstimado"
            type="number"
            min={1}
            value={formData.tiempoEstimado.toString()} 
            onChange={handleChange} 
            required
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activoMotivo"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="activoMotivo" className="ml-2 block text-sm text-gray-700">
              Motivo activo
            </label>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button type="submit" variant="primary">
            {isEditing ? 'Actualizar motivo' : 'Agregar motivo'}
          </Button>
          {isEditing && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
      
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prefijo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo est.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {motivos.map((motivo) => (
              <tr key={motivo.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{motivo.nombre}</td>
                <td className="px-4 py-3">{motivo.prefijo}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div
                      className="w-6 h-6 rounded-full mr-2"
                      style={{ backgroundColor: motivo.color }}
                    ></div>
                    {motivo.color}
                  </div>
                </td>
                <td className="px-4 py-3">{motivo.prioridad}</td>
                <td className="px-4 py-3">{motivo.tiempoEstimado} min</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${motivo.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {motivo.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(motivo)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
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
