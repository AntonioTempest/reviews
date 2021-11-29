CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_photos_review_id ON photos(review_id);
CREATE INDEX idx_char_rev_review_id ON characteristic_reviews(review_id);
CREATE INDEX idx_chr_rev_char_id ON characteristic_reviews(characteristic_id);
CREATE INDEX idx_chr_product_id ON characteristics(product_id);