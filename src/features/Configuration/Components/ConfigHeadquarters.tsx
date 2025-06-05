import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { sedeService } from "@/services/sede.service";
import { useSedeStore } from "@/store/sedeStore";
import { Sede } from "@/types/api.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const ConfigHeadquarters = () => {
  const { sedes, loading, error, fetchSedes } = useSedeStore();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSedes();
  }, [fetchSedes]);

  const schemaValidation = z.object({
    id: z.string(),
    nombre: z.string().min(1, "El nombre de la sede es requerido"),
    direccion: z.string().min(1, "La dirección es requerida"),
    telefono: z.string().min(1, "El teléfono es requerido"),
    activa: z.boolean(),
    codigo: z.string(),
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
      direccion: "",
      telefono: "",
      activa: true,
      codigo: ""
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && data.id) {
        const userData = {
          id: data.id,
          nombre: data.nombre,
          direccion: data.direccion,
          telefono: data.telefono,
          activa: data.activa,
            codigo: data.codigo
        };

        await sedeService.updateSede(data.id, userData);
        toast.success("Sede actualizada correctamente");
      } else {
        await sedeService.createSede({
          nombre: data.nombre,
          direccion: data.direccion,
          telefono: data.telefono,
          activa: data.activa,
            codigo: data.codigo
        });
        fetchSedes();
        toast.success("Sede creada correctamente");
      }

      reset();
      fetchSedes();
      setIsEditing(false);
    } catch (error) {
      console.log("Error al guardar la sede:", error);
      toast.error("Error al guardar la sede. Por favor, inténtelo de nuevo.");
    }
  };

  const handleEdit = (sede: Sede) => {
    setIsEditing(true);
    setValue("id", sede.id);
    setValue("nombre", sede.nombre);
    setValue("direccion", sede.direccion);
    setValue("telefono", sede.telefono || "");
    setValue("activa", sede.activa);
    setValue("codigo", sede.codigo || "");
  };
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Gestión de Sedes</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Nombre de la sede"
            type="text"
            {...register("nombre")}
            error={errors.nombre?.message}
          />
          <Input
            label="Dirección"
            type="text"
            {...register("direccion")}
            error={errors.direccion?.message}
          />
          <Input
            label="Teléfono"
            type="text"
            {...register("telefono")}
            error={errors.telefono?.message}
          />
          <Input
            label="Codigo"
            type="text"
            {...register("codigo")}
            error={errors.codigo?.message}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo"
              {...register("activa")}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="activo"
              className="ml-2 block text-sm text-gray-700"
            >
              Sede activa
            </label>
          </div>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="flex space-x-2">
          <Button type="submit" variant="primary" disabled={loading}>
            {isEditing ? "Actualizar sede" : "Agregar sede"}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                reset();
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
                Dirección
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Codigo
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
            {sedes.map((sede) => (
              <tr key={sede.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{sede.nombre}</td>
                <td className="px-4 py-3">{sede.direccion}</td>
                <td className="px-4 py-3">{sede.telefono}</td>
                <td className="px-4 py-3">{sede.codigo}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-'2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sede.activa
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {sede.activa ? "Activa" : "Inactiva"}
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

export default ConfigHeadquarters;
