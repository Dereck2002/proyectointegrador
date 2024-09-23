-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-09-2024 a las 04:53:41
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
-- Base de datos: `clinudbd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `cod_medico_admin` int(11) NOT NULL,
  `cedula` int(15) NOT NULL,
  `nom_medico` varchar(20) NOT NULL,
  `ape_medico` varchar(20) NOT NULL,
  `telefono_medico` varchar(15) NOT NULL,
  `email_medico` varchar(30) NOT NULL,
  `clave_medico` varchar(20) NOT NULL,
  `espe_medico` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`cod_medico_admin`, `cedula`, `nom_medico`, `ape_medico`, `telefono_medico`, `email_medico`, `clave_medico`, `espe_medico`) VALUES
(1, 123456787, 'Widinson', 'Pabon', '0987654321', 'flowltm@gmail.com', '123', 'Nutricion');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicina`
--

CREATE TABLE `medicina` (
  `cod_medicina` int(11) NOT NULL,
  `medicamento` varchar(100) NOT NULL,
  `dosis` varchar(100) NOT NULL,
  `tiempo` varchar(100) NOT NULL,
  `cod_usuario` int(11) DEFAULT NULL,
  `cod_medico` int(11) DEFAULT NULL,
  `cod_medico_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicina`
--

INSERT INTO `medicina` (`cod_medicina`, `medicamento`, `dosis`, `tiempo`, `cod_usuario`, `cod_medico`, `cod_medico_admin`) VALUES
(6, 'Apronax', 'despues de cada comida', 'durante una semana', 1, 1, 1),
(7, 'Paracetamol', 'antes de cada comida', 'durante 15 dias', 1, 1, 1),
(8, 'Apronax', '1 cada 12 horas', 'por 3 dias', 3, 1, 1),
(9, 'pruebas', 'aaa', 'aaa', 3, 1, 1),
(11, 'dgdf', 'dfgdf', 'dfgd', 3, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medico`
--

CREATE TABLE `medico` (
  `cod_medico` int(11) NOT NULL,
  `cedula` int(15) NOT NULL,
  `nom_medico` varchar(20) NOT NULL,
  `ape_medico` varchar(20) NOT NULL,
  `telefono_medico` varchar(15) NOT NULL,
  `email_medico` varchar(30) NOT NULL,
  `clave_medico` varchar(20) NOT NULL,
  `espe_medico` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medico`
--

INSERT INTO `medico` (`cod_medico`, `cedula`, `nom_medico`, `ape_medico`, `telefono_medico`, `email_medico`, `clave_medico`, `espe_medico`) VALUES
(1, 1234567890, 'Juan', 'Pérez', '0987654321', 'juan.medico@example.com', 'clave123', 'Nutrición'),
(4, 12345678, 'wilson', 'perez', '0987654321', 'wp2003@gmail.com', '123', 'Nutricion');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensaje`
--

CREATE TABLE `mensaje` (
  `cod_mensaje` int(11) NOT NULL,
  `mensaje` varchar(1000) NOT NULL,
  `cod_medico` int(11) DEFAULT NULL,
  `cod_usuario` int(11) DEFAULT NULL,
  `cod_medico_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mensaje`
--

INSERT INTO `mensaje` (`cod_mensaje`, `mensaje`, `cod_medico`, `cod_usuario`, `cod_medico_admin`) VALUES
(1, 'Buenas noches', 1, 1, 1),
(7, 'Revisar su medicacion', 1, 1, 1),
(11, 'dgdfg', 4, 3, 1);

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
(8, 3, 4, 3, 3, 3, 3, 1, '2024-09-20'),
(9, 12, 12, 12, 12, 12, 12, 3, '2024-09-22'),
(10, 4, 4, 4, 4, 4, 4, 3, '2024-09-22');

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
  `clave_usuario` varchar(15) NOT NULL,
  `imagen_usuario` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`cod_usuario`, `cedula`, `nom_usuario`, `ape_usuario`, `telefono_usuario`, `email_usuario`, `clave_usuario`, `imagen_usuario`) VALUES
(1, 1234567890, 'Dereck', 'Jaramillo', '0983288443', 'jaramilloderek13@gmail.com', '123', '/uploads/new-21.png'),
(3, 1234567, 'Josue', 'Yepez', '099999999', 'Josue@gmail.com', '123', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`cod_medico_admin`);

--
-- Indices de la tabla `medicina`
--
ALTER TABLE `medicina`
  ADD PRIMARY KEY (`cod_medicina`),
  ADD KEY `cod_usuario` (`cod_usuario`),
  ADD KEY `cod_medico` (`cod_medico`),
  ADD KEY `cod_medico_admin` (`cod_medico_admin`);

--
-- Indices de la tabla `medico`
--
ALTER TABLE `medico`
  ADD PRIMARY KEY (`cod_medico`);

--
-- Indices de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD PRIMARY KEY (`cod_mensaje`),
  ADD KEY `cod_medico` (`cod_medico`),
  ADD KEY `cod_usuario` (`cod_usuario`),
  ADD KEY `cod_medico_admin` (`cod_medico_admin`);

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
-- AUTO_INCREMENT de la tabla `administrador`
--
ALTER TABLE `administrador`
  MODIFY `cod_medico_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `medicina`
--
ALTER TABLE `medicina`
  MODIFY `cod_medicina` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `medico`
--
ALTER TABLE `medico`
  MODIFY `cod_medico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `mensaje`
--
ALTER TABLE `mensaje`
  MODIFY `cod_mensaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `signos`
--
ALTER TABLE `signos`
  MODIFY `cod_signos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `cod_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `medicina`
--
ALTER TABLE `medicina`
  ADD CONSTRAINT `medicina_ibfk_1` FOREIGN KEY (`cod_medico`) REFERENCES `medico` (`cod_medico`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `medicina_ibfk_2` FOREIGN KEY (`cod_usuario`) REFERENCES `usuario` (`cod_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `medicina_ibfk_3` FOREIGN KEY (`cod_medico_admin`) REFERENCES `administrador` (`cod_medico_admin`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `mensaje`
--
ALTER TABLE `mensaje`
  ADD CONSTRAINT `mensaje_ibfk_1` FOREIGN KEY (`cod_medico`) REFERENCES `medico` (`cod_medico`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mensaje_ibfk_2` FOREIGN KEY (`cod_usuario`) REFERENCES `usuario` (`cod_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mensaje_ibfk_3` FOREIGN KEY (`cod_medico_admin`) REFERENCES `administrador` (`cod_medico_admin`);

--
-- Filtros para la tabla `signos`
--
ALTER TABLE `signos`
  ADD CONSTRAINT `signos_ibfk_1` FOREIGN KEY (`cod_usuario`) REFERENCES `usuario` (`cod_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
