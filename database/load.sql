COPY reviews(review_id, product_id, rating, review_date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/alexandercarlman/work/reviews/csv/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY photos(id,review_id,url)
FROM '/Users/alexandercarlman/work/reviews/csv/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristic_reviews(id,characteristic_id,review_id,value)
FROM '/Users/alexandercarlman/work/reviews/csv/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics(id,product_id,name)
FROM '/Users/alexandercarlman/work/reviews/csv/characteristics.csv'
DELIMITER ','
CSV HEADER;