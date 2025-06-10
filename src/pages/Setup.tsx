import { useInstallation } from "@/contexts/InstallationContext";
import { useSedeStore } from "@/store/sedeStore";
import React, { useEffect, useState } from "react";

const Setup = () => {
  const { updateInstallation } = useInstallation();
  const { sedes, fetchSedes } = useSedeStore();
  const [formData, setFormData] = useState({
    sedeId: "",
    nombre: "",
    ubicacion: "",
    tipo: "sede" as const,
  });

  // Fetch sedes on component mount
  useEffect(() => {
    fetchSedes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updateInstallation({
      sedeId: formData.sedeId,
      nombre: formData.nombre,
      ubicacion: formData.ubicacion,
      tipo: formData.tipo,
    });

    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Configuración Inicial</h1>

        <form onSubmit={handleSubmit}>
          <select
            value={formData.sedeId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, sedeId: e.target.value }))
            }
            className="w-full p-2 border rounded mb-4"
            required
          >
            <option value="">Seleccionar Sede</option>
            {sedes.map((sede) => (
              <option key={sede.id} value={sede.id}>
                {sede.nombre}
              </option>
            ))}
          </select>

          {/* Más campos del formulario */}

          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded"
          >
            Configurar Instalación
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
