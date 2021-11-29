
SELECT "name" FROM characteristics AS charname
LEFT JOIN
( SELECT  * FROM characteristic_reviews AS chr WHERE chr.review_id=2) char ON true;
