SET check_function_bodies = false;

/* Table 'products' */
CREATE TABLE products(
  product_id integer NOT NULL,
  page integer,
  count integer,
  PRIMARY KEY(product_id)
);

/* Table 'reviews' */
CREATE TABLE reviews(
  review_id integer NOT NULL,
  products_product_id integer NOT NULL,
  rating integer,
  summary text,
  body text,
  recommend boolean,
  reported boolean,
  response text,
  date date,
  reviewer_name text,
  reviewer_email text,
  response text,
  helpfulness integer,
  PRIMARY KEY(review_id)
);

/* Table 'photos' */
CREATE TABLE photos(
  photo_id integer NOT NULL,
  reviews_review_id integer NOT NULL,
  url text,
  PRIMARY KEY(photo_id)
);

/* Table 'characteristic_reviews' */
CREATE TABLE characteristic_reviews(
  id integer NOT NULL,
  characteristic_id integer,
  reviews_review_id integer NOT NULL,
  "value" integer,
  PRIMARY KEY(id)
);

/* Relation 'products_reviews' */
ALTER TABLE reviews
  ADD CONSTRAINT products_reviews
    FOREIGN KEY (products_product_id) REFERENCES products (product_id);

/* Relation 'reviews_photos' */
ALTER TABLE photos
  ADD CONSTRAINT reviews_photos
    FOREIGN KEY (reviews_review_id) REFERENCES reviews (review_id);

/* Relation 'reviews_characteristic_reviews' */
ALTER TABLE characteristic_reviews
  ADD CONSTRAINT reviews_characteristic_reviews
    FOREIGN KEY (reviews_review_id) REFERENCES reviews (review_id);