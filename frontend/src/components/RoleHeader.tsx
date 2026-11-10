import { Link } from "react-router-dom";
import logo from "../assets/ambiental2.png";

type Props = {
  role: string;
  subtitle: string;
  back?: string;
};

export default function RoleHeader({ role, subtitle, back }: Props) {
  return (
    <div className="role-header">
      <img src={logo} alt="Logo Rastreo Ambiental" />
      <div>
        <h2>{role}</h2>
        <p>{subtitle}</p>
      </div>
      {back && <Link to={back} className="logout-btn">Volver</Link>}
    </div>
  );
}
