import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { reportesApi, formatearFecha, type EstadoReporte, type Reporte } from "../../services/api";

const ESTADOS: EstadoReporte[] = ["recibido", "en_revision", "resuelto", "descartado"];

export default function Reportes() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    reportesApi
      .listar()
      .then(setReportes)
      .catch((e) => setError(e instanceof Error ? e.message : "No se pudieron cargar los reportes."))
      .finally(() => setCargando(false));
  }, []);

  async function cambiar(id: number, estado: EstadoReporte) {
    setError("");
    try {
      const actualizado = await reportesApi.cambiarEstado(id, estado);
      setReportes((prev) => prev.map((r) => (r.id_reporte === id ? { ...r, ...actualizado } : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar el reporte.");
    }
  }

  return (
    <div className="page-container">
      <Link to="/administrador/dashboard" className="btn btn-dark">Volver</Link>
      <h2 className="page-title">Reportes ciudadanos</h2>

      {error && <p className="error-message">{error}</p>}
      {cargando && <p>Cargando reportes...</p>}
      {!cargando && reportes.length === 0 && !error && <p>No hay reportes por revisar.</p>}

      {reportes.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Fecha</th><th>Ciudadano</th><th>Dirección</th><th>Descripción</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {reportes.map((r) => (
                <tr key={r.id_reporte}>
                  <td>{formatearFecha(r.fecha_creacion)}</td>
                  <td>{r.ciudadano}</td>
                  <td>{r.direccion}</td>
                  <td>{r.descripcion}</td>
                  <td>
                    <select className="form-control" value={r.estado}
                      onChange={(e) => cambiar(r.id_reporte, e.target.value as EstadoReporte)}>
                      {ESTADOS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
