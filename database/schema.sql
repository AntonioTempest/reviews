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
  recommend bool,
  response text,
  body text,
  date date,
  reviewer_name text,
  helpfulness integer,
  reported numeric,
  PRIMARY KEY(review_id)
);

/* Table 'photos' */
CREATE TABLE photos(
  photo_id integer NOT NULL,
  reviews_review_id integer NOT NULL,
  url text,
  PRIMARY KEY(photo_id)
);

/* Table 'metareviews' */
CREATE TABLE metareviews(
  products_product_id integer NOT NULL,
  ratings json,
  recommended json,
  "characteristics" json
);

/* Relation 'products_reviews' */
ALTER TABLE reviews
  ADD CONSTRAINT products_reviews
    FOREIGN KEY (products_product_id) REFERENCES products (product_id);

/* Relation 'products_metareviews' */
ALTER TABLE metareviews
  ADD CONSTRAINT products_metareviews
    FOREIGN KEY (products_product_id) REFERENCES products (product_id);

/* Relation 'reviews_photos' */
ALTER TABLE photos
  ADD CONSTRAINT reviews_photos
    FOREIGN KEY (reviews_review_id) REFERENCES reviews (review_id);
