/* imports */
const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const formData = require("express-form-data");
const os = require("os");
const passport = require("passport");
// const expressValidator = require("express-validator");
// const helmet = require("helmet");
// const compression = require("compression");
// const mongoSessionStore = require("connect-mongo");
// const session = require("express-session");
const logger = require("morgan");

require("dotenv").config();
require("./services/passport");

/* ## vars and fx */
const DEV_DATABASE_URI = "mongodb://127.0.0.1:27017/some-app";
const DB_CONNECTED = "Congrats,The database is connected.";
const DB_CONNECTION_ERROR = "Database Connection Error: ";
const PRODUCTION = "production";
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== PRODUCTION;
const dbConnect = dev ? DEV_DATABASE_URI : process.env.MONGO_URI;
const app = next({ dev });
const handle = app.getRequestHandler();

/* DB Connection */
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
};

mongoose
  .connect(dbConnect, mongooseOptions)
  .then(() => console.log(DB_CONNECTED));

mongoose.connection.on("error", err => {
  console.log(`${DB_CONNECTION_ERROR} ${err.message}`);
});

/* Set up Express */
app.prepare().then(() => {
  const server = express();

  // if (!dev) {
  //   /* Helmet helps secure our app by setting various HTTP headers */
  //   server.use(helmet());
  //   /* Compression gives us gzip compression */
  //   server.use(compression());
  // }

  server.use(express.json());
  //server.use(expressValidator());

  // /* used to format data from forms */
  const formDataOptions = {
    uploadDir: os.tmpdir(),
    autoClean: true
  };
  server.use(formData.parse(formDataOptions));
  server.use(formData.format());
  server.use(formData.stream());
  server.use(formData.union());

  /* give all Next.js's requests to Next.js server */
  server.get("/_next/*", (req, res) => {
    handle(req, res);
  });

  server.get("/static/*", (req, res) => {
    handle(req, res);
  });

  // const MongoStore = mongoSessionStore(session);
  // const sessionConfig = {
  //   name: "next-connect.sid",
  //   // secret used for using signed cookies w/ the session
  //   secret: process.env.SESSION_SECRET,
  //   store: new MongoStore({
  //     mongooseConnection: mongoose.connection,
  //     ttl: 14 * 24 * 60 * 60 // save session for 14 days
  //   }),
  //   // forces the session to be saved back to the store
  //   resave: false,
  //   // don't save unmodified sessions
  //   saveUninitialized: false,
  //   cookie: {
  //     httpOnly: true,
  //     maxAge: 1000 * 60 * 60 * 24 * 14 // expires in 14 days
  //   }
  // };

  // if (!dev) {
  //   sessionConfig.cookie.secure = true; // serve secure cookies in production environment
  //   server.set("trust proxy", 1); // trust first proxy
  // }

  // /* Apply our session configuration to express-session */
  // server.use(session(sessionConfig));

  // /* Add passport middleware to set passport up */
  // server.use(passport.initialize());
  // server.use(passport.session());

  server.use((req, res, next) => {
    /* custom middleware to put our user data (from passport) on the req.user so we can access it as such anywhere in our app */
    res.locals.user = req.user || null;
    next();
  });

  /* morgan for request logging from client
  - we use skip to ignore static files from _next folder */
  server.use(
    logger("dev", {
      skip: req => req.url.includes("_next")
    })
  );

  /* #### require routes */
  require("./routes/auth")(server);
  require("./routes/profile")(server);

  /* Error handling from async / await functions */
  server.use((err, req, res, next) => {
    const { status = 500, message } = err;
    res.status(status).json(message);
  });

  /* ## Example of custom route change display in url */
  server.get("/route/:userId", (req, res) => {
    const routeParams = Object.assign({}, req.params, req.query);
    return app.render(req, res, "/route", routeParams);
  });

  /* must have catchall route */
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> listening on port: ${port}`);
  });
});
