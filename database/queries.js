const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:postgres@localhost:5432/reviews')

const Queries = {};

Queries.getAll = (id, sort, count) => {
  return db.any(`SELECT *, COALESCE(photos.ph, '[]') AS photos
  FROM reviews r
  LEFT JOIN LATERAL(
    SELECT json_agg(json_build_object('id', photos.id, 'url', photos.url))
    AS ph
    FROM photos
    WHERE photos.review_id=r.review_id) photos ON true
    WHERE r.product_id=$1
    AND r.reported=false
    ORDER BY $2 DESC
    LIMIT $3 ;`, [id, sort, count],false);
}

module.exports = Queries;
