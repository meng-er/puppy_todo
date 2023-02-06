<template>
    <el-container>
        <el-header style="background-color: gray;">header</el-header>
        <el-main>
            <el-form :model="form" label-width="120px">
                <el-form-item label="title">
                    <el-input v-model="form.title" />
                </el-form-item>
                <el-form-item label="category">
                    <el-select @click="get_category" v-model="form.category" placeholder="please select">
                        <el-option v-for="category in categories.list" :label="category.class_name"
                            :value="category.class_name" />
                    </el-select>
                </el-form-item>
                <el-form-item label=" start&end">
                    <el-col :span="4">
                        <el-date-picker v-model="form.start" type="datetime" placeholder="Select date and time" />
                    </el-col>
                    <el-col :span="2">
                        <span>to</span>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker v-model="form.end" type="datetime" placeholder="Select date and time" />
                    </el-col>
                </el-form-item>

                <el-form-item label="note">
                    <el-input v-model="form.note" type="textarea" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">Create</el-button>
                    <el-button>Cancel</el-button>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>


</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../api'
import { useRoute, useRouter } from 'vue-router'
import { setMapStoreSuffix } from 'pinia';

// 登陆的参数
const route = useRoute()
const router = useRouter()//跳转
const session = route.query.session//登陆的参数

if (JSON.stringify(route.query) == '{}') {
    console.log("请重新登陆")
    ElMessage.error("请重新登陆")
    router.push({ path: 'login' })
}

const form = reactive({
    title: '',
    category: '',
    start: '',
    end: '',
    note: '',
})


const get_category = () => {
    // console.log("777")
    // console.log(route.query)
    api.category_show({ tel: route.query.tel, session: route.query.session }).then((res) => {
        let category_arr = res.data.data
        categories.list = res.data.data
    })
}





const formatNumber = (n) => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
// 时间格式化
const formatTime = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}



const categories = reactive({ 'list': [] })
const submit = () => {
    console.log(route.query.tel)
    console.log(route.query.session)

    console.log(formatTime(form.start))
    api.item_new({
        tel: route.query.tel,
        session: route.query.session,
        title: form.title,
        note: form.note,
        start: formatTime(form.start),
        end: '2023-02-06 00:00:00',
        class_name: form.class_name,
    }).then((res) => {
        console.log(res.data)
    })

}


</script>
<style>
@media (min-width: 1024px) {}
</style>