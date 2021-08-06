const express = require('express')
const router = express.Router()
const db = require('../db-pool')
const passport = require('passport')

//Сортировка вопросов по дате создания с отдельным подсчетом лайков с самым свежим ответом
// add reply on question
router.post(
  '/questions/questions_posts/add/:question/:text',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user) {
      res.json({
        message: 'you are not authentificated',
      })
    } else {
      console.log('BODY = ', req.body) //Вот тут пусто

      let sql = `INSERT INTO reply_q (_id_reply, id_post, id_user, reply_text, reply_date_create) VALUES (NULL, '${req.params['question']}', '${req.user._id_user}', '${req.params['text']}', current_timestamp())`
      console.log(sql)
      db.query(sql, (error, result, fields) => {
        try {
          if (error) {
            console.log(error)
          } else {
            debugger
            res.json({
              message: 'insert has been completed',
              data: result,
              user: req.user,
            })
            /*console.log(result)*/
          }
        } catch (e) {
          console.log(e)
        }
      })

      /*      res.json({
          data: req.user,
          message: 'your are authentificated',
        })*/
    }
  }
)

// add comment on reply
router.post(
  '/questions/questions_posts/add_comment_on_reply/:comment/:text',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user) {
      res.json({
        message: 'you are not authentificated',
      })
    } else {
      console.log('BODY = ', req.body) //Вот тут пусто
      let sql = `INSERT INTO comments_reply (_id_comment, id_reply, id_user, comment_text, comment_date_create) VALUES (NULL, '${req.params['comment']}', '${req.user._id_user}', '${req.params['text']}', current_timestamp())`

      console.log(sql)
      db.query(sql, (error, result, fields) => {
        try {
          if (error) {
            console.log(error)
          } else {
            debugger
            res.json({
              message: 'insert has been completed',
              data: result,
              user: req.user,
            })
            /*console.log(result)*/
          }
        } catch (e) {
          console.log(e)
        }
      })
    }
  }
)

//лайки
router.post(
  '/questions/questions_posts/like/question/:question',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user) {
      res.json({
        message: 'you are not authentificated',
      })
    } else {
      console.log('BODY = ', req.body) //Вот тут пусто когда отправляешь запрос с фронтенда
      let sql = `INSERT INTO likes_q (_id_like_q, id_user_u, id_questions, date_like_create_q) 
      VALUES (NULL, '${req.user._id_user}', '${req.params['question']}', current_timestamp())`
      console.log(sql)
      db.query(sql, (error, result, fields) => {
        try {
          if (error) {
            console.log(error)
          } else {
            debugger
            res.json({
              message: 'like has been completed',
              data: result,
              user: req.user,
            })
            /*console.log(result)*/
          }
        } catch (e) {
          console.log(e)
        }
      })

      /*      res.json({
            data: req.user,
            message: 'your are authentificated',
          })*/
    }
  }
)

router.post(
  '/questions/questions_posts/like/reply/:reply',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user) {
      res.json({
        message: 'you are not authentificated',
      })
    } else {
      console.log('BODY = ', req.body) //Вот тут пусто когда отправляешь запрос с фронтенда
      let sql = `INSERT INTO likes_r (_id_like_r, id_user, id_reply, date_like_create_r) 
        VALUES (NULL, '${req.user._id_user}', '${req.params['reply']}', current_timestamp())`

      console.log(sql)
      db.query(sql, (error, result, fields) => {
        try {
          if (error) {
            console.log(error)
          } else {
            debugger
            res.json({
              message: 'like has been completed',
              data: result,
              user: req.user,
            })
            /*console.log(result)*/
          }
        } catch (e) {
          console.log(e)
        }
      })
    }
  }
)

router.post(
  '/questions/questions_posts/removelike/reply/:reply',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user) {
      res.json({
        message: 'you are not authentificated',
      })
    } else {
      console.log('BODY = ', req.body) //Вот тут пусто когда отправляешь запрос с фронтенда
      let sql = `SELECT _id_like_r FROM likes_r WHERE id_user = ${req.user._id_user} LIMIT 1`
      /*let sqlDel = `"DELETE FROM likes_r WHERE likes_r._id_like_r = 1`*/

      console.log(sql)
      db.query(sql, (error, result, fields) => {
        try {
          if (error) {
            console.log(error)
          } else {
            /*Если есть результат запроса, то далее уже удаляем из базы лайк*/

            db.query(
              `DELETE FROM likes_r WHERE likes_r._id_like_r = ${result[0]._id_like_r}`,
              (error, result, fields) => {
                try {
                  if (error) {
                    console.log(error)
                  } else {
                    res.json({
                      message: 'like has been removed',
                      data: result,
                      user: req.user,
                    })
                  }
                } catch (e) {
                  console.log(e)
                }
              }
            )
          }
        } catch (e) {
          console.log(e)
        }
      })
    }
  }
)

router.post(
  '/questions/questions_posts/removelike/question/:reply',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user) {
      res.json({
        message: 'you are not authentificated',
      })
    } else {
      console.log('BODY = ', req.body) //Вот тут пусто когда отправляешь запрос с фронтенда
      let sql = `SELECT _id_like_q FROM likes_q WHERE id_user_u = ${req.user._id_user} LIMIT 1`
      /*let sqlDel = `"DELETE FROM likes_r WHERE likes_r._id_like_r = 1`*/

      console.log(sql)
      db.query(sql, (error, result, fields) => {
        try {
          if (error) {
            console.log(error)
          } else {
            /*Если есть результат запроса, то далее уже удаляем из базы лайк*/

            db.query(
              `DELETE FROM likes_q WHERE likes_q._id_like_q = ${result[0]._id_like_q}`,
              (error, result, fields) => {
                try {
                  if (error) {
                    console.log(error)
                  } else {
                    res.json({
                      message: 'like has been removed',
                      data: result,
                      user: req.user,
                    })
                  }
                } catch (e) {
                  console.log(e)
                }
              }
            )
          }
        } catch (e) {
          console.log(e)
        }
      })
    }
  }
)

router.post(
  '/questions/questions_posts/like/comment/:comment',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user) {
      res.json({
        message: 'you are not authentificated',
      })
    } else {
      let sql = `INSERT INTO likes_c (_id_like_c, id_user, id_comment, date_like_create_c) 
        VALUES (NULL, '${req.user._id_user}', '${req.params['comment']}', current_timestamp())`
      db.query(sql, (error, result, fields) => {
        try {
          if (error) {
            console.log(error)
          } else {
            debugger
            res.json({
              message: 'like has been completed',
              data: result,
              user: req.user,
            })
            /*console.log(result)*/
          }
        } catch (e) {
          console.log(e)
        }
      })
    }
  }
)
router.post(
  '/questions/questions_posts/removelike/comment/:comment',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user) {
      res.json({
        message: 'you are not authentificated',
      })
    } else {
      console.log('BODY = ', req.body) //Вот тут пусто когда отправляешь запрос с фронтенда
      let sql = `SELECT _id_like_c FROM likes_c WHERE id_user = ${req.user._id_user} LIMIT 1`
      /*let sqlDel = `"DELETE FROM likes_r WHERE likes_r._id_like_r = 1`*/

      console.log(sql)
      db.query(sql, (error, result, fields) => {
        try {
          if (error) {
            console.log(error)
          } else {
            /*Если есть результат запроса, то далее уже удаляем из базы лайк*/

            db.query(
              `DELETE FROM likes_c WHERE likes_c._id_like_c = ${result[0]._id_like_c}`,
              (error, result, fields) => {
                try {
                  if (error) {
                    console.log(error)
                  } else {
                    res.json({
                      message: 'like has been removed',
                      data: result,
                      user: req.user,
                    })
                  }
                } catch (e) {
                  console.log(e)
                }
              }
            )
          }
        } catch (e) {
          console.log(e)
        }
      })
    }
  }
)
module.exports = router
