const express = require('express')
const router = express.Router()
const db = require('../db')
/*
var express = require('express')
const e = require('express')
var app = express();
var PORT = 3000;

var student = express.Router();
app.use('/student', student);

student.get('/profile/:start/:end', function (req, res) {
    console.log("Starting Page: ", req.params['start']);
    console.log("Ending Page: ", req.params['end']);
    res.send();
})

app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});*/
function RDM(min = 1, max = 10000) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //Максимум не включается, минимум включается
}

function page(numpage) {
  let num = parseInt(numpage)
  if (num === 1) {
    return 0
  }
  return (num - 1) * 20
}

/*SELECT `_id_post`,
    `id_user`, `heading`,
    `questions_text`,
    `date_create`,
    (SELECT COUNT(*) FROM `likes_q` WHERE `id_questions` = `_id_post`) AS likes_count,
    (SELECT COUNT(*) AS `count` FROM `questions_posts` WHERE 1) AS rows_count,
    (SELECT `_id_reply` AS `reply_id_reply` FROM `reply_q` WHERE `id_post` = `_id_post` ORDER BY `date_create` DESC LIMIT 1) AS reply_id_reply,
    (SELECT `id_post` AS `reply_id_reply` FROM `reply_q` WHERE `id_post` = `_id_post` ORDER BY `date_create` DESC LIMIT 1) AS reply_id_post,
    (SELECT `id_user` AS `reply_id_reply` FROM `reply_q` WHERE `id_post` = `_id_post` ORDER BY `date_create` DESC LIMIT 1) AS reply_id_user,
    (SELECT `reply_text` AS `reply_id_reply` FROM `reply_q` WHERE `id_post` = `_id_post` ORDER BY `date_create` DESC LIMIT 1) AS reply_reply_text,
    (SELECT `reply_date_create` AS `reply_id_reply` FROM `reply_q` WHERE `id_post` = `_id_post` ORDER BY `date_create` DESC LIMIT 1) AS reply_reply_date_create
FROM `questions_posts` WHERE 1 ORDER BY `date_create` DESC LIMIT 20 Offset 0

SELECT `id_user` AS `reply_id_reply`
FROM `reply_q` WHERE `id_post` = 200
INNER JOIN `users` ON `id_user` = `user_name`
ORDER BY `reply_date_create` DESC LIMIT 100

SELECT `id_user`
FROM `reply_q` WHERE `id_post` = 200
INNER JOIN `users`
ON `id_user` = `user_name`
ORDER BY `reply_date_create` DESC LIMIT 100

SELECT *
FROM `questions_posts`
INNER JOIN `users`
ON `id_user` = `user_name`*/
router.get('/questions/:page', function (req, res) {
  /*if (req.params['page'] === 1)*/
  /*console.log(page(req.params['page']))*/
  /*let a = page(req.params['page'])*/
  // prettier-ignore
  //В параметре запроса указываем страницу, которую нам необходимо получить.
  let sql = "SELECT `_id_post`,`id_user`, `heading`, `questions_text`,`date_create`, (SELECT COUNT(*) FROM `likes_q` WHERE `id_questions` = `_id_post`) AS likes_count,(SELECT COUNT(*) AS `count` FROM `questions_posts` WHERE 1) AS rows_count, (SELECT `_id_reply` AS `reply_id_reply` FROM `reply_q` WHERE `id_post` = `_id_post` ORDER BY `reply_date_create` DESC LIMIT 1) AS reply_id_reply,   (SELECT `id_post` AS `reply_id_reply` FROM `reply_q` WHERE `id_post` = `_id_post` ORDER BY `reply_date_create` DESC LIMIT 1) AS reply_id_post,   (SELECT `id_user` AS `reply_id_reply` FROM `reply_q` WHERE `id_post` = `_id_post` ORDER BY `reply_date_create` DESC LIMIT 1) AS reply_id_user,   (SELECT `reply_text` AS `reply_id_reply` FROM `reply_q` WHERE `id_post` = `_id_post` ORDER BY `reply_date_create` DESC LIMIT 1) AS reply_reply_text,   (SELECT `reply_date_create` AS `reply_id_reply` FROM `reply_q` WHERE `id_post` = `_id_post` ORDER BY `reply_date_create` DESC LIMIT 1) AS reply_reply_date_create   FROM `questions_posts` WHERE 1 ORDER BY `date_create` DESC LIMIT 20 Offset " + page(req.params['page']) + ""
  db.query(sql, (error, result, fields) => {
    try {
      if (error) {
        console.log(error)
      } else {
        debugger
        res.json(result)
        /*console.log(result)*/
      }
    } catch (e) {
      console.log(e)
    }
  })
})

/*async function main() {
  try {
    let count = await count_questions1()
    return count
    console.log('count = ', count)
  } catch (e) {
    console.log(e)
  }
  /!*  try {
    let count = await count_questions()
    return count
    console.log('count = ', count)
  } catch (e) {
    console.log(e)
  }*!/
}
function count_questions1() {
  return 'Hello'
  /!*  function sayHi() {
    return 'Hello'
  }
  setTimeout(sayHi, 1000)*!/
}
function count_questions() {
  db.query(
    'SELECT COUNT(*) AS `count` FROM `questions_posts` WHERE 1',
    (error, result, fields) => {
      try {
        if (error) {
          /!*console.log('error ', error)*!/
        } else {
          /!*console.log(result[0].count)*!/
          return result[0].count
        }
      } catch (e) {
        /!*console.log(e)*!/
      }
    }
  )
}*/

/*router.get('', function (req, res) {
  db.query(
    'SELECT * FROM `questions_posts` ORDER BY `date_create` DESC LIMIT 20',
    (error, result, fields) => {
      try {
        if (error) {
          console.log(error)
        } else {
          res.json(result)
        }
      } catch (e) {
        console.log(e)
      }
    }
  )
})*/
module.exports = router
