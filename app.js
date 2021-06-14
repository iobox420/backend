const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportJWT = require("passport-jwt");
const config = require("./config");
const db = require("./db");

//Routers
const apiRouter = require("./routes/apiRouter");
const postRouter = require("./routes/postRouter");

const PORT = process.env.PORT || config.serverPort;
const HOSTNAME = config.serverIp;
const JWTStrategy = passportJWT.Strategy;

const app = express();
app.use(passport.initialize());
app.use(cors());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
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
              console.log(error);
            } else {
              //Если ничего не нашел то результат запроса будет равняться массиву с нулевой длиной
              if (result.length === 0) {
                console.log("false");
                done(null, false);
              } else {
                //Если нашел, то первый элемент массивы, искомый юзер
                let user = result[0];
                console.log(user);
                done(null, user);
              }
            }
          }
        );
      } catch (e) {
        console.log(e);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "jwt_secret",
    },
    (jwt_payload, done) => {
      console.log(jwt_payload.user._id);
      console.log(jwt_payload.user.email);
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
              console.log(error);
            } else {
              //Если ничего не нашел то результат запроса будет равняться массиву с нулевой длиной
              if (result.length === 0) {
                console.log("false");
                done(null, false);
              } else {
                //Если нашел, то первый элемент массивы, искомый юзер
                let user = result[0];
                console.log(user);
                done(null, user);
              }
            }
          }
        );
      } catch (e) {
        console.log(e);
      }
    }
  )
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "client/build")));
app.use("/api", apiRouter);
app.use("/api", postRouter);

app.get("*", (req, res) => {
  /*return res.sendFile(path.join(__dirname, "/client/build/index.html"));*/
  return "Server has been started";
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(PORT, HOSTNAME, () =>
  console.log(`The server is running on port ${PORT} and hostname ${HOSTNAME}`)
);
