SELECT *
FROM   reviews
LEFT JOIN (SELECT array_to_json(array_agg(id, url)) AS u FROM photos WHERE reviews.review_id = photos.review_id) x ON true
WHERE product_id = 2;