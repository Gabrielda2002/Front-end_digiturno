import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { useSedeStore } from "@/store/sedeStore";
import { useEffect, useState } from "react";
import { useModuloStore } from "../store/moduloStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { moduloService } from "@/services/modulo.service";
import { useFetchUsers } from "../Hooks/useFetchUsers";
import { Modulo } from "@/types/api.types";
import { toast } from "react-toastify";

const ConfigModulos = () => {
  const { sedes } = useSedeStore();
  const { usuarios } = useFetchUsers();

  const { modulos, error,loading, fetchModulos } = useModuloStore();

  useEffect(() => {
    fetchModulos()
  }, [fetchModulos])

  const [isEditing, setIsEditing] = useState(false);

const modalSchema = z.object({
  id: z.string().optional(),
  numero: z.coerce.number({
    required_error: "Número de módulo es requerido",
    invalid_type_error: "Número de módulo debe ser un número válido"
  }).min(1, "Número de módulo debe ser mayor a 0"),
  nombre: z.string().min(1, "Nombre del módulo es requerido"),
  operador: z.string(),
  activo: z.boolean(),
  sede_id: z.string(),
});

type FormData = z.infer<typeof modalSchema>;

const {
  register,
  handleSubmit,
  reset,
  setValue,
  formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(modalSchema),
  defaultValues: {
    id: "",
    numero: 0,
    nombre: "",
    operador: "",
    activo: true,
    sede_id: ''
  },
});


  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing && data.id) {
        const moduloData = {
          numero: data.numero,
          nombre: data.nombre,
          operador: data.operador,
          activo: data.activo,
          sede_id: data.sede_id
        };

        await moduloService.updateModulo(data.id, moduloData)

      } else {
        await moduloService.createModulo({
          numero: data.numero,
          nombre: data.nombre,
          operador_id: data.operador,
          activo: data.activo,
          sede_id: data.sede_id
        });
      }

      reset();
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar el módulo:", error);
    }
  };

  const handleEdit = (modulo: Modulo) => {
    setIsEditing(true);

    setValue("id", modulo.id);
    setValue("numero", modulo.numero);
    setValue("nombre", modulo.nombre);
    setValue("operador", modulo.operador_id);
    setValue("activo", modulo.activo);
    setValue("sede_id", modulo.sede_id)
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Gestión de Módulos</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Número de módulo"
            type="number"
            min={1}
            {...register("numero")}
            error={errors.numero?.message}
          />
          <Input
            label="Nombre del módulo"
            {...register("nombre")}
            error={errors.nombre?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operador
            </label>
            <select
              {...register("operador")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="" disabled>
                Seleccione un operador
              </option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sede
            </label>
            <select
              {...register("sede_id")}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="" disabled>
                Seleccione una sede
              </option>
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="activoModulo"
              checked={true}
              {...register("activo")}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="activoModulo"
              className="ml-2 block text-sm text-gray-700"
            >
              Módulo activo
            </label>
          </div>
        </div>
        {error && (
          <div className="text-red-600 mb-4">
            {error}
          </div>
        )}
        <div className="flex space-x-2">
          <Button type="submit" variant="primary" isLoading={loading} disabled={loading}>
            {isEditing ? "Actualizar módulo" : "Agregar módulo"}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset();
                setIsEditing(false);
              }}
              disabled={loading}
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
                Número
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operador
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
            {modulos.map((modulo) => (
              <tr key={modulo.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{modulo.numero}</td>
                <td className="px-4 py-3">{modulo.nombre}</td>
                <td className="px-4 py-3">{modulo.operador_id}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      modulo.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {modulo.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(modulo)}
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

export default ConfigModulos;
