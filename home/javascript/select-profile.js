const elBody = document.getElementsByTagName('html')[0];
const isHover = e => e.parentElement.querySelector(':hover') === e;
document.querySelector('#inputFilterSelectProfile').addEventListener('keyup', filterSelectProfile);
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
        console.log("View dont element");
    } else {
        liDefaultListProfile.classList.add("d-none");
        console.log("View has element");
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
elBody.onclick = function () {
    var elSelectProfileGroup = document.getElementById("selectProfileGroup");
    const hovered = isHover(elSelectProfileGroup);
    if (!hovered) {
        hideSelectProfile();
    }
};