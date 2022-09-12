const router = require('express').Router();
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const poolconnection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'user'
});

router.post('/register',async (req,res)=>{
    const salt=await bcrypt.genSalt(10);
    const hashpassword=await bcrypt.hash(req.body.password, salt);
    const uid = uuidv4();
    var user = {
        'id':`${uid}`,
        'name':`${req.body.name}`,
        'email':`${req.body.email}`,
        'password':`${hashpassword}`
    };
    poolconnection.getConnection((err, connection) => {
        if (err) throw err;
        let sql = `INSERT INTO user_table (id, name, email, password) VALUES ("${user.id}","${user.name}","${user.email}","${user.password}")`;
        connection.query(sql, (err, rows) => {
            if (err) throw err;
            res.send(rows);
        })
    })
});

router.post('/login', async function(req,res) {
    poolconnection.getConnection((err, connection) => {
        if (err) throw err;
        let sql = `SELECT * FROM user_table WHERE email = '${req.body.email}'`
        connection.query(sql, function (err, rows) {
            if (err) throw err;
            if (rows == 0) return res.status(404).send({
                'message': 'user not found'
            });
            else {
                bcrypt.compare(req.body.password, rows[0].password,function (err,result) {
                    if(err) throw err;
                    if(result) {
                        return res.status(200).send({
                            'username':`${rows[0].name}`,
                            'email':`${rows[0].email}`
                        });
                    }
                    else res.status(404).send({
                        'message':'wrong password'
                    }) 
                });
            }
        })
    })
})

module.exports = router;