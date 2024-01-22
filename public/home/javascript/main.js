var host = window.location.hostname;
var socket = io(window.location.protocol == 'https:' ? host : window.host + ':8080');
var countLoadPage = 0;
var maxCountLoadPage = 6;

setTimeout(() => {
    countLoadPage = 0;
    socket.emit('getProfiles', {});
}, 1000);