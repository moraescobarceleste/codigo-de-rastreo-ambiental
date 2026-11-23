import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reportesApi, formatearFecha, type Reporte, type TipoReporte } from "../../services/api";

const TIPOS: { valor: TipoReporte; etiqueta: string }[] = [
  { valor: "acumulacion", etiqueta: "Acumulación de basura" },
  { valor: "recoleccion_omitida", etiqueta: "Recolección omitida" },
  { valor: "punto_critico", etiqueta: "Punto crítico" },
  { valor: "otro", etiqueta: "Otro" },
];

export default function Reportes() {
  const [tipo, setTipo] = useState<TipoReporte>("acumulacion");
  const [descripcion, setDescripcion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    reportesApi
      .listar()
      .then(setReportes)
      .catch((e) => setError(e instanceof Error ? e.message : "No se pudieron cargar tus reportes."));
  }, []);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setError("");
    setOk("");
    setEnviando(true);
    try {
      const nuevo = await reportesApi.crear({ tipo, descripcion, direccion });
      setReportes((prev) => [nuevo, ...prev]);
      setDescripcion("");
      setDireccion("");
      setOk("Reporte enviado correctamente.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo enviar el reporte.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="page-container">
      <Link to="/ciudadano/dashboard" className="btn btn-dark">Volver</Link>
      <h2 className="page-title">Reportar incidente</h2>

      <form className="card form-card" onSubmit={enviar}>
        <select className="form-control" value={tipo} onChange={(e) => setTipo(e.target.value as TipoReporte)}>
          {TIPOS.map((t) => <option key={t.valor} value={t.valor}>{t.etiqueta}</option>)}
        </select>
        <input className="form-control" placeholder="Dirección o lugar" value={direccion}
          onChange={(e) => setDireccion(e.target.value)} required />
        <textarea className="form-control" placeholder="Describe el problema" value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)} required />
        <button className="btn btn-danger" type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar reporte"}
        </button>
      </form>

      {ok && <p className="success-message">{ok}</p>}
      {error && <p className="error-message">{error}</p>}

      <h3 className="page-title">Mis reportes</h3>
      {reportes.length === 0 ? (
        <p>Aún no has enviado reportes.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Fecha</th><th>Tipo</th><th>Dirección</th><th>Estado</th></tr></thead>
            <tbody>
              {reportes.map((r) => (
                <tr key={r.id_reporte}>
                  <td>{formatearFecha(r.fecha_creacion)}</td>
                  <td>{TIPOS.find((t) => t.valor === r.tipo)?.etiqueta}</td>
                  <td>{r.direccion}</td>
                  <td>{r.estado.replace("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
