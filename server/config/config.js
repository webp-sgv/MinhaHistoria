const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const cookieSession = require("cookie-session");
const session = require("express-session");
const io = require('socket.io')(server);
const sqlite = require('../../db/config/config'); // CONEXAO COM O BANCO LOCAL
const sqlQuery = require('../../db/config/query');
const fs = require('fs/promises');
const directoryPath = path.join(__dirname, '../../public/home/img/');
const CryptoJS = require("crypto-js");
const portApp = process.env.PORT || 8080;
let lastRecivedContactForm;

async function execulteQuery(command, params) {
    const conn = new sqlite();
    const query = new sqlQuery();
    const db = await conn.connection();
    const resultQuery = await query.execulteQuery(db, command, params);
    return resultQuery;
};

async function createTables() {
    const query = `
        CREATE TABLE IF NOT EXISTS perfil (
            id integer PRIMARY KEY AUTOINCREMENT,
            status integer DEFAULT 1,
            avatar varchar(50) NOT NULL DEFAULT 'home/default/profile/default.svg',
            nome varchar(50) not NULL,
            sobrenome varchar(50) NOt NULL,
            email varchar(100) UNIQUE NOT NULL,
            telefone char(15) NOT NULL,
            token char(73) NOT NULL,
            createat datetime NOT NULL DEFAULT (datetime('now','localtime')),
            reset_token integer NOT NULL DEFAULT 0
        );
        
        CREATE TABLE IF NOT EXISTS redes (
            id integer PRIMARY key AUTOINCREMENT,
            perfil_id integer NOT NULL,
            nome varchar(20) NOT NULL,
            tipo char(20) NOT NULL,
            nomeDownload char(20),
            url varchar(100) UNIQUE NOT NULL,
            icone char(20) NOT NULL,
            status integer DEFAULT 1,
            createat datetime DEFAULT (datetime('now','localtime'))
        );
        
        CREATE TABLE IF NOT EXISTS hello (
            id integer PRIMARY KEY AUTOINCREMENT,
            perfil_id integer NOT NULL,
            titulo varchar(50) NOT NULL,
            subtitulo varchar(50) NOT NULL,
            tituloBotao varchar(50) NOT NULL,
            urlBotao varchar(100) NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS aboutText (
            id integer PRIMARY KEY AUTOINCREMENT,
            perfil_id integer NOT NULL,
            titulo varchar(50) NOT NULL,
            subtitulo text NOT NULL,
            createat datetime NOT NULL DEFAULT (datetime('now','localtime'))
        );
        
        CREATE TABLE IF NOT EXISTS contactPreview (
            id integer PRIMARY KEY AUTOINCREMENT,
            perfil_id integer NOT NULL,
            titulo varchar(50) NOT NULL,
            subtitulo varchar(100) NOT NULL,
            tipo char(10) NOT NULL,
            createat datetime DEFAULT (datetime('now','localtime'))
        );
        
        CREATE TABLE IF NOT EXISTS contactForm (
            id integer PRIMARY KEY AUTOINCREMENT,
            perfil_id integer NOT NULL,
            remetente varchar(100) NOT NULL,
            email_remetente varchar(100) NOT NULL,
            texto varchar(300) NOT NULL,
            createat datetime DEFAULT (datetime('now','localtime'))
        );
    `;
    const params = {};
    const filds = await execulteQuery(query, params);
    return filds;
};

async function listProfile() {
    const query = `
        SELECT
        id as 'identificador',
        avatar as 'foto',
        nome,
        sobrenome,
        token as 'chave',
        createat as 'criado'
        FROM perfil
        WHERE status in (1);
    `;
    const params = {};
    const filds = await execulteQuery(query, params);
    return filds;
};

async function getHello(data) {
    const { identificador } = data;
    const query = `
        SELECT
        titulo,
        subtitulo,
        tituloBotao,
        urlBotao
        FROM hello 
        WHERE perfil_id = $identificador
        LIMIT 1;
    `;
    const params = {
        "$identificador": identificador
    };
    const filds = await execulteQuery(query, params);
    return filds;
};

async function getAbout(data) {
    const { identificador } = data;
    const query = `
        SELECT
        titulo,
        subtitulo
        FROM aboutText 
        WHERE perfil_id = $identificador
        LIMIT 1;
    `;
    const params = {
        "$identificador": identificador
    };
    const filds = await execulteQuery(query, params);
    return filds;
};

async function getPicturesProfile(data) {
    const { nome, sobrenome } = data;
    const result = await fs.readdir(directoryPath + `${nome}.${sobrenome}/profile`);
    let newObj = {};
    newObj.path = `${nome}.${sobrenome}`;
    newObj.list = result;
    return newObj;
};

async function getWorks(data) {
    const { nome, sobrenome } = data;
    const dir = await fs.readdir(directoryPath + `${nome}.${sobrenome}/works`);
    let newObj = {};
    let objArrayFiles = [];

    for (row in dir) {
        const files = await fs.readdir(directoryPath + `${nome}.${sobrenome}/works/${dir[row]}`);
        objArrayFiles.push({ path: dir[row], list: files });
    }

    newObj.path = `${nome}.${sobrenome}`;
    newObj.list = objArrayFiles;
    return newObj;
}

async function getContactPreview(data) {
    const { identificador } = data;
    const query = `
        SELECT
        *
        FROM
        contactPreview
        WHERE perfil_id = $identificador
        LIMIT 5;
    `;
    const params = {
        "$identificador": identificador
    };
    const filds = await execulteQuery(query, params);
    return filds;
};

async function getContactFormData(data) {
    const { identificador, email } = data;
    
    let query = "";
    let params = {};

    if (email == '*@mail.com') {
        query = `
            SELECT
            *
            FROM contactForm
            ORDER BY id DESC
            LIMIT 10;
        `;
    } else {
        query = `
            SELECT
            *
            FROM contactForm
            WHERE perfil_id = $identificador
            AND email_remetente = $email
            ORDER BY id DESC
            LIMIT 10;
        `;
        params = {
            "$identificador": identificador,
            "$email": email
        };
    }

    const filds = await execulteQuery(query, params);
    console.log(filds)
    return filds;
};

async function saveContactForm(data) {

    if (lastRecivedContactForm == data) {
        return {
            "status": 404,
            "response": "pedido duplicado, revise os dados!"
        }
    };

    const { nome, email, texto, identificador } = data;

    const select = `
        SELECT
        COUNT(*) AS 'TOTAL'
        FROM
        contactForm
        WHERE perfil_id = $identificador
        AND remetente = $nome
        AND email_remetente = $email
        AND texto = $texto
    `;
    const insert = `
        INSERT INTO contactForm (
            perfil_id,
            remetente,
            email_remetente,
            texto
        ) VALUES (
            $identificador,
            $nome,
            $email,
            $texto
        );
    `;
    const params = {
        "$nome": nome,
        "$email": email,
        "$texto": texto,
        "$identificador": identificador
    };
    const fildsSelect = await execulteQuery(select, params);

    if (fildsSelect[0]['TOTAL'] < 1) {
        const fildsInsert = await execulteQuery(insert, params);
        return {
            "status": 200,
            "response": "Registro criado com sucesso."
        };
    } else {
        return {
            "status": 500,
            "response": "Registro já existe, verifique os dados e tente novamente!"
        }
    };

}

function encriptData(data) {
    let secret = process.SECRET_ENCRYPT || 'JEAN CLEIDSON PEREIRA RODRIGUES';
    let secretValue = CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
    return secretValue;
};

module.exports = function () {

    app.use(express.static(path.join(__dirname, '../../public')));
    app.set('views', path.join(__dirname, '../../public'));
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');

    app.use(cookieSession({
        name: "tk_session",
        keys: [
            "c2add694bf942dc77b376592d9c862cd.1073ab6cda4b991cd29f9e83a307f34004ae9327",
            "78f825aaa0103319aaa1a30bf4fe3ada.87ba78e0f03afcef60657f342ec5567368fadd8c"
        ],
        maxAge: 24 * 60 * 60 * 1000
    }));

    const sessionMiddleware = session({
        secret: "jean cleidson pereira rodrigues",
        resave: false,
        saveUninitialized: true,
        // cookie: { secure: true, maxAge: 60000 }
    });

    app.use(sessionMiddleware);

    async function startDb() {
        await createTables();
    }

    startDb();

    var hosts = 0;
    var sockets = [];

    io.engine.use(sessionMiddleware);

    io.on('connection', socket => {

        const req = socket.request;
        hosts++; // QUANDO UM SE CONECTAR A SESSAO
        sockets.push({ id: socket.id });
        console.log(`O usuario: ${socket.id} entrou ${JSON.stringify(req.session.count)}`);

        socket.on('getProfiles', async (data) => {
            const profiles = await listProfile();
            socket.emit('listProfiles', profiles);
        });

        socket.on('getHello', async (data) => {
            const hello = await getHello(data);
            socket.emit('dataHello', hello);
        });

        socket.on('getAbout', async (data) => {
            const about = await getAbout(data);
            socket.emit('dataAbout', about);
        });

        socket.on('getPictures', async (data) => {
            const picture = await getPicturesProfile(data);
            socket.emit('dataPictures', picture);
        });

        socket.on('getWorks', async (data) => {
            const works = await getWorks(data);
            socket.emit('dataWorks', works);
        });

        socket.on('getContactPreview', async (data) => {
            const contact = await getContactPreview(data);
            socket.emit('dataContactPreview', contact);
        });

        socket.on('getContactForm', async (data) => {
            let contactForm = await getContactFormData(data);
            // let el = contactForm.map(x => x.id = CryptoJS.AES.encrypt(x.id, 'Jean Cleidson Pereira Rodrigues').toString());
            // console.log(el);
            for (key in contactForm) {
                contactForm[key]['id'] = encriptData(contactForm[key]['id']);
                contactForm[key]['perfil_id'] = encriptData(contactForm[key]['perfil_id']);
            };
            socket.emit('dataContactForm', contactForm);
        });

        socket.on('saveContactForm', async (data) => {
            const saveContact = await saveContactForm(data);
            socket.emit('responseSaveContactForm', saveContact);
        });

        socket.on('disconnect', () => {
            hosts--; // QUANDO UM SE DESCONECTAR DA SESSAO
            const newObj = sockets.filter((key) => key.id !== socket.id);
            sockets = newObj;
            console.log(`O usuario: ${socket.id} saiu`);
        });

        socket.on('testeSession', () => {
            console.log("teste");
            req.session.reload((err) => {
                // if (err) {
                //     return socket.disconnect();
                // }
                req.session.count = { id: "1w" };
                req.session.save();
            });
            socket.emit('testeSessionRes', req.session.count);
            // req.session.count = { id: "1w" };
            // req.session.save();
        });

    });

    // var ciphertext = CryptoJS.AES.encrypt('Jean Cleidson', 'Jean Cleidson Pereira Rodrigues').toString();
    // var bytes  = CryptoJS.AES.decrypt(ciphertext, 'Jean Cleidson Pereira Rodrigues');
    // var originalText = bytes.toString(CryptoJS.enc.Utf8);

    server.listen(portApp);

    return app;
};