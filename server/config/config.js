const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const sqlite = require('../../db/config/config'); // CONEXAO COM O BANCO LOCAL
const sqlQuery = require('../../db/config/query');
const portApp = process.env.PORT || 8080;

module.exports = function () {

};