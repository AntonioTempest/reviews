const pgp = require('pg-promise')(/* options */)
const dbconfig = {
  user: "postgres",
  password: "ubuntu",
  host: "52.15.58.58",
  port: 5432,
  database: "reviews"
}
const db = pgp(dbconfig)

const Queries = {};

Queries.getAll = (id, page, count, offset, sort) => {
  return db.any(`SELECT *, COALESCE(photos.ph, '[]') AS photos
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
    .catch((err) => {
      return err;
    })
}

Queries.getRatings = (id) => {
  return db.any(`SELECT
  json_build_object(
  1, (SELECT
    COUNT(reviews.rating)
    FROM reviews
    WHERE reviews.product_id= $1 AND reviews.rating = 1),
  2, (SELECT
    COUNT(reviews.rating)
    FROM reviews
    WHERE reviews.product_id= $1 AND reviews.rating = 2),
  3, (SELECT
    COUNT(reviews.rating)
    FROM reviews
    WHERE reviews.product_id= $1 AND reviews.rating = 3),
  4, (SELECT
    COUNT(reviews.rating)
    FROM reviews
    WHERE reviews.product_id= $1 AND reviews.rating = 4),
  5, (SELECT
    COUNT(reviews.rating)
    FROM reviews
    WHERE reviews.product_id= $1 AND reviews.rating = 5)
  )`, id)
    .then((data) => {
      return data[0]["json_build_object"];
    })
    .catch((err) => {
      return err;
    })
}

Queries.getRecommended = (id) => {
  return db.any(`SELECT
      json_build_object(
      0, (SELECT
        COUNT(reviews.recommend)
        FROM reviews
        WHERE reviews.product_id=$1 AND reviews.recommend=false),
      1, (SELECT
        COUNT(reviews.recommend)
        FROM reviews
        WHERE reviews.product_id=$1 AND reviews.recommend=true))`, id)
      .then((result) => {
       return result[0]["json_build_object"];
      })
      .catch((err) => {
        return err;
      })
}

Queries.getCharacteristics = (id) => {
  return db.any(`SELECT
        json_build_object(
        characteristics.name,
        json_agg(json_build_object(
          'id', characteristics.id,
          'value', (SELECT TRUNC(AVG (characteristic_reviews.value),4)
          FROM characteristic_reviews
          WHERE characteristic_reviews.characteristic_id = characteristics.id
          ))
          )
        ) ch FROM characteristics WHERE characteristics.product_id=$1
       GROUP BY characteristics.name`, id)
        .then((data) => {
          var chars = {};
          data.map((char) => {
            //console.log(char)
            var type = Object.keys(char.ch)[0];
            chars[type] = char.ch[type][0];
          })
          return chars;
        })
        .catch((err) => {
          return err;
        })
}

Queries.postReview = (product_id, rating, summary, body, recommend, name, email, reported, date) => {
  return db.any(`INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, reported, review_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [product_id, rating, summary, body, recommend, name, email, reported, date])
  .then((data) => 'success')
  .catch((e) => e);
}

Queries.postCharacteristics = (characteristics) => {
  return db.any('SELECT MAX(review_id) FROM reviews')
    .then ((review_id) => {
      Object.keys(characteristics).map((key, index) => {
        db.any('INSERT INTO characteristic_reviews (characteristic_id, review_id, value) VALUES ($1, $2, $3)', [key, review_id[0].max, characteristics[key]])
      })
      return 'success';
    })
    .catch((e) => e);
}

Queries.postPhotos = (photos) => {
  return db.any('SELECT MAX(review_id) FROM reviews')
  .then ((review_id) => {
    photos.map((photo) => {
    db.any('INSERT INTO photos (review_id, url) VALUES ($1, $2)', [review_id[0].max, photo])
    .then((result) => 'success')
    .catch((e) => e)
  })
  })
  .catch((e) => e);
}

Queries.putHelpful = (id) => {
  return db.any('UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id=$1;', id)
  .then((data) => {
    return 'success';
  })
  .catch((err) => {
    return 'error';
  })
}

Queries.putReported = (id) => {
  return db.any('UPDATE reviews SET reported = true WHERE review_id=$1', id)
    .then((data) => {
      return 'success'
    })
    .catch((err) => {
      return err
    })
}

module.exports = Queries;
