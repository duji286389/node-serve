/*
  搭建express框架的服务器
*/
// 引入express模块
const { query } = require('express');
var express = require('express');
// 引入mysql工具包
var mysql = require('mysql');
console.log(express);

var app = express();

/*
 通过中间件来进行乱码处理
    req:请求对象
    resp:响应对象
    next:允许执行后面的请求
 */

app.use(function (req, resp, next) {
    //中文乱码处理
    resp.header('Content-Type', 'text/html;charset=utf-8');
    next();
});

//设置跨域请求
app.all('*', function (req, res, next) {
    //设置请求头
    //允许所有来源访问
    res.header('Access-Control-Allow-Origin', '*')
    //用于判断request来自ajax还是传统请求
    res.header("Access-Control-Allow-Headers", " Origin, X-Requested-With, Content-Type, Accept");
    //允许访问的方式
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    //修改程序信息与版本
    res.header('X-Powered-By', ' 3.2.1')
    //内容类型：如果是post请求必须指定这个属性
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
})
//创建路由器
var routes = function (app) {
    var conn = mysql.createConnection({
        host: 'localhost',  //mysql连接数据库ip地址
        user: 'root',       //用户名
        password: 'hello123',  //密码
        port: '3306',           //端口号 
        database: 'n200406',      //数据库名
        timezone: 'SYSTEM'    //设置时区
    });
    app.get('/api/allorder', function (req, resp) {
        var sql = 'select * from `order`';
        conn.query(sql, [], function (err, rs) {
            if (err) {
                resp.send('{"count":0}');
            } else {
                resp.send(rs);
            }
        });
    })
    //新增
    app.get('/api/addo', function (req, resp) {
        //获取商品信息
        var order_name = req.query.order_name;
        var order_price = req.query.order_price;
        var order_desc = req.query.order_desc;
        //执行新增
        var sql = 'insert into `order` (order_name,order_price,order_desc) values(?,?,?)';
        var arr = [order_name, order_price, order_desc];
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                resp.send('添加失败');
            } else {
                resp.send('添加成功');
            }
        });
    });
    //删除
    app.get('/api/delo', function (req, resp) {
        //获取选中商品的id
        var id = req.query.id;
        //执行sql语句(sql注入攻击)
        var sql = 'delete from order where id = ?';
        var arr = [id];
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                console.log(err.message);
                resp.send('{"count":0}');
            } else {
                resp.send('{"count":1}');
            }
        });
    });
    //修改
    app.post('/api/updateo', function (req, resp) {
        //获取修改的数据
        var id = req.query.id;
        var order_name = req.query.order_pname;
        var order_price = req.query.order_price;
        var order_desc = req.query.order_desc;
        //执行sql语句
        var sql = 'update order set order_anme = ?,order_price =?,order_desc = ? where id = ?';
        var arr = [order_name, order_price, order_desc, id];
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                console.log(err.message);
                resp.end('{"count":0}');
            } else {
                resp.end('{"count":1}');
            }
        });
    });
    app.get('/api/loadProduct', function (req, resp) {
        var pageSize = parseInt(req.query.pageSize);
        var newPage = parseInt(req.query.newPage);
        var sql = `SELECT * FROM product  limit ${(newPage - 1) * pageSize},${pageSize}`;
        conn.query(sql, [], function (err, rs) {
            for (var i = 0; i < rs.length; i++) {
                if (rs[i].state > 0) {
                    rs[i].state = true;
                } else {
                    rs[i].state = false;
                }
            }
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send(rs);
            }
        });
    });
    app.get('/api/loadwenzhang', function (req, resp) {
        var pageSize = parseInt(req.query.pageSize);
        var newPage = parseInt(req.query.newPage);
        var sql = `SELECT * FROM wenzhang  limit ${(newPage - 1) * pageSize},${pageSize}`;
        conn.query(sql, [], function (err, rs) {
            for (var i = 0; i < rs.length; i++) {
                if (rs[i].state > 0) {
                    rs[i].state = true;
                } else {
                    rs[i].state = false;
                }
            }
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send(rs);
            }
        });
    });
    app.get('/api/serachwenzhang', function (req, resp) {
        var title = req.query.title;
        console.log(p_name);
        var sql = `SELECT * FROM wenzhang where title like '%${title}%'`;
        conn.query(sql, [title], function (err, rs) {
            for (var i = 0; i < rs.length; i++) {
                if (rs[i].state > 0) {
                    rs[i].state = true;
                } else {
                    rs[i].state = false;
                }
            }
            if (err) {
                console.log(err.message, '报错了');
            } else {
                console.log(rs);
                resp.send(rs);
            }
        });
    })

    app.get('/api/updataid', function (req, resp) {
        var id = req.query.id;
        // 查询所有用户
        var sql = 'select * from product where id = ?';
        var arr = [id];
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send(rs[0]);
            }

        });
    })
    app.get('/api/deletewenzhang', function (req, resp) {
        var id = req.query.id;
        var sql = 'delete from wenzhang where id = ?';
        var arr = [id];
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send('success');
            }
        });
    })
    app.get('/api/editwenzhang', function (req, resp) {
        var title = req.query.title;
        var author = req.query.author;
        var desc = req.query.desc;
        var text = req.query.text;
        var id = req.query.id;
        var sql = 'update wenzhang set title = ?,author=?,`desc`=?,text=? where id = ?';
        var arr = [title, author, desc, text, id];
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send('success');
            }
        });
    })
    app.get('/api/getwenzhangid', function (req, resp) {
        var id = req.query.id;
        // 查询所有用户
        var sql = 'select * from wenzhang where id = ?';
        var arr = [id];
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send(rs[0]);
            }

        });
    })
    app.get('/api/addwenzhang', function (req, resp) {
        var title = req.query.title;
        var author = req.query.author;
        var desc = req.query.desc;
        var text = req.query.text;
        var sql = 'insert into wenzhang(title,author,`desc`,text) values(?,?,?,?);';
        var arr = [title, author, desc, text];
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send('success');
            }
        });
    })
    app.get('/api/allwenzhang', function (req, resp) {
        // 查询所有用户
        var sql = 'select * from wenzhang';
        conn.query(sql, [], function (err, rs) {
            for (var i = 0; i < rs.length; i++) {
                if (rs[i].state > 0) {
                    rs[i].state = true;
                } else {
                    rs[i].state = false;
                }
            }
            if (err) {
                console.log(err.message, '报错了');
            } else {
                let obj = {};
                obj = rs;
                let str = JSON.stringify(obj);
                resp.send(str);

            }
        });

    });
    app.get('/api/getmenu', function (req, resp) {
        var sql = 'select * from submenu';
        conn.query(sql, [], function (err, rs) {
            if (err) {
                console.log(err.message, '报错了');
            } else {
                let obj = {};
                obj = rs;
                let str = JSON.stringify(obj);
                resp.send(str);
            }
        });
    })
    app.post('/api/upload', function (req, resp) {
        var url = req.query.url;
        console.log(url);
    })
    app.get('/api/load', function (req, resp) {
        var pageSize = parseInt(req.query.pageSize);
        var newPage = parseInt(req.query.newPage);
        var sql = `SELECT * FROM p_user  limit ${(newPage - 1) * pageSize},${pageSize}`;
        conn.query(sql, [], function (err, rs) {
            for (var i = 0; i < rs.length; i++) {
                if (rs[i].state > 0) {
                    rs[i].state = true;
                } else {
                    rs[i].state = false;
                }
            }
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send(rs);
            }
        });
    });
    app.get('/api/queryUser', function (req, resp) {
        var username = req.query.username;
        var sql = `SELECT * FROM p_user where username like '%${username}%'`;
        conn.query(sql, [], function (err, rs) {
            for (var i = 0; i < rs.length; i++) {
                if (rs[i].state > 0) {
                    rs[i].state = true;
                } else {
                    rs[i].state = false;
                }
            }
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send(rs);
            }
        });
    })
    app.get('/api/editUser', function (req, resp) {
        var username = req.query.username;
        var password = req.query.password;
        var email = req.query.email;
        var role = req.query.role;
        var id = req.query.id;
        var sql = 'update p_user set username = ?,password = ?,email = ?,role = ? where id = ?';
        var arr = [username, password, email, role, id];
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send('success');
            }
        });

    })
    app.get('/api/getUpdate', function (req, resp) {
        var id = req.query.id;
        // 查询所有用户
        var sql = 'select * from p_user where id = ?';
        var arr = [id];
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send(rs[0]);
            }

        });
    })
    app.post('/api/addUser', function (req, resp) {
        var username = req.query.username;
        var password = req.query.password;
        var email = req.query.email;
        var role = req.query.role;
        var state = role == '超级管理员' ? 1 : 0;
        var sql = 'insert into p_user(username,`password`,email,role,state) values(?,?,?,?,?);';
        var arr = [username, password, email, role, state];
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send('success');
            }
        });


    })
    app.get('/api/deleteUser', function (req, resp) {
        var id = req.query.id;
        var sql = 'delete from p_user where id = ?';
        var arr = [id];
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send('success');
            }
        });
    })
    app.get('/api/userState', function (req, resp) {
        var id = req.query.id;
        var state = req.query.state == 'true' ? 1 : 0;
        var sql = 'update p_user set state = ? where id = ?';
        var arr = [state, id];
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                console.log(err.message, '报错了');
            } else {
                resp.send('success');
            }
        });
    })
    app.get('/api/allUser', function (req, resp) {
        // 查询所有用户
        var sql = 'select * from p_user';
        conn.query(sql, [], function (err, rs) {
            for (var i = 0; i < rs.length; i++) {
                if (rs[i].state > 0) {
                    rs[i].state = true;
                } else {
                    rs[i].state = false;
                }
            }
            if (err) {
                console.log(err.message, '报错了');
            } else {
                let obj = {};
                obj = rs.reverse();
                let str = JSON.stringify(obj);
                resp.send(str);
            }
        });

    });
    app.get('/api/getmenu', function (req, resp) {
        var sql = 'select * from submenu';
        conn.query(sql, [], function (err, rs) {
            if (err) {
                console.log(err.message, '报错了');
            } else {
                let obj = {};
                obj = rs;
                let str = JSON.stringify(obj);
                resp.send(str);
            }
        });

    });

    app.get('/api/login', function (req, resp) {
        var username = req.query.username;
        var password = req.query.password;
        var arr = [username, password];
        var sql = 'select * from p_user where username = ? and password = ?';
        conn.query(sql, arr, function (err, rs) {
            if (err) {
                resp.end(err.message, '报错了');
                return;
            } else {
                if (rs !== null) {
                    let obj = {};
                    obj = rs;
                    var str = JSON.stringify(obj);
                    var arr2 = JSON.parse(str)
                    var person = arr2[0];
                    if (person.state > 0 && person.role == '超级管理员') {
                        resp.send('ok');
                    } else {
                        resp.send('fail');
                    }

                }
            }
        });
    });






}
routes(app);
app.listen('9000', function () {
    console.log(9000, '服务器启动', "http://localhost:9000");
});