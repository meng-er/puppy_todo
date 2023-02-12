//express
const express = require("express");
const app = express();

//中间件
const bodyParser = require('body-parser')
app.use(bodyParser.json({}))


//连数据库
var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'gymA20000925',
    database: 'node_project'
})
connection.connect();

function getSession() {
    var session = Math.trunc(Math.random() * Math.pow(10, 16)) + ''
    session = session + '_' + Date.now()
    // console.log(session)
    return session
}

function sql(req, res, sqlstr, callback) {
    // console.log(callback)
    connection.query(sqlstr, function (error, results) {
        if (error) {
            res.send({ 'msg': '数据库错误', 'code': '0' })
            console.log(error)
            return
        } else {
            callback(results)
        }
    })
    return
}

function log(msg) {
    console.log(msg)
}

function succInfo(msg, data) {
    return { 'code': 1, msg, data }
}

function errInfo(msg) {
    return { 'code': 0, msg }
}

//数据库查询
function dbQuery(sqlstr, params) {
    // log(sqlstr + ',' + params)
    return new Promise((resolve, reject) => {
        connection.query(sqlstr, params, (error, results) => {
            // log(error + ',resultes=' + results)
            resolve({ error, results });
        })
    })
}

//session验证
function reqAuth(req, res) {
    // log('reqAuth')
    // console.log(req.body.data.session)
    return new Promise((resolve, reject) => {
        console.log(req.body)
        if (!req.body.data.tel || !req.body.data.session) {
            resolve(errInfo("表单信息不完整"))
        }
        dbQuery('select session from users where tel=?', req.body.data.tel)
            .then((res) => {
                // log(res)
                if (res.error) {
                    res.send(errInfo("数据库错误:" + res.error))
                }
                if (res.results.length == 0) {
                    res.send(errInfo("用户无效"))
                }
                let sessionFront = req.body.data.session.split('_')
                let sessionDb = res.results[0].session.split('_')
                if (sessionFront[0] != sessionDb[0]) {
                    res.send(errInfo("session错误"))
                }
                if (sessionFront[1] - sessionDb[1] >= 7200) {
                    res.send(errInfo("session过期"))
                }
                resolve(succInfo("session验证通过", ''))
            })
    })
}

function auth(req, res, callback) {
    // console.log("检查session")
    //log("auth-req",req);
    // req.body.data.session
    if (req.body.data.tel && req.body.data.session) {
        connection.query('select session from users where tel="' + req.body.data.tel + '";',
            function (error, results) {
                // log("auth-log-req")
                if (req.body.data.session - results[0].session <= 7200) {
                    console.log("session未过期")
                    callback();
                } else {
                    if (!req.body.data.session) {
                        console.log("前端无session（未登陆）")
                    } else {
                        console.log("session过期")
                        console.log("前端session:" + req.body.data.session)
                        console.log("后端session:" + results[0].session)
                    }
                }

            })
    } else {
        console.log("表单信息不完整")
    }
    return 0
}


module.exports = { app, getSession, log, succInfo, errInfo, dbQuery, reqAuth }