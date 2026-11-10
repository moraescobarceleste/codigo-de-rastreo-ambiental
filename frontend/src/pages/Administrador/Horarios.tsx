import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

export default function Horarios() {
  const [ruta,setRuta]=useState(""); const [hora,setHora]=useState(""); const [items,setItems]=useState<{ruta:string,hora:string}[]>([]);
  function add(e:FormEvent){e.preventDefault(); if(!ruta||!hora)return; setItems(p=>[...p,{ruta,hora}]);setRuta("");setHora("");}
  return <div className="page-container"><Link to="/administrador/dashboard" className="btn btn-dark">Volver</Link><h2 className="page-title">Gestión de horarios</h2>
    <form className="card form-card" onSubmit={add}><input className="form-control" placeholder="Ruta" value={ruta} onChange={e=>setRuta(e.target.value)}/><input className="form-control" type="time" value={hora} onChange={e=>setHora(e.target.value)}/><button className="btn btn-success">Agregar</button></form>
    <div className="table-wrap"><table><thead><tr><th>Ruta</th><th>Hora</th></tr></thead><tbody>{items.map((h,i)=><tr key={i}><td>{h.ruta}</td><td>{h.hora}</td></tr>)}</tbody></table></div>
  </div>;
}
