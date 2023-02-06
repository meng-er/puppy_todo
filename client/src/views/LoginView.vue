<template>
    <div class="common-layout">
        <el-container>
            <el-header style="background-color: aqua;">
                <!-- <img src="../。assets/logo.png" alt="" width="600"> -->
            </el-header>
            <!-- 登录 -->
            <el-main style="background-color: blue;">
                <div class="value">
                    <el-form ref="ruleFormRef" :model="ruleForm" label-width="100px" style="max-width: 460px">
                        <el-form-item label="tel">
                            <el-input v-model="ruleForm.tel" />
                        </el-form-item>
                        <el-form-item label="password">
                            <el-input v-model="ruleForm.psw" />
                        </el-form-item>
                    </el-form>

                    <el-button type="primary" plain @click="submitForm(ruleFormRef)">登陆</el-button>
                    <el-button plain>
                        <router-link to="/register">
                            注册
                        </router-link>
                    </el-button>
                </div>
            </el-main>
            <!-- <el-button :plain="true" @click="open4">error</el-button> -->
        </el-container>
    </div>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import User from '../apir
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'//import type 是用来协助进行类型检查和声明的，在运行时是完全不存在的。

import { useRouter } from 'vue-router'
const router = useRouter()





const ruleForm = reactive({
    tel: '13388110101',
    psw: '123',
})

const ruleFormRef = ref<FormInstance>()//https://cn.vuejs.org/guide/typescript/composition-api.html#typing-ref
// console.log(ruleFormRef)


const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            // console.log(ruleForm)
            //🦦看这里看这里！是这在用
            User.Login(
                { tel: ruleForm.tel, password: ruleForm.psw }
            ).then(res => {
                //把后端返回的数据打印下来
                // console.log('login response data', res.data.code)
                if (res.data.code == 0) {
                    // console.log(res.data.msg)
                    ElMessage.error(res.data.msg)
                } else {
                    // console.log(res.data.data)
                    User.session = res.data.data
                    ElMessage({
                        message: '登陆成功',
                        type: 'success',
                    })
                    router.push({ path: 'items', query: { tel: ruleForm.tel, session: User.session } })
                }
            })
        } else {
            // console.log('error submit!')
            return false
        }
    })
}
</script>
<style>
@media (min-width: 1024px) {}
</style>