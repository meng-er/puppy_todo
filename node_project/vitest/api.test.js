import { expect } from 'chai'
import { assert, describe, it } from 'vitest'
const axios = require('axios')
let session = ''
let tel = String(Date.now()).slice(-11)
let password = '123456'

const base = 'http://localhost:5173/api'

const reqApi = (url, data) => {
    data.session = session
    // console.log(data)
    return axios.post(base + url, data)
}


const getData = (res) => {
    return res.data

}

describe('注册', () => {
    it('tel不存在', async () => {
        const res = await reqApi('/register', { password })
        const resData = getData(res)
        expect(resData.msg).toEqual("tel不存在")
        // console.log(data)
    })
    it('password不存在', async () => {
        const res = await reqApi('/register', { tel })
        const resData = getData(res)
        expect(resData.msg).toEqual("password不存在")
    })

    it('tel长度不符合要求', async () => {
        const res = await reqApi('/register', { tel: '1', password: '1' })
        const resData = getData(res)
        expect(resData.msg).toEqual("tel长度须为11")
        // console.log(data)
    })
    it('password长度不符合要求', async () => {
        const res = await reqApi('/register', { tel, password: '1' })
        const resData = getData(res)
        expect(resData.msg).toEqual("password长度须大于5")
        // console.log(data)
    })
    it('成功', async () => {
        const res = await reqApi('/register', { tel, password })
        const resData = getData(res)
        expect(resData.msg).toEqual('注册成功')
    })
    it('重复注册', async () => {
        const res = await reqApi('/register', { tel, password })
        const resData = getData(res)
        expect(resData.msg).toEqual('账户已存在')
    })
})


describe('密码重置', () => {
    it('重置密码信息不完整', async () => {
        const res = await reqApi('/resetPassword', { tel: '1', oldPassword: password, newPassword: '654321' })
        const resData = getData(res)
        expect(resData.msg).toEqual('重置密码信息不完整')
    })
    it('成功', async () => {
        const res = await reqApi('/resetPassword', { tel, 'oldPassword': password, newPassword: '654321' })
        const resData = getData(res)
        expect(resData.msg).toEqual('修改密码成功')
    })
    it('旧密码输入错误', async () => {
        const res = await reqApi('/resetPassword', { tel, 'oldPassword': password, newPassword: '654321' })
        const resData = getData(res)
        expect(resData.msg).toEqual('旧密码输入错误')
    })

    it('成功', async () => {
        const res = await reqApi('/resetPassword', { tel, 'oldPassword': '654321', newPassword: '123456' })
        const resData = getData(res)
        expect(resData.msg).toEqual('修改密码成功')
    })

})



describe('登录', () => {
    it('账户不存在或账户不唯一', async () => {
        // Suite skipped, no error
        // console.log(tel)
        const res = await reqApi('/login', { tel: '11111111111', password: '123456' })
        const resData = getData(res)
        expect(resData.msg).toEqual('账户不存在或账户不唯一')
    })
    it('密码错误', async () => {
        const res = await reqApi('/login', { tel, password: '1' })
        const resData = getData(res)
        expect(resData.msg).toEqual('密码错误')
    })
    it('成功', async () => {
        // console.log(tel)
        // console.log(password)
        const res = await reqApi('/login', { tel, password })
        const resData = getData(res)
        session = resData.data
        expect(resData.msg).toEqual('登录成功')
    })

})

describe('/item/new 新增待办事项', () => {
    console.log("/item/new 新增待办事项")
    it('部分参数为空', async () => {
        const res = await reqApi('/item/new', { tel, title: "新增部分参数", note: '', start: '', end: '', class_id: -1 })
        const resData = getData(res)
        expect(resData.msg).toEqual('新增事项成功')
    })
    it('参数完整', async () => {
        const res = await reqApi('/item/new', { tel, title: "新增完整参数", note: '', start: '2023-02-05 00:00:00', end: '2023-02-05 00:00:00', class_id: -1 })
        const resData = getData(res)
        expect(resData.msg).toEqual('新增事项成功')
    })
})


describe('/item/show 待办事项显示', () => {
    console.log("/item/show 待办事项显示")

    it('成功', async () => {
        const res = await reqApi('/item/show', { tel })
        const resData = getData(res)
        // console.log(resData.data)
        expect(resData.data.length).toEqual(2)
        expect(resData.data[0].title).toEqual("新增部分参数")
        expect(resData.data[1].title).toEqual("新增完整参数")
        expect(resData.msg).toEqual('查找成功')
    })
})

describe('/category/new 新增类别', () => {
    it('部分参数(parent_id)为空', async () => {
        const res = await reqApi('/category/new', { parent_id: '', tel, class_name: 'lala' })
        const resData = getData(res)
        expect(resData.msg).toEqual('parent_id长度须大于0')
    })
    it('部分参数(class_name)为空', async () => {
        const res = await reqApi('/category/new', { parent_id: '', tel, class_name: '' })
        const resData = getData(res)
        expect(resData.msg).toEqual('class_name长度须大于0')
    })
    it('父类不存在', async () => {
        const res = await reqApi('/category/new', { parent_id: '0', tel, class_name: '新增类' })
        const resData = getData(res)
        expect(resData.msg).toEqual('父类不存在')
    })
    let rootId
    it('成功', async () => {
        const res = await reqApi('/category/new', { parent_id: '-1', tel, class_name: '新增类' })
        const resData = getData(res)
        rootId = resData.data
        expect(resData.msg).toEqual('新增成功')
    })
    it('成功', async () => {
        const res = await reqApi('/category/new', { parent_id: rootId, tel, class_name: '新增类2' })
        const resData = getData(res)
        expect(resData.msg).toEqual('新增成功')
    })
})


describe('/category/show 显示类别', () => {
    it('成功', async () => {
        const res = await reqApi('/category/show', { tel })
        const resData = getData(res)
        expect(resData.data[0].class_name).toEqual('新增类')
        expect(resData.data[1].class_name).toEqual('新增类2')

        expect(resData.msg).toEqual('查找成功')
    })
})

