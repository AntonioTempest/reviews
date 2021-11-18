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
  var page = req.page || 1;
  var count = req.count || 5;
  var sort = req.sort;
  db.any(`SELECT *
  FROM reviews
  LEFT JOIN photos
  ON reviews.review_id = photos.review_id
  WHERE reviews.product_id=$1`, id)
    .then((data) => {
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
            "photos": []
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
  db.any('SELECT *')
})

app.post('/reviews', (req, res) => {
  db.any('INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1, $2, $3, $4, $5, $6, $7)', [req.body.product_id, req.body.rating, req.body.summary, req.body.body, req.body.recommend, req.body.name, req.body.email])
  .then((data) => {
    console.log(data);
    res.status(201).send('CREATED');
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('ERR POSTING')
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