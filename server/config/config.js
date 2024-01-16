const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const cookieSession = require("cookie-session");
const io = require('socket.io')(server);
const sqlite = require('../../db/config/config'); // CONEXAO COM O BANCO LOCAL
const sqlQuery = require('../../db/config/query');
const portApp = process.env.PORT || 8080;

// execulta query
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