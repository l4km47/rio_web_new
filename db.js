const mysql = require("mysql");

// Database connection details
const db = mysql.createPool({
  host: "riocomputers.lk",
  user: "esporttournemts",
  password: "296fca8674",
  database: "esporttournemts",
});

// Connect to the database
/*db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL database");
});*/

// Helper function for executing MySQL queries
function executeQuery(query, params, callback) {
  db.query(query, params, (error, results, fields) => {
    if (error) {
      return callback(error);
    }
    callback(null, results, fields);
  });
}

module.exports = { db, executeQuery };
