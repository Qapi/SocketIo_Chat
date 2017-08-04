/**
 * 简易聊天室主入口
 * Created by wangp on 2017/8/2.
 */
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
let clientNum = 1;
let currentIp;

server.listen(8090);
app.use(express.static(path.join(__dirname, 'public')));// 配置静态资源目录
app.get('/', (req, res) => {
    res.sendfile(__dirname + '/index.html');
    //获取客户端ip
    currentIp = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (currentIp.split(',').length > 0) {
        currentIp = currentIp.split(',')[0]
    }
    ++clientNum;
});

io.on('connection', (socket) => {
    console.log('a user connected:' + currentIp);
    socket.emit('init data', currentIp, clientNum); // 发送客户端Ip
    io.emit('new client', currentIp, clientNum);
    socket.on('chat message', function (msg, fn) {
        io.emit('chat message', msg);
        fn('server have received');
    });
    socket.on('i leave', (ip) => {
        currentIp = ip;
        console.log('user disconnected:' + ip);
    });
    socket.on('disconnect', () => {
        --clientNum;
        io.emit('someone leave', currentIp, clientNum);
    });
});