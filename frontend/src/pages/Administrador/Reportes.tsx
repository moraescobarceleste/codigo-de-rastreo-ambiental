import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

export default function Reportes() {
  const [camion,setCamion]=useState(""); const [viajes,setViajes]=useState(""); const [retrasos,setRetrasos]=useState(""); const [reportes,setReportes]=useState<{camion:string,eficiencia:string}[]>([]);
  function add(e:FormEvent){e.preventDefault(); const v=Number(viajes), r=Number(retrasos); if(!camion||v<=0)return; setReportes(p=>[...p,{camion,eficiencia:(((v-r)/v)*100).toFixed(1)}]);setCamion("");setViajes("");setRetrasos("");}
  return <div className="page-container"><Link to="/administrador/dashboard" className="btn btn-dark">Volver</Link><h2 className="page-title">Reportes de desempeño</h2>
    <form className="card form-card" onSubmit={add}><input className="form-control" placeholder="Camión" value={camion} onChange={e=>setCamion(e.target.value)}/><input className="form-control" type="number" placeholder="Viajes realizados" value={viajes} onChange={e=>setViajes(e.target.value)}/><input className="form-control" type="number" placeholder="Retrasos" value={retrasos} onChange={e=>setRetrasos(e.target.value)}/><button className="btn btn-primary">Generar reporte</button></form>
    <div className="stack">{reportes.map((r,i)=><div className="card" key={i}>Camión: {r.camion} — eficiencia: {r.eficiencia}%</div>)}</div>
  </div>;
}
