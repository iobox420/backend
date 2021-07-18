const config = require('./config')
const mysql = require('mysql')
const pool = mysql.createPool({
  connectionLimit: 1,
  host: config.HOST,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE,
})

module.exports = pool
