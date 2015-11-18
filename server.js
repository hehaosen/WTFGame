/**
 * 模块依赖
 */
var express=require('express'),
    sio=require('socket.io');

/**
 * 创建app
 */

app=express.createServer(
    express.bodyParser(),
    express.static('public')
);

/**
 * 监听
 */
app.listen(3000);


var io=sio.listen(app);

io.sockets.on('connection',function(socket){
    socket.on('join',function(name){
        socket.nickname=name;
        console.log(name+'----登录了世界!!!');
    });
    socket.on('move',function(msg){
        console.log(msg);
        socket.broadcast.emit('position',JSON.stringify({pos:msg,id:socket.id}));
    });
});

