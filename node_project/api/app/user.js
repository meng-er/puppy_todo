

//函数们
const { app, getSession, log, succInfo, errInfo, dbQuery, getParams } = require('./main.js')

//中间件接收post
const bodyParser = require('body-parser')
app.use(bodyParser.json({}))




let session = ''
/*
输入：
params: {
    tel: '13388110101',
    password: '123'
}
输出：
{ 'msg': "登录成功", 'code': '1', 'data': session }

{ 'msg': "密码错误", 'code': '0 }
{ 'msg': "登录表单信息不完整", 'code': '0'}
{ 'msg': "账户不存在或账户不唯一", 'code': '0'}
{ 'msg': "数据库错误", 'code': '0'}
*/
app.post('/login', function (req, res) {
    try {
        // throw "01"
        const params = getParams(req, ['tel=11', 'password'])
        // console.log(params)
        const login = async (req, res) => {
            const dbData = await dbQuery('select password from users where tel=?', params.tel)
            if (dbData.error) {
                log(dbData.error)
                res.send(errInfo("数据库错误"))
                return
            }
            if (dbData.results.length != 1) {
                res.send(errInfo("账户不存在或账户不唯一", ''))
                return
            }
          
            if (dbData.results[0].password == params.password) {
                session = getSession();
                const dbData = await dbQuery('update users set session=? where tel=?', [session, params.tel])
                if (dbData.error) {
                    log(dbData.error)
                    res.send(errInfo("数据库错误"))
                    return
                }
               
                res.send(succInfo("登录成功", session))
            } else {
                res.send(errInfo("密码错误"))
            };

        }
        login(req, res)
    } catch (err) {
        // console.log("2")
        // console.log(err)
        res.send(errInfo(err))
    }
})

/*
输入
params: {
        tel: '13308110101',

    }
输出
{ 'msg': "账户已存在", 'code': '0' }
{ 'msg': "数据库错误", 'code': '0' }
{ 'msg': "注册成功", 'code': '1' ,'data':''}
*/

app.post('/register', (req, res) => {
    try {
        const params = getParams(req, ['tel=11', 'password>5'])
        const register = async (req, res) => {
            let dbData = await dbQuery('select * from users where tel=?', params.tel)
            // console.log(dbData.results.length)
            if (dbData.results.length != 0) {
                res.send(errInfo("账户已存在"))
                return

            }
            dbData = await dbQuery('insert into users set tel=?,password=?,session=""', [params.tel, params.password])
            if (dbData.error) {
                res.send(errInfo("数据库错误"))
                return
            }
            res.send(succInfo("注册成功"))
        }
        register(req, res)
    } catch (err) {
        // console.log(err)
        res.send(errInfo(err))
    }
})

/*
输入：
params: {
            tel: '13388110101',
            oldPassword: '123',
            newPassword: '000000',
        }
输出
{ 'msg': "修改密码成功", 'code': '1','data':'' }

{ 'msg': "旧密码输入错误", 'code': '0' }
{ 'msg': "重置密码信息不完整", 'code': '0' }
{ 'msg': "用户信息错误", 'code': '0' }
*/
app.post('/resetPassword', (req, res) => {
    const params = getParams(req)
    if (params.tel.length != 11 || !params.oldPassword || !params.newPassword) {
        res.send(errInfo("重置密码信息不完整"))
        return
    }
    const resetPassword = async (req, res) => {
        let dbData = await dbQuery('select password,session from users where tel=?', params.tel)
        if (dbData.results.length != 1) {
            res.send(errInfo("用户信息错误"))
            return

        }
        if ((dbData.results[0].password) == params.oldPassword) {
            await dbQuery('update users set password=? where tel=?', [params.newPassword, params.tel])
            res.send(succInfo("修改密码成功", ''))
        } else {
            res.send(errInfo("旧密码输入错误"))

        };
    }
    resetPassword(req, res)
})
module.exports = { app }


