/* ## change Dev database name */
const DEV_DATABASE_URI = "mongodb://127.0.0.1:27017/some-app";
const DB_CONNECTED = "Congrats,The database is connected.";
const DB_CONNECTION_ERROR = "Database Connection Error: ";

require("dotenv").config();
const express = require("express");
const expressValidator = require("express-validator");
const formData = require("express-form-data");
const os = require("os");
const mongoose = require("mongoose");
const next = require("next");

/* ## import Routes Here */
const xxxRoutes = require("./routes/xxxRoutes");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const dbConnect = dev ? DEV_DATABASE_URI : process.env.MONGO_URI;
const app = next({ dev });
const handle = app.getRequestHandler();

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

const formDataOptions = {
  uploadDir: os.tmpdir(),
  autoClean: true
};

app.prepare().then(() => {
  const server = express();

  server.use(express.json());

  /* used to format data from forms */
  server.use(formData.parse(formDataOptions));
  server.use(formData.format());
  server.use(formData.stream());
  server.use(formData.union());

  /* ## Add the routes */
  server.use("/api/xxx", xxxRoutes);

  /* ## Example of Other routes if needed */
  server.get("/route/:id", (req, res) => {
    app.render(req, res, "/route");
  });

  server.get("/route/:cat", (req, res) => {
    app.render(req, res, "/route");
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
