const mysql = require("mysql");
const bodyparser = require("body-parser");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.port || 5000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors({
    origin: "http://127.0.0.1"
}))

const poolconnection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'question_db'
});

app.get('/getquestion/:id', (req, res) => {
    poolconnection.getConnection((err, connection) => {
        if (err) throw err;
        let sql = `SELECT question FROM question_table WHERE id = ${req.params.id}`;
        connection.query(sql, (err, rows) => {
            if (err) throw err;
            res.send(rows);
        })
    })
})

app.listen(port)