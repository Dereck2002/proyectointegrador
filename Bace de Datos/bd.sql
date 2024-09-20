-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-09-2024 a las 09:01:24
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de datos: `clinudbd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicina`
--

CREATE TABLE `medicina` (
  `cod_medicina` int(11) NOT NULL,
  `medicamento` varchar(50) NOT NULL,
  `dosis` varchar(20) NOT NULL,
  `tiempo` varchar(15) NOT NULL,
  `cod_usuario` int(11) NOT NULL,
  `cod_medico` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicina`
--

INSERT INTO `medicina` (`cod_medicina`, `medicamento`, `dosis`, `tiempo`, `cod_usuario`, `cod_medico`) VALUES
(4, '', '', '', 1, 1),
(5, '', '', '', 1, 1),
(6, 'Paracetamol', 'despues de cada comi', 'durante una sem', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico`
--

CREATE TABLE `medico` (
  `cod_medico` int(11) NOT NULL,
  `cedula` int(11) NOT NULL,
  `nom_medico` varchar(20) NOT NULL,
  `ape_medico` varchar(20) NOT NULL,
  `telefono_medico` varchar(15) NOT NULL,
  `email_medico` varchar(30) NOT NULL,
  `clave_medico` varchar(20) NOT NULL,
  `cod_usuario` int(11) NOT NULL,
  `espe_medico` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medico`
--

INSERT INTO `medico` (`cod_medico`, `cedula`, `nom_medico`, `ape_medico`, `telefono_medico`, `email_medico`, `clave_medico`, `cod_usuario`, `espe_medico`) VALUES
(1, 1234567890, 'Juan', 'Pérez', '0987654321', 'juan.medico@example.com', 'clave123', 1, 'Nutrición');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje`
--

CREATE TABLE `mensaje` (
  `cod_mensaje` int(11) NOT NULL,
  `mensaje` varchar(1000) NOT NULL,
  `cod_medico` int(11) NOT NULL,
  `cod_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mensaje`
--

INSERT INTO `mensaje` (`cod_mensaje`, `mensaje`, `cod_medico`, `cod_usuario`) VALUES
(1, 'Buenas noches', 1, 1),
(2, '', 1, 1),
(3, '', 1, 1),
(4, 'hfghfg', 1, 1),
(5, 'todo bien\n', 1, 1),
(6, 'prueba proyecto integrador', 1, 1),
(7, 'Revisar su medicacion', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `signos`
--

CREATE TABLE `signos` (
  `cod_signos` int(11) NOT NULL,
  `precion` int(11) NOT NULL,
  `glucosa` int(11) NOT NULL,
  `peso` int(11) NOT NULL,
  `glicemia` int(11) NOT NULL,
  `pulso` int(11) NOT NULL,
  `temperatura` int(11) NOT NULL,
  `cod_usuario` int(11) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `signos`
--

INSERT INTO `signos` (`cod_signos`, `precion`, `glucosa`, `peso`, `glicemia`, `pulso`, `temperatura`, `cod_usuario`, `fecha`) VALUES
(7, 1, 1, 1, 1, 1, 1, 1, '2024-09-20'),
(8, 3, 3, 3, 3, 3, 3, 1, '2024-09-20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `cod_usuario` int(11) NOT NULL,
  `cedula` int(11) NOT NULL,
  `nom_usuario` varchar(15) NOT NULL,
  `ape_usuario` varchar(15) NOT NULL,
  `telefono_usuario` varchar(15) NOT NULL,
  `email_usuario` varchar(35) NOT NULL,
  `clave_usuario` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`cod_usuario`, `cedula`, `nom_usuario`, `ape_usuario`, `telefono_usuario`, `email_usuario`, `clave_usuario`) VALUES
(1, 1234567890, 'Dereck', 'Jaramillo', '0987654321', 'jaramilloderek13@gmail.com', '123');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medicina`
--
ALTER TABLE `medicina`
  ADD PRIMARY KEY (`cod_medicina`),
  ADD KEY `cod_usuario` (`cod_usuario`),
  ADD KEY `cod_medico` (`cod_medico`);

--
-- Indices de la tabla `medico`
--
ALTER TABLE `medico`
  ADD PRIMARY KEY (`cod_medico`),
  ADD KEY `cod_usuario` (`cod_usuario`);

--
-- Indices de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD PRIMARY KEY (`cod_mensaje`),
  ADD KEY `cod_medico` (`cod_medico`),
  ADD KEY `cod_usuario` (`cod_usuario`);

--
-- Indices de la tabla `signos`
--
ALTER TABLE `signos`
  ADD PRIMARY KEY (`cod_signos`),
  ADD KEY `cod_usuario` (`cod_usuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`cod_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `medicina`
--
ALTER TABLE `medicina`
  MODIFY `cod_medicina` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `medico`
--
ALTER TABLE `medico`
  MODIFY `cod_medico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `cod_mensaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `signos`
--
ALTER TABLE `signos`
  MODIFY `cod_signos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `cod_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `medicina`
--
ALTER TABLE `medicina`
  ADD CONSTRAINT `medicina_ibfk_1` FOREIGN KEY (`cod_medico`) REFERENCES `medico` (`cod_medico`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `medicina_ibfk_2` FOREIGN KEY (`cod_usuario`) REFERENCES `usuario` (`cod_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD CONSTRAINT `mensaje_ibfk_1` FOREIGN KEY (`cod_medico`) REFERENCES `medico` (`cod_medico`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mensaje_ibfk_2` FOREIGN KEY (`cod_usuario`) REFERENCES `usuario` (`cod_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `signos`
--
ALTER TABLE `signos`
  ADD CONSTRAINT `signos_ibfk_1` FOREIGN KEY (`cod_usuario`) REFERENCES `usuario` (`cod_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
