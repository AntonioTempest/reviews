// Server
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Database
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:postgres@localhost:5432/reviews')

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '../dist')));

app.listen(port, () => {
  console.log(`Listening at port: ${port}`);
})

app.get('/reviews', (req, res) => {
  var id = Number(req.query.product_id);
  var page = req.query.page || 1;
  var count = req.query.count || 5;
  console.log(count);
  var offset = (page - 1) * count;
  var sort = req.query.sort || 'review_date';
  db.any(`SELECT *, COALESCE(photos.ph, '[]') AS photos
  FROM reviews r
  INNER JOIN LATERAL(
    SELECT json_agg(json_build_object('id', photos.id, 'url', photos.url))
    AS ph
    FROM photos
    WHERE photos.review_id=r.review_id) photos ON true
    WHERE r.product_id=$1
    AND r.reported=false
    OFFSET $2
    LIMIT $3 ;`, [id, offset, count])
    .then((data) => {
      console.log(data)
      var results = [];
      var header = {
        "product" : id,
        "page": page,
        "count": count,
        "results": []
      }
      data.map((review, i) => {
        if (i <= count) {
          var result = {
            "review_id": review.review_id,
            "rating": review.rating,
            "summary": review.summary,
            "recommend": review.recommend,
            "response": review.response,
            "body": review.body,
            "date": review.review_date,
            "reviewer_name": review.reviewer_name,
            "helpfulness": review.helpfulness,
            "photos": review.photos || []
          }
          header.results.push(result);
        }
      })
      return header;
    })
    .then((header) => {
      res.status(200).send(header);
    })
    .catch((err) => {
      console.log('ERR:', err)
      res.status(500).send(err);
    })
})

app.get('/reviews/meta', (req, res) => {
  var id = Number(req.query.product_id);
  console.log(id);
db.any(`json_agg(SELECT
json_build_object(
  '1', (SELECT
    COUNT(reviews.rating)
    FROM reviews
    WHERE reviews.product_id= $1 AND reviews.rating = 1),
  '2', (SELECT
    COUNT(reviews.rating)
    FROM reviews
    WHERE reviews.product_id= $1 AND reviews.rating = 2),
  '3', (SELECT
    COUNT(reviews.rating)
    FROM reviews
    WHERE reviews.product_id= $1 AND reviews.rating = 3),
  '4', (SELECT
    COUNT(reviews.rating)
    FROM reviews
    WHERE reviews.product_id= $1 AND reviews.rating = 4),
  '5', (SELECT
    COUNT(reviews.rating)
    FROM reviews
    WHERE reviews.product_id= $1 AND reviews.rating = 5)
  )`, id)
    .then((data) => {
      console.log('ratings data > ', data);
    }
    )

  db.any(`SELECT
  json_build_object(
    characteristics.name,
    json_agg(json_build_object(
      'id', characteristics.id,
      'value', (SELECT AVG (CAST(characteristic_reviews.value as Float))
      FROM characteristic_reviews
      WHERE characteristic_reviews.characteristic_id = characteristics.id
      ))
    )
  ) characteristics FROM characteristics WHERE characteristics.product_id=$1
  GROUP BY characteristics.name`, id)
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send();
    })
})

app.post('/reviews', (req, res) => {
  var reviewId=0;
  var d = new Date();
  var timeZoneOffset = d.getTimezoneOffset() * 60000;
  var date = new Date(d.getTime() - timeZoneOffset);
  db.any(`INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, reported, review_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [req.body.product_id, req.body.rating, req.body.summary, req.body.body, req.body.recommend, req.body.name, req.body.email, false, date])
  .then((result) => {
    db.any('SELECT MAX(review_id) FROM reviews')
    .then ((review_id) => {
      reviewId=review_id[0].max;
      Object.keys(req.body.characteristics).map((key, index) => {
        console.log('KEY > ', key);
        console.log('VALUE > ', req.body.characteristics[key])
        db.any('INSERT INTO characteristic_reviews (characteristic_id, review_id, value) VALUES ($1, $2, $3)', [key, reviewId, req.body.characteristics[key]])
      })
    })
    .then((data) => {
      console.log('.then ran');
      req.body.photos.map((photo, i) => {
        console.log('map ran x', i);
        db.any('INSERT INTO photos (review_id, url) VALUES ($1, $2)', [reviewId, photo])
      })
  })
  .then((result) => {
    res.status(201).send('CREATED');
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('ERR POSTING')
  })
  })
})

app.put('/reviews/:review_id/helpful', (req, res) => {
  var id = req.params.review_id;
  db.any('UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id=$1;', id)
    .then((data) => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(500).send();
    })
})

app.put('/reviews/:review_id/report', (req, res) => {
  var id = req.params.review_id;
  db.any('UPDATE reviews SET reported = true WHERE review_id=$1', id)
    .then((data) => {
      res.status(204).send();
    })
    .catch((data) => {
      res.status(500).send();
    })
})