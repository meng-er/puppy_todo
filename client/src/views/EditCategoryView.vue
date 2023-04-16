<template>
    <el-container>
        <el-header style="background-color: gray;">编辑分类</el-header>
        <el-main>
            <el-tree :data="categories"  draggable @node-drop="afterDrop" @node-click="get_childs_and_category_info"
                @node-expand="get_childs_and_category_info" />
            <el-drawer size="45%" v-model="drawer" :title="selected_class_name" :direction="direction"
                :before-close="handleClose">
                <el-row :gutter="30">
                    <el-col :span="6"></el-col>
                    <!-- <div style="background-color:wheat ;"> -->
                    <el-col :span="6">
                        <el-form>
                            <!-- <el-divider direction="vertical" /> -->
                            <el-form-item label="原信息"></el-form-item>
                            <el-form-item label="类别名称">
                                <el-input disabled v-model="before.class_name" />
                            </el-form-item>
                            <el-form-item label="&nbsp&nbsp父&nbsp&nbsp&nbsp类&nbsp&nbsp">
                                <el-input disabled v-model="before.parent_name" />
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <!-- <el-divider direction="vertical" /> -->
                    <el-col :span="6">
                        <el-form>
                            <el-form-item label="更改为"></el-form-item>
                            <el-form-item label="类别名称">
                                <el-input v-model="after.class_name" />
                            </el-form-item>
                            <el-form-item label="&nbsp&nbsp父&nbsp&nbsp&nbsp类&nbsp&nbsp">
                                <!-- <el-input v-model="after.parent_name" /> -->
                                <el-tree-select v-model="node" @node-expand="get_childs" @node-click="get_childs"
                                    :data="categories_have_root" check-strictly :render-after-expand="false" />
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="6"></el-col>
                    <!-- </div> -->
                </el-row>
                <div style="text-align:center;padding-top: 30px;">
                    <el-button @click="submit_modify" type="primary" :icon="Check" circle />
                </div>
            </el-drawer>

            <!-- 新增类别 -->
            <el-drawer size="45%" v-model="drawer_new" title="新增类别" :direction="direction" :before-close="handleClose">
                <el-row :gutter="30">
                    <el-col :span="9"></el-col>
                    <!-- <div style="background-color:wheat ;"> -->
                    <el-col :span="6">
                        <el-form>
                            <el-form-item label="类别名称">
                                <el-input v-model="create.class_name" />
                            </el-form-item>
                            <el-form-item label="&nbsp&nbsp父&nbsp&nbsp&nbsp类&nbsp&nbsp">
                                <!-- <el-input v-model="after.parent_name" /> -->
                                <el-tree-select v-model="create.node" @node-expand="get_childs" @node-click="get_childs"
                                    :data="categories_have_root" check-strictly :render-after-expand="false" />
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="9"></el-col>
                    <!-- </div> -->
                </el-row>
                <div style="text-align:center;padding-top: 30px;">
                    <el-button @click="submit_new" type="primary" :icon="Check" circle />
                </div>
            </el-drawer>



            <el-button @click="edit" type="primary">编辑</el-button>
            <el-button @click="new_category" type="primary">新增</el-button>


        </el-main>
    </el-container>
</template>


<script setup>
import { reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import api from '../api'
import { useRoute, useRouter } from 'vue-router'
import { Check } from '@element-plus/icons-vue'

// 登陆的参数
const route = useRoute()
const router = useRouter()//跳转
const session = route.query.session//登陆的参数
const tel = route.query.tel
const categories = reactive([])
const categories_have_root = reactive([{ label: '根类', value: '-1', children: categories }])
const selected_parent_name_org = ref('')
let drawer = ref(false)
let drawer_new = ref(false)
const direction = ref('btt')
let selected
let selected_class_name = ref('')
let node = ref()

const before = reactive({
    class_name: '',
    parent_name: '',
})

const after = reactive({
    class_name: '',
    parent_name: '',
    parent_id: ''
})

const create = reactive({
    class_name: '',
    parent_name: '',
    parent_id: ''
})


function edit() {

    if (!selected) {
        ElMessage('请先选中需要修改的类别')
        return
    }
    // console.log(selected)

    drawer.value = true

}

function new_category() {
    drawer_new.value = true
    // console.log(create)
}


function selected_category(parent_id) {
    after.parent_id = parent_id
}

function submit_modify() {

}
function submit_new() {
    // console.log(after)

}


const handleClose = (done) => {
    ElMessageBox.confirm('表单还未提交，确认关闭吗？')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}

//最基础的显示（可以显示根结点）
api.reqApi('/category/show', { tel, session }).then((res) => {
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

            api.reqApi('/category/showChild', { tel: route.query.tel, session: route.query.session, parent_id: category_arr[i].class_id }).then((res) => {
                const childs = res.data.data
                // console.log(childs)
                for (let j = 0; j < childs.length; j++) {
                    categories[i].children.push({ label: childs[j].class_name, value: childs[j].class_id, children: [] })
                }
            })
        }
    }

})

function get_category_info(v) {
    selected = v
    selected_class_name = '修改分类：' + selected.label
    // console.log(selected)
    // console.log(selected.class_name)
    before.class_name = selected.label
    api.reqApi('/category/myParent', { tel: route.query.tel, session: route.query.session, class_id: selected.value }).then((res) => {
        // console.log(res.data.msg)
        if (res.data.msg == -1) {
            before.parent_name = '根类'
            after.parent_name = '根类'
            after.parent_id = -1
            return
        }
        before.parent_name = res.data.msg[0].class_name
        // after.parent_name = res.data.msg[0].class_name
        // console.log(categories_have_root)
        after.parent_id = 12
        // after.parent_id = res.data.msg[0].class_id
    })
}

function get_childs(v) {
    // console.log(v)
    after.parent_name = v.label
    // console.log(after.parent_name)
    api.reqApi('/category/showChild', { tel: route.query.tel, session: route.query.session, parent_id: v.value }).then((res) => {
        const childs = res.data.data
        // console.log(childs)
        for (let i = 0; i < childs.length; i++) {
            api.reqApi('/category/showChild', { tel: route.query.tel, session: route.query.session, parent_id: childs[i].class_id }).then((res) => {
                const childs2 = res.data.data
                for (let j = 0; j < childs2.length && v.children[i].children.length != childs2.length; j++) {
                    v.children[i].children.push({ label: childs2[j].class_name, value: childs2[j].class_id, children: [] })
                }
                // console.log(v.children[i].children)
            })
        }
        // console.log(chi)
    })
}

function get_childs_and_category_info(v) {

    get_childs(v)
    get_category_info(v)
}


</script>

<style>

</style> 

