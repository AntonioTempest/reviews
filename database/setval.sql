BEGIN;
SELECT setval('reviews_review_id_seq', COALESCE((SELECT MAX(review_id)+1 FROM reviews), 1), false);
SELECT setval('characteristic_reviews_id_seq', COALESCE((SELECT MAX(id)+1 FROM characteristic_reviews), 1), false);
SELECT setval('photos_id_seq', COALESCE((SELECT MAX(id)+1 FROM photos), 1), false);
COMMIT;