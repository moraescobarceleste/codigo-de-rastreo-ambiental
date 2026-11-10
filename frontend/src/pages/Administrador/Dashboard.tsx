export default function Dashboard() {
  return (
    <>
      <h1>Panel de administración</h1>
      <p className="subtitle">Control general del sistema RASTREO AMBIENTAL</p>
      <div className="admin-cards">
        <div className="admin-card"><h3>Usuarios activos</h3><span>154</span></div>
        <div className="admin-card"><h3>Vehículos activos</h3><span>28</span></div>
        <div className="admin-card"><h3>Alertas activas</h3><span>7</span></div>
        <div className="admin-card"><h3>Reportes pendientes</h3><span>19</span></div>
      </div>
    </>
  );
}
