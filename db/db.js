const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  password: "",
  user: "root",
  database: "node_project",
  host: "localhost",
  port: 3306,
});
let db = {};
db.getUser = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users WHERE id= ?", [id], (error, user) => {
      if (error) {
        return reject(error);
      }
      return resolve(user[0]);
    });
  });
};
db.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (error, users) => {
        if (error) {
          return reject(error);
        }
        return resolve(users[0]);
      }
    );
  });
};
db.insertUser = (email, password, token, active) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO users (email, passwor,token,active) VALUES ( ?, ?,?,?)",
      [email, password, token, active],
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result.insertId);
      }
    );
  });
};
module.exports = db;
