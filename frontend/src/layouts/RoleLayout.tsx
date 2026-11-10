import { Outlet, useNavigate, Link } from "react-router-dom";
import { logout } from "../services/api";
import logo from "../assets/ambiental2.png";

type Props = {
  role: string;
  subtitle: string;
};

export default function RoleLayout({ role, subtitle }: Props) {
  const navigate = useNavigate();

  async function handleLogout() {
    try { await logout(); } catch {}
    localStorage.removeItem("rastreoUser");
    navigate("/login");
  }

  return (
    <div className="role-page">
      <div className="role-container">
        <div className="role-header">
          <img src={logo} alt="Logo Rastreo Ambiental" />
          <div>
            <h2>{role}</h2>
            <p>{subtitle}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
