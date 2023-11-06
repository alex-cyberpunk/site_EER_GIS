const nodemailer = require('nodemailer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const usersPath =  '../../public/users.json';
const messagesPath =  '../../public/messages.json';

async function sendEmail(email, body,subject) {
    const emailAdmin='alex.matias@pecenergia.com.br'
    const passEmailCoporative='406571Pec'
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // true para SSL, false para TLS
        auth: {
            user: emailAdmin,
            pass: passEmailCoporative 
        }
    });
    // Configuração do email
    const mailOptions = {
        from: emailAdmin,
        to: email,
        subject: subject,
        text: body
    };

    // Envia o email
    await transporter.sendMail(mailOptions);
}

async function sendMessageWithTemplate(key, values,userId) {
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
    
    const usersData = fs.readFileSync(usersPath, 'utf8');
    const messagesData = fs.readFileSync(messagesPath, 'utf8');

    const users = JSON.parse(usersData);
    const templates = JSON.parse(messagesData);
    console.log(users)
    console.log(userId)
    const user = users.find(user => user._id === parseInt(userId));
    
    if(user.userType==='Topografia') values.responsavelTopografia = user
    else if (user.userType==='Comercial Fundiario') {
        values.responsavelTopografia = user.responsavelTopografia;
        values.responsavelComercial = user.userName;
    }
    else if (user.userType==='Resources') {
        values.resources= user;
        //values.responsavelComercial = user.responsavelComercial; no corpo da requisicao
    }        
    
    //const templates = await axios.get('../../public/messages.json');
    
    //console.log(templates)
    console.log(templates)
    console.log(user)
    //const template = templates[key];
    const template = templates.find(template => template.messageType === key);
    if (template) {
        const subject = template.subject;
        const body = template.body.replace(/\{(\w+)\}/g, (match, key) => {
          return values[key] || match; 
        });
        console.log(body)
        console.log(subject)
        sendEmail(user.email,body,subject)
    }    
    /*
    if (!template) {
      throw new Error(`Chave de modelo "${key}" não encontrada.`);
    }
  
    */


}

module.exports={sendMessageWithTemplate}