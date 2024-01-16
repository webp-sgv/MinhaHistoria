var host = window.location.hostname;
var socket = io(window.location.protocol == 'https:' ? host : window.host + ':8080');

socket.on('listProfiles', function(data) {
    dirProfile(data);
});

setTimeout(() => {
    socket.emit('getProfiles', {});
}, 1000);