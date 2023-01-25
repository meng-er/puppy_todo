const axios = require('axios')
console.log("todolist请求端")
var session;

/*
//登陆+新增item
axios.get('http://localhost:8080/login', {
    params: {
        tel: '13388110101',
        password: '123'
    }
})
    .then(function (response) {
        // console.log(response.data.session);
        session = response.data.session
        console.log("session" + session)
        if (response.data.code == 1) {
            console.log("登陆成功")
        } else {
            console.log("密码错误")
        }
        axios.get('http://localhost:8080/todoList/new', {
            params: {
                tel: '13388110101',
                session: session,
                title: '吃饭',
                note: '碗杂面',
                start: '2022-12-24 12:00:00',
                end: '',
                class_name: 'life',
                parent_id: '-1'
            }
        })
    })
    .catch(function (error) {
        console.log(error);
    });
*/

/*
//登陆+新增种类
axios.get('http://localhost:8080/login', {
    params: {
        tel: '13388110101',
        password: '123'
    }
})
    .then(function (response) {
        // console.log(response.data.session);
        session = response.data.session
        console.log("session" + session)
        if (response.data.code == 1) {
            console.log("登陆成功")
        } else {
            console.log("密码错误")
        }
        axios.get('http://localhost:8080/category/new', {
            params: {
                tel: '13388110101',
                session: session,
                class_name: 'hoa',
                parent_id: '2'
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
//登陆+修改类别
axios.get('http://localhost:8080/login', {
    params: {
        tel: '13388110101',
        password: '123'
    }
})
    .then(function (response) {
        // console.log(response.data.session);
        session = response.data.session
        console.log("session:" + session)
        if (response.data.code == 1) {
            console.log("登陆成功")
        } else {
            console.log("密码错误")
        }
        axios.get('http://localhost:8080/category/modify', {
            params: {
                tel: '13388110101',//不能改
                session: session,
                before: {
                    class_name: 'life',//可以改
                    parent_id: '4'//
                },
                after:{
                    class_name: 'eat',
                    parent_id: '4'//
                }


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
axios.get('http://localhost:8080/login', {
    params: {
        tel: '13388110101',
        password: '123'
    }
})
    .then(function (response) {
        // console.log(response.data.session);
        session = response.data.session
        console.log("session:" + session)
        if (response.data.code == 1) {
            console.log("登陆成功")
        } else {
            console.log("密码错误")
        }
        axios.get('http://localhost:8080/category/show', {
            params: {
                tel: '13388110101',
                session: session,
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
//登陆+新增item
axios.get('http://localhost:8080/login', {
    params: {
        tel: '13388110101',
        password: '123'
    }
})
    .then(function (response) {
        // console.log(response.data.session);
        session = response.data.session
        console.log("session:" + session)
        if (response.data.code == 1) {
            console.log("登陆成功")
        } else {
            console.log("密码错误")
        }
        axios.get('http://localhost:8080/item/new', {
            params: {
                tel: '13388110101',
                session: session,
                title: '恰饭',
                note: '',
                start: '2023-3-25 13:02:23',
                end: '2023-3-25 13:02:23',
                class_name: ''
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
//新增+修改item
axios.get('http://localhost:8080/login', {
    params: {
        tel: '13388110101',
        password: '123'
    }
})
    .then(function (response) {
        // console.log(response.data.session);
        session = response.data.session
        console.log("session:" + session)
        if (response.data.code == 1) {
            console.log("登陆成功")
        } else {
            console.log("密码错误")
        }
        axios.get('http://localhost:8080/item/modify', {
            params: {
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
//登陆+showitmes
axios.get('http://localhost:8080/login', {
 params: {
     tel: '13388110101',
     password: '123'
 }
})
 .then(function (response) {
     // console.log(response.data.session);
     session = response.data.session
     console.log("session:" + session)
     if (response.data.code == 1) {
         console.log("登陆成功")
     } else {
         console.log("密码错误")
     }
     axios.get('http://localhost:8080/item/show', {
         params: {
             tel: '13388110101',
             session: session,
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
//登陆+删除类别
axios.get('http://localhost:8080/login', {
    params: {
        tel: '13388110101',
        password: '123'
    }
})
    .then(function (response) {
        // console.log(response.data.session);
        session = response.data.session
        console.log("session:" + session)
        if (response.data.code == 1) {
            console.log("登陆成功")
        } else {
            console.log("密码错误")
        }
        axios.get('http://localhost:8080/category/delete', {
            params: {
                tel: '13388110101',
                session: session,
                class_id: '7'
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
//登陆+删除item
axios.get('http://localhost:8080/login', {
    params: {
        tel: '13388110101',
        password: '123'
    }
})
    .then(function (response) {
        // console.log(response.data.session);
        session = response.data.session
        console.log("session:" + session)
        if (response.data.code == 1) {
            console.log("登陆成功")
        } else {
            console.log("密码错误")
        }
        axios.get('http://localhost:8080/item/delete', {
            params: {
                tel: '13388110101',
                session: session,
                item_id: '5'
            }
        })
            .then(function (response) {
                console.log(response.data)
            })
    })
    .catch(function (error) {
        console.log(error);
    });