socket.on('listProfiles', function(data) {
    countLoadPage += 1;
    sessionStorage.setItem('listProfiles', JSON.stringify(data));
    dirProfile(data);
});

socket.on('dataHello', function(data) {
    countLoadPage += 1;
    sessionStorage.setItem('dataHello', JSON.stringify(data));
    pageSetHello(data);
});

socket.on('dataAbout', function(data) {
    countLoadPage += 1;
    sessionStorage.setItem('dataAbout', JSON.stringify(data));
    pageSetAbout(data);
});

socket.on('dataPictures', function(data) {
    countLoadPage += 1;
    sessionStorage.setItem('dataPictures', JSON.stringify(data));
    pageSetListFlipCard(data);
});

socket.on('dataWorks', function(data) {
    countLoadPage += 1;
    sessionStorage.setItem('dataWorks', JSON.stringify(data));
    pageSetWorks(data);
});

socket.on('dataContactPreview', function(data) {
    countLoadPage += 1;
    sessionStorage.setItem('dataContactPreview', JSON.stringify(data));
    pageSetContactPreview(data);
    hideSplashLoad();
    console.log({"tipo": "server end load", "data": countLoadPage});
});

socket.on('dataContactForm', function(data) {
    sessionStorage.setItem('dataContactForm', JSON.stringify(data));
    pageListContactForm(data);
});

socket.on('responseSaveContactForm', function(data) {
    const buttonMessages = document.getElementById("pills-profile-tab");
    const inputName = document.getElementById("validationCustomYouName");
    const inputEmail = document.getElementById("validationCustomYouEmail");
    const inputText = document.getElementById("validationCustomYouAssunt");

    inputName.value = "";
    inputText.value = "";

    buttonMessages.click();

    const elSplashLoad = document.getElementsByClassName("splashFormContact")[0];
    elSplashLoad.classList.add("d-none");
});

socket.on('responseDeleteItem', function(data) {
    const { id } = data;
    let elMasterMsgContactForm = document.querySelector(`[data-div-id="${id}"]`);
    let elMasterDivListContact = document.querySelector('#listContactForm');
    
    elMasterMsgContactForm.remove();
    console.log(elMasterDivListContact.childElementCount);

    if (elMasterDivListContact.childElementCount < 1) {
        pageRefreshListContactForm();
    };
    
});