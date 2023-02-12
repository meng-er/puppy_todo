

//函数们
const { app, getSession, log, succInfo, errInfo, dbQuery, reqAuth } = require('./main.js')

//中间件接收post
const bodyParser = require('body-parser')
app.use(bodyParser.json({}))

let session
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
app.post('/login', function (req, res) {
    const login = async (req, res) => {
        let tel = req.body.data.tel
        let psw = req.body.data.password
        if (tel && psw) {
            const resObj = await dbQuery('select password from users where tel=?', tel)
            if (resObj.error) {
                log(resObj.error)
                res.send(errInfo("数据库错误"))
                return
            }
            if (resObj.results.length != 1) {
                res.send(errInfo("账户不存在或账户不唯一", ''))
                return
            }
            if (resObj.results[0].password == psw) {
                session = getSession();
                const resObj = await dbQuery('update users set session=? where tel=?', [session, tel])
                if (resObj.error) {
                    log(resObj.error)
                    res.send(errInfo("数据库错误"))
                    return
                }
                // console.log(session)
                res.send(succInfo("登陆成功", session))
            } else {
                res.send(errInfo("密码错误"))
            };
        }
        else {
            res.send({ 'msg': "登陆表单信息不完整", 'code': 0 })
        }
    }
    login(req, res)
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
app.post('/register', (req, res) => {
    let tel = req.body.data.tel
    let psw = req.body.data.password
    // console.log(tel.length)
    if (tel.length != 11 || !psw) {
        res.send(errInfo("信息不完整"))
        return
    }
    const register = async (req, res) => {
        let resObj = await dbQuery('select * from users where tel=?', tel,)
        console.log(resObj.results.length)
        if (resObj.results.length != 0) {
            // console.log("h")
            res.send(errInfo("账户已存在"))
            return
        }
        resObj = await dbQuery('insert into users set tel=?,password=?,session=""', [tel, psw])
        if (resObj.error) {
            log(resObj.error)
            res.send(errInfo("数据库错误"))
            return
        }
        res.send(succInfo("注册成功"))
    }
    register(req, res)
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
app.post('/resetPwd', (req, res) => {
    if (tel.length != 11 || !req.body.originalPwd || !req.body.newPwd || !req.body.session) {
        res.send(errInfo("信息不完整"))
    }
    const resetPwd = async (req, res) => {
        await reqAuth(req, res)
        let resObj = await dbQuery('select password,session from users where tel=?', tel)
        if (resObj.results.length != 1) {
            res.send(errInfo("用户信息错误"))
        }
        if ((resObj.results[0].password) == req.body.originalPwd) {
            await dbQuery('update users set password=? where tel=?', [req.body.newPwd, tel])
            res.send(succInfo("修改密码成功"))
        } else {
            res.send(errInfo("旧密码输入错误"))
        };
    }
    resetPwd(req, res)
})
module.exports = { app }


