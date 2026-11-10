import { Link } from "react-router-dom";

type Props = {
  title: string;
  back?: string;
};

export default function TopBar({ title, back }: Props) {
  return (
    <div className="topbar">
      {back ? <Link to={back} className="btn btn-dark">Volver</Link> : <span />}
      <strong>{title}</strong>
    </div>
  );
}
