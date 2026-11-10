import { Link } from "react-router-dom";
export default function Mapa(){return <div className="page-container"><Link to="/ciudadano/dashboard" className="btn btn-dark">Volver</Link><h2 className="page-title">Camiones en tiempo real</h2><iframe className="map-frame" src="https://maps.google.com/maps?q=Bogota&t=&z=13&ie=UTF8&iwloc=&output=embed" title="Camiones en Bogotá"/></div>}
