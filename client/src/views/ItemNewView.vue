<template>
    <el-container>
        <el-header style="background-color: gray;">header</el-header>
        <el-main>
            <el-form :model="form" label-width="120px">
                <el-form-item label="title">
                    <el-input v-model="form.title" />
                </el-form-item>
                <el-form-item label="category">
                    <el-tree-select @node-click="get_childs" v-model="form.category" :data="categories"
                        :render-after-expand="false" />
                    <Edit @click="goto_category_edit"
                        style="width: 1.5em; height: 1.5em; margin-left: 8px; cursor: pointer" />
                </el-form-item>
                <el-form-item label=" start&end">
                    <el-col :span="4">
                        <el-date-picker v-model="form.start" type="datetime" placeholder="begin" />
                    </el-col>
                    <el-col :span="2">
                        <span>to</span>
                    </el-col>
                    <el-col :span="4">
                        <el-date-picker v-model="form.end" type="datetime" placeholder="end" />
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
const categories = reactive([])
const form = reactive({
    title: '',
    category: '',
    start: '',
    end: '',
    note: '',
})

if (JSON.stringify(route.query) == '{}') {
    console.log("请重新登陆")
    ElMessage.error("请重新登陆")
    router.push({ path: 'login' })
}

api.category_show({ tel: route.query.tel, session: route.query.session }).then((res) => {
    // console.log("haha")
    let category_arr = res.data.data
    // console.log(category_arr)
    let is_child = []
    for (let i = 0; i < category_arr.length; i++) {
        // if (category_arr[i].parent_id != -1 && is_child.indexOf(category_arr[i].parent_id) == -1) {
        //     is_child.push(category_arr[i].parent_id)
        // }
        if (category_arr[i].parent_id == -1) {
            categories.push({ label: category_arr[i].class_name, value: category_arr[i].class_id, children: [] })
            api.category_showChild({ tel: route.query.tel, session: route.query.session, parent_id: category_arr[i].class_id }).then((res) => {
                const childs = res.data.data
                // console.log(childs)
                for (let j = 0; j < childs.length; j++) {
                    categories[i].children.push({ label: childs[j].class_name, value: childs[j].class_id, children: [] })
                }
            })
        }
    }
})

function get_childs(v) {
    // console.log(v)
    // console.log(v.$treeNodeId)
    api.category_showChild({ tel: route.query.tel, session: route.query.session, parent_id: v.value }).then((res) => {
        const childs = res.data.data
        // console.log(childs)
        for (let i = 0; i < childs.length; i++) {
            api.category_showChild({ tel: route.query.tel, session: route.query.session, parent_id: childs[i].class_id }).then((res) => {
                const childs2 = res.data.data
                for (let j = 0; j < childs2.length && v.children[i].children.length != childs2.length; j++) {
                    // console.log(v.children[i])
                    // console.log(childs2[j])//后端
                    v.children[i].children.push({ label: childs2[j].class_name, value: childs2[j].class_id, children: [] })
                }
            })
        }
    })
}

function goto_category_edit() {
    console.log("haha")
    router.push({ path: 'editCategory', query: { tel: route.query.tel, session } })
}

const formatNumber = (n) => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 时间格式化
const formatTime = (date) => {
    if (date == '') {
        return ''
    }
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const submit = () => {
    // console.log("heihei")
    // console.log(form.category)
    // console.log("heihei")
    // console.log(route.query.tel)
    // console.log(route.query.session)
    console.log(formatTime(form.start))
    api.item_new({
        tel: route.query.tel,
        session: route.query.session,
        title: form.title,
        note: form.note,
        start: formatTime(form.start),
        end: formatTime(form.end),
        class_id: form.category,
    }).then((res) => {
        if (res.data.code == 1) {
            ElMessage({
                message: '新增成功',
                type: 'success',
            })
        } else {
            ElMessage.error('新增失败:' + res.data.msg)
        }
    })

}


</script>
<style>
@media (min-width: 1024px) {}
</style>