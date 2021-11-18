const { Pool, Client } = require('pg')

const reviews = new Pool({
  user: "postgres",
  database: "reviews",
  port: 5432
})

const Queries = {};

Queries.getReviews = (req, res) => {
  console.log(req.query);
}

module.exports = Queries;