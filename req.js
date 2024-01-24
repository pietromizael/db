const express = require("express");
const cors = require("cors");
const app = express();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the users database.");

    db.run(
      "CREATE TABLE IF NOT EXISTS users (name TEXT, email TEXT, message TEXT)"
    ),
      (err) => {
        if (err) {
          console.error(err.message);
        }
      };
  }
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5174/contact",
    methods: ["GET", "POST"],
  })
);

app.post("/api/users", (req, res) => {
  const { name, email, message } = req.body;

  const stmt = db.prepare(
    "INSERT INTO users (name, email, message) VALUES (?, ?, ?)"
  );
  stmt.run([name, email, message]),
    (err) => {
      if (err) {
        return console.error(err.message);
      }

      console.log("User created");
    };

  stmt.finalize();

  res.send("User created");
});

app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    res.send(rows);
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
