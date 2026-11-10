import { Link } from "react-router-dom";
import { useState } from "react";

type User = { id:number; nombre:string; rol:string };

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<User[]>([{id:1,nombre:"Juan Pérez",rol:"Ciudadano"}]);
  return <div className="page-container">
    <Link to="/administrador/dashboard" className="btn btn-dark">Volver</Link>
    <h2 className="page-title">Gestión de usuarios</h2>
    <button className="btn btn-primary" onClick={()=>setUsuarios(p=>[...p,{id:p.length+1,nombre:"Nuevo usuario",rol:"Ciudadano"}])}>Agregar usuario</button>
    <div className="table-wrap"><table><thead><tr><th>ID</th><th>Nombre</th><th>Rol</th><th>Acciones</th></tr></thead>
      <tbody>{usuarios.map(u=><tr key={u.id}><td>{u.id}</td><td>{u.nombre}</td><td>{u.rol}</td><td><button className="btn btn-warning btn-sm">Editar</button> <button className="btn btn-danger btn-sm" onClick={()=>setUsuarios(p=>p.filter(x=>x.id!==u.id))}>Eliminar</button></td></tr>)}</tbody>
    </table></div>
  </div>;
}
