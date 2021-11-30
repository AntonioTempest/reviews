const { Client } = require('pg')
const client = new Client({
  user: "postgres",
  host: "52.15.58.58",
  port: 22,
  database: "reviews"
})

client.connect()
.then(() => console.log('Connection successful'))
.then(() => client.query('SELECT * FROM reviews WHERE product_id=1;'))
.then(results => console.table(results.rows))
.catch(e => console.log(e))
.finally(() => client.end());

client.connect()
.then(() => client.query(`SELECT *, COALESCE(photos.ph, '[]') AS photos
FROM reviews r
LEFT JOIN LATERAL(
  SELECT json_agg(json_build_object('id', photos.id, 'url', photos.url))
  AS ph
  FROM photos
  WHERE photos.review_id=r.review_id) photos ON true
  WHERE r.product_id=$1
  AND r.reported=false
  ORDER BY $2 DESC
  LIMIT $3 ;`, ))
