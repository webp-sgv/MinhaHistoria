function saveFormContact() {
    event.preventDefault();
    const elSplashLoad = document.getElementsByClassName("splashFormContact")[0];
    const inputName = document.getElementById("validationCustomYouName");
    const inputEmail = document.getElementById("validationCustomYouEmail");
    const inputText = document.getElementById("validationCustomYouAssunt");
    const { identificador } = !JSON.parse(sessionStorage.getItem('profileSelected')) ? { "identificador": 1 } : JSON.parse(sessionStorage.getItem('profileSelected'));

    let newObj = {};
    newObj.nome = inputName.value;
    newObj.email = inputEmail.value;
    newObj.texto = inputText.value;
    newObj.identificador = identificador;

    elSplashLoad.classList.remove("d-none");

    socket.emit('saveContactForm', newObj);
};