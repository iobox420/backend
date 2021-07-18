const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const router = express.Router()
const db = require('../db-pool')
const bcrypt = require('bcryptjs')

router.post('/signin', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.send('Wrong email or password')
    }
    req.login(user, () => {
      const body = {
        _id: user._id_user,
        user_name: user.user_name,
      }
      debugger
      const token = jwt.sign({ user: body }, 'jwt_secret')
      return res.json({
        user: user.user_name,
        avatarUrl: user.avatar_url,
        token: token,
      })
    })
  })(req, res, next)
})

router.post('/signup', (req, res, next) => {
  db.query(
    // prettier-ignore
    // Запрос к базе
    `SELECT _id_user, email, password FROM users WHERE user_name = '${req.body.userName}'`,
    (error, result, fields) => {
      if (error) {
        //Если ошибка то вывести ошибку
        console.log(error)
      }
      if (!error) {
        if (result.length != 0) {
          res.send(
            `Пользователь с таким именем пользователя - ${req.body.userName} уже зарегистрирован`
          )
        }
        //Если ничего не нашел то результат запроса будет равняться массиву с нулевой длиной
        if (result.length === 0) {
          // Не нашел пользователя, пишем логику обработки
          // prettier-ignore
          const salt = bcrypt.genSaltSync(3)
          const password = bcrypt.hashSync(req.body.password, salt)
          let sql =
            `INSERT INTO users(user_name, email, name, second_name, password)` +
            `VALUES('${req.body.userName}', '${req.body.email}', '${req.body.name}', '${req.body.secondName}', '${password}')`
          console.log(sql)
          db.query(sql, (error, result) => {
            if (error) {
              debugger
              res.send('db error')
            }
            if (!error) {
              res.send('Регистрация успешно завершена')
            }
          })
        }
      }
    }
  )
})

router.get(
  '/secret',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    if (!req.user) {
      res.json({
        username: 'nobody',
      })
    } else {
      res.json(req.user)
    }
  }
)

module.exports = router
