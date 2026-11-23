import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { apiRequest } from "../services/api";

interface ProtectedRouteProps {
  role: string;
}

type Estado = "cargando" | "autorizado" | "sin-sesion" | "sin-permiso";

/**
 * Protege las rutas por rol. La decisión la toma el SERVIDOR (GET /session);
 * localStorage solo guarda datos de apariencia, nunca autoriza el acceso.
 */
export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const [estado, setEstado] = useState<Estado>("cargando");

  useEffect(() => {
    let activo = true;

    apiRequest<{ user: { tipo_usuario: string } | null }>("/session")
      .then(({ user }) => {
        if (!activo) return;
        if (!user) {
          localStorage.removeItem("usuario");
          setEstado("sin-sesion");
        } else {
          setEstado(user.tipo_usuario === role ? "autorizado" : "sin-permiso");
        }
      })
      .catch(() => {
        if (activo) setEstado("sin-sesion");
      });

    return () => {
      activo = false;
    };
  }, [role]);

  if (estado === "cargando") return <p style={{ padding: "2rem" }}>Verificando sesión...</p>;
  if (estado === "sin-sesion") return <Navigate to="/login" replace />;
  if (estado === "sin-permiso") return <Navigate to="/" replace />;
  return <Outlet />;
}
