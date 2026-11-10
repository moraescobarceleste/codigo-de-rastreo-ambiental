import { useState } from "react";
import { Link } from "react-router-dom";

type Truck = { placa: string; modelo: string; estado: string };

export default function Camiones() {
  const [form, setForm] = useState({ placa: "", modelo: "", estado: "activo" });
  const [camiones, setCamiones] = useState<Truck[]>([]);

  function add() {
    if (!form.placa || !form.modelo) return;
    setCamiones(prev => [...prev, form]);
    setForm({ placa: "", modelo: "", estado: "activo" });
  }

  function changeState(i: number) {
    const estados = ["activo", "mantenimiento", "inactivo"];
    setCamiones(prev => prev.map((c, idx) => idx === i ? { ...c, estado: estados[(estados.indexOf(c.estado) + 1) % 3] } : c));
  }

  return <div className="page-container">
    <Link to="/administrador/dashboard" className="btn btn-dark">Volver</Link>
    <h2 className="page-title">Gestión de camiones</h2>
    <div className="card form-card">
      <input className="form-control" placeholder="Placa" value={form.placa} onChange={e => setForm({...form, placa:e.target.value})}/>
      <input className="form-control" placeholder="Modelo" value={form.modelo} onChange={e => setForm({...form, modelo:e.target.value})}/>
      <select className="form-control" value={form.estado} onChange={e => setForm({...form, estado:e.target.value})}>
        <option>activo</option><option>mantenimiento</option><option>inactivo</option>
      </select>
      <button className="btn btn-success" onClick={add}>Agregar</button>
    </div>
    <div className="table-wrap"><table><thead><tr><th>Placa</th><th>Modelo</th><th>Estado</th><th>Acciones</th></tr></thead>
      <tbody>{camiones.map((c,i)=><tr key={i}><td>{c.placa}</td><td>{c.modelo}</td><td>{c.estado}</td><td><button className="btn btn-warning btn-sm" onClick={()=>changeState(i)}>Cambiar estado</button> <button className="btn btn-danger btn-sm" onClick={()=>setCamiones(prev=>prev.filter((_,idx)=>idx!==i))}>Eliminar</button></td></tr>)}</tbody>
    </table></div>
  </div>;
}
