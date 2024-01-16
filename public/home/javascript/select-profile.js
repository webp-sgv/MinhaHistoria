const elBody = document.getElementsByTagName('html')[0];
const isHover = e => e.parentElement.querySelector(':hover') === e;
const ulProfile = document.getElementById("ulFilterSelectProfile");
const elSelectPreviewImg = document.querySelector('#selectProfilePreviewClick > img');
const elSelectPreviewSpan = document.querySelector('#selectProfilePreviewClick > span');
document.querySelector('#inputFilterSelectProfile').addEventListener('keyup', filterSelectProfile);
async function clearAllProfile() {
    ulProfile.innerHTML = "";
    return true;
};
async function appendChildProfile(data) {
    ulProfile.innerHTML += `
        <li class="selectable" onclick="selectProfile(this)" data-key="${data.chave}" data-create="${data.criado}" data-id="${data.identificador}">
            <img src="${data.foto}"
                class="rounded-5 border border-4" />
            <span class="name text-truncate">${data.nome} ${data.sobrenome}</span>
        </li>
    `;
};
async function appendChildControlProfile () {
    ulProfile.innerHTML += `
        <li id="liDefaultSelectedNone" class="selectableDefault text-truncate d-none">
            <span>Nenhum registro encontrado</span>
        </li>
        <li id="liNewSelectedNone" class="selectableNew text-truncate">
            <div class="p-2 rounded-5" data-bs-toggle="modal" data-bs-target="#modalCodeExists">
                <span>Criar um perfil</span>
                <i class="bi bi-database-fill-add"></i>
            </div>
        </li>
    `;
};
async function setFirtProfile() {

}
function filterSelectProfile(e) {
    var input, filter, ul, li, liView, a, i, txtValue;
    var liDefaultListProfile = document.getElementById("liDefaultSelectedNone");
    input = document.getElementById("inputFilterSelectProfile");
    filter = input.value.toUpperCase();
    ul = document.getElementById("ulFilterSelectProfile");
    li = ul.querySelectorAll('li.selectable');
    liView = li.length;

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("span")[0];
        try {
            txtValue = a.textContent || a.innerText;
        } catch (e) {
            txtValue = "";
        }
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            liView--;
            li[i].style.display = "none";
        }
    }

    if (!liView) {
        liDefaultListProfile.classList.remove("d-none");
    } else {
        liDefaultListProfile.classList.add("d-none");
    }
};
function showSelectProfile() {
    var elGroupFilter = document.getElementById("selectProfileGroup");
    var elFilter = document.getElementById("selectProfileFilter");
    var elList = document.getElementById("selectProfileList");

    elGroupFilter.classList.add("actived");
    elFilter.classList.remove("d-none");
    elList.classList.remove("d-none");
};
function hideSelectProfile() {
    var elGroupFilter = document.getElementById("selectProfileGroup");
    var elFilter = document.getElementById("selectProfileFilter");
    var elList = document.getElementById("selectProfileList");

    elGroupFilter.classList.remove("actived");
    elFilter.classList.add("d-none");
    elList.classList.add("d-none");
};
function selectProfile(el) {
    const elData = {
        id: el.getAttribute('data-id'),
        name: el.innerText,
        img: el.firstElementChild.src,
        key: el.getAttribute('data-key')
    };
    sessionStorage.setItem('profileSelected', JSON.stringify(elData));
    elSelectPreviewImg.setAttribute('src', elData.img);
    elSelectPreviewSpan.innerHTML = elData.name;
    hideSelectProfile();
};
async function dirProfile(data) {
    await clearAllProfile();
    for (let i=0; i<data.length; i++) {
        appendChildProfile(data[i]);
    };
    appendChildControlProfile();
}
elBody.onclick = function () {
    var elSelectProfileGroup = document.getElementById("selectProfileGroup");
    const hovered = isHover(elSelectProfileGroup);
    if (!hovered) {
        hideSelectProfile();
    }
};