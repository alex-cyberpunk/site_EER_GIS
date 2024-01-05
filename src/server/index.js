const server = require('./server.js')
const sendEmail = require('./reqEmail/sendEmail.js')
const login = require('./reqLogin/login.js')
const repository = require('./repository/repository.js')
const profileAcessControl = require('./reqAdminGISControl/profileAcessControl.js')
const arcgisAPIRestful = require('./reqArcgisRestfulApi/operationsRestfulApi.js')

require('dotenv-safe').config();

async function start() {
    try {
        let app = await server.start();
        
        login(app)//lida com os logins na aplicacao
        sendEmail.setupRoutes(app)//envio de emails
        profileAcessControl(app);
        arcgisAPIRestful(app);
        //setInterval(repository.freeUnusedArcgisUsers, 60 * 60 * 1000);
        
    } catch (error) {
        console.error("Ocorreu um erro ao iniciar o servidor:", error);
        
    }
}

start();