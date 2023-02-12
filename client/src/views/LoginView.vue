<template>
    <el-container>
        <div class="root">
            <el-header height="80px">
                <div class="logo">
                </div>
                <!-- <img style=" display: block;" src="../assets/logo.png" alt="" width="400"> -->
            </el-header>
            <!-- 登录 -->
            <el-main class="el-main">
                <div style="background-color: bisque;   display: flex;justify-content: center; ">
                    <div style="display: inline-block;background-color: aquamarine;">
                        <el-form ref="ruleFormRef" :model="ruleForm" label-width="100px" style="max-width: 460px">
                            <el-form-item class="el-form-item" label="tel">
                                <el-input class="el-input" v-model="ruleForm.tel" />
                            </el-form-item>
                            <el-form-item class="el-form-item" label="password">
                                <el-input class="el-input" v-model="ruleForm.psw" />
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="buttons_outer">
                    <div class="buttons_inner">
                        <el-button type="primary" @click="submitForm(ruleFormRef)">登陆</el-button>
                        <el-button type="info">
                            <router-link to="/register" style="color: black;">
                                注册
                            </router-link>
                        </el-button>
                    </div>
                </div>

            </el-main>
            <!-- <el-button :plain="true" @click="open4">error</el-button> -->
        </div>
    </el-container>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import api from '../api'
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'//import type 是用来协助进行类型检查和声明的，在运行时是完全不存在的。

import { useRouter } from 'vue-router'
const router = useRouter()

let clientWidth = document.body.clientWidth;
console.log(clientWidth)


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
            api.Login(
                { tel: ruleForm.tel, password: ruleForm.psw }
            ).then(res => {
                //把后端返回的数据打印下来
                // console.log('login response data', res.data.code)
                if (res.data.code == 0) {
                    // console.log(res.data.msg)
                    ElMessage.error(res.data.msg)
                } else {
                    // console.log(res.data.data)
                    api.session = res.data.data
                    ElMessage({
                        message: '登陆成功',
                        type: 'success',
                    })
                    router.push({ path: 'items', query: { tel: ruleForm.tel, session: api.session } })
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
@media (min-width: 1024px) {
    .logo {
        width: 400px;
        height: 100%;
        background-image: url(../assets/logo.png);
        background-size: 100% 100%;
    }

    .el-main {
        background-color: blue;
        /* display: flex;
        justify-content: center; */
    }

    .root {
        width: 40%;
        background-color: beige;
        margin: 0 auto;

    }

    .buttons_inner {
        display: inline-block;
        background-color: cadetblue;
        /* margin: 0 auto; */
        /* padding: 10px; */
    }

    .buttons_outer {
        /* padding: 0 auto; */
        background-color: burlywood;
        /* width: 300px; */
        display: flex;
        justify-content: center;
        margin: 10px 0;
    }

    .el-input {
        width: 300px;
    }

    .el-form-item {
        margin: 30px 0;
    }
}
</style>