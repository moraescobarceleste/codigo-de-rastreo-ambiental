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
