import { Link } from "react-router-dom";
import logo from "../assets/ambiental2.png";
import fondo from "../assets/fondo.jpg";

export default function Home() {
  return (
    <div className="index-page">
      <header className="navbar">
        <div className="logo-nav">
          <img src={logo} alt="Logo" />
          <h2>RASTREO AMBIENTAL</h2>
        </div>
        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Registro</Link>
        </nav>
      </header>

      <section className="hero" style={{ backgroundImage: `url(${fondo})` }}>
        <div className="overlay">
          <h1>Monitoreo Ambiental Inteligente</h1>
          <p>Plataforma para control de rutas, gestión de residuos, monitoreo ciudadano y administración ambiental en tiempo real.</p>
          <div className="buttons">
            <Link to="/login" className="btn1">Iniciar Sesión</Link>
            <Link to="/register" className="btn2">Registrarse</Link>
          </div>
          <div className="features">
            <div className="feature-card"><h3>Geolocalización</h3><span>Seguimiento en tiempo real</span></div>
            <div className="feature-card"><h3>Reportes</h3><span>Gestión centralizada</span></div>
            <div className="feature-card"><h3>Alertas</h3><span>Control ambiental activo</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}
