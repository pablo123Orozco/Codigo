import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "../paginas/home";
import { Estadisticas } from "../paginas/estadisticas";
import { Productos } from "../paginas/productos";
import { Sidebar } from "../componentes/Sidebar";

export default function Myrouters() {
  return (
    <BrowserRouter>
      <Sidebar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
      </Routes>
    </BrowserRouter>
  );
}
