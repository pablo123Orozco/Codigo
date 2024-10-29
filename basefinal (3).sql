-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-10-2024 a las 07:04:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `basefinal`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth`
--

CREATE TABLE `auth` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `contraseña` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `auth`
--

INSERT INTO `auth` (`id`, `usuario`, `contraseña`) VALUES
(1, 'spiderman', '$2b$04$EyZfGfYYkBtfCrY29IwmZ.8h5mhwflZB17QIkSgWSjz.klMQEIdfS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caja`
--

CREATE TABLE `caja` (
  `id` int(11) NOT NULL,
  `concepto` varchar(255) DEFAULT NULL,
  `monto` decimal(10,2) DEFAULT NULL,
  `tipo` enum('Ingreso','Egreso') DEFAULT NULL,
  `fecha` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `caja`
--

INSERT INTO `caja` (`id`, `concepto`, `monto`, `tipo`, `fecha`) VALUES
(1, 'Pago de servicio', 130.00, 'Egreso', '2024-10-22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `nit` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `estadoCuenta` decimal(10,2) DEFAULT NULL,
  `telefono` int(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nombre`, `apellido`, `nit`, `correo`, `estadoCuenta`, `telefono`) VALUES
(1, 'Pablo', 'Orozco', '124578', 'pabloorozco2013@gmail.com', 0.00, 34597613),
(2, 'Geovanni', 'Perez', '784513', 'perez@gmail.com', 0.00, 654687);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `id` int(11) NOT NULL,
  `nombreProducto` varchar(100) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `idProveedor` int(11) DEFAULT NULL,
  `idCliente` int(11) DEFAULT NULL,
  `marcha` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compra`
--

INSERT INTO `compra` (`id`, `nombreProducto`, `fecha`, `total`, `estado`, `idProveedor`, `idCliente`, `marcha`) VALUES
(1, 'flecha', '2024-10-16', 130.00, 'nuevo', 1, 2, 'marca clasista2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mecanico`
--

CREATE TABLE `mecanico` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mecanico`
--

INSERT INTO `mecanico` (`id`, `nombre`, `fecha`) VALUES
(1, 'Ivan', '2024-10-18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenesservicio`
--

CREATE TABLE `ordenesservicio` (
  `id` int(11) NOT NULL,
  `detalleReparacion` varchar(255) DEFAULT NULL,
  `costoEstimado` decimal(10,2) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `idVehiculo` int(11) DEFAULT NULL,
  `idCliente` int(11) DEFAULT NULL,
  `idMecanico` int(11) DEFAULT NULL,
  `concepto` varchar(100) DEFAULT 'REPARACIÓN',
  `combustible` varchar(20) DEFAULT 'Bajo',
  `servicio_id` int(11) DEFAULT NULL,
  `fechaIngreso` date DEFAULT curdate(),
  `tipoPago` enum('Efectivo','Cheque') DEFAULT NULL,
  `estadoPago` enum('Pendiente','Anticipo','Pagado','Deuda') DEFAULT 'Pendiente',
  `adelantoEmpresa` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ordenesservicio`
--

INSERT INTO `ordenesservicio` (`id`, `detalleReparacion`, `costoEstimado`, `estado`, `idVehiculo`, `idCliente`, `idMecanico`, `concepto`, `combustible`, `servicio_id`, `fechaIngreso`, `tipoPago`, `estadoPago`, `adelantoEmpresa`) VALUES
(1, 'se realizara reparacion de la caja de cambios', 27.00, 'Pendiente', 1, 1, 1, 'Reparación', 'bajo', 1, '2024-10-11', 'Efectivo', 'Pendiente', 6.00),
(2, 'se realizara reparacion de la caja de cambios', 27.00, 'En Progreso', 1, 1, 1, 'Reparación', 'bajo', 1, '2024-10-11', 'Efectivo', 'Pendiente', 6.00),
(3, 'Cambio de frenos', 150.00, 'Completado', 1, 1, 1, 'Pago de servicio', 'Medio', 1, '2024-10-18', 'Efectivo', 'Pagado', 2.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `nit` varchar(20) DEFAULT NULL,
  `dpi` varchar(13) DEFAULT NULL,
  `razonSocial` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id`, `nombre`, `nit`, `dpi`, `razonSocial`, `telefono`) VALUES
(1, 'Otto', '789464122', '45786512', 'Empreza A', '487895'),
(2, 'Miles', '2378273-f', '2145906545', 'repuestos de segunda mano', '45789515');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id` int(11) NOT NULL,
  `servicio` varchar(255) NOT NULL,
  `costo_mano_obra` decimal(10,2) NOT NULL,
  `precio_repuesto` decimal(10,2) NOT NULL,
  `precio_total` decimal(10,2) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id`, `servicio`, `costo_mano_obra`, `precio_repuesto`, `precio_total`, `descripcion`) VALUES
(1, 'Cambio de aceite', 150.00, 450.00, 600.00, 'se realizara cambio de aceite al vehiculo tatata');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `nombreUsuario` varchar(50) DEFAULT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `estado` char(1) DEFAULT NULL,
  `rol` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `nombreUsuario`, `contraseña`, `estado`, `rol`) VALUES
(1, 'Miles', 'Morales', 'spiderman', '123456', '1', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculos`
--

CREATE TABLE `vehiculos` (
  `id` int(11) NOT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `modelo` varchar(50) DEFAULT NULL,
  `placa` varchar(20) DEFAULT NULL,
  `estadoActual` varchar(50) DEFAULT NULL,
  `year` varchar(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vehiculos`
--

INSERT INTO `vehiculos` (`id`, `marca`, `modelo`, `placa`, `estadoActual`, `year`) VALUES
(1, 'suzuki', 'CX-30', 'P001BB', 'Reperacion', '2001');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auth`
--
ALTER TABLE `auth`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `caja`
--
ALTER TABLE `caja`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nit` (`nit`);

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idProveedor` (`idProveedor`),
  ADD KEY `idCliente` (`idCliente`);

--
-- Indices de la tabla `mecanico`
--
ALTER TABLE `mecanico`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ordenesservicio`
--
ALTER TABLE `ordenesservicio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idVehiculo` (`idVehiculo`),
  ADD KEY `fk_ordenes_cliente` (`idCliente`),
  ADD KEY `fk_servicio_orden` (`servicio_id`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nit` (`nit`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombreUsuario` (`nombreUsuario`);

--
-- Indices de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `placa` (`placa`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `caja`
--
ALTER TABLE `caja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `mecanico`
--
ALTER TABLE `mecanico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ordenesservicio`
--
ALTER TABLE `ordenesservicio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auth`
--
ALTER TABLE `auth`
  ADD CONSTRAINT `auth_ibfk_1` FOREIGN KEY (`id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`idProveedor`) REFERENCES `proveedores` (`id`),
  ADD CONSTRAINT `compra_ibfk_2` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`);

--
-- Filtros para la tabla `ordenesservicio`
--
ALTER TABLE `ordenesservicio`
  ADD CONSTRAINT `fk_ordenes_cliente` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_servicio_orden` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ordenesservicio_ibfk_2` FOREIGN KEY (`idVehiculo`) REFERENCES `vehiculos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
