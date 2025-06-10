import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { motivoVisitaService } from "@/services/motivoVisita.service";
import { useReasonStore } from "@/store/reasonStore";
import { useSedeStore } from "@/store/sedeStore";
import { MotivoVisita } from "@/types/api.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const ConfigReason = () => {
  const { reasons, fetchReasons } = useReasonStore();
  const { sedes } = useSedeStore();

  useEffect(() => {
    fetchReasons();
  }, [fetchReasons]);

  const [isEditing, setIsEditing] = useState(false);

  const schemaValidation = z.object({
    id: z.string(),
    nombre: z.string().min(1, "El nombre del motivo es requerido"),
    prefijo: z
      .string()
      .min(1, "El prefijo es requerido")
      .max(2, "El prefijo debe tener dos carácter"),
    descripcion: z.string().optional(),
    sede_id: z.string(),
    activo: z.boolean(),
  });

  type FormData = z.infer<typeof schemaValidation>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schemaValidation),
    defaultValues: {
      id: "",
      nombre: "",
      prefijo: "",
      descripcion: "",
      sede_id: "",
      activo: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && data.id) {
        const updatedData = {
          nombre: data.nombre,
          prefijo: data.prefijo,
          descripcion: data.descripcion,
          sede_id: data.sede_id,
          activo: data.activo,
        };

        await motivoVisitaService.updateMotivo(data.id, updatedData);
        toast.success("Motivo actualizado correctamente");
      } else {
        await motivoVisitaService.createMotivo({
          nombre: data.nombre,
          prefijo: data.prefijo,
          descripcion: data.descripcion,
          sede_id: data.sede_id,
          activo: data.activo,
        });
        toast.success("Motivo creado correctamente");
      }
      fetchReasons();
      reset();
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar el motivo:", error);
      toast.error("Error al guardar el motivo. Por favor, inténtelo de nuevo.");
    }
  };

  const handleEditing = (motivo: MotivoVisita) => {
    setIsEditing(true);
    setValue("id", motivo.id);
    setValue("nombre", motivo.nombre);
    setValue("prefijo", motivo.prefijo);
    setValue("descripcion", motivo.descripcion || "");
    setValue("sede_id", motivo.sede_id);
    setValue("activo", motivo.activo);
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">
        Gestión de Motivos de Visita
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Nombre del motivo"
            {...register("nombre")}
            error={errors.nombre?.message}
          />
          <Input
            label="Prefijo (para tickets)"
            {...register("prefijo")}
            error={errors.prefijo?.message}
            maxLength={2}
          />
          <Input
            label="Descripción"
            {...register("descripcion")}
            error={errors.descripcion?.message}
            type="text"
          />
          <select
            {...register("sede_id")}
            className={`block w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary ${
              errors.sede_id ? "border-red-500" : ""
            }`}
          >
            <option value="">Seleccione una sede</option>
            {sedes.map((sede) => (
              <option key={sede.id} value={sede.id}>
                {sede.nombre}
              </option>
            ))}
          </select>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activoMotivo"
              {...register("activo")}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="activoMotivo"
              className="ml-2 block text-sm text-gray-700"
            >
              Motivo activo
            </label>
          </div>
          {errors.activo && (
            <p className="text-red-500 text-sm mt-1">{errors.activo.message}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button type="submit" variant="primary">
            {isEditing ? "Actualizar motivo" : "Agregar motivo"}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset();
                setIsEditing(false);
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prefijo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripcion
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reasons.map((motivo) => (
              <tr key={motivo.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{motivo.nombre}</td>
                <td className="px-4 py-3">{motivo.prefijo}</td>
                <td className="px-4 py-3">{motivo.descripcion}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      motivo.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {motivo.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleEditing(motivo)}
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

export default ConfigReason;
