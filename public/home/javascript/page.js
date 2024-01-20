const elListContactForm = document.getElementById("listContactForm");

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

function pageSetWorks(data) {
    const { list, path } = data;
    const elDivWorks = document.getElementById("boxWorks");
    elDivWorks.innerHTML = "";

    for (key in list) {
        elDivWorks.innerHTML += `
            <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 trabalhos">

                <div class="spanType rounded-2">
                    <span>Pro</span>
                    <i class="bi bi-star-fill"></i>
                </div>

                <div class="iconNextAndBack rounded-2 ${list[key]['list'].length == 1 ? 'd-none' : ''}">
                    <i data-dir="${list[key]['path']}" data-agent="${path}" data-type="left" class="iLeft bi bi-arrow-left-circle" onclick="arrowControleWorks(this)"></i>
                    <i data-dir="${list[key]['path']}" data-agent="${path}" data-type="right" class="iRight bi bi-arrow-right-circle-fill" onclick="arrowControleWorks(this)"></i>
                </div>

                <img data-dir="${list[key]['path']}" data-agent="${path}" data-index="0" width="100%" class="imgWorks rounded-2 border"
                    src="home/img/${path}/works/${list[key]['path']}/1.png"
                    onerror="this.src='home/img/aplication/png/default work.png'" />

                <div>Arraste o mouse</div>
            </div>
        `;
    };

};

function pageSetContactPreview(data) {
    const elDivContactPreview = document.getElementById("boxContactPreview");
    elDivContactPreview.innerHTML = "";
    for (key in data) {
        const { id, titulo, subtitulo, tipo, createat } = data[key];
        elDivContactPreview.innerHTML += `
            <div id="${id}.${titulo}.${tipo}">
                <h5>${titulo}</h5>
                <p>${subtitulo}</p>
                <p></p>
                <p></p>
            </div>
        `;
    }
};

function pageSetListFlipCard(data) {
    // const elUlListFlipCardProfile = document.getElementById('/flipCardAboutImgProfile');
    // elUlListFlipCardProfile.innerHTML = "";
    // for (row in data.list) {
    //     elUlListFlipCardProfile.innerHTML += `
    //         <li class="card-group-flip">
    //             <img src="home/img/${data.path}/profile/${data.list[row]}"></img>
    //         </li>
    //     `;
    // };
    return true;
};

function pageListContactForm(data) {
    elListContactForm.innerHTML = "";
    if (data.length < 1) {
        elListContactForm.innerHTML += `
            <a class="contactForm list-group-item list-group-item-action" aria-current="true">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1" style="width: 100%;">
                        <p class="card-text placeholder-glow">
                            <span class="placeholder col-6 rounded-2" style="height: 10px;"></span>
                        </p>
                    </h5>
                    <small style="width: 100%;">
                        <p class="card-text placeholder-glow" style="text-align: end;">
                            <span class="placeholder col-4 rounded-2" style="height: 10px;"></span>
                        </p>
                    </small>
                </div>
                <p class="mb-1" style="width: 100%;">
                    <p class="card-text placeholder-glow">
                        <span class="placeholder col-7 rounded-2" style="height: 10px;"></span>
                    </p>
                </p>
            </a>
        `;
        return true;
    }

    for (row in data) {
        const { id, remetente, email_remetente, texto, createat } = data[row];
        elListContactForm.innerHTML += `
            <a data-email="${email_remetente}" data-createat="${createat}" data-form-id="${id}" class="contactForm list-group-item list-group-item-action" aria-current="true">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${remetente}</h5>
                    <small>${moment(new Date(createat)).locale('pt-br').fromNow()}</small>
                </div>
                <p class="mb-1">${texto}</p>
            </a>
        `;
    };
};

function hideSplashLoad() {
    const elSplashLoad = document.getElementsByClassName("caixasplash")[0];
    const elCaixaDeFora = document.getElementsByClassName("caixadefora")[0];
    elSplashLoad.classList.add("d-none");
    elCaixaDeFora.classList.remove("d-none");

};

function arrowControleWorks(el) {
    let dataDirButton = el.getAttribute("data-dir");
    let dataAgentButton = el.getAttribute("data-agent");
    let dataTypeButton = el.getAttribute("data-type");
    let elILeft = document.querySelector(`i[data-type="left"][data-dir="${dataDirButton}"]`);
    let elIRight = document.querySelector(`i[data-type="right"][data-dir="${dataDirButton}"]`);
    let elImgDir = document.querySelector(`.imgWorks[data-dir="${dataDirButton}"][data-agent="${dataAgentButton}"]`);
    let dataIndexImg = elImgDir.getAttribute("data-index");
    let dataSessionWorks = JSON.parse(sessionStorage.getItem("dataWorks"));
    let baseUrl = `home/img/${dataAgentButton}/works/${dataDirButton}/`;
    let dataCacheWorks = dataSessionWorks['list'].filter(index => index.path == dataDirButton)[0]['list']; // [ {...} ]

    if (dataTypeButton == 'left' && dataIndexImg == 0) {
        el.classList.remove("bi-arrow-left-circle-fill");
        el.classList.add('bi-arrow-left-circle');
        return true;
    }

    if (dataTypeButton == 'right' && (parseInt(dataIndexImg) + 1) == dataCacheWorks.length) {
        el.classList.remove("bi-arrow-right-circle-fill");
        el.classList.add('bi-arrow-right-circle');
        return true;
    }

    elILeft.classList.remove('bi-arrow-left-circle');
    elILeft.classList.add('bi-arrow-left-circle-fill');

    elIRight.classList.remove('bi-arrow-right-circle');
    elIRight.classList.add('bi-arrow-right-circle-fill');

    if (dataTypeButton == 'right') {
        if (dataIndexImg == (dataCacheWorks.length - 2)) {
            elIRight.classList.remove("bi-arrow-right-circle-fill");
            elIRight.classList.add('bi-arrow-right-circle');
        }
        elImgDir.setAttribute("data-index", (parseInt(dataIndexImg) + 1));
        elImgDir.setAttribute("src", baseUrl + dataCacheWorks[(parseInt(dataIndexImg) + 1)]);
    } else {
        if (dataIndexImg == 1) {
            elILeft.classList.remove("bi-arrow-left-circle-fill");
            elILeft.classList.add('bi-arrow-left-circle');
        }
        elImgDir.setAttribute("data-index", (parseInt(dataIndexImg) - 1));
        elImgDir.setAttribute("src", baseUrl + dataCacheWorks[(parseInt(dataIndexImg) - 1)]);
    }
};

function pageCreateSplashContactForm() {
    elListContactForm.innerHTML = "";
    elListContactForm.innerHTML += `
        <a class="contactForm list-group-item list-group-item-action" aria-current="true">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1" style="width: 100%;">
                    <p class="card-text placeholder-glow">
                        <span class="placeholder col-6 rounded-2" style="height: 10px;"></span>
                    </p>
                </h5>
                <small style="width: 100%;">
                    <p class="card-text placeholder-glow" style="text-align: end;">
                        <span class="placeholder col-4 rounded-2" style="height: 10px;"></span>
                    </p>
                </small>
            </div>
            <p class="mb-1" style="width: 100%;">
                <p class="card-text placeholder-glow">
                    <span class="placeholder col-7 rounded-2" style="height: 10px;"></span>
                </p>
            </p>
        </a>

        <a class="contactForm list-group-item list-group-item-action" aria-current="true">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1" style="width: 100%;">
                    <p class="card-text placeholder-glow">
                        <span class="placeholder col-4 rounded-2" style="height: 10px;"></span>
                    </p>
                </h5>
                <small style="width: 100%;">
                    <p class="card-text placeholder-glow" style="text-align: end;">
                        <span class="placeholder col-4 rounded-2" style="height: 10px;"></span>
                    </p>
                </small>
            </div>
            <p class="mb-1" style="width: 100%;">
                <p class="card-text placeholder-glow">
                    <span class="placeholder col-6 rounded-2" style="height: 10px;"></span>
                </p>
            </p>
        </a>
    `;
};

async function pageRefreshListContactForm() {
    const elInputEmail = document.getElementById("validationCustomYouEmail");
    const identificador = await getIdentificadorProfile();

    let newObj = {};
    newObj.identificador = identificador;
    newObj.email = elInputEmail.value;

    pageCreateSplashContactForm();

    socket.emit('getContactForm', newObj);
}