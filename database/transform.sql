ALTER TABLE reviews
ALTER review_date TYPE timestamp without time zone
USING to_timestamp(review_date / 1000) AT TIME ZONE 'UTC';