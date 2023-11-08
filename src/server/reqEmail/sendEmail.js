const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '..', 'users.json');
const messagesPath = path.join(__dirname, '.', 'messages.json');

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
    await transporter.sendMail(mailOptions);
    transporter.close();
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

module.exports=(app)=>{
    app.post('/enviarEmail', async (req, res) => {

    userId=req.body.userId
    const messageValues = req.body.values
    const messageKey = req.body.key;

    await sendMessageWithTemplate(messageKey, messageValues,userId)
    return res.json({status:200});
    })
}