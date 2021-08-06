const express = require('express')
const router = express.Router()
const db = require('../db-pool')
const passport = require('passport')

function page(numpage) {
  let num = parseInt(numpage)
  if (num === 1) {
    return 0
  }
  return (num - 1) * 20
}

//Сортировка вопросов по дате создания с отдельным подсчетом лайков с самым свежим ответом
router.get(
  '/questionswithauth/all/:page',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user) {
      res.json({
        message: 'you are not authentificated',
      })
    } else {
      /*Аутентификация прошла успешно, пишем код тут*/
      //В параметре запроса указываем страницу, которую нам необходимо получить.
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
  (SELECT COUNT(*) FROM likes_r WHERE likes_r.id_user = questions_posts.id_user) as reply_likes_count,
  (SELECT date_like_create_q FROM likes_q WHERE id_user_u = ${req.user._id_user} AND id_questions = questions_posts._id_post LIMIT 1) as isLike         

  FROM questions_posts WHERE 1 
  ORDER BY date_create DESC 
  LIMIT 20 
  Offset ${page(req.params["page"])}`;
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
    }
  }
)

router.get(
  '/questions/questions_posts_with_auth/:id_post',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user) {
      res.json({
        message: 'you are not authentificated',
      })
    } else {
      /*Аутентификация прошла успешно, пишем код тут*/

      function queryQuestionPost() {
        //simple function to get growth items
        return new Promise((resolve, reject) => {
          sql = `SELECT _id_post, id_user, heading, questions_text, date_create, 
        (select user_name from users where users._id_user = questions_posts.id_user) as user_user_name, 
        (select name from users where users._id_user = questions_posts.id_user) as user_name, 
        (select second_name from users where users._id_user = questions_posts.id_user) as user_second_name, 
        (select avatar_url from users where users._id_user = questions_posts.id_user) as user_avatar_url,
        (SELECT COUNT(*) FROM likes_q WHERE likes_q.id_questions = questions_posts._id_post) as question_likes_count,
        (SELECT date_like_create_q FROM likes_q WHERE id_user_u = ${req.user._id_user} AND id_questions = questions_posts._id_post LIMIT 1) as isLike         
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
        (SELECT COUNT(*) FROM likes_r WHERE likes_r.id_reply = reply_q._id_reply) as reply_likes_count,
        (SELECT date_like_create_r FROM likes_r WHERE id_user = ${req.user._id_user} AND id_reply = reply_q._id_reply LIMIT 1) as isLike    
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
        (SELECT COUNT(*) FROM likes_c WHERE likes_c.id_comment = comments_reply._id_comment) as comments_likes_count,
        (SELECT date_like_create_c FROM likes_c WHERE id_user = ${req.user._id_user} AND id_comment = comments_reply._id_comment LIMIT 1) as isLike          
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
    }
  }
)

module.exports = router
