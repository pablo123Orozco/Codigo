// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/login';
import Dashboard from './componentes/dashboard';
import UserModule from './modulos/usuario/usuarios';
import ClienteModule from './modulos/clientes/clientes';
import ProveedoresModule from './modulos/proveedores/proveedores';
import VehiculoModule from './modulos/vehiculos/vehiculo';
import OrdenesServicioModule from './modulos/ordenes/ordenes';
import CompraModule from './modulos/compras/compras';
import MecanicoModule from './modulos/mecanico/mecanico';
import ServicioModule from './modulos/servicios/servicios';
import CajaModule from './modulos/caja/caja';
import ReportesModule from './modulos/reportes/Reportes'; // Reporte de Clientes
import ReportesCompras from './modulos/reportes/ReporteCompra'; // Reporte de Compras
import PrivateRoute from './componentes/PrivateRoute';
import ServicioForm from './modulos/servicios/serviciosForms';
import { useState } from 'react';

function App() {
  const [servicioToEdit, setServicioToEdit] = useState(null);

  const handleSaveServicio = () => {
    setServicioToEdit(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/usuarios" element={<UserModule />} />
          <Route path="/clientes" element={<ClienteModule />} />
          <Route path="/proveedores" element={<ProveedoresModule />} />
          <Route path="/vehiculos" element={<VehiculoModule />} />
          <Route path="/ordenes" element={<OrdenesServicioModule />} />
          <Route path="/compras" element={<CompraModule />} />
          <Route path="/mecanico" element={<MecanicoModule />} />
          <Route path="/servicios" element={<ServicioModule />} />

          {/* Ruta para crear un nuevo servicio */}
          <Route 
            path="/servicios/nuevo" 
            element={<ServicioForm servicioToEdit={null} onSave={handleSaveServicio} />} 
          />

          {/* Ruta para editar un servicio existente */}
          <Route 
            path="/servicios/editar/:id" 
            element={<ServicioForm servicioToEdit={servicioToEdit} onSave={handleSaveServicio} />} 
          />

          {/* Ruta para el módulo de caja */}
          <Route path="/caja" element={<CajaModule />} />

          {/* Rutas para el módulo de reportes */}
          <Route path="/reportes/clientes" element={<ReportesModule />} />
          <Route path="/reportes/compras" element={<ReportesCompras />} />
        </Route>

        {/* Redirigir cualquier ruta no existente al login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
