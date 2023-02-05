const express = require("express");
const app = express();
var bodyParser = require('body-parser')//中间件
let fs = require('fs')
var path = "../pic";//修改成自己的路径

var jsonParser = bodyParser.json({
    limit: '50mb'
})

app.use(jsonParser)

app.post('/file', function (req, res) {
    // var data = req.body.bitmap.data
    //data,是读取到的数据，二进制数据，将data写入到文件中
    // console.log(req.body.bitmap.data)
    var data = Buffer.from(req.body.bitmap.data)//转成buffer对象
    // console.log(data)
    fs.writeFile(path + '/' + req.body.file_name, data, function (err) {
        if (!err) {
            console.log("文件写入成功");
            res.send({ 'msg': "写入成功", 'code': 1, 'path': path + '/' + req.body.file_name, data })
        } else {
            console.log(err)
        }
    });
})
app.listen(8080, () => {
    console.log("server start")
})