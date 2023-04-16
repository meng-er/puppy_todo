
const { log, succInfo, errInfo, dbQuery, reqAuth, getParams } = require('./main.js')
const { app } = require('./user.js')
// //中间件接收post
// const bodyParser = require('body-parser')
// app.use(bodyParser.json({}))

function category_parent_check(tel, parent_id) {
    /*
    有parent_id？-无->succInfo("成功")
                -有->parent_id有效否？-无->
                                    -有->
    */
    return new Promise((resolve, reject) => {
        const category_parent_check = async (tel, parent_id) => {
            // var parent_alive//父类是否存在，结果，bool
            if (parent_id != 0) {
                const resObj = await dbQuery('select * from category where tel=? and class_id=?', [tel, parent_id])
                if (resObj.results.length != 1) {
                    resolve(errInfo("parent_id无效"))
                }
                else {
                    resolve(succInfo("parent_id有效", resObj.results))
                }
            } else {
                resolve(succInfo("没有parent"))
            }
        }
        category_parent_check(tel, parent_id)
    })
}
//新增类别
/*
已存在该类？-是->errInfo("已存在该类")
          -否->父类存在？-是->succInfo("新增成功",class_id)
                       -否->errInfo("父类不存在")
*/
/*
function category_new(req, res) {
    return new Promise((resolve, reject) => {
        const category_new = async (req, res) => {
            const resObj = await dbQuery('select * from category where tel=? and class_name=? and parent_id=?', [req.body.tel, req.body.class_name, req.body.parent_id])
            // console.log(resObj.results.length)
            if (resObj.results.length != 0) {
                resolve(errInfo("已存在该类", resObj.results[0].class_id))
                return
            }
            const isParentObj = await category_parent_check(req.body.tel, req.body.parent_id)
            // console.log(isParentObj)
            if (isParentObj.code) {
                // console.log("ss")
                dbQuery('insert into category (parent_id,tel,class_name) values (?,?,?)', [req.body.parent_id, req.body.tel, req.body.class_name])
                    .then((resObj) => {
                        resolve(succInfo("新增类别成功", resObj.results.insertId))
                        return
                    })
            } else {
                resolve(errInfo("父类无效"))
            }
        }
        category_new(req, res)
    })
}
*/

/*
params: {
            tel: '13388110101',
            session: session,
            class_name: 'life',
            parent_id: '-1'
}
输出
{ 'msg': "父类不存在", 'code': '0' }
{ 'msg': "新增成功", 'code': '1', 'class_id': dbData.results.insertId }
*/
app.post('/category/new', async (req, res) => {
    try {
        const params = await getParams(req, ["tel=11", "class_name>0", "parent_id>0", "session"])
        await reqAuth(req, res)
        if (params.parent_id != -1) {
            const resObj = await dbQuery('select * from category where tel=? and class_id=?', [params.tel, params.parent_id])
            if (resObj.results.length != 1) {
                //如果没有parent，parent_id=-1,不能为空串、null、0
                throw "父类不存在"
            }
        }
        const dbData = await dbQuery('insert into category (parent_id,tel,class_name) values (?,?,?)', [params.parent_id, params.tel, params.class_name])
        res.send(succInfo("新增成功", dbData.results.insertId))
    } catch (err) {
        res.send(errInfo(err))
    }
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
app.post('/category/modify', (req, res) => {
    if (!req.body.data.tel || !req.body.data.session || !req.body.before.class_name || !req.body.before.parent_id || !req.body.after.class_name || !req.body.after.parent_id) {
        res.send(errInfo("修改类别信息不完整"))
    }
    const category_modify = async (req, res) => {
        await reqAuth(req, res)
        const dbResObj = await dbQuery('select * from category where tel=? and class_name=? and parent_id=?', [req.body.data.tel, req.body.before.class_name, req.body.before.parent_id])
        if (dbResObj.results.length == 0) {
            res.send(errInfo("原类别信息错误"))
            return
        }
        const isParentObj = await category_parent_check(req.body.data.tel, req.body.after.parent_id)
        if (!isParentObj.code) {
            res.send(errInfo("父类不存在"))
            return
        }
        // console.log(isParentObj)
        var class_id = isParentObj.data[0].class_id
        dbQuery('update category set parent_id=?,class_name=? where class_id=?', [req.body.after.parent_id, req.body.after.class_name, class_id])
            .then((dbResObj) => {
                if (dbResObj.error) {
                    log(dbResObj.error)
                    res.send(errInfo("数据库错误"))
                    return
                }
                res.send(succInfo("修改类别成功"))
            })

    }
    category_modify(req, res)

})



app.post('/category/myParent', async (req, res) => {
    try {
        const params = getParams(req, ["tel=11", "session>0", "class_id"])
        await reqAuth(req, res)
        const dbResObj = await dbQuery('select parent_id from category where tel=? and class_id=?', [params.tel, params.class_id])
        if (dbResObj.results.length != 1 || dbResObj.error) {
            res.send(errInfo("没有结果||数据库错误"))
            return
        }
        // console.log(dbResObj.results)
        let parent_id = dbResObj.results[0].parent_id
        // console.log(parent_id)
        if (parent_id == -1) {
            res.send(succInfo(-1))
            return
        }

        dbQuery('select * from category where tel=? and class_id=?', [paramsF.tel, parent_id])
            .then((dbResObj) => {
                if (dbResObj.error || dbResObj.results.length == 0) {
                    log(dbResObj.error)
                    res.send(errInfo("数据库错误"))
                    return
                }
                res.send(succInfo(dbResObj.results))
            })


    } catch (err) {
        res.send(errInfo(err))
    }
})



/*
params: {
    tel: '13388110101',
    session: session,
}
输出
{ 'msg': "查找成功", 'code': '1', results }
*/
app.post('/category/show', async (req, res) => {
    try {
        const params = getParams(req, ["tel=11", "session"])
        await reqAuth(req, res)
        // const dbData = await dbQuery('select a.class_id,a.parent_id,a.class_name,count(c.parent_id) child_nums from (select * from category where tel=? and parent_id=?) a left join (select * from category where tel=?) c on a.class_id=c.parent_id and a.tel=c.tel group by a.class_id,a.parent_id,a.class_name,c.parent_id;', [params.tel, params.parent_id, params.tel])
        const dbData = await dbQuery('select * from category where parent_id=-1 and tel=?', [params.tel])
        // console.log("haha")
        if (dbData.error) {
            res.send(errInfo("数据库错误"))
            return
        }
        // console.log(dbData.results)
        res.send(succInfo("查找成功", dbData.results))
    } catch (err) {
        res.send(errInfo(err))
    }
})
app.post('/category/showChild', async (req, res) => {
    try {
        const params = getParams(req, ["tel=11", "session", "parent_id"])
        await reqAuth(req, res)
        const dbData = await dbQuery('select * from category where tel=? and parent_id=?', [params.tel, params.parent_id])
        if (dbData.error) {
            res.send(errInfo("数据库错误"))
            return
        }
        res.send(succInfo("查找成功", dbData.results))

    } catch (err) {
        res.send(errInfo(err))
    }
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
app.post('/category/delete', (req, res) => {
    const category_delete = async (req, res) => {
        await reqAuth(req, res)
        let dbResObj = await dbQuery('select * from category where class_id=?', req.body.data.class_id)
        if (dbResObj.results.length != 1) {
            res.send(errInfo("class_id错误"))
            return
        }
        if (dbResObj.results[0].parent_id) {
            //有父类->子类的父类改为该父
            await dbQuery('update category set parent_id=? where parent_id=?', [dbResObj.results[0].parent_id, req.body.data.class_id])
            await dbQuery('update items set class_id=-1 where class_id=?', req.body.data.class_id)
            // console.log(results)
            await dbQuery('delete from category where class_id=?', req.body.data.class_id).then((dbResObj) => {
                res.send(succInfo("删除成功", dbResObj.results))

            })
        } else {
            //没有父类
            await dbQuery('update category set parent_id=-1 where parent_id=?', req.body.data.class_id)
            await dbQuery('update items set class_id=-1 where class_id=?', req.body.data.class_id)
            // console.log(results)
            await dbQuery('delete from category where class_id=?', req.body.data.class_id).then((dbResObj) => {
                res.send(succInfo("删除成功", dbResObj.results))

            })
        }
    }
    category_delete(req, res)
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
app.post('/item/new', async (req, res) => {
    try {
        let params = await getParams(req, ["tel", "session", "title>0", "note", "start", "end", "class_id"])
        await reqAuth(req, res)
        let sqlStr = 'insert into items (tel,title,note,start,end,class_id) values (?,?,?,?,?,?)'
        params.start = (params.start == '') ? null : params.start
        params.end = (params.end == '') ? null : params.end
        await dbQuery(sqlStr, [params.tel, params.title, params.note, params.start, params.end, params.class_id])
        res.send(succInfo("新增事项成功"))
    } catch (err) {
        console.log(err)
        res.send(err)
    }
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
app.post('/item/modify', (req, res) => {
    if (!req.body.data.tel || !req.body.data.session || !req.body.item_id || !req.body.before.title || !req.body.after.title) {
        res.send(errInfo("修改事项信息不完整"))
    }
    const item_modify = async (req, res) => {
        await reqAuth(req, res)
        let sqlstr
        if (!req.body.after.start && !req.body.after.end) {
            sqlstr = 'update items set title="' + req.body.after.title + '",note="' + req.body.after.note + '",start=NULL,end=NULL,class_id=' + req.body.after.class_id + ' where item_id=' + req.body.item_id
            // console.log(sqlstr)
        } else {
            if (!req.body.after.start) {
                sqlstr = 'update items set title="' + req.body.after.title + '",note="' + req.body.after.note + '",start=NULL,end="' + req.body.after.end + '",class_id=' + req.body.after.class_id + ' where item_id=' + req.body.item_id
                // console.log(sqlstr)
            } else {
                if (!req.body.after.end) {
                    sqlstr = 'update items set title="' + req.body.after.title + '",note="' + req.body.after.note + '",start="' + req.body.after.start + '",end=NULL,class_id=' + req.body.after.class_id + ' where item_id=' + req.body.item_id
                }
                else {
                    sqlstr = 'update items set title="' + req.body.after.title + '",note="' + req.body.after.note + '",start="' + req.body.after.start + '",end="' + req.body.after.end + '",class_id=' + req.body.after.class_id + ' where item_id=' + req.body.item_id
                }
            }
        }
        dbQuery(sqlstr, []).then((res) => { res.send(succInfo("修改成功")) })
    }
    item_modify(req, res)
})

/*
 params: {
             tel: '13388110101',
             session: session,
         }
输出
{ 'msg': "查找成功", 'code': '1', 'sqlmsg': results }
*/
app.post('/item/show', async (req, res) => {
    try {
        const params = getParams(req, ['tel', 'session'])
        await reqAuth(req, res)
        const dbData = await dbQuery('select * from items where tel=?', params.tel)
        res.send(succInfo("查找成功", dbData.results))
    } catch (err) {
        // console.log(err)
        res.send(errInfo(err))
    }
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
app.post('/item/delete', (req, res) => {
    if (!req.body.data.tel || !req.body.data.session || !req.body.item_id) {
        res.send(errInfo("itemdelete信息不完整"))
    }
    const item_delete = async (req, res) => {
        await reqAuth(req, res)
        dbQuery('delete from items where item_id=?', req.body.item_id)
            .then((dbResObj) => {
                if (resObj.error) {
                    log(resObj.error)
                    res.send(errInfo("数据库错误"))
                    return
                }
                res.send(succInfo("删除成功"))
            })
    }
    item_delete(req, res)
})


app.listen(8080, () => {
    console.log("server start")
})

