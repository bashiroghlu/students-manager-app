const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("uncaughtException");

  console.log(err.name, err.message);

  process.exit();
});

const app = require("./app");

dotenv.config({ path: "./config.env" });

// const DB = process.env.DB_CONNECTION || "mongodb://localhost:27017/student-app";
const DB = process.env.DB_CONNECTION.replace(
  "<password>",
  process.env.DB_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected to DB");
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log("Student manager app running");
});

process.on("unhandledRejection", (err) => {
  console.log("uncaughtException");

  console.log(err.name, err.message);

  server.close(() => {
    process.exit();
  });
});
