import { Link } from "react-router-dom";
export default function Analisis(){return <div className="page-container"><Link to="/administrador/dashboard" className="btn btn-dark">Volver</Link><h2 className="page-title">Puntos críticos del sistema</h2><div className="card critical">Zona centro: alta congestión</div><div className="card warning-card">Ruta norte: retrasos frecuentes</div></div>}
