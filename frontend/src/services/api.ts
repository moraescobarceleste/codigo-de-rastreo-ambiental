const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Ocurrió un error en la solicitud.");
  }

  return data as T;
}

export type LoginResponse = {
  message: string;
  user: {
    id_usuario: number;
    nombre: string;
    tipo_usuario: "administrador" | "funcionario" | "ciudadano" | "conductor";
  };
};

export async function login(correo: string, password: string) {
  return apiRequest<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ correo, password }),
  });
}

export async function register(data: Record<string, unknown>) {
  return apiRequest<{ message: string }>("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logout() {
  return apiRequest<{ message: string }>("/logout", { method: "POST" });
}

/* ---------- Tipos y llamadas de los módulos operativos ---------- */

export type EstadoCamion = "activo" | "mantenimiento" | "inactivo";

export type Camion = {
  id_camion: number;
  placa: string;
  modelo: string;
  capacidad_kg: number | null;
  estado: EstadoCamion;
};

export type PuntoRuta = {
  orden?: number;
  direccion: string;
  latitud?: number | null;
  longitud?: number | null;
};

export type Ruta = {
  id_ruta: number;
  nombre: string;
  descripcion: string | null;
  estado: "activa" | "inactiva";
  total_puntos?: number;
  puntos?: PuntoRuta[];
};

const json = (data: unknown) => JSON.stringify(data);

export const camionesApi = {
  listar: () => apiRequest<{ camiones: Camion[] }>("/camiones").then((r) => r.camiones),
  crear: (data: Omit<Camion, "id_camion">) =>
    apiRequest<{ camion: Camion }>("/camiones", { method: "POST", body: json(data) }).then((r) => r.camion),
  actualizar: (id: number, data: Omit<Camion, "id_camion">) =>
    apiRequest<{ camion: Camion }>(`/camiones/${id}`, { method: "PUT", body: json(data) }).then((r) => r.camion),
  eliminar: (id: number) => apiRequest<{ message: string }>(`/camiones/${id}`, { method: "DELETE" }),
};

export const rutasApi = {
  listar: () => apiRequest<{ rutas: Ruta[] }>("/rutas").then((r) => r.rutas),
  crear: (data: { nombre: string; descripcion: string; puntos: PuntoRuta[] }) =>
    apiRequest<{ ruta: Ruta }>("/rutas", { method: "POST", body: json(data) }).then((r) => r.ruta),
  eliminar: (id: number) => apiRequest<{ message: string }>(`/rutas/${id}`, { method: "DELETE" }),
};

/* ---------- Reportes, asignaciones y conductores ---------- */

export type TipoReporte = "acumulacion" | "recoleccion_omitida" | "punto_critico" | "otro";
export type EstadoReporte = "recibido" | "en_revision" | "resuelto" | "descartado";

export type Reporte = {
  id_reporte: number;
  tipo: TipoReporte;
  descripcion: string;
  direccion: string;
  estado: EstadoReporte;
  fecha_creacion: string;
  ciudadano?: string;
};

export type EstadoAsignacion = "programada" | "en_curso" | "completada" | "cancelada";

export type Asignacion = {
  id_asignacion: number;
  fecha: string;
  estado: EstadoAsignacion;
  id_ruta: number;
  ruta: string;
  id_camion: number;
  placa: string;
  id_conductor: number;
  conductor: string;
};

export type Conductor = {
  id_conductor: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  num_documento: string | null;
  licencia: string | null;
};

export const reportesApi = {
  listar: () => apiRequest<{ reportes: Reporte[] }>("/reportes").then((r) => r.reportes),
  crear: (data: { tipo: TipoReporte; descripcion: string; direccion: string }) =>
    apiRequest<{ reporte: Reporte }>("/reportes", { method: "POST", body: json(data) }).then((r) => r.reporte),
  cambiarEstado: (id: number, estado: EstadoReporte) =>
    apiRequest<{ reporte: Reporte }>(`/reportes/${id}/estado`, { method: "PATCH", body: json({ estado }) }).then(
      (r) => r.reporte
    ),
};

export const asignacionesApi = {
  listar: () => apiRequest<{ asignaciones: Asignacion[] }>("/asignaciones").then((r) => r.asignaciones),
  crear: (data: { id_ruta: number; id_camion: number; id_conductor: number; fecha: string }) =>
    apiRequest<{ asignacion: Asignacion }>("/asignaciones", { method: "POST", body: json(data) }).then(
      (r) => r.asignacion
    ),
  cambiarEstado: (id: number, estado: EstadoAsignacion) =>
    apiRequest<{ asignacion: Asignacion }>(`/asignaciones/${id}/estado`, {
      method: "PATCH",
      body: json({ estado }),
    }).then((r) => r.asignacion),
  eliminar: (id: number) => apiRequest<{ message: string }>(`/asignaciones/${id}`, { method: "DELETE" }),
};

export const conductoresApi = {
  listar: () => apiRequest<{ conductores: Conductor[] }>("/conductores").then((r) => r.conductores),
};

export function formatearFecha(valor: string) {
  const f = new Date(valor);
  return Number.isNaN(f.getTime()) ? valor : f.toLocaleDateString("es-CO", { timeZone: "UTC" });
}
