const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

// REALIZA UMA PESQUISA SIMPLES [ SELECT, DELETE, UPDATE & INSERT ]
const querySimples = async (db, query, params) => {

    var newObj = [];

    await db.each(query, params, (err, row) => {
        if (err) {
            newObj.push({"err": true, "data": err});
            return;
        };
        newObj.push(row);
    });

    return newObj;

};

module.exports = function () {
    // EXECULTA UMA QUERY SIMPLES COM QUERY E PARAMETROS
    this.execulteQuery = async (db, query, params) => {
        const data = await querySimples(db, query, params);
        return data;
    };
};