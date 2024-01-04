//index.js cinema-microservice
/**
 * gerador de senhas
 *https://bcrypt-generator.com/ 
 */

const express = require('express')
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const repository = require('../repository/repository.js')
const authController = require('./controllers/authController.js')
//const arcgisRestfulApi = require('../reqArcgisRestfulApi/operationsRestfulApi.js')

module.exports=(app)=>{
        
    app.use(morgan('dev'));
    app.use(helmet());
    app.use(cookieParser());
    app.use(express.json());

    const login=app.post('/login',authController.validateLoginSchema,authController.doLogin);

    //app.use(authController.validateBlacklist);//todas as rotas passam por aqui

    app.post('/logout',authController.validateBlacklist,authController.validateToken,authController.doLogout);

    app.get('/userInfo',authController.validateBlacklist,authController.getInfoApp);

    app.post('/insertUser',authController.insertUser);

    app.post('/forgotPassword', authController.generateResetPasswordToken);

    app.post('/resetPassword', authController.resetPassword);

    //arcgisRestfulApi(app)//lida com as requisicoes para o APIRestful do arcgis


    return login
}