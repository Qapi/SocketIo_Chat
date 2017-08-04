let myIp;// 客户端ip
// 更新消息
function updateNews(msg) {
    $('#messages').append($('<li>').text(msg));
}
$(() => {
    var socket = io.connect('http://localhost:8090');
    $('form').submit(() => {
        var m = $('#m');
        socket.emit('chat message', myIp + ':' + m.val(), function (data) {
            console.log(data);
        });
        m.val('');
        return false;
    });
    socket.on('init data', (ip, num) => {
        myIp = ip;
        $('#onlineNum').text(num);
    });
    socket.on('new client', (ip, num) => {
        updateNews('==>' + ip + ' 加入了聊天室,让我们欢迎ta！<==');
        $('#onlineNum').text(num);
    });
    socket.on('disconnect', () => {
        socket.emit('i leave', myIp);
    });
    socket.on('someone leave', (ip, num) => {
        updateNews('==>' + ip + ' 离开了聊天室！<==');
        $('#onlineNum').text(num);
    });
    socket.on('chat message', (msg) => {
        updateNews(msg);
    });
});