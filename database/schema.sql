SET check_function_bodies = false;
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

/* Table 'products' */
CREATE TABLE products(
  product_id integer NOT NULL,
  page integer,
  count integer,
  PRIMARY KEY(product_id)
);

/* Table 'reviews' */

CREATE TABLE reviews(
  id serial NOT NULL,
  product_id integer NOT NULL,
  rating integer,
  review_date BIGINT,
  summary text,
  body text,
  recommend boolean,
  reported boolean,
  reviewer_name text,
  reviewer_email text,
  response text,
  helpfulness integer,
  PRIMARY KEY(id)
);

/* Table 'photos' */
CREATE TABLE photos(
  id serial NOT NULL,
  review_id integer NOT NULL,
  "url" text,
  PRIMARY KEY(id)
);

/* Table 'characteristic_reviews' */
CREATE TABLE characteristic_reviews(
  id serial NOT NULL,
  characteristic_id integer,
  review_id integer NOT NULL,
  "value" integer,
  PRIMARY KEY(id)
);

CREATE TABLE characteristics(
  id serial NOT NULL,
  product_id integer,
  "name" text,
  PRIMARY KEY(id)
);

/* Relation 'reviews_photos' */
ALTER TABLE photos
  ADD CONSTRAINT reviews_photos
    FOREIGN KEY (review_id) REFERENCES reviews (id);

/* Relation 'reviews_characteristic_reviews' */
ALTER TABLE characteristic_reviews
  ADD CONSTRAINT reviews_characteristic_reviews
    FOREIGN KEY (review_id) REFERENCES reviews (id);
