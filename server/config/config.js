const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const cookieSession = require("cookie-session");
const io = require('socket.io')(server);
const sqlite = require('../../db/config/config'); // CONEXAO COM O BANCO LOCAL
const sqlQuery = require('../../db/config/query');
const fs = require('fs/promises');
const directoryPath = path.join(__dirname, '../../public/home/img/');
const portApp = process.env.PORT || 8080;

async function execulteQuery(command, params) {
    const conn = new sqlite();
    const query = new sqlQuery();
    const db = await conn.connection();
    const resultQuery = await query.execulteQuery(db, command, params);
    return resultQuery;
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

    var hosts = 0;
    var sockets = [];

    io.on('connection', socket => {
        hosts++; // QUANDO UM SE CONECTAR A SESSAO
        sockets.push({ id: socket.id });
        console.log(`O usuario: ${socket.id} entrou`);

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

        socket.on('disconnect', () => {
            hosts--; // QUANDO UM SE DESCONECTAR DA SESSAO
            const newObj = sockets.filter((key) => key.id !== socket.id);
            sockets = newObj;
            console.log(`O usuario: ${socket.id} saiu`);
        });
    });

    server.listen(portApp);

    return app;
};