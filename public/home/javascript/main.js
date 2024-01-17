var host = window.location.hostname;
var socket = io(window.location.protocol == 'https:' ? host : window.host + ':8080');

socket.on('listProfiles', function(data) {
    sessionStorage.setItem('listProfiles', JSON.stringify(data));
    dirProfile(data);
});

socket.on('dataHello', function(data) {
    sessionStorage.setItem('dataHello', JSON.stringify(data));
    pageSetHello(data);
});

socket.on('dataAbout', function(data) {
    sessionStorage.setItem('dataAbout', JSON.stringify(data));
    pageSetAbout(data);
});

socket.on('dataPictures', function(data) {
    sessionStorage.setItem('dataPictures', JSON.stringify(data));
    pageSetListFlipCard(data);
});

setTimeout(() => {
    socket.emit('getProfiles', {});
}, 500);