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
/*
检测req中的参数是否完整，paramList中是必须要求的参数。

抛出错误的情况：
-参数xx不存在:如果有任何一个参数
-（参数名）长度须为（num）:该参数的长度必须是特定的一个数

其余情况返回req.body


检测req中的参数是否完整，paramList中是必须要求的参数。如果paramList中的任何一个参数在req中不存在，就会抛出“XX参数不存在的错误”。外部调用程序可以捕获这个错误进行相应的处理。如果paramList中的参数需要符合一定的长度要求，可以通过“=”实现，具体方法是用“参数名=长度”的形式实现，例如paramList的值是[tel=11,password]，就表示req中必须要有tel和password两个参数，而且tel参数的长度必须为11，否则就会抛出“XX不存在”或“XX长度需为XX”的错误。

*/
function getParams(req, paramList) {
    // console.log("————————————调用getParams————————————")
    let params = req.body
    // console.log("params=")
    for (idx in paramList) {
        let paramArr = undefined
        // console.log(paramList[idx])
        if (paramList[idx].includes("=")) {
            paramArr = paramList[idx].split('=')
            console.log(params)
            if (!params.hasOwnProperty(paramArr[0])) {
                // console.log("不存在")

                throw `${paramArr[0]}不存在`
            }
            if (params[paramArr[0]].length != Number(paramArr[1])) {
                // console.log("=")
                throw `${paramArr[0]}长度须为${paramArr[1]}`
            }

        }
        if (paramList[idx].includes(">")) {
            paramArr = paramList[idx].split('>')
            // console.log("paramArr[0]=")
            // console.log(paramArr[0])
            if (!params.hasOwnProperty(paramArr[0])) {
                // console.log("不存在")
                throw `${paramArr[0]}不存在`
            }
            if (params[paramArr[0]].length <= Number(paramArr[1])) {
                // console.log(">")
                throw `${paramArr[0]}长度须大于${paramArr[1]}`
            }
        }
        if (!paramArr && !params.hasOwnProperty(paramList[idx])) {
            // console.log("不存在")
            throw `${paramArr[0]}不存在`
        }

    }
    // console.log("1")
    return params
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
            // console.log(error)
            if (error) {
                reject("数据库错误:" + error)
                return
            }
            // console.log(results)
            resolve({ error, results });
        })
    })
}

//session验证
function reqAuth(req, res) {
    return new Promise((resolve, reject) => {
        // console.log(req.body)

        dbQuery('select session from users where tel=?', req.body.tel)
            .then((res) => {
                // log(res)
                if (res.error) {
                    reject("数据库错误")
                    return
                }
                if (res.results.length == 0) {
                    reject("用户无效")
                    return
                }
                let sessionFront = req.body.session.split('_')
                let sessionDb = res.results[0].session.split('_')
                if (sessionFront[0] != sessionDb[0]) {
                    reject("session错误")
                    return
                }
                if (sessionFront[1] - sessionDb[1] >= 7200) {
                    reject("session过期")
                    return
                }
                resolve()
            })
    })
}


// async function reqAuth(req, res) {
//     const dbData = await dbQuery('select session from users where tel=?', req.body.tel)
//     // log(res)
//     if (dbData.error) {
//         res.send(errInfo("数据库错误:" + dbData.error))
//         return
//     }
//     if (dbData.results.length == 0) {
//         res.send(errInfo("用户无效"))
//         return
//     }
//     let sessionFront = req.body.session.split('_')
//     let sessionDb = dbData.results[0].session.split('_')
//     console.log(req.body.session)
//     console.log(sessionDb)
//     console.log(sessionFront)
//     if (sessionFront[0] != sessionDb[0]) {
//         res.send(errInfo("session错误"))
//         return

//     }
//     if (sessionFront[1] - sessionDb[1] >= 7200) {
//         res.send(errInfo("session过期"))
//         return
//     }
//     res.send(succInfo("session验证通过", ''))
//     return
// }



// async function reqAuth(req, res) {
//     const dbData = await dbQuery('select session from users where tel=?', req.body.tel)
//     // log(res)

//     if (dbData.error) {
//         res.send(errInfo("数据库错误:" + dbData.error))
//         return
//     }
//     if (dbData.results.length == 0) {
//         throw new Error("用户无效")
//         res.send(errInfo("用户无效"))
//         return
//     }
//     let sessionFront = req.body.session.split('_')
//     let sessionDb = dbData.results[0].session.split('_')
//     console.log(req.body.session)
//     console.log(sessionDb)
//     console.log(sessionFront)
//     if (sessionFront[0] != sessionDb[0]) {
//         throw new Error("session错误")
//         res.send(errInfo("session错误"))
//         return

//     }
//     if (sessionFront[1] - sessionDb[1] >= 7200) {
//         throw new Error("session过期")


//         res.send(errInfo("session过期"))
//         return
//     }
//     throw new Error("session通过")


//     res.send(succInfo("session验证通过", ''))
//     return

// }

function auth(req, res, callback) {
    // console.log("检查session")
    //log("auth-req",req);
    // req.body.session
    if (req.body.tel && req.body.session) {
        connection.query('select session from users where tel="' + req.body.tel + '";',
            function (error, results) {
                // log("auth-log-req")
                if (req.body.session - results[0].session <= 7200) {
                    console.log("session未过期")
                    callback();
                } else {
                    if (!req.body.session) {
                        console.log("前端无session（未登陆）")
                    } else {
                        console.log("session过期")
                        console.log("前端session:" + req.body.session)
                        console.log("后端session:" + results[0].session)
                    }
                }

            })
    } else {
        console.log("表单信息不完整")
    }
    return 0
}


module.exports = { app, getSession, log, succInfo, errInfo, dbQuery, reqAuth, getParams }