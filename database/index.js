const { Client } = require('pg')
const client = new Client({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5432,
  database: "reviews"
})

client.connect()
.then(() => console.log('Connection successful'))
.then(() => client.query('SELECT * FROM reviews WHERE product_id=1;'))
.then(results => console.table(results.rows))
.catch(e => console.log(e))
.finally(() => client.end());
