function actionButtonForm(type, id, email, el) {
    let elMsg = document.querySelector(`[data-id="${id}"] > p`);
    let elMsgText = elMsg.innerText;
    let elMsgContent = elMsg.getAttribute('data-content');
    let elMsgStatus = elMsg.getAttribute('contenteditable');
    let elAMaster = document.querySelector(`[data-form-id="${id}"]`);
    let elASplashMaster = document.querySelector(`[data-splash-id="${id}"]`);
    let elAConfirmDeleteMaster = document.querySelector(`[data-confirm-delete-id="${id}"]`);
    let elBtnDelete = document.querySelector(`[data-action-delete="${id}"]`);
    let btnFinishEdit = document.getElementsByClassName(`btnFinishAlter-${id}`)[0];

    function fixedMasterAction(status) {
        let elMaster = document.getElementsByClassName(`masterCardActionForm-${id}`)[0];
        if (status) {
            elMaster.classList.add('listBtnContactForm-active');
            elMaster.classList.remove('listBtnContactForm');
        } else {
            elMaster.classList.remove('listBtnContactForm-active');
            elMaster.classList.add('listBtnContactForm');
        }
    };
    function statusDivContentEdit(el, status) {
        let elDivContentBtn = el.querySelector("div");
        if (status) {
            el.classList.remove("color-primary");
            el.classList.add("color-danger");
            elDivContentBtn.innerText = "Cancelar";
        } else {
            el.classList.add("color-primary");
            el.classList.remove("color-danger");
            elDivContentBtn.innerText = "Editar";
        };
    };
    function statusDivContentRemove(el, status) {
        let elDivContentBtn = el.querySelector("div");
        if (status) {
            elDivContentBtn.innerText = "Cancelar";
        } else {
            elDivContentBtn.innerText = "Apagar";
        };
    };

    if (type == 'edit') {
        if (elMsgStatus == 'false') {
            btnFinishEdit.classList.remove('d-none');
            elMsg.setAttribute('contenteditable', true);
            fixedMasterAction(true);
            statusDivContentEdit(el, true);
        } else {
            btnFinishEdit.classList.add('d-none');
            elMsg.setAttribute('contenteditable', false);
            fixedMasterAction(false);
            statusDivContentEdit(el, false);
            elMsg.innerText = elMsgContent;
        };
    };

    if (type == 'remove') {
        if (elAMaster.classList.contains('d-none')) {
            statusDivContentRemove(el, false);
            elAMaster.classList.remove('d-none');
            elAConfirmDeleteMaster.classList.add('d-none');
            fixedMasterAction(false);
        } else {
            statusDivContentRemove(el, true);
            elAMaster.classList.add('d-none');
            elAConfirmDeleteMaster.classList.remove('d-none');
            fixedMasterAction(true);
        };
    };

    if (type == 'confirm-remove') {
        statusDivContentRemove(elBtnDelete, false);
        elAMaster.classList.add('d-none');
        elAConfirmDeleteMaster.classList.add('d-none');
        elASplashMaster.classList.remove("d-none");
        fixedMasterAction(false);
        socket.emit('removeItem', { "id": id, "email": email });
    };

    if (type == 'cancel-remove') {
        statusDivContentRemove(elBtnDelete, false);
        elAMaster.classList.remove('d-none');
        elAConfirmDeleteMaster.classList.add('d-none');
        fixedMasterAction(false);
    };

};

function finishEditMsgForm(id, email) {
    let inputEditable = document.querySelector(`[data-id="${id}"] > p`);
    let inputEditableText = inputEditable.innerText;
    
    if (inputEditableText == "\n") {
        inputEditable.classList.add('textFildEditabled-null');
        inputEditable.classList.remove('textFildEditabled');
    } else {
        inputEditable.classList.remove('textFildEditabled-null');
        inputEditable.classList.add('textFildEditabled');
    };

}