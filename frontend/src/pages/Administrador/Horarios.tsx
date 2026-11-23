import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  asignacionesApi, camionesApi, conductoresApi, rutasApi, formatearFecha,
  type Asignacion, type Camion, type Conductor, type Ruta,
} from "../../services/api";

export default function Horarios() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [camiones, setCamiones] = useState<Camion[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [form, setForm] = useState({ id_ruta: "", id_camion: "", id_conductor: "", fecha: "" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    Promise.all([rutasApi.listar(), camionesApi.listar(), conductoresApi.listar(), asignacionesApi.listar()])
      .then(([r, c, d, a]) => {
        setRutas(r.filter((x) => x.estado === "activa"));
        setCamiones(c.filter((x) => x.estado === "activo"));
        setConductores(d);
        setAsignaciones(a);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "No se pudieron cargar los datos."));
  }, []);

  async function asignar(e: FormEvent) {
    e.preventDefault();
    setError("");
    setOk("");
    try {
      const nueva = await asignacionesApi.crear({
        id_ruta: Number(form.id_ruta),
        id_camion: Number(form.id_camion),
        id_conductor: Number(form.id_conductor),
        fecha: form.fecha,
      });
      setAsignaciones((prev) => [nueva, ...prev]);
      setForm({ id_ruta: "", id_camion: "", id_conductor: "", fecha: "" });
      setOk("Ruta asignada correctamente.");
    } catch (e) {
      // Ej.: el camión o el conductor ya tiene una ruta ese día
      setError(e instanceof Error ? e.message : "No se pudo asignar la ruta.");
    }
  }

  async function eliminar(a: Asignacion) {
    if (!window.confirm("¿Eliminar esta asignación?")) return;
    try {
      await asignacionesApi.eliminar(a.id_asignacion);
      setAsignaciones((prev) => prev.filter((x) => x.id_asignacion !== a.id_asignacion));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar la asignación.");
    }
  }

  return (
    <div className="page-container">
      <Link to="/administrador/dashboard" className="btn btn-dark">Volver</Link>
      <h2 className="page-title">Asignación de rutas</h2>

      <form className="card form-card" onSubmit={asignar}>
        <select className="form-control" value={form.id_ruta} required
          onChange={(e) => setForm({ ...form, id_ruta: e.target.value })}>
          <option value="">Selecciona una ruta</option>
          {rutas.map((r) => <option key={r.id_ruta} value={r.id_ruta}>{r.nombre}</option>)}
        </select>
        <select className="form-control" value={form.id_camion} required
          onChange={(e) => setForm({ ...form, id_camion: e.target.value })}>
          <option value="">Selecciona un camión disponible</option>
          {camiones.map((c) => <option key={c.id_camion} value={c.id_camion}>{c.placa} — {c.modelo}</option>)}
        </select>
        <select className="form-control" value={form.id_conductor} required
          onChange={(e) => setForm({ ...form, id_conductor: e.target.value })}>
          <option value="">Selecciona un conductor</option>
          {conductores.map((d) => <option key={d.id_conductor} value={d.id_conductor}>{d.nombre}</option>)}
        </select>
        <input className="form-control" type="date" value={form.fecha} required
          onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
        <button className="btn btn-success" type="submit">Asignar</button>
      </form>

      {ok && <p className="success-message">{ok}</p>}
      {error && <p className="error-message">{error}</p>}

      {asignaciones.length === 0 ? (
        <p>Aún no hay rutas asignadas.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Fecha</th><th>Ruta</th><th>Camión</th><th>Conductor</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {asignaciones.map((a) => (
                <tr key={a.id_asignacion}>
                  <td>{formatearFecha(a.fecha)}</td>
                  <td>{a.ruta}</td>
                  <td>{a.placa}</td>
                  <td>{a.conductor}</td>
                  <td>{a.estado.replace("_", " ")}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => eliminar(a)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
