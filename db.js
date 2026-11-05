const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "food_ordering"
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed:", err.message);
        return;
    }

    console.log("Connected to Food Ordering Database!");
});

module.exports = db;