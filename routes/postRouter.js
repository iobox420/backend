const express = require('express')
const router = express.Router()
const db = require('../db-pool')

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

//Сортировка вопросов по дате создания с отдельным подсчетом лайков с самым свежим ответом
router.get('/questions/all/:page', function (req, res) {
  //В параметре запроса указываем страницу, которую нам необходимо получить.
  /*  let sql =
    "SELECT `heading`, `questions_text`, `date_create`, `id_user` as `id`, (select `user_name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as user_name, (select `name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as name, (select `second_name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as second_name, (select `avatar_url` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as avatar_url, (SELECT COUNT(*) FROM `likes_q` WHERE `id_questions` = `_id_post`) AS question_post_likes_count, (SELECT COUNT(*) AS `count` FROM `questions_posts` WHERE 1) AS rows_count, (select `reply_text` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_text, (select `reply_date_create` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_date_create,     (select `user_name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_user_name, (select `name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_name, (select `second_name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_second_name,     (select `avatar_url` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_avatar_url, (SELECT COUNT(*) FROM `likes_r` WHERE likes_r.id_user = questions_posts.id_user) as reply_likes_count FROM `questions_posts` WHERE 1 ORDER BY `date_create` DESC LIMIT 20 Offset " +
    page(req.params["page"]) +
    "";*/
  //prettier-ignore
  let sql = `SELECT _id_post,heading, questions_text, date_create, id_user as id, 
  (SELECT user_name from questions_posts INNER JOIN users on questions_posts.id_user = users._id_user WHERE id = questions_posts.id_user  LIMIT 1) as user_name, 
  (SELECT name from questions_posts INNER JOIN users on questions_posts.id_user = users._id_user WHERE id = questions_posts.id_user  LIMIT 1) as name, 
  (SELECT second_name from questions_posts INNER JOIN users on questions_posts.id_user = users._id_user WHERE id = questions_posts.id_user  LIMIT 1) as second_name, 
  (SELECT avatar_url from questions_posts INNER JOIN users on questions_posts.id_user = users._id_user WHERE id = questions_posts.id_user  LIMIT 1) as avatar_url, 
  (SELECT COUNT(*) FROM likes_q WHERE id_questions = _id_post) AS question_post_likes_count, (SELECT COUNT(*) AS count FROM questions_posts WHERE 1) AS rows_count, 
  (SELECT reply_text from reply_q INNER JOIN users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY reply_date_create DESC LIMIT 1) as reply_text, 
  (SELECT reply_date_create from reply_q INNER JOIN users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY reply_date_create DESC LIMIT 1) as reply_date_create,     
  (SELECT user_name from reply_q INNER JOIN users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY reply_date_create DESC LIMIT 1) as reply_user_name, 
  (SELECT name from reply_q INNER JOIN users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY reply_date_create DESC LIMIT 1) as reply_name, 
  (SELECT second_name from reply_q INNER JOIN users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY reply_date_create DESC LIMIT 1) as reply_second_name,     
  (SELECT avatar_url from reply_q INNER JOIN users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY reply_date_create DESC LIMIT 1) as reply_avatar_url, 
  (SELECT COUNT(*) FROM likes_r WHERE likes_r.id_user = questions_posts.id_user) as reply_likes_count 
  FROM questions_posts WHERE 1 
  ORDER BY date_create DESC 
  LIMIT 20 
  Offset ${page(req.params["page"])}`;
  //let sql = "SELECT `heading`, `questions_text`, `date_create`, `id_user` as `id`, (select `user_name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as user_name, (select `name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as name, (select `second_name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as second_name,  (SELECT COUNT(*) FROM `likes_q` WHERE `id_questions` = `_id_post`) AS question_post_likes_count, (SELECT COUNT(*) AS `count` FROM `questions_posts` WHERE 1) AS rows_count, (select `reply_text` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_text, (select `reply_date_create` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_date_create,     (select `user_name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_user_name, (select `name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_name, (select `second_name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_second_name,      (SELECT COUNT(*) FROM `likes_r` WHERE likes_r.id_user = questions_posts.id_user) as reply_likes_count FROM `questions_posts` WHERE 1 ORDER BY `date_create` DESC LIMIT 20 Offset 0";
  /*console.log(sql);*/
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
router.get('/questions/questions_posts/:id_post', function (req, res) {
  function queryQuestionPost() {
    //simple function to get growth items
    return new Promise((resolve, reject) => {
      sql = `SELECT _id_post, id_user, heading, questions_text, date_create, 
        (select user_name from users where users._id_user = questions_posts.id_user) as user_user_name, 
        (select name from users where users._id_user = questions_posts.id_user) as user_name, 
        (select second_name from users where users._id_user = questions_posts.id_user) as user_second_name, 
        (select avatar_url from users where users._id_user = questions_posts.id_user) as user_avatar_url,
        (SELECT COUNT(*) FROM likes_q WHERE likes_q.id_questions = questions_posts._id_post) as question_likes_count  
        FROM questions_posts WHERE _id_post = ${req.params['id_post']}`
      db.query(sql, function (err, result) {
        if (err) {
          console.log('Garden Error: ' + err)
          reject(err)
        }
        resolve(result)
      })
    })
  }
  function replyOnQuestion() {
    //simple function to get growth items
    return new Promise((resolve, reject) => {
      sql = `SELECT _id_reply, id_post, id_user, reply_text, reply_date_create, 
        (select user_name from users where users._id_user = reply_q.id_user) as user_user_name, 
        (select name from users where users._id_user = reply_q.id_user) as user_name, 
        (select second_name from users where users._id_user = reply_q.id_user) as user_second_name, 
        (select avatar_url from users where users._id_user = reply_q.id_user) as user_avatar_url,
        (SELECT COUNT(*) FROM likes_r WHERE likes_r.id_reply = reply_q._id_reply) as reply_likes_count  
        FROM reply_q WHERE id_post = ${req.params['id_post']}`
      db.query(sql, function (err, result) {
        if (err) {
          console.log('Garden Error: ' + err)
          reject(err)
        }
        resolve(result)
      })
    })
  }

  async function commentOnReply(replys) {
    let arrOfPromises = replys.map((curElem, i, arr) => {
      return new Promise((resolve, reject) => {
        let sql, comments
        sql = `SELECT _id_comment, id_reply, id_user, comment_text, comment_date_create, 
        (select user_name from users where users._id_user = comments_reply.id_user) as user_user_name, 
        (select name from users where users._id_user = comments_reply.id_user) as user_name, 
        (select second_name from users where users._id_user = comments_reply.id_user) as user_second_name, 
        (select avatar_url from users where users._id_user = comments_reply.id_user) as user_avatar_url,
        (SELECT COUNT(*) FROM likes_c WHERE likes_c.id_comment = comments_reply._id_comment) as comments_likes_count      
        FROM comments_reply WHERE id_reply = ${curElem._id_reply}`
        db.query(sql, function (err, result) {
          if (err) {
            reject(err)
          }
          resolve(result)
        })
      })
    })
    return Promise.all(arrOfPromises)
  }

  async function commentOnReply(replys) {
    let arrOfPromises = replys.map((curElem, i, arr) => {
      return new Promise((resolve, reject) => {
        let sql, comments
        sql = `SELECT _id_comment, id_reply, id_user, comment_text, comment_date_create, 
        (select user_name from users where users._id_user = comments_reply.id_user) as user_user_name, 
        (select name from users where users._id_user = comments_reply.id_user) as user_name, 
        (select second_name from users where users._id_user = comments_reply.id_user) as user_second_name, 
        (select avatar_url from users where users._id_user = comments_reply.id_user) as user_avatar_url,
        (SELECT COUNT(*) FROM likes_c WHERE likes_c.id_comment = comments_reply._id_comment) as comments_likes_count      
        FROM comments_reply WHERE id_reply = ${curElem._id_reply}`
        db.query(sql, function (err, result) {
          if (err) {
            reject(err)
          }
          resolve(result)
        })
      })
    })
    return Promise.all(arrOfPromises)
  }
  async function starter() {
    let replys = await replyOnQuestion()
    let comments = await commentOnReply(replys)
    res.json({
      post: await queryQuestionPost(),
      reply: replys.map((cur, i, ar) => {
        return {
          ...cur,
          comments: comments[i],
        }
      }),
    })
  }
  starter()
})

/*router.get('/questions/commentsOnReply/:id_post', function (req, res) {

  function commentsOnReply() {
    //simple function to get growth items
    return new Promise((resolve, reject) => {
      sql = `SELECT _id_comment, id_reply, id_user, comment_text, comment_date_create,
        (select user_name from users where users._id_user = comments_reply.id_user) as user_user_name,
        (select name from users where users._id_user = comments_reply.id_user) as user_name,
        (select second_name from users where users._id_user = comments_reply.id_user) as user_second_name,
        (select avatar_url from users where users._id_user = comments_reply.id_user) as user_avatar_url,
        (SELECT COUNT(*) FROM likes_c WHERE likes_c.id_comment = comments_reply._id_comment) as comments_likes_count,
        FROM comments_reply WHERE id_reply = ${req.params['id_post']}`
      db.query(sql, function (err, result) {
        if (err) {
          console.log('Garden Error: ' + err)
          reject(err)
        }
        resolve(result)
      })
    })
  }
  async function starter() {
    res.json({
      comment: await commentsOnReply()
    })
  }
  starter()
})*/

router.get('/questions/bestof1day/:page', function (req, res) {
  //prettier-ignore
  let sql =
    "SELECT `heading`, `questions_text`, `date_create`, `id_user` as `id`, (select `user_name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as user_name, (select `name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as name, (select `second_name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as second_name, (select `avatar_url` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as avatar_url, (SELECT COUNT(*) FROM `likes_q` WHERE `id_questions` = `_id_post`) AS question_post_likes_count, (SELECT COUNT(*) AS `count` FROM `questions_posts` WHERE 1) AS rows_count, (select `reply_text` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_text, (select `reply_date_create` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_date_create,     (select `user_name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_user_name, (select `name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_name, (select `second_name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_second_name,     (select `avatar_url` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_avatar_url, (SELECT COUNT(*) FROM `likes_r` WHERE likes_r.id_user = questions_posts.id_user) as reply_likes_count FROM `questions_posts` WHERE `date_create` BETWEEN (NOW() - INTERVAL 1 DAY) AND NOW() ORDER BY `question_post_likes_count`DESC LIMIT 20 Offset " +
    page(req.params["page"]) +
    "";
  db.query(sql, (error, result, fields) => {
    try {
      if (error) {
        console.log(error)
      } else {
        res.json(result)
      }
    } catch (e) {
      console.log(e)
    }
  })
})

router.get('/questions/bestof7day/:page', function (req, res) {
  //prettier-ignore
  let sql =
    "SELECT `heading`, `questions_text`, `date_create`, `id_user` as `id`, (select `user_name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as user_name, (select `name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as name, (select `second_name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as second_name, (select `avatar_url` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as avatar_url, (SELECT COUNT(*) FROM `likes_q` WHERE `id_questions` = `_id_post`) AS question_post_likes_count, (SELECT COUNT(*) AS `count` FROM `questions_posts` WHERE 1) AS rows_count, (select `reply_text` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_text, (select `reply_date_create` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_date_create,     (select `user_name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_user_name, (select `name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_name, (select `second_name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_second_name,     (select `avatar_url` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_avatar_url, (SELECT COUNT(*) FROM `likes_r` WHERE likes_r.id_user = questions_posts.id_user) as reply_likes_count FROM `questions_posts` WHERE `date_create` BETWEEN (NOW() - INTERVAL 7 DAY) AND NOW() ORDER BY `question_post_likes_count`DESC LIMIT 20 Offset " +
    page(req.params["page"]) +
    "";
  db.query(sql, (error, result, fields) => {
    try {
      if (error) {
        console.log(error)
      } else {
        res.json(result)
      }
    } catch (e) {
      console.log(e)
    }
  })
})

router.get('/questions/bestofmonth/:page', function (req, res) {
  //prettier-ignore
  let sql =
    "SELECT `heading`, `questions_text`, `date_create`, `id_user` as `id`, (select `user_name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as user_name, (select `name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as name, (select `second_name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as second_name, (select `avatar_url` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as avatar_url, (SELECT COUNT(*) FROM `likes_q` WHERE `id_questions` = `_id_post`) AS question_post_likes_count, (SELECT COUNT(*) AS `count` FROM `questions_posts` WHERE 1) AS rows_count, (select `reply_text` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_text, (select `reply_date_create` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_date_create,     (select `user_name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_user_name, (select `name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_name, (select `second_name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_second_name,     (select `avatar_url` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_avatar_url, (SELECT COUNT(*) FROM `likes_r` WHERE likes_r.id_user = questions_posts.id_user) as reply_likes_count FROM `questions_posts` WHERE `date_create` BETWEEN (NOW() - INTERVAL 1 MONTH) AND NOW() ORDER BY `question_post_likes_count`DESC LIMIT 20 Offset " +
    page(req.params["page"]) +
    "";
  db.query(sql, (error, result, fields) => {
    try {
      if (error) {
        console.log(error)
      } else {
        res.json(result)
      }
    } catch (e) {
      console.log(e)
    }
  })
})

router.get('/questions/bestofyear/:page', function (req, res) {
  //prettier-ignore
  let sql =
    "SELECT `heading`, `questions_text`, `date_create`, `id_user` as `id`, (select `user_name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as user_name, (select `name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as name, (select `second_name` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as second_name, (select `avatar_url` from `questions_posts` inner join users on questions_posts.id_user = users._id_user WHERE `id` = questions_posts.id_user  LIMIT 1) as avatar_url, (SELECT COUNT(*) FROM `likes_q` WHERE `id_questions` = `_id_post`) AS question_post_likes_count, (SELECT COUNT(*) AS `count` FROM `questions_posts` WHERE 1) AS rows_count, (select `reply_text` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_text, (select `reply_date_create` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_date_create,     (select `user_name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_user_name, (select `name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_name, (select `second_name` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_second_name,     (select `avatar_url` from `reply_q` inner join users on reply_q.id_user = users._id_user WHERE reply_q.id_user = questions_posts.id_user ORDER BY `reply_date_create` DESC LIMIT 1) as reply_avatar_url, (SELECT COUNT(*) FROM `likes_r` WHERE likes_r.id_user = questions_posts.id_user) as reply_likes_count FROM `questions_posts` WHERE `date_create` BETWEEN (NOW() - INTERVAL 1 YEAR) AND NOW() ORDER BY `question_post_likes_count`DESC LIMIT 20 Offset  " +
    page(req.params["page"]) +
    "";
  db.query(sql, (error, result, fields) => {
    try {
      if (error) {
        console.log(error)
      } else {
        res.json(result)
      }
    } catch (e) {
      console.log(e)
    }
  })
})

router.get('/pool/', function (req, res) {
  db.query('SELECT * FROM users', function (error, results, fields) {
    if (error) throw error
    res.send(results)
  })
})

module.exports = router
