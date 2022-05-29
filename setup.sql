-- CS 132 Spring 2022 Final Project
-- SQL setup file for online jewelry store

CREATE DATABASE IF NOT EXISTS jewelrydb;
USE jewelrydb;

-- These clear the database so we can easily repopulate if needed.
DROP TABLE IF EXISTS jewelry;

-- Represents a table of jewelry items, which can include different kinds and 
-- styles of jewelry
CREATE TABLE jewelry(
  -- Unique identifier for each jewelry item. This will be an integer.
  id            SERIAL PRIMARY KEY, 
  -- Product name should be descriptive, i.e. should adequately describe what the 
  -- jewelry item is
  product_name   VARCHAR(255)  NOT NULL,  
  -- Describes the exact image path of the jewelry item
  img_path       VARCHAR(255)  NOT NULL,
  -- The type of jewelry, e.g. bracelet, necklace, ring, etc.
  prod_type      VARCHAR(30)   NOT NULL,
  -- The price of the jewelry item, should have two decimal places
  price         NUMERIC(2)    NOT NULL,
  -- The color of the jewelry item, e.g. silver, gold, red, blue
  color         VARCHAR(30)   NOT NULL,
  -- The style of the jewelry item, e.g. formal, casual
  style         VARCHAR(30)   NOT NULL,
  CHECK (style IN ('casual', 'formal'))
);

-- Format of insert statement: 
-- INSERT INTO jewelry VALUES(id, product_name, img_path, prod_type, price, color, 
-- dated_listed, style);
<<<<<<< HEAD
INSERT INTO jewelry VALUES(1, 'Thick Crystal Crusted Gold Ring', 'img/thick_crusted_ring.jpg', 'ring', 29.99, 'gold', 'casual');
=======

-- Inserting rings
INSERT INTO jewelry VALUES(1, 'Dual Band Ring', 'img/rings/dual_band_ring.jpg',
  'ring', price: 29.99, color: 'gold', 'casual');
INSERT INTO jewelry VALUES(1, 'Dual Color Ring', 'img/rings/dual_color_ring.jpg',
  'ring', price: 19.99, color: 'dual', 'casual');
INSERT INTO jewelry VALUES(1, 'Olive Leaf Ring', 'img/rings/olive_tree_ring.jpg',
  'ring', price: 59.99, color: 'gold', 'casual');
INSERT INTO jewelry VALUES(1, 'Pink Gem Ring', 'img/rings/pink_gem_ring.jpg',
  'ring', price: 39.99, color: 'pink', 'formal');
INSERT INTO jewelry VALUES(1, 'Thick Crystal Crusted Gold Ring', 'img/rings/thick_crusted_ring.jpg',
  'ring', price: 29.99, color: 'gold', 'formal');

-- Inserting earrings
INSERT INTO jewelry VALUES(1, 'Blue Heart Earrings', 'img/earrings/blue_heart_earrings.jpg',
  'earring', price: 29.99, color: 'blue', 'casual');
INSERT INTO jewelry VALUES(1, 'Dual Color Earrings', 'img/earrings/dual_color_earrings.jpg',
  'earring', price: 39.99, color: 'dual', 'formal');
INSERT INTO jewelry VALUES(1, 'Flower Earrings', 'img/earrings/flower_earrings.jpg',
  'earring', price: 49.99, color: 'silver', 'casual');
INSERT INTO jewelry VALUES(1, 'Teardrop Earrings', 'img/earrings/teardrop.jpg',
  'earring', price: 19.99, color: 'brown', 'formal');
INSERT INTO jewelry VALUES(1, 'Yellow Topaz Tooth Earrings', 'img/earrings/topaz_tooth_earrings.jpg',
  'earring', price: 29.99, color: 'yellow', 'formal');

-- Inserting necklaces
INSERT INTO jewelry VALUES(1, 'Blue Heart Necklace', 'img/necklaces/blue_heart_necklace.jpg',
  'necklace', price: 19.99, color: 'blue', 'formal');
INSERT INTO jewelry VALUES(1, 'Silver Drop Necklace', 'img/necklaces/drop_necklace.jpg',
  'necklace', price: 39.99, color: 'silver', 'formal');
INSERT INTO jewelry VALUES(1, 'Thin Moon Cresent Necklace', 'img/necklaces/moon_necklace.jpg',
  'necklace', price: 19.99, color: 'pink', 'casual');
INSERT INTO jewelry VALUES(1, 'Gold Ruby Necklace', 'img/necklaces/ruby_necklace.jpg',
  'necklace', price: 29.99, color: 'red', 'casual');
INSERT INTO jewelry VALUES(1, 'Sweetheart Necklace', 'img/necklaces/sweetheart_necklace.jpg',
  'necklace', price: 59.99, color: 'silver', 'formal');
>>>>>>> 0effbe43766e34c9bbdf5b94a6ef51e1e00abb87
