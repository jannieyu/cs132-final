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
  id  INT PRIMARY KEY, 
  -- Product name should be descriptive, i.e. should adequately describe what the 
  -- jewelry item is
  productName  VARCHAR(255),  
  -- Describes the exact image path of the jewelry item
  imgPath VARCHAR(255),
  -- The type of jewelry, e.g. bracelet, necklace, ring, etc.
  prodType VARCHAR(30),
  -- The price of the jewelry item, should have two decimal places
  price NUMERIC(2),
  -- The color of the jewelry item, e.g. silver, gold
  color VARCHAR(30),
  -- The date and time the product was added to the database
  dateListed DATETIME, 
  -- The style of the jewelry item, e.g. formal, casual
  style VARCHAR(30) 
);


