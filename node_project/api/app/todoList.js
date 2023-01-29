var user = require('../user.js')
var connection = user.connection
var auth = user.auth
var sql = user.sql
var app = user.app

function category_parent_check(req, res, tel, parent_id, callback) {
    //验证类别的parent是否存在
    //用到情况：/category/new，category/modify
    var parent_alive//父类是否存在，结果，bool
    if (parent_id != -1) {
        //有parent_id->判断是否有效
        var sqlstr = 'select * from category where tel="' + tel + '" and class_id="' + parent_id + '"'
        sql(req, res, sqlstr, function ( results) {
            if (results.length == 0) {
                //parent_id无效
                parent_alive = false
                callback(req, res, parent_alive)
            }
            else {
                //parent_id有效->新增分类
                parent_alive = true
                callback(req, res, parent_alive)
            }
        })
    } else {
        //parent_id=-1
        parent_alive = true
        callback(req, res, parent_alive)
    }
}

function category_new(req, res, callback) {
    var class_id
    var sqlstr = 'select * from category where tel="' + req.query.tel + '" and class_name="' + req.query.class_name + '"'
    // console.log(sql)
    sql(req, res, sqlstr, function (results) {
        // console.log('是否存在相同的类')
        if (results.length == 0) {
            //不存在相同的类-》新增
            category_parent_check(req, res, req.query.tel, req.query.parent_id, function (req, res, parent_alive) {
                // console.log(parent_alive)
                if (parent_alive) {
                    //不存在相同类.父类存在->新增 返回新增的class_id
                    var sqlstr = 'insert into category (parent_id,tel,class_name) values (' + req.query.parent_id + ',"' + req.query.tel + '","' + req.query.class_name + '")'
                    // console.log(sqlstr)
                    sql(req, res, sqlstr, function (results) {
                        // console.log(results.insertId)
                        class_id = results.insertId
                        // res.send({ 'msg': "新增类别成功", 'code': '1', 'class_id': results.insertId })
                        callback(req, res, class_id)
                    })
                } else {
                    //父类不存在
                    // console.log("父类不存在")
                    class_id = ''
                    console.log({ 'msg': "新增类别失败:父类不存在", 'code': '0' })
                    callback(req, res, class_id)
                }
            })
        } else {
            //存在相同的类
            class_id = results[0].class_id
            // console.log({ 'msg': "新增类别失败:已存在该类", 'code': '0', 'class_id': class_id })
            callback(req, res, class_id)
        }
    })
}

/*
params: {
            tel: '13388110101',
            session: session,
            class_name: 'life',
            parent_id: '-1'
}
输出
{ 'msg': "新增类别失败:父类不存在", 'code': '0' }
{ 'msg': "新增类别失败:已存在该类", 'code': '0', 'class_id': results[0].class_id }
{ 'msg': "新增类别成功", 'code': '1', 'class_id': results[0].class_id }
*/
app.get('/category/new', (req, res) => {
    auth(req, res, function () {
        console.log("/category/new")
        category_new(req, res, function (req, res, class_id) {
            if (!class_id) {
                console.log("-1")
                res.send({ 'msg': "新增类别失败:父类不存在", 'code': '0' })
            } else {
                //新增成功包含两种情况，（1）本来就啥也没有，新增成功；（2）发来的请求的classname是已经存在的，返回已存在的那个类的id，也叫新增成功
                res.send({ 'msg': "新增成功", 'code': '1', 'class_id': class_id })
            }
        })
    })
})

/*
params: {
            tel: '13388110101',//不能改
            session: session,
            before: {
                    class_name: 'life',//可以改
                    parent_id: '4'//
                },
            after:{
                    class_name: 'eat',
                    parent_id: '4'//
                }
        }
输出：
{ 'msg': "修改类别失败：原类别信息错误", 'code': '0' }
{ 'msg': "修改类别失败：父类不存在", 'code': '0' }
{ 'msg': "修改类别成功", 'code': '1' }
*/
app.get('/category/modify', (req, res) => {
    auth(req, res, function () {
        console.log("/category/modify")
        // console.log(req.query.before)
        var sqlstr = 'select * from category where tel="' + req.query.tel + '" and class_name="' + req.query.before.class_name + '" and parent_id=' + req.query.before.parent_id
        sql(req, res, sqlstr, function (results) {
            if (results.length == 0) {
                res.send({ 'msg': "修改类别失败：原类别信息错误", 'code': '0' })
            } else {
                category_parent_check(req, res, req.query.tel, req.query.after.parent_id, function (req, res, parent_alive) {
                    // console.log("判断parent——id是否存在")
                    if (parent_alive) {
                        var class_id = results[0].class_id
                        console.log(class_id)
                        console.log(req.query.after)
                        var sqlstr = 'update category set parent_id=' + req.query.after.parent_id + ',class_name="' + req.query.after.class_name + '" where class_id=' + class_id
                        sql(req, res, sqlstr, function (results) {
                            res.send({ 'msg': "修改类别成功", 'code': '1' })
                        })
                    } else {
                        //父类不存在
                        res.send({ 'msg': "修改类别失败：父类不存在", 'code': '0' })
                    }
                })
            }
        })
    })
})

/*
params: {
    tel: '13388110101',
    session: session,
}
输出
{ 'msg': "查找成功", 'code': '1', results }
*/
app.get('/category/show', (req, res) => {
    auth(req, res, function () {
        console.log("/category/show")
        var sqlstr = 'select * from category where tel="' + req.query.tel + '"'
        sql(req, res, sqlstr, function (results) {
            res.send({ 'msg': "查找成功", 'code': '1', results })
        })
    })
})

/*
params: {
            tel: '13388110101',
            session: session,
            class_id: '7'
        }
输出
{ 'msg': "删除成功", 'code': '1', 'sqlmsg': results }
*/
app.get('/category/delete', (req, res) => {
    auth(req, res, function () {
        var sqlstr = 'select * from category where class_id=' + req.query.class_id
        sql(req, res, sqlstr, function (results) {
            if (results[0].parent_id) {
                //有父类->子类的父类改为该父
                var sqlstr = 'update category set parent_id=' + results[0].parent_id + ' where parent_id=' + req.query.class_id
                console.log(sqlstr)
                sql(req, res, sqlstr, function (results) {
                    // console.log(results)
                    var sqlstr = 'update items set class_id=NULL where class_id=' + req.query.class_id
                    console.log(sqlstr)
                    sql(req, res, sqlstr, function (results) {
                        var sqlstr = 'delete from category where class_id=' + req.query.class_id
                        sql(req, res, sqlstr, function (results) {
                            res.send({ 'msg': "删除成功", 'code': '1', 'sqlmsg': results })
                        })
                    })
                })
            } else {
                //没有父类
                var sqlstr = 'update category set parent_id=NULL where parent_id=' + req.query.class_id
                sql(req, res, sqlstr, function (results) {
                    var sqlstr = 'update items set class_id=NULL where class_id=' + req.query.class_id
                    console.log(sqlstr)
                    sql(req, res, sqlstr, function (results) {
                        var sqlstr = 'delete from category where class_id=' + req.query.class_id
                        sql(req, res, sqlstr, function (results) {
                            res.send({ 'msg': "删除成功", 'code': '1', 'sqlmsg': results })
                        })
                    })
                })
            }
        })
    })
})

/*
params: {
                tel: '13388110101',
                session: session,
                title: '恰饭',
                note: '',
                start: '2023-3-25 13:02:23',
                end: '2023-3-25 13:02:23',
                class_name: ''
            }
输出
{ 'msg': '新增事项成功', 'code': '1', '事项id': results.insertId }
*/
app.get('/item/new', (req, res) => {
    auth(req, res, function () {
        var class_id
        console.log("/item/new")
        if (req.query.class_name) {
            //有分类
            category_new(req, res, function (req, res, class_id) {
                // console.log(class_id)
                var sqlstr = 'insert into items (tel,title,note,start,end,class_id) values ("' + req.query.tel + '","' + req.query.title + '","' + req.query.note + '","' + req.query.start + '","' + req.query.end + '",' + class_id + ')'
                sql(req, res, sqlstr, function (results) {
                    res.send({ 'msg': '新增事项成功', 'code': '1', '事项id': results.insertId })
                })
            })
        } else {
            var sqlstr = 'insert into items (tel,title,note,start,end) values ("' + req.query.tel + '","' + req.query.title + '","' + req.query.note + '","' + req.query.start + '","' + req.query.end + '")'
            sql(req, res, sqlstr, function (results) {
                res.send({ 'msg': '新增事项成功', 'code': '1', '事项id': results.insertId })
            })
        }
    })
})

/*
params: {
                tel: '13388110101',
                session: session,
                item_id: '3',
                before: {
                    title: '恰饭',
                    note: '',
                    start: '2023-3-25 13:02:23',
                    end: '2023-3-25 13:02:23',
                    class_id: '7'
                },
                after: {
                    title: '恰饭',
                    note: '',
                    start: '',
                    end: '2023-3-25 13:02:23',
                    class_id: '8'
                }
            }
输出
{ 'msg': '修改完成', 'code': 1 }
*/
app.get('/item/modify', (req, res) => {
    auth(req, res, function () {
        // console.log(req.query.after)
        var sqlstr
        if (!req.query.after.start && !req.query.after.end) {
            sqlstr = 'update items set title="' + req.query.after.title + '",note="' + req.query.after.note + '",start=NULL,end=NULL,class_id=' + req.query.after.class_id + ' where item_id=' + req.query.item_id
            console.log(sqlstr)
        } else {
            if (!req.query.after.start) {
                sqlstr = 'update items set title="' + req.query.after.title + '",note="' + req.query.after.note + '",start=NULL,end="' + req.query.after.end + '",class_id=' + req.query.after.class_id + ' where item_id=' + req.query.item_id
                // console.log(sqlstr)
            } else {
                if (!req.query.after.end) {
                    sqlstr = 'update items set title="' + req.query.after.title + '",note="' + req.query.after.note + '",start="' + req.query.after.start + '",end=NULL,class_id=' + req.query.after.class_id + ' where item_id=' + req.query.item_id
                }
                else {
                    sqlstr = 'update items set title="' + req.query.after.title + '",note="' + req.query.after.note + '",start="' + req.query.after.start + '",end="' + req.query.after.end + '",class_id=' + req.query.after.class_id + ' where item_id=' + req.query.item_id
                }
            }
        }
        // console.log(sqlstr);
        sql(req, res, sqlstr, function (results) {
            res.send({ 'msg': '修改完成', 'code': 1 })
        })
    })
})

/*
 params: {
             tel: '13388110101',
             session: session,
         }
输出
{ 'msg': "查找成功", 'code': '1', 'sqlmsg': results }
*/
app.get('/item/show', (req, res) => {
    auth(req, res, function () {
        console.log("/item/show")
        var sqlstr = 'select * from items where tel="' + req.query.tel + '"'
        sql(req, res, sqlstr, function (results) {
            res.send({ 'msg': "查找成功", 'code': '1', 'sqlmsg': results })
        })
    })
})

/*
params: {
            tel: '13388110101',
            session: session,
            item_id: '5'
        }
输出
{ 'msg': "删除成功", 'code': '1', 'sqlmsg': results }
*/
app.get('/item/delete', (req, res) => {
    auth(req, res, function () {
        var sqlstr = 'delete from items where item_id=' + req.query.item_id
        sql(req, res, sqlstr, function (results) {
            res.send({ 'msg': "删除成功", 'code': '1', 'sqlmsg': results })
        })
    })
})


app.listen(8080, () => {
    console.log("server start")
})

