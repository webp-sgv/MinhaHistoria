function pageSetHello(data) {
    let { titulo, subtitulo, tituloBotao, urlBotao } = data[0];
    let elTitulo = document.getElementById("titulo1");
    let elSubtitulo = document.getElementById("titulo2");
    let elBotao = document.getElementById("butaoservices");
    
    elTitulo.innerHTML = titulo;
    elSubtitulo.innerHTML = subtitulo;
    elBotao.innerHTML = tituloBotao;
    elBotao.setAttribute('href', urlBotao);
};

function pageSetAbout(data) {
    let { titulo, subtitulo } = data[0];

    const elTituloAbout = document.getElementById('tituloAbout');
    const elSubtituloAbout = document.getElementById('subtituloAbout');

    elTituloAbout.innerHTML = titulo;
    elSubtituloAbout.innerHTML = subtitulo;
};

function pageSetListFlipCard(data) {
    const elUlListFlipCardProfile = document.getElementById('/flipCardAboutImgProfile');
    elUlListFlipCardProfile.innerHTML = "";
    for (row in data.list) {
        elUlListFlipCardProfile.innerHTML += `
            <li class="card-group-flip">
                <img src="home/img/${data.path}/profile/${data.list[row]}"></img>
            </li>
        `;
    };
};