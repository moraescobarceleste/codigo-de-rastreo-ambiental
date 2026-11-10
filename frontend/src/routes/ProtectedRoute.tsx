import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  role: string;
}

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  try {
    const datos = JSON.parse(usuario);

    if (datos.tipo_usuario !== role) {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch {
    localStorage.removeItem("usuario");
    return <Navigate to="/login" replace />;
  }
}