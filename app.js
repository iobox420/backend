const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const config = require('./config')
const db = require('./db')

//Routers
const apiRouter = require('./routes/apiRouter')
const postRouter = require('./routes/postRouter')

const PORT = process.env.PORT || config.serverPort
const HOSTNAME = config.serverIp
const JWTStrategy = passportJWT.Strategy

const app = express()
app.use(passport.initialize())
app.use(cors())

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    (email, password, done) => {
      try {
        db.query(
          // prettier-ignore
          // Запрос к базе
          "SELECT `id`, `email`, `password` FROM `users` WHERE `email` = '" + email + "' AND `password` = '" + password +"'",
          (error, result, fields) => {
            if (error) {
              //Если ошибка то вывести ошибку
              console.log(error)
            } else {
              //Если ничего не нашел то результат запроса будет равняться массиву с нулевой длиной
              if (result.length === 0) {
                console.log('false')
                done(null, false)
              } else {
                //Если нашел, то первый элемент массивы, искомый юзер
                let user = result[0]
                console.log(user)
                done(null, user)
              }
            }
          }
        )
      } catch (e) {
        console.log(e)
      }
    }
  )
)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwt_secret',
    },
    (jwt_payload, done) => {
      console.log(jwt_payload.user._id)
      console.log(jwt_payload.user.email)
      /*      if (user.id === jwt_payload.user._id) {
        return done(null, user)
      } else {
        return done(null, false, {
          message: 'Token not matched',
        })
      }*/
      try {
        db.query(
          // prettier-ignore
          // Запрос к базе
          "SELECT `id`, `email`, `password` FROM `users` WHERE `id` = '" + jwt_payload.user._id + "' AND `email` = '" + jwt_payload.user.email +"'",
          (error, result, fields) => {
            if (error) {
              //Если ошибка то вывести ошибку
              console.log(error)
            } else {
              //Если ничего не нашел то результат запроса будет равняться массиву с нулевой длиной
              if (result.length === 0) {
                console.log('false')
                done(null, false)
              } else {
                //Если нашел, то первый элемент массивы, искомый юзер
                let user = result[0]
                console.log(user)
                done(null, user)
              }
            }
          }
        )
      } catch (e) {
        console.log(e)
      }
    }
  )
)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'client/build')))
app.use('/api', apiRouter)
app.use('/api', postRouter)

app.get('*', (req, res) => {
  return res.sendFile(path.join(__dirname, '/client/build/index.html'))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send(err.message)
})

app.listen(PORT, HOSTNAME, () =>
  console.log(`The server is running on port ${PORT} and hostname ${HOSTNAME}`)
)

function RDM(min = 1, max = 10000) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //Максимум не включается, минимум включается
}
function makeid(length) {
  let text = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  return text
}
function f_user_rdn_val() {
  for (let iw = 0; iw < 1000; iw++) {
    db.query(
      // prettier-ignore
      // Запрос к базе
      "INSERT INTO `users` (`_id_user`, `user_name`, `user_type`, `name`, `second_name`, `description`, `email`, `avatart_url`, `reg_date`) " +
            "VALUES (NULL, " +
            "'" + makeid(8) + "', " +
            "'" + 1 + "', " +
            "'" + makeid(8) + "', " +
            "'" + makeid(8) + "', " +
            "'" + makeid(25) + "', " +
            "'" + makeid(8) +"', " +
            "'" + makeid(8) + "', " +
            "FROM_UNIXTIME( UNIX_TIMESTAMP('2018-04-30 14:53:27') + FLOOR(0 + (RAND() * 63072000)) ));",
      (error, result, fields) => {
        if (error) {
          //Если ошибка то вывести ошибку
          console.log(error)
        } else {
          //Если ничего не нашел то результат запроса будет равняться массиву с нулевой длиной
          if (result.length === 0) {
            console.log('false', result)
          } else {
            console.log(iw)
          }
        }
      }
    )
  }
}

function f_questions_posts_rdn_val() {
  for (let iw = 0; iw < 4000; iw++) {
    db.query(
      // prettier-ignore
      // Запрос к базе
      "INSERT INTO `questions_posts` (`_id_post`, `id_user`, `heading`, `questions_text`, `date_create`) VALUES (NULL, '" + RDM(1, 999) + "', '" + makeid(20) + "','" + makeid(100) + "', FROM_UNIXTIME( UNIX_TIMESTAMP('2018-04-30 14:53:27') + FLOOR(0 + (RAND() * 63072000)) ))",
      (error, result, fields) => {
        if (error) {
          //Если ошибка то вывести ошибку
          console.log(error)
        } else {
          //Если ничего не нашел то результат запроса будет равняться массиву с нулевой длиной
          if (result.length === 0) {
            console.log('false', result)
          } else {
            console.log(iw)
          }
        }
      }
    )
  }
}
/*f_questions_posts_rdn_val()*/

function f_likes_questions_rdn_val() {
  for (let iw = 0; iw < 25000; iw++) {
    db.query(
      // prettier-ignore
      // Запрос к базе
      "INSERT INTO `likes_q` (`_id_like_q`, `id_user_u`, `id_questions`, `date_like_create_q`) VALUES (null, '" + RDM(1, 999) + "', '" + RDM(1, 999) + "', FROM_UNIXTIME( UNIX_TIMESTAMP('2018-04-30 14:53:27') + FLOOR(0 + (RAND() * 63072000)) ))",
      (error, result, fields) => {
        if (error) {
          //Если ошибка то вывести ошибку
          console.log(error)
        } else {
          //Если ничего не нашел то результат запроса будет равняться массиву с нулевой длиной
          if (result.length === 0) {
            console.log('false', result)
          } else {
            console.log(iw)
          }
        }
      }
    )
  }
}

/*f_likes_questions_rdn_val()*/

function f_reple_q_rdn_val() {
  for (let iw = 0; iw < 10000; iw++) {
    db.query(
      // prettier-ignore
      // Запрос к базе
      "INSERT INTO `reply_q` (`_id_reply`, `id_post`, `id_user`, `reply_text`, `reply_date_create`) " +
        "VALUES (NULL, '" + RDM(1, 3999) + "', '" + RDM(1, 999) + "', '" + makeid(100) + "', FROM_UNIXTIME( UNIX_TIMESTAMP('2018-04-30 14:53:27') + FLOOR(0 + (RAND() * 63072000)) ))",
      (error, result, fields) => {
        if (error) {
          //Если ошибка то вывести ошибку
          console.log(error)
        } else {
          //Если ничего не нашел то результат запроса будет равняться массиву с нулевой длиной
          if (result.length === 0) {
            console.log('false', result)
          } else {
            console.log(iw)
          }
        }
      }
    )
  }
}
/*f_reple_q_rdn_val()*/

function f_comments_reply_rdn_val() {
  for (let iw = 0; iw < 100000; iw++) {
    db.query(
      // prettier-ignore
      // Запрос к базе
      "INSERT INTO `comments_reply` (`_id_comment`, `id_reply`, `id_user`, `comment_text`, `comment_date_create`) " +
        "VALUES (NULL, '" + RDM(1, 9999) + "', '" + RDM(1, 999) + "', '" + makeid(100) + "', FROM_UNIXTIME( UNIX_TIMESTAMP('2018-04-30 14:53:27') + FLOOR(0 + (RAND() * 63072000)) ))",
      (error, result, fields) => {
        if (error) {
          //Если ошибка то вывести ошибку
          console.log(error)
        } else {
          //Если ничего не нашел то результат запроса будет равняться массиву с нулевой длиной
          if (result.length === 0) {
            console.log('false', result)
          } else {
            console.log(iw)
          }
        }
      }
    )
  }
}
function f_likes_c_rdn_val() {
  for (let iw = 0; iw < 10000; iw++) {
    db.query(
      // prettier-ignore
      // Запрос к базе
      "INSERT INTO `likes_c` (`_id_like_c`, `id_user`, `id_comment`, `date_like_create_c`) VALUES (NULL, '" + RDM(1, 999) + "', '" + RDM(1, 49999) + "', FROM_UNIXTIME( UNIX_TIMESTAMP('2018-04-30 14:53:27') + FLOOR(0 + (RAND() * 63072000)) ))",
      (error, result, fields) => {
        if (error) {
          //Если ошибка то вывести ошибку
          console.log(error)
        } else {
          //Если ничего не нашел то результат запроса будет равняться массиву с нулевой длиной
          if (result.length === 0) {
            console.log('false', result)
          } else {
            console.log(iw)
          }
        }
      }
    )
  }
}
/*f_likes_c_rdn_val()*/
function f_likes_r_rdn_val() {
  for (let iw = 0; iw < 10000; iw++) {
    db.query(
      // prettier-ignore
      // Запрос к базе
      "INSERT INTO `likes_r` (`_id_like_r`, `id_user`, `id_reply`, `date_like_create_r`) VALUES (NULL, '" + RDM(1, 999) + "', '" + RDM(1, 9999) + "', FROM_UNIXTIME( UNIX_TIMESTAMP('2018-04-30 14:53:27') + FLOOR(0 + (RAND() * 63072000)) ))",
      (error, result, fields) => {
        if (error) {
          //Если ошибка то вывести ошибку
          console.log(error)
        } else {
          //Если ничего не нашел то результат запроса будет равняться массиву с нулевой длиной
          if (result.length === 0) {
            console.log('false', result)
          } else {
            console.log(iw)
          }
        }
      }
    )
  }
}
/*f_likes_r_rdn_val()*/
