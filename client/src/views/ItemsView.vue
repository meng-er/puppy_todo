<template>
    <el-container>
        <el-header style="background-color: brown;">header</el-header>
        <el-main>
            <el-table :data="items_info.items" style="width: 100%">
                <el-table-column prop="item_title" label="title" width="180" />
                <el-table-column prop="item_note" label="note" width="180" />
                <el-table-column prop="item_start" label="start" width="180" />
                <el-table-column prop="item_end" label="end" width="180" />
                <el-table-column prop="item_class" label="class" />
            </el-table>
            <el-button type="primary" @click="goto_newItem">新增</el-button>
        </el-main>
    </el-container>


</template>

<script>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import User from '../api'
// import type { FormInstance } from 'element-plus'//import type 是用来协助进行类型检查和声明的，在运行时是完全不存在的。
import { setMapStoreSuffix } from 'pinia';

//路由
import { useRoute, useRouter } from 'vue-router'


export default {
    // `setup` 是一个专门用于组合式 API 的特殊钩子函数
    setup() {
        // 路由
        const router = useRouter()//跳转
        const route = useRoute()//接收参数
        const session = route.query.session//登陆的参数

        const items_info = reactive({ items: [] })//表格绑定数据

        function goto_newItem() {
            router.push({ path: 'newItem', query: { tel: route.query.tel, session } })
        }


        if (JSON.stringify(route.query) == '{}') {
            console.log("请重新登陆")
        } else {
            User.item_show({ tel: route.query.tel, session: route.query.session }).then((res) => {
                console.log(res.data.data)
                let item_arr = res.data.data
                if (item_arr.length > 0) {
                    for (let i = 0; i < item_arr.length; i++) {
                        items_info.items.push({
                            item_title: item_arr[i].title,
                            item_note: item_arr[i].note,
                            item_start: item_arr[i].start,
                            item_end: item_arr[i].end,
                            item_class: item_arr[i].class,
                        })
                    }
                } else {
                    //如果数据库中没有item-》不展示表格
                }

            })
        }

        // 暴露 state 到模板
        return {
            items_info,
            goto_newItem,
            router,
            route
        }
    }

}

</script>
<style>
@media (min-width: 1024px) {}
</style>