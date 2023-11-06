const express = require('express');
const nodemailer = require('nodemailer');
const axios=require('axios')
const app = express();

const {authenticateUser} = require('./reqLogin/repository.js')
const {sendMessageWithTemplate} = require('./reqEmail/sendEmail.js')

const port = 3001;

app.use(require("cors")());
app.use(express.json());

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, 'public')));


app.post('/login', async (req, res) => {
    console.log(req.body)
    const { username, password } = req.body;
    console.log(username, password)
    try {
        const user = await authenticateUser(username, password);

        if (user) {
            console.log('Login bem-sucedido!');
            console.log(user)
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


app.post('/enviarEmail', async (req, res) => {

    userId=req.body.userId
    console.log("userId")
    console.log(userId)
    const messageValues = req.body.values
    const messageKey = req.body.key;

    await sendMessageWithTemplate(messageKey, messageValues,userId)
    return res.json({status:200});
    });


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});



