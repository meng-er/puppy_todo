const axios = require('axios')
const fs = require('fs')//node的file system，核心模块无需下载
const path = require('path');//核心模块无需下载
const file_name = path.basename('../pic/test.jpg');//获取文件名
let bitmap = fs.readFileSync('../pic/test.jpg');//获取buffer

axios.post('http://localhost:8080/file', {
    'file_name': file_name,
    'bitmap': bitmap
})
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });