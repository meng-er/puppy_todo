import Axios from 'axios'
// store.js
import { ref } from 'vue'


const session = ref('')

const base = 'http://localhost:5173/api'//这个api随便替换成想要的名字，主要是从5173分一部分出去给服务器

const login = async (data: { [key: string]: any }) => {
    //data是get请求的参数
    let res = await Axios.post(base + '/login', data)
    if (res.data.code == 1) {
        session.value = res.data.data
    }
    return res
}

const Register = (data: { [key: string]: any }) => {
    return Axios.post(base + '/register', data)
}

const reqApi = (url: string, data: any) => {
    data.session = session.value
    // console.log("haha")
    // console.log(session.value)
    // console.log(data)
    return Axios.post(base + url, data)
}


// const item_show = (data: { [key: string]: any }) => {
//     return Axios.post(base + '/item/show', { data })
// }

// const item_new = (data: { [key: string]: any }) => {
//     return Axios.post(base + 'item/new', { data })
// }


// const category_show = (data: { [key: string]: any }) => {
//     return Axios.post(base + '/category/show', { data })
// }

// const category_showChild = (data: { [key: string]: any }) => {
//     return Axios.post(base + '/category/showChild', { data })
// }

// const category_myParent = (data: { [key: string]: any }) => {
//     return Axios.post(base + '/category/myParent', { data })
// }
export default {
    //暴露出去，vue视图那边要用
    reqApi,
    base,
    login,
    Register,
    // item_show,
    // category_show,
    // item_new,
    // category_showChild,
    // category_myParent
}

