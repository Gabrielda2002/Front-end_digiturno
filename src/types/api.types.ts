export type Sede = {
  id: string;
  nombre: string;
  codigo: string;
  direccion: string;
  telefono?: string;
  activa: boolean;
  created_at?: string;
  updated_at?: string;
};

export type MotivoVisita = {
  id: string;
  sede_id: string;
  nombre: string;
  prefijo: string;
  descripcion?: string;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Modulo = {
  id: string;
  sede_id: string;
  nombre: string;
  numero: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TurnoEstado = 'esperando' | 'llamando' | 'atendido' | 'cancelado' | 'derivado';

export type Turno = {
  id: string;
  sede_id: string;
  numero_turno: string;
  cedula: string;
  motivo_id: string;
  modulo_id?: string;
  estado: TurnoEstado;
  fecha_creacion: string;
  fecha_llamado?: string;
  fecha_atencion?: string;
  motivo?: MotivoVisita;
  modulo?: Modulo;
  tiempoEspera?: number; // En minutos
};

export type RolUsuario = 'admin' | 'supervisor' | 'operador';

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  sede_id?: string;
  activo: boolean;
  sede?: Sede;
  created_at?: string;
  updated_at?: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  usuario: Omit<Usuario, 'password'>;
};

export type ApiError = {
  message: string;
  statusCode?: number;
};
