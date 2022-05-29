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

-- Inserting rings
INSERT INTO jewelry VALUES(1, 'Dual Band Ring', 'img/rings/dual_band_ring.jpg', 'ring', 29.99,  'gold', 'casual');
INSERT INTO jewelry VALUES(2, 'Dual Color Ring', 'img/rings/dual_color_ring.jpg','ring', 19.99, 'dual', 'casual');
INSERT INTO jewelry VALUES(3, 'Olive Leaf Ring', 'img/rings/olive_tree_ring.jpg','ring',  59.99, 'gold', 'casual');
INSERT INTO jewelry VALUES(4, 'Pink Gem Ring', 'img/rings/pink_gem_ring.jpg','ring', 39.99,'pink', 'formal');
INSERT INTO jewelry VALUES(5, 'Thick Crystal Crusted Gold Ring', 'img/rings/thick_crusted_ring.jpg','ring',  29.99,  'gold', 'formal');

-- Inserting earrings
INSERT INTO jewelry VALUES(6, 'Blue Heart Earrings', 'img/earrings/blue_heart_earrings.jpg', 'earring',29.99,'blue', 'casual');
INSERT INTO jewelry VALUES(7, 'Dual Color Earrings', 'img/earrings/dual_color_earrings.jpg', 'earring', 39.99,'dual', 'formal');
INSERT INTO jewelry VALUES(8, 'Flower Earrings', 'img/earrings/flower_earrings.jpg','earring',  49.99,  'silver', 'casual');
INSERT INTO jewelry VALUES(9, 'Teardrop Earrings', 'img/earrings/teardrop.jpg', 'earring', 19.99,'brown', 'formal');
INSERT INTO jewelry VALUES(10, 'Yellow Topaz Tooth Earrings', 'img/earrings/topaz_tooth_earrings.jpg','earring', 29.99, 'yellow', 'formal');

-- Inserting necklaces
INSERT INTO jewelry VALUES(11, 'Blue Heart Necklace', 'img/necklaces/blue_heart_necklace.jpg','necklace',19.99,  'blue', 'formal');
INSERT INTO jewelry VALUES(12, 'Silver Drop Necklace', 'img/necklaces/drop_necklace.jpg','necklace',  39.99, 'silver', 'formal');
INSERT INTO jewelry VALUES(13, 'Thin Moon Cresent Necklace', 'img/necklaces/moon_necklace.jpg','necklace',19.99, 'pink', 'casual');
INSERT INTO jewelry VALUES(14, 'Gold Ruby Necklace', 'img/necklaces/ruby_necklace.jpg','necklace', 29.99, 'red', 'casual');
INSERT INTO jewelry VALUES(15, 'Sweetheart Necklace', 'img/necklaces/sweetheart_necklace.jpg','necklace', 59.99, 'silver', 'formal');
