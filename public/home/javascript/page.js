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

            </div>
        `;
        console.log(list[key])
    };

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