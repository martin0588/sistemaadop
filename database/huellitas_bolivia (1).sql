-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307:3307
-- Tiempo de generación: 19-05-2026 a las 14:00:24
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
-- Base de datos: `huellitas_bolivia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adoptions`
--

CREATE TABLE `adoptions` (
  `id` int(11) NOT NULL,
  `pet_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `request_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `adoptions`
--

INSERT INTO `adoptions` (`id`, `pet_id`, `user_id`, `status`, `request_date`) VALUES
(1, 14, 4, 'Aprobado', '2026-03-23 22:37:24'),
(2, 7, 4, 'Aprobado', '2026-04-18 17:58:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `adoption_followups`
--

CREATE TABLE `adoption_followups` (
  `id` int(11) NOT NULL,
  `adoption_id` int(11) DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `adoption_followups`
--

INSERT INTO `adoption_followups` (`id`, `adoption_id`, `date`, `notes`, `status`) VALUES
(1, 1, '2026-04-18 18:00:36', 'hacer seguimiento constante', 'Regular');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medical_records`
--

CREATE TABLE `medical_records` (
  `id` int(11) NOT NULL,
  `pet_id` int(11) DEFAULT NULL,
  `vet_id` int(11) DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `description` text DEFAULT NULL,
  `treatment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medical_records`
--

INSERT INTO `medical_records` (`id`, `pet_id`, `vet_id`, `date`, `description`, `treatment`) VALUES
(1, 1, 2, '2026-04-18 17:47:13', 'estable', 'ninguno'),
(2, 1, 2, '2026-04-18 17:47:50', 'ninguno/estable', 'normal'),
(3, 1, 2, '2026-04-18 17:48:01', 'srtharthhaet', 'q5tg'),
(4, 11, 2, '2026-04-18 17:49:45', 'normal', 'normal'),
(5, 13, 2, '2026-04-18 17:51:57', 'bebe', 'estable');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `message`, `date`) VALUES
(1, 'sugerencia ', 'titulo', '2026-04-18 17:42:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pets`
--

CREATE TABLE `pets` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `species` varchar(100) DEFAULT NULL,
  `breed` varchar(100) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `vet_notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pets`
--

INSERT INTO `pets` (`id`, `name`, `species`, `breed`, `age`, `status`, `image_url`, `vet_notes`) VALUES
(1, 'Luna', 'Perro', 'Golden Retriever', 2, 'Disponible', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600&h=400', 'Sana, vacunas al día. Muy juguetona y cariñosa.'),
(2, 'Milo', 'Gato', 'Mestizo', 1, 'Disponible', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600&h=400', 'Desparasitado. Le encanta dormir al sol.'),
(3, 'Bella', 'Perro', 'Pug', 1, 'Adoptado', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600&h=400', 'En tratamiento por alergia en la piel. Requiere dieta especial.'),
(4, 'Simba', 'Gato', 'Persa', 4, 'En Proceso', 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=600&h=400', 'Tranquilo y muy peludo. Necesita cepillado diario.'),
(5, 'Rocky', 'Perro', 'Bulldog Francés', 2, 'Adoptado', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600&h=400', 'Saludable. Adoptado por la familia Perez.'),
(6, 'Nala', 'Gato', 'Siamés', 1, 'En Proceso', 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=600&h=400', 'Muy vocal y activa. Esperando confirmación de adopción.'),
(7, 'Max', 'Perro', 'Pastor Alemán', 5, 'Adoptado', 'https://images.unsplash.com/photo-1589965716319-4a041b58fa8a?auto=format&fit=crop&q=80&w=600&h=400', 'Entrenado y obediente. Ideal para espacios grandes.'),
(8, 'Coco', 'Conejo', 'Enano', 1, 'Disponible', 'https://images.unsplash.com/photo-1585110396000-c9fd4e4e325c?auto=format&fit=crop&q=80&w=600&h=400', 'Saludable. Come mucho heno.'),
(9, 'Kira', 'Perro', 'Husky Siberiano', 2, 'Adoptado', 'https://images.unsplash.com/photo-1605568420105-440fa10f1e54?auto=format&fit=crop&q=80&w=600&h=400', 'Mucha energía. Necesita ejercicio diario.'),
(10, 'Oliver', 'Gato', 'Mestizo', 2, 'Adoptado', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=600&h=400', 'Rescatado de la calle. Un poco tímido pero amoroso.'),
(11, 'Toby', 'Perro', 'Beagle', 3, 'En Tratamiento', 'https://images.unsplash.com/photo-1537151608804-ea6f11840eb3?auto=format&fit=crop&q=80&w=600&h=400', 'Excelente olfato, muy curioso.'),
(12, 'Mia', 'Gato', 'Angora', 2, 'En Tratamiento', 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&q=80&w=600&h=400', 'Recuperándose de una infección ocular.'),
(13, 'Zeus', 'Perro', 'Doberman', 4, 'En Proceso', 'https://images.unsplash.com/photo-1611003228941-98852ba62227?auto=format&fit=crop&q=80&w=600&h=400', 'Protector y leal.'),
(14, 'Chloe', 'Gato', 'Mestizo', 1, 'Adoptado', 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=600&h=400', 'Muy juguetona, le encantan los ratones de juguete.'),
(15, 'Bruno', 'Perro', 'Labrador', 6, 'En Tratamiento', 'https://images.unsplash.com/photo-1599561046222-a4eb0bc882f9?auto=format&fit=crop&q=80&w=600&h=400', 'asma.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `profile_pic` text DEFAULT NULL,
  `email_verified` tinyint(4) DEFAULT 0,
  `verification_code` varchar(10) DEFAULT NULL,
  `verification_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `full_name`, `email`, `profile_pic`, `email_verified`, `verification_code`, `verification_expires`) VALUES
(1, 'admin', '123', 'Administrador', 'Admin Principal', 'admin@huellitas.com', 'https://ui-avatars.com/api/?name=Admin+Principal&background=f59e0b&color=fff', 1, NULL, NULL),
(2, 'vet', '123', 'Veterinario', 'Dr. Vet', 'vet@huellitas.com', 'https://ui-avatars.com/api/?name=Dr+Vet&background=14b8a6&color=fff', 1, NULL, NULL),
(3, 'vol', '123', 'Voluntario', 'Voluntario 1', 'vol@huellitas.com', 'https://ui-avatars.com/api/?name=Voluntario+1&background=8b5cf6&color=fff', 1, NULL, NULL),
(4, 'adopt', '123', 'Adoptante', 'Juan Perez', 'juan@gmail.com', 'https://ui-avatars.com/api/?name=Juan+Perez&background=f43f5e&color=fff', 1, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `adoptions`
--
ALTER TABLE `adoptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pet_id` (`pet_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `adoption_followups`
--
ALTER TABLE `adoption_followups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `adoption_id` (`adoption_id`);

--
-- Indices de la tabla `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pet_id` (`pet_id`),
  ADD KEY `vet_id` (`vet_id`);

--
-- Indices de la tabla `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `adoptions`
--
ALTER TABLE `adoptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `adoption_followups`
--
ALTER TABLE `adoption_followups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `pets`
--
ALTER TABLE `pets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `adoptions`
--
ALTER TABLE `adoptions`
  ADD CONSTRAINT `adoptions_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`),
  ADD CONSTRAINT `adoptions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `adoption_followups`
--
ALTER TABLE `adoption_followups`
  ADD CONSTRAINT `adoption_followups_ibfk_1` FOREIGN KEY (`adoption_id`) REFERENCES `adoptions` (`id`);

--
-- Filtros para la tabla `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `medical_records_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`),
  ADD CONSTRAINT `medical_records_ibfk_2` FOREIGN KEY (`vet_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
