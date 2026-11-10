import { Link } from "react-router-dom";
import { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
  back: string;
};

export default function SimplePage({ title, children, back }: Props) {
  return (
    <div className="page-container">
      <Link to={back} className="btn btn-dark">Volver</Link>
      <h2 className="page-title">{title}</h2>
      {children || <div className="card"><p>Módulo preparado para integrar su funcionalidad.</p></div>}
    </div>
  );
}
