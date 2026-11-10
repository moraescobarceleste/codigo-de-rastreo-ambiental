import { Link } from "react-router-dom";
export default function Monitoreo(){return <div className="page-container"><Link to="/administrador/dashboard" className="btn btn-dark">Volver</Link><h2 className="page-title">Monitoreo de camiones</h2><iframe className="map-frame" src="https://maps.google.com/maps?q=Bogota&t=&z=12&ie=UTF8&iwloc=&output=embed" title="Mapa de Bogotá"/></div>}
