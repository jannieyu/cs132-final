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
  -- The color of the jewelry item, e.g. silver, gold
  color         VARCHAR(30)   NOT NULL,
  -- The style of the jewelry item, e.g. formal, casual
  style         VARCHAR(30)   NOT NULL,
  CHECK (style IN ('casual', 'formal'))
);

-- Format of insert statement: 
-- INSERT INTO jewelry VALUES(id, product_name, img_path, prod_type, price, color, 
-- dated_listed, style);
INSERT INTO jewelry VALUES(1, 'Thick Crystal Crusted Gold Ring', 'img/thick_crusted_ring.jpg', 'ring', 29.99, 'gold', 'casual');
