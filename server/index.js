// Server
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const queries = require('../database/queries.js');

app.use(express.json());
app.use('/', express.static(path.join(__dirname, '../dist')));

app.listen(port, () => {
  console.log(`Listening at port: ${port}`);
})

app.get('/reviews', (req, res) => {
  var id = Number(req.query.product_id);
  var page = req.query.page || 1;
  var count = req.query.count || 5;
  var offset = (page - 1) * count;
  var sort = req.query.sort || 'review_date';
  queries.getAll(id, page, count, offset, sort)
  .then((result) => res.status(200).send(result))
  .catch((e) => res.status(500).send(e));
})

app.get('/reviews/meta', (req, res) => {
  var id = Number(req.query.product_id);
  var response = {
    "product_id": id
  }
  queries.getRatings(id)
  .then((ratings) => {
    response.ratings = ratings;
    queries.getRecommended(id)
    .then((recommended) => {
      response.recommended = recommended;
      queries.getCharacteristics(id)
      .then((characteristics) => {
        response.characteristics = characteristics;
        res.status(200).send(response);
      })
    })
  })
  .catch((err) => res.status(500).send(err));

})

app.post('/reviews', (req, res) => {
  var reviewId=0;
  var d = new Date();
  var timeZoneOffset = d.getTimezoneOffset() * 60000;
  var date = new Date(d.getTime() - timeZoneOffset);
  queries.postReview(req.body.product_id, req.body.rating, req.body.summary, req.body.body, req.body.recommend, req.body.name, req.body.email, false, date)
  .then((result) => {
    queries.postCharacteristics(req.body.characteristics)
    .then((data) => {
      queries.postPhotos(req.body.photos)
      .then((data) => {
        res.status(201).send('CREATED')
      })
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('ERR POSTING')
  })
  })
})

app.put('/reviews/:review_id/helpful', (req, res) => {
  var id = req.params.review_id;
  queries.putHelpful(id)
  .then((result) => {
    res.status(204).send();
  })
  .catch((err) => {
    res.status(500).send();
  })
})

app.put('/reviews/:review_id/report', (req, res) => {
  var id = req.params.review_id;
  queries.putReported(id)
  .then((result) => {
    res.status(204).send();
  })
  .catch((err) => {
    res.status(500).send();
  })
})

app.get('/loaderio-6167b42a4833b3f8f412051e3bb30e54', (req, res) => {
  res.status(200).send('loaderio-6167b42a4833b3f8f412051e3bb30e54');
})