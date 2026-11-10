import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/ambiental2.png";
import { logout } from "../services/api";

const links = [
  ["Usuarios", "/administrador/usuarios"],
  ["Rutas", "/administrador/rutas"],
  ["Vehículos", "/administrador/camiones"],
  ["Conductores", "/administrador/conductores"],
  ["Monitoreo GPS", "/administrador/monitoreo"],
  ["Reportes", "/administrador/reportes"],
  ["Notificaciones", "/administrador/notificaciones"],
  ["Alertas", "/administrador/alertas"],
  ["Análisis", "/administrador/analisis"],
  ["Configuración", "/administrador/configuracion"],
  ["Horarios", "/administrador/horarios"],
];

export default function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    try { await logout(); } catch {}
    localStorage.removeItem("rastreoUser");
    navigate("/login");
  }

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src={logo} alt="Logo" />
          <h3>ADMINISTRADOR</h3>
        </div>
        {links.map(([label, path]) => (
          <Link key={path} to={path}>{label}</Link>
        ))}
        <button className="admin-logout" onClick={handleLogout}>Cerrar sesión</button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
