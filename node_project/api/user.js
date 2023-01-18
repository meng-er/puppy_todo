const express = require("express");
var mysql = require('mysql')
const app = express();
var session;

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'gymA20000925',
    database: 'node_project'
})
connection.connect();

function getSession() {
    var session = ""
    for (var i = 0; i < 16; i++) {
        var num = Math.floor(Math.random() * 10)
        session = session + (num + "")
    }
    session = session + Date.now()
    // console.log(session)
    return session
}
log(tag, msg){

}
function auth(req, res, callback) {
    console.log("检查session")
    //log("auth-req",req);

    // req.query.session
    connection.query('select session from users where tel="' + req.query.tel + '";',
        function (error, results) {
            // log("auth-log-req")
            if (req.query.session - results[0].session <= 7200) {
                console.log("session未过期")
                callback(req, res);
            } else {
                console.log("session过期")
            }

        })

    return 0
}

app.get('/login', (req, res) => {

    console.log("收到登陆请求")
    if (req.query.tel && req.query.password) {

        connection.query('select password from users where tel=' + req.query.tel + ';', function (error, results) {
            if (error) throw error;
            if ((results[0].password) == req.query.password) {
                console.log('登陆密码正确')
                session = getSession();
                // console.log(session);
                var sqlstr = 'update users set session="' + session + '" where tel="' + req.query.tel + '"'
                // console.log(sqlstr)
                connection.query(sqlstr, function (error, results) {
                    if (error) throw error;
                    res.send({ 'msg': "登录成功", 'code': '1', 'session': session })
                    console.log("登陆成功")
                });
            } else {
                res.send({ 'msg': "密码错误", 'code': '-1', 'session': '' })
            };
        });
    }
    else {
        res.send("表单不完整")
    }
})

app.get('/register', (req, res) => {
    console.log("收到注册请求")
    if (req.query.tel && req.query.password) {
        connection.query('select * from users where tel=' + req.query.tel + ';',
            function (error, results) {

                if (error) throw error;
                // console.log(results[0])
                if (results[0]) { res.send("账户已存在") }
                else {
                    connection.query('insert into users set tel=' + req.query.tel + ',password=' + req.query.password + ';', function (error, results) {
                        if (results.affectedRows == 1) {
                            res.send("注册成功")
                        }
                    })
                }
            })
    } else {
        res.send("信息不完整")
    }
})

app.get('/resetPwd', (req, res) => {
    console.log("收到修改密码请求")
    // console.log(req.query)
    auth(req, res, function (req, res) {

        if (req.query.tel && req.query.originalPwd && req.query.newPwd && req.query.session) {
            // console.log("req.query=")

            connection.query('select password,session from users where tel=' + req.query.tel + ';', function (error, results) {
                if (error) throw error;

                if ((results[0].password) == req.query.originalPwd) {
                    console.log('修改密码-旧密码输入正确')
                    connection.query('update users set password="' + req.query.newPwd + '" where tel="' + req.query.tel + '";', function (error, results) {
                        if (error) throw error;
                        // console.log(results);
                        res.send("修改密码-成功")
                        console.log("修改密码-成功")
                    });
                } else {
                    // console.log("dfccashf")
                    res.send("旧密码输入错误")
                };
            })
        }
        else {
            res.send("表单信息不完整")
        }

    })

})
// connection.end();
app.listen(8080, () => {
    console.log("服务器开始运行")
})                                                        
