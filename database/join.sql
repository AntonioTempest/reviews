SELECT *
  FROM reviews
  LEFT JOIN photos AS ARRAY_AGG(id, url)
  ON reviews.review_id = array_agg.id
  AND reviews.product_id=2