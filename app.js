
const express = require("express");
const db = require("./db");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// INSERT FOOD
app.post("/foods", (req, res) => {
    const { food_name, category, price, description } = req.body;

    if (
        !food_name ||
        !category ||
        price === undefined ||
        price === ""
    ) {
        return res.status(400).send(
            "Please enter food name, category and price."
        );
    }

    const sql = `
        INSERT INTO foods
        (food_name, category, price, description, available)
        VALUES (?, ?, ?, ?, 1)
    `;

    db.query(
        sql,
        [food_name, category, price, description || null],
        (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            res.send(
                "Food Item Inserted Successfully. ID: " +
                result.insertId
            );
        }
    );
});

// LIST ALL FOODS
app.get("/foods", (req, res) => {
    db.query(
        "SELECT * FROM foods ORDER BY food_id",
        (err, results) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            res.json(results);
        }
    );
});

// LIST ONE FOOD
app.get("/foods/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        "SELECT * FROM foods WHERE food_id = ?",
        [id],
        (err, results) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            if (results.length === 0) {
                return res.status(404).send("Food Item Not Found");
            }

            res.json(results[0]);
        }
    );
});

// UPDATE FOOD
app.put("/foods/:id", (req, res) => {
    const id = req.params.id;
    const { food_name, category, price, description, available } = req.body;

    if (
        !food_name ||
        !category ||
        price === undefined ||
        price === ""
    ) {
        return res.status(400).send(
            "Please enter food name, category and price."
        );
    }

    const sql = `
        UPDATE foods
        SET food_name = ?,
            category = ?,
            price = ?,
            description = ?,
            available = ?
        WHERE food_id = ?
    `;

    db.query(
        sql,
        [
            food_name,
            category,
            price,
            description || null,
            available === undefined ? 1 : available,
            id
        ],
        (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Food Item Not Found");
            }

            res.send("Food Item Updated Successfully");
        }
    );
});

// DELETE FOOD
app.delete("/foods/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        "DELETE FROM foods WHERE food_id = ?",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Food Item Not Found");
            }

            res.send("Food Item Deleted Successfully");
        }
    );
});

// START SERVER
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
