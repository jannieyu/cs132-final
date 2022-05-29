-- CS 132 Spring 2022 Final Project
-- SQL setup file for online jewelry store

CREATE DATABASE IF NOT EXISTS jewelrydb;
USE jewelrydb;

-- These clear the database so we can easily repopulate if needed.
DROP TABLE IF EXISTS contact_info;
DROP TABLE IF EXISTS jewelry;

-- Represents a table of jewelry items, which can include different kinds and 
-- styles of jewelry
CREATE TABLE jewelry(
  -- Unique identifier for each jewelry item. This will be an integer.
  id            SERIAL PRIMARY KEY, 
  -- Product name should be descriptive, i.e. should adequately describe what the 
  -- jewelry item is
  product_name   VARCHAR(200)  NOT NULL,  
  -- Describes the exact image path of the jewelry item
  img_path       VARCHAR(200)  NOT NULL,
  -- The type of jewelry, e.g. bracelet, necklace, ring, etc.
  prod_type      VARCHAR(30)   NOT NULL,
  -- The price of the jewelry item, should have two decimal places
  price         NUMERIC(4)    NOT NULL,
  -- The color of the jewelry item, e.g. silver, gold, red, blue
  color         VARCHAR(30)   NOT NULL,
  -- The style of the jewelry item, e.g. formal, casual
  style         VARCHAR(30)   NOT NULL,
  CHECK (style IN ('casual', 'formal'))
);

-- Create a table for contact information
CREATE TABLE contact_info(
  -- Unique identifier for the contact table entry
  contact_id      SERIAL PRIMARY KEY,

  contact_name    VARCHAR(30) NOT NULL,
  -- email address for the contact
  email           VARCHAR(50)   NOT NULL, 
  -- time that the entry was made
  time_submitted  DATETIME NOT NULL,
  -- The contact message body, i.e. what the user is reaching out for
  contact_msg     VARCHAR(500)  NOT NULL
);

-- Create a table for FAQs
CREATE TABLE faq(
  -- Unique identifier for the FAQ
  faq_id SERIAL PRIMARY KEY,
  -- Question which is asked 
  question VARCHAR(300)  NOT NULL,
  -- Answer for given question
  answer VARCHAR(300)    NOT NULL
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

-- Format of FAQ entries
-- INSERT_INTO faq VALUES(faq_id, question, anwer)
INSERT INTO faq VALUES (1, "How long does shipping take?", "Shipping typically takes 2 weeks for U.S. orders. 
We don't ship internationally yet, but we're hoping to expand soon!");
INSERT INTO faq VALUES (2, "What was the inspiration for this store?", "We made a jewelry store because 
  high-quality jewelry is typically hard to come by at affordable prices. We try to provide high-quality
  items at prices that are significantly lower than other brands.");
INSERT INTO faq VALUES (3, "What kind of jewelry do you guys offer?", "We offer a variety of rings, necklaces,
  and earrings with precious metals and stones. We hope to offer bracelets and more niche jewelry types
  in the future!");
INSERT INTO faq VALUES (4, "What's your return policy?", "We will take returns up to one month (30 days) after
  purchase. After this period, returns cannot be made.");
INSERT INTO faq VALUES (5, "Can I buy this jewelry in person?", "Unfortunately, no. We only offer our goods online.
  We hope to open in-person stores within the next 5 years!");
