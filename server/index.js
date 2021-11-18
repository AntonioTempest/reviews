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
  db.any(`SELECT *
  FROM reviews
  LEFT JOIN photos AS ARRAY_AGG(review_id, id, url)
  ON reviews.review_id = array_agg.review_id
  WHERE reviews.product_id=$1`, id)
    .then((data) => {
      var results = [];
      console.log(data);
      data.map((review) => {
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
        results.push(result);
      })
      return results;
    })
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      console.log('ERR:', err)
      res.status(500).send(err);
    })
})

/*

db.one('SELECT $1 AS value', 123)
  .then(function (data) {
    console.log('DATA:', data.value)
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })

db.any('SELECT * FROM reviews WHERE id BETWEEN $1 AND $2', [1, 10])
  .then((data) => {
    console.log('DATA:', data)
  })
  .catch((err) => console.log(err))
  */