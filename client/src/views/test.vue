<template>
    <el-container>
        <el-tree-select @node-expand="node_expand1" @change="change" @node-click="click" v-model="value2" :data="data" />
    </el-container>
</template>


<script setup>
import { reactive, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import api from '../api'
import { useRoute, useRouter } from 'vue-router'
import { Check } from '@element-plus/icons-vue'

const value2 = ref(2)
const data = reactive([
    {
    value: 1,
    label: '一级 1',
    children: [{
        value: 2,
        label: '二级 1-1',
        children: [{
            value: 3,
            label: '三级 1-1-1'
        }]
    }]
}
])

function node_expand1()
{
    console.log("node-expand")
}
function change(v) {
    console.log(v)
    console.log(value2)
}
function click(v) {
    console.log("click")
    console.log(v)
}


</script>

<style>

</style> 

