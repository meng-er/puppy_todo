//前端
const axios = require('axios')
console.log("请求端")
var session;


/*
//登陆
axios.post('http://localhost:8080/login', {
    'tel': '13388110101',
    'password': '123'
})
    .then(function (response) {
        // console.log(response.data.session);
        session = response.data.session
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error);
    });
*/

// 登陆+改密码
/*
axios.get('http://localhost:8080/login', {
    params: {
        tel: '13388110101',
        password: '123'
    }
})
    .then(function (response) {
        // console.log(response.data.session);
        session = response.data.session
        console.log(session)
        if (response.data.code ==1) {
            axios.get('http://localhost:8080/resetPwd', {
                params: {
                    tel: '13388110101',
                    originalPwd: '123',
                    newPwd: '000000',
                    session: session+''
                }
            })
                .then(function (response) {
                    console.log(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            console.log("密码错误")
        }
    })
    .catch(function (error) {
        console.log(error);
    });
*/
/*
//注册
axios.post('http://localhost:8080/register', {
    'tel': '12308117100',
    'password': '123'

})
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });
*/

//登陆+修改密码
axios.post('http://localhost:8080/login', {
    'tel': '13388110101',
    'password': '123'
})
    .then(function (response) {
        session = response.data.data
        console.log(session)
        axios.post('http://localhost:8080/resetPwd', {
            'tel': '13388110101',
            'originalPwd': '123',
            'newPwd': '000',
            'session': session + ''

        })
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    })
    .catch(function (error) {
        console.log(error);
    });


/*
nodehttp模块写法
http.get('http://localhost:8080/login?name=testuer&password=123', res => {
    let data = '';
    res.on('data', function (chunk) {
        data += chunk;
        console.log("" + chunk)
    })

    res.on('end', function () {
        console.log(data);
    })

})
*/
