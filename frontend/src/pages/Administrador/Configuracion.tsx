import { useState } from "react";
import { Link } from "react-router-dom";

export default function Configuracion() {
  const [mantenimiento,setMantenimiento]=useState(false); const [capacidad,setCapacidad]=useState(""); const [tiempo,setTiempo]=useState(""); const [frecuencia,setFrecuencia]=useState("Inmediata"); const [estado,setEstado]=useState("");
  const [mods,setMods]=useState({mapa:true,reportes:true,notificaciones:true});
  return <div className="page-container"><Link to="/administrador/dashboard" className="btn btn-dark">Volver</Link><h2 className="page-title">Configuración del sistema</h2>
    <div className="card form-card"><h3>Estado del sistema</h3><label className="check"><input type="checkbox" checked={mantenimiento} onChange={e=>setMantenimiento(e.target.checked)}/> Modo mantenimiento</label><button className="btn btn-primary" onClick={()=>setEstado(mantenimiento?"Sistema en MANTENIMIENTO":"Sistema activo")}>Guardar estado</button>{estado&&<p className="success-message">{estado}</p>}</div>
    <div className="card form-card"><h3>Configuración de camiones</h3><input className="form-control" placeholder="Capacidad máxima por camión" value={capacidad} onChange={e=>setCapacidad(e.target.value)}/><input className="form-control" placeholder="Tiempo de actualización (segundos)" value={tiempo} onChange={e=>setTiempo(e.target.value)}/><button className="btn btn-success" onClick={()=>setEstado(`Capacidad: ${capacidad}. Actualización: ${tiempo} segundos.`)}>Guardar configuración</button></div>
    <div className="card form-card"><h3>Configuración de notificaciones</h3><select className="form-control" value={frecuencia} onChange={e=>setFrecuencia(e.target.value)}><option>Inmediata</option><option>Cada 5 min</option><option>Cada hora</option></select><button className="btn btn-warning" onClick={()=>setEstado(`Frecuencia: ${frecuencia}`)}>Guardar configuración</button></div>
    <div className="card form-card"><h3>Módulos del sistema</h3>{(["mapa","reportes","notificaciones"] as const).map(k=><label className="check" key={k}><input type="checkbox" checked={mods[k]} onChange={e=>setMods({...mods,[k]:e.target.checked})}/> {k[0].toUpperCase()+k.slice(1)}</label>)}<button className="btn btn-danger" onClick={()=>setEstado(`Mapa: ${mods.mapa?"Activo":"Desactivado"} | Reportes: ${mods.reportes?"Activo":"Desactivado"} | Notificaciones: ${mods.notificaciones?"Activo":"Desactivado"}`)}>Aplicar cambios</button></div>
  </div>;
}
