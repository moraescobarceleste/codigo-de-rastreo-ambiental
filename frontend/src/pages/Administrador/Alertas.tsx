import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

type AlertItem = { msg: string; nivel: string };

export default function Alertas() {
  const [mensaje, setMensaje] = useState("");
  const [nivel, setNivel] = useState("informativa");
  const [lista, setLista] = useState<AlertItem[]>([]);

  function crearAlerta(e: FormEvent) {
    e.preventDefault();
    if (!mensaje.trim()) return;
    setLista(prev => [...prev, { msg: mensaje, nivel }]);
    setMensaje("");
  }

  return <div className="page-container">
    <Link to="/administrador/dashboard" className="btn btn-dark">Volver</Link>
    <h2 className="page-title">Configuración de alertas</h2>
    <form className="card form-card" onSubmit={crearAlerta}>
      <input className="form-control" value={mensaje} onChange={e => setMensaje(e.target.value)} placeholder="Mensaje de alerta" />
      <select className="form-control" value={nivel} onChange={e => setNivel(e.target.value)}>
        <option value="informativa">Informativa</option><option value="advertencia">Advertencia</option><option value="critica">Crítica</option>
      </select>
      <button className="btn btn-danger">Activar alerta</button>
    </form>
    <div className="stack">
      {lista.map((a, i) => <div key={i} className={`alert alert-${a.nivel}`}>{a.msg}</div>)}
    </div>
  </div>;
}
