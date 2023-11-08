const server = require('./server.js')
const postInFeatureLayer = require('./reqArcgisRestfulApi/operationsRestfulApi.js')
const sendEmail = require('./reqEmail/sendEmail.js')
const login = require('./reqLogin/login.js')
require('dotenv-safe').config();

async function start() {
    try {
        let app = await server.start();
        
        //postInFeatureLayer(app)//lida com as requisicoes para o APIRestful
        login(app)//lida com os logins na aplicacao
        sendEmail(app)//envio de emails
    } catch (error) {
        console.error("Ocorreu um erro ao iniciar o servidor:", error);
        
    }
}

start();