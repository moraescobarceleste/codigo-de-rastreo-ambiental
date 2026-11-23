import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { rutasApi, type PuntoRuta, type Ruta } from "../../services/api";

export default function Rutas() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [puntos, setPuntos] = useState<PuntoRuta[]>([{ direccion: "" }]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function cargar() {
    try {
      setRutas(await rutasApi.listar());
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar las rutas.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function cambiarPunto(i: number, direccion: string) {
    setPuntos((prev) => prev.map((p, idx) => (idx === i ? { ...p, direccion } : p)));
  }

  async function guardar(e: FormEvent) {
    e.preventDefault();
    setError("");
    setOk("");
    try {
      await rutasApi.crear({
        nombre,
        descripcion,
        puntos: puntos.filter((p) => p.direccion.trim()),
      });
      setNombre("");
      setDescripcion("");
      setPuntos([{ direccion: "" }]);
      setOk("Ruta guardada correctamente.");
      await cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar la ruta.");
    }
  }

  async function eliminar(r: Ruta) {
    if (!window.confirm(`¿Eliminar la ruta "${r.nombre}"?`)) return;
    setError("");
    try {
      await rutasApi.eliminar(r.id_ruta);
      setRutas((prev) => prev.filter((x) => x.id_ruta !== r.id_ruta));
    } catch (e) {
      // Ej.: la ruta tiene asignaciones y la BD no permite borrarla
      setError(e instanceof Error ? e.message : "No se pudo eliminar la ruta.");
    }
  }

  return (
    <div className="page-container">
      <Link to="/administrador/dashboard" className="btn btn-dark">Volver</Link>
      <h2 className="page-title">Gestión de rutas</h2>

      <form className="card form-card" onSubmit={guardar}>
        <input className="form-control" placeholder="Nombre de la ruta" value={nombre}
          onChange={(e) => setNombre(e.target.value)} required />
        <textarea className="form-control" placeholder="Descripción / trayecto" value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)} />

        <strong>Puntos de recolección (en orden)</strong>
        {puntos.map((p, i) => (
          <input key={i} className="form-control" placeholder={`Dirección del punto ${i + 1}`} value={p.direccion}
            onChange={(e) => cambiarPunto(i, e.target.value)} />
        ))}
        <button type="button" className="btn btn-dark btn-sm" onClick={() => setPuntos((p) => [...p, { direccion: "" }])}>
          + Agregar punto
        </button>

        <button className="btn btn-success" type="submit">Guardar ruta</button>
      </form>

      {ok && <p className="success-message">{ok}</p>}
      {error && <p className="error-message">{error}</p>}
      {cargando && <p>Cargando rutas...</p>}
      {!cargando && rutas.length === 0 && !error && <p>Aún no hay rutas registradas.</p>}

      {rutas.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Nombre</th><th>Descripción</th><th>Puntos</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {rutas.map((r) => (
                <tr key={r.id_ruta}>
                  <td>{r.nombre}</td>
                  <td>{r.descripcion ?? "—"}</td>
                  <td>{r.total_puntos ?? 0}</td>
                  <td>{r.estado}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => eliminar(r)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
