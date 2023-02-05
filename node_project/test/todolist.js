const axios = require('axios')
const fs = require('fs')
console.log("todolist请求端")
var session;

/*
//登陆+新增item
axios.post('http://localhost:8080/login', {

        tel: '13388110101',
        password: '123'
    
})
    .then(function (response) {
        // console.log(response.data.data);
        session = response.data.data
        console.log("session" + session)
        if (response.data.code == 1) {
            console.log("登陆成功")
        } else {
            console.log("密码错误")
        }
        axios.post('http://localhost:8080/todoList/new', {

                tel: '13388110101',
                session: session,
                title: '吃饭',
                note: '碗杂面',
                start: '2022-12-24 12:00:00',
                end: '',
                class_name: 'life',
                parent_id: '-1'
            
        })
    })
    .catch(function (error) {
        console.log(error);
    });
*/

/*
//登陆+新增种类
axios.post('http://localhost:8080/login', {
    tel: '13388110101',
    password: '123'

})
    .then(function (response) {
        console.log("response:")
        console.log(response.data);
        session = response.data.data
        console.log("session:" + session)
        axios.post('http://localhost:8080/category/new', {
            tel: '13388110101',
            session: session,
            class_name: 'ho',
            parent_id: '7'

        })
            .then(function (response) {
                console.log(response.data)
            })

    })
    .catch(function (error) {
        console.log(error);
    });

*/
/*
//登陆+修改类别
axios.post('http://localhost:8080/login', {

    tel: '13388110101',
    password: '123'

})
    .then(function (response) {
        // console.log(response.data.data);
        session = response.data.data

        axios.post('http://localhost:8080/category/modify', {
            tel: '13388110101',//不能改
            session: session,
            before: {
                class_name: 'life',//可以改
                parent_id: '-1'//
            },
            after: {
                class_name: 'eat',
                parent_id: '7'//
            }

        })
            .then(function (response) {
                console.log(response.data)
            })
    })
    .catch(function (error) {
        console.log(error);
    });
*/

/*
//登陆+show类别列表
axios.post('http://localhost:8080/login', {

        tel: '13388110101',
        password: '123'
    
})
    .then(function (response) {
        // console.log(response.data.data);
        session = response.data.data
        console.log("session:" + session)
        if (response.data.code == 1) {
            console.log("登陆成功")
        } else {
            console.log("密码错误")
        }
        axios.post('http://localhost:8080/category/show', {

                tel: '13388110101',
                session: session,
        })
            .then(function (response) {
                console.log(response.data)
            })
    })
    .catch(function (error) {
        console.log(error);
    });
*/
/*
//登陆+新增item
axios.post('http://localhost:8080/login', {

    tel: '13388110101',
    password: '123'

})
    .then(function (response) {
        // console.log(response.data.data);
        session = response.data.data
        console.log("session:" + session)

        axios.post('http://localhost:8080/item/new', {
            tel: '13388110101',
            session: session,
            title: '恰饭',
            note: '',
            start: '2023-3-25 13:02:23',
            end: '2023-3-25 13:02:23',
            class_id: ''

        })
            .then(function (response) {
                console.log(response.data)
            })
    })
    .catch(function (error) {
        console.log(error);
    });
*/

//新增+修改item
axios.post('http://localhost:8080/login', {

    tel: '13388110101',
    password: '123'

})
    .then(function (response) {
        // console.log(response.data.data);
        session = response.data.data
        console.log("session:" + session)
        if (response.data.code == 1) {
            console.log("登陆成功")
        } else {
            console.log("密码错误")
        }
        axios.post('http://localhost:8080/item/modify', {

            tel: '13388110101',
            session: session,
            item_id: '3',
            before: {
                title: '恰饭',
                note: '',
                start: '2023-3-25 13:02:23',
                end: '2023-3-25 13:02:23',
                class_id: '7'
            },
            after: {
                title: '恰饭',
                note: '',
                start: '',
                end: '2023-3-25 13:02:23',
                class_id: '8'
            }

        })
            .then(function (response) {
                console.log(response.data)
            })
    })
    .catch(function (error) {
        console.log(error);
    });

/*
//登陆+showitmes
axios.post('http://localhost:8080/login', {
tel: '1338801',
password: '123'

})
.then(function (response) {
    console.log(response.data);
    session = response.data.data
    console.log("session:" + session)
    if (response.data.code == 1) {
        console.log("登陆成功")
    } else {
        console.log("密码错误")
    }
    axios.post('http://localhost:8080/item/show', {

        tel: '13388110101',
        session: session,

    })
        .then(function (response) {
            console.log(response.data)
        })
})
.catch(function (error) {
    console.log(error);
});
*/
/*
//登陆+删除类别
axios.post('http://localhost:8080/login', {
    tel: '13388110101',
    password: '123'

})
    .then(function (response) {
        // console.log(response.data.data);
        session = response.data.data
        console.log("session:" + session)
        if (response.data.code == 1) {
            console.log("登陆成功")
        } else {
            console.log("密码错误")
        }
        axios.post('http://localhost:8080/category/delete', {
            tel: '13388110101',
            session: session,
            class_id: 3

        })
            .then(function (response) {
                console.log(response.data)
            })
    })
    .catch(function (error) {
        console.log(error);
    });
*/
/*
//登陆+删除item
axios.post('http://localhost:8080/login', {

        tel: '13388110101',
        password: '123'
    
})
    .then(function (response) {
        // console.log(response.data.data);
        session = response.data.data
        console.log("session:" + session)
        if (response.data.code == 1) {
            console.log("登陆成功")
        } else {
            console.log("密码错误")
        }
        axios.post('http://localhost:8080/item/delete', {

                tel: '13388110101',
                session: session,
                item_id: '5'
            
        })
            .then(function (response) {
                console.log(response.data)
            })
    })
    .catch(function (error) {
        console.log(error);
    });
*/