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
import CajaModule from './modulos/caja/caja';  // Nueva importación del módulo de caja
import PrivateRoute from './componentes/PrivateRoute';  
import OrdenServiceForm from './modulos/ordenes/ordenesForms';  
import ServicioForm from './modulos/servicios/serviciosForms';
import { useState } from 'react';  // Importamos useState

function App() {
  const [servicioToEdit, setServicioToEdit] = useState(null);  // Estado para editar servicio

  const handleSaveServicio = () => {
    setServicioToEdit(null);  // Limpiar el estado después de guardar
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
          
          {/* Nueva ruta para crear una orden de servicio */}
          <Route path="/ordenes/nueva" element={<OrdenServiceForm />} />  

          <Route path="/compras" element={<CompraModule />} />
          <Route path="/mecanico" element={<MecanicoModule />} />

          {/* Nueva ruta para el módulo de servicios */}
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

          {/* Nueva ruta para el módulo de caja */}
          <Route path="/caja" element={<CajaModule />} />  {/* Añadimos la ruta de caja */}
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
