const express = require('express');
//const bodyParser = require('body-parser');
//const fs = require('fs');
//const xlsx = require('xlsx');
//const path = require('path');
const nodemailer = require('nodemailer');
//const randomstring = require('randomstring');
const axios=require('axios')
const app = express();
const port = 3001;

app.use(require("cors")());
app.use(express.json());

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, 'public')));

async function authenticateUser(username, password) {
  try {
    console.log(username, password)
    const response = [
      {
        "userName": "Comercial Fund - Bruno",
        "password": "1234",
        "userType": "Comercial Fundiario",
        "email":"alex.matias@pecenergia.com.br"
      },
      {
        "userName": "Bruno",
        "password": "1234",
        "userType": "Topografia",
        "email":"alex.matias@pecenergia.com.br"
      },
      {
        "userName": "Luis",
        "password": "1234",
        "userType": "Resources",
        "email":"alex.matias@pecenergia.com.br"
      }
    ];

    const user = response.find((user) => user.userName === username && user.password === password);

    if (user) {
      // Imprimir o tipo de usuário
      console.log(`Tipo de usuário: ${user.userType}`);
      return user;
    } else {
      throw new Error('Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return null; // Retorna null em caso de erro
  }
}

 
app.post('/login', async (req, res) => {
    console.log(req)
    const { username, password } = req.body;
    console.log(username, password)
    try {
        const user = await authenticateUser(username, password);

        if (user) {
            console.log('Login bem-sucedido!');
            // Redirecionar para a página "segredo.html" após o login bem-sucedido
            return res.json(user);
        } else {
            console.error('Erro de autenticação.');
            return res.status(401).send('Nome de usuário ou senha incorretos.');
        }
    } catch (error) {
        console.error(`Username Enviado: ${username}`);
        console.error(`Password Enviada: ${password}`);
        return res.status(500).send('Erro interno do servidor');
    }
});


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



async function sendEmail(email, body,subject,transporter) {
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

async function sendMessageWithTemplate(key, values,transporter) {
    const email='alex.matias@pecenergia.com.br'
    const templates = await axios.get('messages.json');
    console.log(templates)
    const template = templates[key];
    if (!template) {
      throw new Error(`Chave de modelo "${key}" não encontrada.`);
    }
  
    const subject = template.subject;
    const body = template.body.replace(/\{(\w+)\}/g, (match, key) => {
      return values[key] || match;
    });
  
    sendEmail(email, body,subject,transporter)
}


app.post('/enviarEmail', async (req, res) => {
    const { email,subject ,responsavel} = req.body;
    let body;

    if (responsavel === 'Comercial Fund - Bruno') {
      body = `O membro do Comercial Fundiário ${responsavel} adicionou uma nova área.`;
    } else {
      body = `O membro da Topografia Bruno aprovou uma nova área.`;
    }

    sendEmail(email, body,subject,transporter)
    return res.json({status:200});
    });


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

