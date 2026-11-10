import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <div className="page-container terms-page">
      <Link to="/login" className="btn btn-dark">Volver</Link>
      <h1 className="page-title">Términos y Condiciones</h1>
      <div className="card">
        <p>Al utilizar Rastreo Ambiental, el usuario acepta utilizar la plataforma de manera responsable y proporcionar información correcta.</p>
        <p>Los datos de acceso deben mantenerse privados y no deben compartirse con terceros.</p>
        <p>El sistema se encuentra en desarrollo y algunas funciones pueden estar pendientes de integración con el backend.</p>
      </div>
    </div>
  );
}
