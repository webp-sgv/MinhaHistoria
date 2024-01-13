// ARQUIVO QUE REALIZA A CONEXÃO COM O BANCO DE DADOS LOCAL
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const base = process.env.PORT ? 'live.db' : 'sandbox.db';

const dataBase = async () => {
    const db = await open({
        filename: `db/${base}`,
        driver: sqlite3.cached.Database
    });
    return db;
};

module.exports = function () {
    this.connection = async () => {
        const db = await dataBase();
        return db;
    };
};