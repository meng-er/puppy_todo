//server
const express = require("express");
var mysql = require('mysql')
const app = express();
var session


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'gymA20000925',
    database: 'node_project'
})
connection.connect();

function getSession() {
    var session = Math.trunc(Math.random() * Math.pow(10, 16)) + ''
    session = session + Date.now()
    // console.log(session)
    return session
}


// getSession();
function sql(req, res, sqlstr, callback) {
    // console.log(callback)
    connection.query(sqlstr, function (error, results) {
        if (error) {
            return error
        } else {
            // console.log("jaj")
            // console.log(callback)
            callback(results)
        }
    })
    return
}

function auth(req, res, callback) {
    // console.log("检查session")
    //log("auth-req",req);
    // req.query.session
    if (req.query.tel && req.query.session) {
        connection.query('select session from users where tel="' + req.query.tel + '";',
            function (error, results) {
                // log("auth-log-req")
                if (req.query.session - results[0].session <= 7200) {
                    console.log("session未过期")
                    callback();
                } else {
                    if (!req.query.session) {
                        console.log("前端无session（未登陆）")
                    } else {
                        console.log("session过期")
                        console.log("前端session:" + req.query.session)
                        console.log("后端session:" + results[0].session)
                    }
                }

            })
    } else {
        console.log("表单信息不完整")
    }
    return 0
}
/*
输入：
params: {
    tel: '13388110101',
    password: '123'
}
输出：
{ 'msg': "登录成功", 'code': '1', 'session': session }
{ 'msg': "密码错误", 'code': '-1', 'session': '' }
{ 'msg': "表单信息不完整", 'code': '-1', 'session': '' }
*/
app.get('/login', (req, res) => {
    // console.log("收到登陆请求")
    if (req.query.tel && req.query.password) {
        connection.query('select password from users where tel=' + req.query.tel + ';', function (error, results) {
            if (error) throw error;
            if ((results[0].password) == req.query.password) {
                // console.log('登陆密码正确')
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
                res.send({ 'msg': "密码错误", 'code': '0', 'session': '' })
            };
        });
    }
    else {
        res.send({ 'msg': "表单信息不完整", 'code': '0', 'session': '' })
    }

})

/*
输入
params: {
        tel: '13308110101',
        password: '123'
    }
输出
{ 'msg': "信息不完整", 'code': '0' }
{ 'msg': "账户已存在", 'code': '0' }
{ 'msg': "注册成功", 'code': '1' }
*/
app.get('/register', (req, res) => {
    console.log("收到注册请求")
    if (req.query.tel && req.query.password) {
        connection.query('select * from users where tel=' + req.query.tel + ';',
            function (error, results) {

                if (error) throw error;
                // console.log(results[0])
                if (results[0]) { res.send({ 'msg': "账户已存在", 'code': '0' }) }
                else {
                    connection.query('insert into users set tel=' + req.query.tel + ',password=' + req.query.password + ';', function (error, results) {
                        if (results.affectedRows == 1) {
                            res.send({ 'msg': "注册成功", 'code': '1' })
                        }
                    })
                }
            })
    } else {
        res.send({ 'msg': "信息不完整", 'code': '0' })
    }
})

/*
输入：
params: {
            tel: '13388110101',
            originalPwd: '123',
            newPwd: '000000',
            session: session+''
        }
输出
{ 'msg': "修改密码成功", 'code': '1' }
{ 'msg': "旧密码输入错误", 'code': '0' }
{ 'msg': "信息不完整", 'code': '0' }
*/
app.get('/resetPwd', (req, res) => {
    // console.log("收到修改密码请求")
    // console.log(req.query)
    auth(req, res, function () {
        if (req.query.tel && req.query.originalPwd && req.query.newPwd && req.query.session) {
            // console.log("req.query=")
            connection.query('select password,session from users where tel=' + req.query.tel + ';', function (error, results) {
                if (error) throw error;

                if ((results[0].password) == req.query.originalPwd) {
                    // console.log('修改密码-旧密码输入正确')
                    connection.query('update users set password="' + req.query.newPwd + '" where tel="' + req.query.tel + '";', function (error, results) {
                        if (error) throw error;
                        // console.log(results);
                        res.send({ 'msg': "修改密码成功", 'code': '1' })
                        // console.log("修改密码-成功")
                    });
                } else {
                    // console.log("dfccashf")
                    res.send({ 'msg': "旧密码输入错误", 'code': '0' })
                };
            })
        }
        else {
            res.send({ 'msg': "信息不完整", 'code': '0' })
        }

    })

})
// connection.end();
module.exports = { app, connection, auth, sql }
// module.exports = connection


