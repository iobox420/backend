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

/*
const url =
  'https://api.github.com/users/RodrigoWebDev/repos?per_page=100&sort=created'

getData(url).then((data) => console.log(data))

async function getData(url) {
  const response = await fetch(url)
  const data = await response.json()
  const arrOfPromises = data.map((item) =>
    fetch(
      `https://raw.githubusercontent.com/${item.full_name}/master/built-with.json`
    )
  )
  return Promise.all(arrOfPromises)
}
*/
