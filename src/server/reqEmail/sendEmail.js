const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const repository = require('../repository/repository.js');
const { send } = require('process');

//const messagesPath =  './messages.json';

async function sendEmail(email, body,subject) {
    
    const transporter = nodemailer.createTransport({
        host: process.env.SMPT,
        port: process.env.SMPT_PORT,
        secure: false, // true para SSL, false para TLS
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_SENHA
        }
    });
    // Configuração do email
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: subject,
        text: body
    };

    // Envia o email
    const info =await transporter.sendMail(mailOptions);
    transporter.close();


    if(info.response.includes('250')) return 200;
    else return 503;
}

async function sendMessageWithTemplate(key, values,userIds) {
    /**
     * Exemplo de uso:
     *  const messageKey = 'areaNovaTopografia';
     *  const messageValues = {
            numPedido: '123',
            responsavelComercial: 'João',
            responsavelTopografia: 'Maria'
        }; 
     *sendMessageWithTemplate(messageKey, messageValues);   
       */

    const template = await repository.getEmailTemplate(key);
    const users = await repository.returnUsers();
        
    if (template) {
        // Replace placeholders in the email body with actual values
        const subject = template.subject.replace(/\{(\w+)\}/g, (match, key) => {
            return values[key] || match; 
            });;
        const body = template.body.replace(/\{(\w+)\}/g, (match, key) => {
            return values[key] || match; 
             });
        
        // Send email for each user in the list of userIds
        let emailNotSent = true;
        for (let user of users) {
          for(let userId of userIds){
            if(userId===user.userId){
              let status=sendEmail(user.email,body,subject);
              if(status===503) emailNotSent = true;
              else emailNotSent = false;
            } 
          }
          
          }
        return emailNotSent;
    }
    }    
    

    module.exports = {
        setupRoutes: (app) => {
          app.post('/enviarEmail', async (req, res) => {
            const userIds = req.body.userIds;
            const messageValues = req.body.values;
            const messageKey = req.body.key;
            const message = await sendMessageWithTemplate(messageKey, messageValues, userIds);
            if (!message) {
              return res.json({ message });
            } else {
              return res.sendStatus(500);
            }
          });
        },
        sendMessageWithTemplate
      };