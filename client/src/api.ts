import Axios from 'axios'
const base = 'http://localhost:5173/api'//这个api随便替换成想要的名字，主要是从5173分一部分出去给服务器
let session

const Login = (data: { [key: string]: any }) => {
    //data是get请求的参数
    return Axios.post(base + '/login', { data })
}

const Register = (data: { [key: string]: any }) => {
    return Axios.post(base + '/register', { data })
}

const item_show = (data: { [key: string]: any }) => {
    return Axios.post(base + '/item/show', { data })
}

const item_new = (data: { [key: string]: any }) => {
    return Axios.post(base + 'item/new', { data })
}


const category_show = (data: { [key: string]: any }) => {
    return Axios.post(base + '/category/show', { data })
}

const category_showChild = (data: { [key: string]: any }) => {
    return Axios.post(base + '/category/showChild', { data })
}

const category_myParent = (data: { [key: string]: any }) => {
    return Axios.post(base + '/category/myParent', { data })
}
export default {
    //暴露出去，vue视图那边要用
    base,
    Login,
    session,
    Register,
    item_show,
    category_show,
    item_new,
    category_showChild,
    category_myParent
}