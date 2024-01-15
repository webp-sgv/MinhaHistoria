const server = require('./server/config/config.js');
const app = new server;

// HOME
app.use(
    require('./server/router/home/main')
);