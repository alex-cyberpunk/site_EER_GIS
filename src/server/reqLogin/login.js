//index.js cinema-microservice
/**
 * gerador de senhas
 *https://bcrypt-generator.com/ 
 */

const express = require('express')
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const repository = require('./repository/repository.js')
const authController = require('./controllers/authController.js')

module.exports=(app)=>{
        
    app.use(morgan('dev'));
    app.use(helmet());
    app.use(cookieParser());
    app.use(express.json());

    const login=app.post('/login',authController.validateLoginSchema,authController.doLogin);

    app.use(authController.validateBlacklist);//todas as rotas passam por aqui

    app.post('/logout',authController.validateToken,authController.doLogout);

    app.get('/userInfo',authController.validateToken,authController.getInfoApp);

    return login
}