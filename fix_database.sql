-- Script para limpiar la base de datos y permitir que TypeORM recree las tablas
-- ADVERTENCIA: Esto eliminará TODOS los datos de autos, reviews, fotos, etc.

-- Eliminar todas las tablas relacionadas con cars en orden
DROP TABLE IF EXISTS "review_failure_tags_failure_tag" CASCADE;
DROP TABLE IF EXISTS "review_reactions" CASCADE;
DROP TABLE IF EXISTS "review_reports" CASCADE;
DROP TABLE IF EXISTS "reviews" CASCADE;
DROP TABLE IF EXISTS "photos" CASCADE;
DROP TABLE IF EXISTS "favorite_cars" CASCADE;
DROP TABLE IF EXISTS "cars" CASCADE;

-- TypeORM recreará automáticamente todas estas tablas cuando reinicies el servidor
