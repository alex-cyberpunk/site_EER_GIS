const express = require('express');
let server = null;


async function start() {
    const app = express();
    
    
    app.use(require("cors")());
    app.use(express.json());
    
    //Pra saber se ta diboas
    app.get('/health', (req, res, next) => {
        res.send(`The service arcgis already started at ${process.env.PORT}`);
      });

    //api(app);
    
    //requisicoes de login  


    app.use((error, req, res, next) => {
        logger.error(error.stack);
        res.sendStatus(500);
    });  

    server =app.listen(3002, () => {
        console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });

    return app
}

async function stop() {
    if (server) await server.close();
    return true;
  }

module.exports = { start, stop };


