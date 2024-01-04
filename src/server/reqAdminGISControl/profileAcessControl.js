//index.js cinema-microservice
/**
 * gerador de senhas
 *https://bcrypt-generator.com/ 
 */
 const {generateKML} = require('../reqArcgisRestfulApi/arcgisAPIRestful.js')

 const express = require('express')
 const cookieParser = require('cookie-parser');
 const morgan = require('morgan');
 const helmet = require('helmet');
 const repository = require('../repository/repository.js')
 const authController = require('../reqLogin/controllers/authController.js')
 
 module.exports=(app)=>{
         
     app.use(morgan('dev'));
     app.use(helmet());
     app.use(cookieParser());
     app.use(express.json());
 
     
     //app.use(authController.validateBlacklist);//todas as rotas passam por aqui
 
     
     app.get('/appManager', async (req, res) => {
      const userId = parseInt(req.query.userId, 10); // query for get params and convert to integer
      const controlItems = await repository.profileAcessControlAppMenager(userId);
      if(controlItems)
        res.json(controlItems);  
      else 
        res.sendStatus(400);     
      }); 
     
     return app
 }