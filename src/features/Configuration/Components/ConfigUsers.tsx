import { useState } from "react";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useFetchUsers } from "../Hooks/useFetchUsers";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usuarioService } from "../../../services/usuario.service";

export const ConfigUsers = () => {
  const { usuarios, loading, error, refreshUsers } = useFetchUsers();

  const [isEditing, setIsEditing] = useState(false);

  const roles = [
    { value: "admin", label: "Administrador" },
    { value: "supervisor", label: "Supervisor" },
    { value: "operator", label: "Operador" },
  ];

  const sedes = [
    { value: "todas", label: "Todas las sedes" },
    { value: "sede1", label: "Sede Principal" },
    { value: "sede2", label: "Sede Norte" },
  ];

  const userSchema = z.object({
    id: z.string().optional(),
    nombre: z.string().min(1, "Nombre es requerido"),
    usuario: z.string().min(1, "Usuario es requerido"),
    password: z.string().optional(),
    rol: z.string(),
    sede_id: z.string(),
    activo: z.boolean(),
  });

  type userFormData = z.infer<typeof userSchema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<userFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombre: "",
      usuario: "",
      password: "",
      rol: "operator",
      sede_id: "todas",
      activo: true,
    },
  });

  const onSubmit = async (data: userFormData) => {
    try {
      if (isEditing && data.id) {
        const userData = {
          nombre: data.nombre,
          email: data.usuario,
          rol: data.rol,
          sede: data.sede_id,
          activo: data.activo,
        };

        await usuarioService.updateUsuario(data.id, userData);

        if (data.password && data.password.length > 0) {
          await usuarioService.changePassword(data.id, {
            newPassword: data.password,
          });
        }

      } else {
        await usuarioService.createUsuario({
          nombre: data.nombre,
          email: data.usuario,
          password: data.password || "",
          rol: data.rol,
          sede: data.sede_id,
          activo: data.activo,
        });
      }
      refreshUsers();
      reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (usuario: any) => {
    setIsEditing(true);

    // * establecer valores en el formulario
    setValue("id", usuario.id);
    setValue("nombre", usuario.nombre);
    setValue("usuario", usuario.email);
    setValue("rol", usuario.rol);
    setValue("sede_id", usuario.sede_id);
    setValue("activo", usuario.activo);
    setValue("password", ""); // Dejar en blanco para no mostrar la contraseña
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>

      <form className="mb-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Nombre completo"
            {...register("nombre")}
            error={errors.nombre?.message}
          />
          <Input
            label="Nombre de usuario"
            {...register("usuario")}
            error={errors.usuario?.message}
          />
          <Input
            label={
              isEditing
                ? "Nueva contraseña (dejar en blanco para mantener)"
                : "Contraseña"
            }
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol del usuario
            </label>
            <select
              {...register("rol")}
              className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.rol && (
              <span className="text-red-500 text-sm">{errors.rol.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sede asignada
            </label>
            <select
              {...register("sede_id")}
              className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            >
              <option value="">Seleccione una sede</option>
              {sedes.map((sede) => (
                <option key={sede.value} value={sede.value}>
                  {sede.label}
                </option>
              ))}
            </select>
            {errors.sede_id && (
              <span className="text-red-500 text-sm">
                {errors.sede_id.message}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activoUsuario"
              {...register("activo")}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="activoUsuario"
              className="ml-2 block text-sm text-gray-700"
            >
              Usuario activo
            </label>
          </div>
          {errors.activo && (
            <span className="text-red-500 text-sm">
              {errors.activo.message}
            </span>
          )}
        </div>

        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="flex space-x-2">
          <Button type="submit" disabled={loading} variant="primary">
            {isEditing ? "Actualizar usuario" : "Agregar usuario"}
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
                Usuario
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sede
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
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{usuario.nombre}</td>
                <td className="px-4 py-3">{usuario.email}</td>
                <td className="px-4 py-3 capitalize">{usuario.rol}</td>
                <td className="px-4 py-3">
                  {usuario.sede ? String(usuario.sede) : "N/A"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      usuario.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(usuario)}
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
