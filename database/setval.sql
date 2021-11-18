BEGIN;
SELECT setval('reviews_review_id_seq', COALESCE((SELECT MAX(review_id)+1 FROM reviews), 1), false);
COMMIT;