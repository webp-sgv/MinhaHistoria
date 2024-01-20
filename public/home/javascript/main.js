var host = window.location.hostname;
var socket = io(window.location.protocol == 'https:' ? host : window.host + ':8080');
moment.locale = "pt-br";

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

socket.on('dataWorks', function(data) {
    sessionStorage.setItem('dataWorks', JSON.stringify(data));
    pageSetWorks(data);
});

socket.on('dataContactPreview', function(data) {
    sessionStorage.setItem('dataContactPreview', JSON.stringify(data));
    pageSetContactPreview(data);
    hideSplashLoad();
});

socket.on('dataContactForm', function(data) {
    sessionStorage.setItem('dataContactForm', JSON.stringify(data));
    pageListContactForm(data);
});

socket.on('responseSaveContactForm', function(data) {
    const elSplashLoad = document.getElementsByClassName("splashFormContact")[0];
    elSplashLoad.classList.add("d-none");
});

setTimeout(() => {
    socket.emit('getProfiles', {});
}, 1000);