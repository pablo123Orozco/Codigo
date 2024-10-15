import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './componentes/login';
import Dashboard from './componentes/dashboard';
import UserModule from './modulos/usuario/usuarios';  // Módulo de usuarios
import ClienteModule from './modulos/clientes/clientes';  // Módulo de clientes
import ProveedoresModule from './modulos/proveedores/proveedores';
import VehiculoModule from './modulos/vehiculos/vehiculo';  // Módulo de vehículos
import OrdenesServicioModule from './modulos/ordenes/ordenes';  // Importa el módulo de órdenes de servicio
import CompraModule from './modulos/compras/compras';  // Módulo de compras
import MecanicoModule from './modulos/mecanico/mecanico';  // Módulo de mecánicos

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/usuarios" element={<UserModule />} />  {/* Ruta para el módulo de usuarios */}
        <Route path="/clientes" element={<ClienteModule />} />  {/* Ruta para el módulo de clientes */}
        <Route path="/proveedores" element={<ProveedoresModule />} />  {/* Ruta para el módulo de proveedores */}
        <Route path="/vehiculos" element={<VehiculoModule />} />  {/* Ruta para el módulo de vehículos */}
        <Route path="/ordenes" element={<OrdenesServicioModule />} />  {/* Ruta para el módulo de órdenes de servicio */}
        <Route path="/compras" element={<CompraModule />} /> {/* Ruta para el módulo de compras */}
        <Route path="/mecanico" element={<MecanicoModule />} />   {/*Ruta para elmódulo de mecánicos */}
      </Routes>
    </Router>
  );
}

export default App;
