<template>
    <el-container>
        <el-header style="background-color: gray;">编辑分类</el-header>
        <el-main>
            <el-tree :data="categories" @node-click="get_childs" />
            <el-drawer size="40%" v-model="drawer" :title="selected_class_name" :direction="direction"
                :before-close="handleClose">
                <el-row :gutter="50">
                    <el-col :span="4"></el-col>
                    <el-col :span="8">

                        <el-form>
                            <!-- <el-divider direction="vertical" /> -->
                            <el-form-item label="原信息"></el-form-item>
                            <el-form-item label="类别名称">
                                <el-input disabled v-model="before.class_name" />
                            </el-form-item>
                            <el-form-item label="&nbsp&nbsp父&nbsp&nbsp&nbsp类&nbsp&nbsp">
                                <el-input disabled v-model="before.parent_id" />
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-divider direction="vertical" />
                    <el-col :span="8">
                        <el-form>
                            <el-form-item label="更改为"></el-form-item>
                            <el-form-item label="类别名称">
                                <el-input v-model="ruleForm.class_name" />
                            </el-form-item>
                            <el-form-item label="&nbsp&nbsp父&nbsp&nbsp&nbsp类&nbsp&nbsp">
                                <el-input v-model="ruleForm.parent_id" />
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="3"></el-col>
                </el-row>

            </el-drawer>
            <el-button @click="edit" type="primary">编辑</el-button>
        </el-main>
    </el-container>
</template>


<script setup>
import { reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import api from '../api'
import { useRoute, useRouter } from 'vue-router'

// 登陆的参数
const route = useRoute()
const router = useRouter()//跳转
const session = route.query.session//登陆的参数
const tel = route.query.tel
const categories = reactive([])
let drawer = ref(false)
const direction = ref('btt')
let selected
let selected_class_name = ref('')


const before = reactive({
    class_name: '',
    parent_id: '',
})

const ruleForm = reactive({
    class_name: '5555',
    parent_id: '',
})

function edit() {

    if (!selected) {
        ElMessage('请先选中需要修改的类别')
        return
    }
    console.log(selected)

    drawer.value = true

}

const handleClose = (done) => {
    ElMessageBox.confirm('Are you sure you want to close this?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}

//最基础的显示（可以显示根结点）
api.category_show({ tel, session }).then((res) => {
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
    selected = v
    selected_class_name = '修改分类：' + selected.label
    // console.log(selected)
    // console.log(selected.class_name)
    before.class_name = selected.label
    api.category_myParent({ tel: route.query.tel, session: route.query.session, class_id: selected.value }).then((res) => {
        console.log(res.data.msg)

    })
    // console.log(before.class_name)
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



</script>

<style>

</style> 
<!-- 
<template>
    <el-radio-group v-model="direction">
        <el-radio label="btt">bottom to top</el-radio>
    </el-radio-group>

    <el-button type="primary" style="margin-left: 16px" @click="drawer = true">
        open
    </el-button>

    <el-drawer v-model="drawer" title="I am the title" :direction="direction" :before-close="handleClose">
        <span>Hi, there!</span>
    </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const drawer = ref(false)
const direction = ref('btt')

const handleClose = (done: () => void) => {
    ElMessageBox.confirm('Are you sure you want to close this?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}
</script>  -->
