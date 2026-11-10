import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Terms from "./pages/Auth/Terms";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import RoleLayout from "./layouts/RoleLayout";

// ADMINISTRADOR
import AdminDashboard from "./pages/Administrador/Dashboard";
import Alertas from "./pages/Administrador/Alertas";
import Analisis from "./pages/Administrador/Analisis";
import Camiones from "./pages/Administrador/Camiones";
import Conductores from "./pages/Administrador/Conductores";
import Configuracion from "./pages/Administrador/Configuracion";
import Horarios from "./pages/Administrador/Horarios";
import Monitoreo from "./pages/Administrador/Monitoreo";
import Notificaciones from "./pages/Administrador/Notificaciones";
import ReportesAdmin from "./pages/Administrador/Reportes";
import RutasAdmin from "./pages/Administrador/Rutas";
import Usuarios from "./pages/Administrador/Usuarios";

// CIUDADANO
import CiudadanoDashboard from "./pages/Ciudadano/Dashboard";
import Mapa from "./pages/Ciudadano/Mapa";
import Reciclaje from "./pages/Ciudadano/Reciclaje";
import ReportesCiudadano from "./pages/Ciudadano/Reportes";

// CONDUCTOR
import ConductorDashboard from "./pages/Conductor/Dashboard";

// FUNCIONARIO
import FuncionarioDashboard from "./pages/Funcionario/Dashboard";
import GpsFuncionario from "./pages/Funcionario/Gps";

// GENÉRICO
import GenericModule from "./pages/GenericModule";

export default function App() {
  return (
    <Routes>

      {/* ==================== PÚBLICAS ==================== */}

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/terms" element={<Terms />} />


      {/* ==================== ADMINISTRADOR ==================== */}

      <Route element={<ProtectedRoute role="administrador" />}>
        <Route path="/administrador" element={<AdminLayout />}>

          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="alertas" element={<Alertas />} />

          <Route path="analisis" element={<Analisis />} />

          <Route path="camiones" element={<Camiones />} />

          <Route path="conductores" element={<Conductores />} />

          <Route path="configuracion" element={<Configuracion />} />

          <Route path="horarios" element={<Horarios />} />

          <Route path="monitoreo" element={<Monitoreo />} />

          <Route path="notificaciones" element={<Notificaciones />} />

          <Route path="reportes" element={<ReportesAdmin />} />

          <Route path="rutas" element={<RutasAdmin />} />

          <Route path="usuarios" element={<Usuarios />} />

        </Route>
      </Route>


      {/* ==================== CIUDADANO ==================== */}

      <Route element={<ProtectedRoute role="ciudadano" />}>
        <Route
          path="/ciudadano"
          element={
            <RoleLayout
              role="CIUDADANO"
              subtitle="Consulta y participación en el sistema"
            />
          }
        >

          <Route path="dashboard" element={<CiudadanoDashboard />} />

          <Route path="mapa" element={<Mapa />} />

          <Route path="reciclaje" element={<Reciclaje />} />

          <Route path="reportes" element={<ReportesCiudadano />} />

          <Route
            path="novedades"
            element={
              <GenericModule
                title="Novedades del sistema"
                back="/ciudadano/dashboard"
              />
            }
          />

        </Route>
      </Route>


      {/* ==================== CONDUCTOR ==================== */}

      <Route element={<ProtectedRoute role="conductor" />}>
        <Route
          path="/conductor"
          element={
            <RoleLayout
              role="CONDUCTOR"
              subtitle="Operación y gestión del vehículo"
            />
          }
        >

          <Route path="dashboard" element={<ConductorDashboard />} />

          <Route
            path="gps"
            element={
              <GenericModule
                title="GPS"
                back="/conductor/dashboard"
              />
            }
          />

          <Route
            path="reportes"
            element={
              <GenericModule
                title="Reportes"
                back="/conductor/dashboard"
              />
            }
          />

          <Route
            path="historial"
            element={
              <GenericModule
                title="Historial"
                back="/conductor/dashboard"
              />
            }
          />

          <Route
            path="rutas"
            element={
              <GenericModule
                title="Rutas"
                back="/conductor/dashboard"
              />
            }
          />

          <Route
            path="recoleccion"
            element={
              <GenericModule
                title="Recolección"
                back="/conductor/dashboard"
              />
            }
          />

          <Route
            path="validacion"
            element={
              <GenericModule
                title="Validación"
                back="/conductor/dashboard"
              />
            }
          />

          <Route
            path="prioridad"
            element={
              <GenericModule
                title="Prioridad"
                back="/conductor/dashboard"
              />
            }
          />

          <Route
            path="horario"
            element={
              <GenericModule
                title="Horario"
                back="/conductor/dashboard"
              />
            }
          />

          <Route
            path="fallas"
            element={
              <GenericModule
                title="Fallas"
                back="/conductor/dashboard"
              />
            }
          />

        </Route>
      </Route>


      {/* ==================== FUNCIONARIO ==================== */}

      <Route element={<ProtectedRoute role="funcionario" />}>
        <Route
          path="/funcionario"
          element={
            <RoleLayout
              role="FUNCIONARIO"
              subtitle="Gestión operativa del sistema"
            />
          }
        >

          <Route
            path="dashboard"
            element={<FuncionarioDashboard />}
          />

          <Route
            path="gps"
            element={<GpsFuncionario />}
          />

          <Route
            path="basura"
            element={
              <GenericModule
                title="Basura"
                back="/funcionario/dashboard"
              />
            }
          />

          <Route
            path="historial"
            element={
              <GenericModule
                title="Historial"
                back="/funcionario/dashboard"
              />
            }
          />

          <Route
            path="horario"
            element={
              <GenericModule
                title="Horario"
                back="/funcionario/dashboard"
              />
            }
          />

          <Route
            path="prioridad"
            element={
              <GenericModule
                title="Prioridad"
                back="/funcionario/dashboard"
              />
            }
          />

          <Route
            path="reportes"
            element={
              <GenericModule
                title="Reportes"
                back="/funcionario/dashboard"
              />
            }
          />

          <Route
            path="rutas"
            element={
              <GenericModule
                title="Rutas"
                back="/funcionario/dashboard"
              />
            }
          />

          <Route
            path="validacion"
            element={
              <GenericModule
                title="Validación"
                back="/funcionario/dashboard"
              />
            }
          />

        </Route>
      </Route>


      {/* ==================== RUTA NO ENCONTRADA ==================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}
