const mysql = require("mysql");
const bodyparser = require("body-parser");
const express = require("express");
const cors = require("cors");
const router = require("./routes/route");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.port || 5500;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));    
app.use(cors({
    origin: "http://127.0.0.1:5500"
}))

const poolconnection = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'user'
});

app.use('/api', router);

app.listen(port);