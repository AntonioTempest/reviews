UPDATE reviews
  SET helpfulness = helpfulness + 1
WHERE review_id=$1;