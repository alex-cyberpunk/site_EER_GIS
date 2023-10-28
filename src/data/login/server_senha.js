const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const xlsx = require('xlsx');
const randomstring = require('randomstring'); // Biblioteca para gerar tokens aleatórios

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));

// Configuração do transporte SMTP para o Outlook corporativo
const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true para SSL, false para TLS
    auth: {
        user: 'eric.salge@pecenergia.com.br',
        pass: 'Fenicios1200a.c' 
    }
});

// Rota para a página de recuperação de senha
app.get('/recuperar_senha', (req, res) => {
    res.sendFile(__dirname + '/recuperar_senha.html');
});

// Rota para enviar o email de recuperação
app.post('/enviar_email_recuperacao', async (req, res) => {
    const { email } = req.body;

    try {
        // Verifique o email (substitua isso pela validação adequada)
        const isEmailValid = isValidEmail(email);

        if (!isEmailValid) {
            console.error('Email inválido.');
            return res.status(400).send('Email inválido.');
        }

        // Gera um token aleatório para redefinição de senha
        const token = randomstring.generate(16);

        // Envia o email com o token para redefinição de senha
        await sendPasswordResetEmail(email, token);

        console.log('Email de redefinição de senha enviado com sucesso.');

        // Redirecione o usuário para a página de inserção de token
        res.redirect('/inserir_token_recuperacao?email=' + encodeURIComponent(email));
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        return res.status(500).send('Erro interno do servidor');
    }
});

// Rota para a página de inserção de token
app.get('/inserir_token_recuperacao', (req, res) => {
    const { email } = req.query;

    // Renderize a página de inserção de token (redefinir_senha.html)
    res.sendFile(__dirname + '/redefinir_senha.html');
});

// Rota para processar a redefinição de senha com o token
app.post('/redefinir_senha', async (req, res) => {
    const { email, token, novaSenha } = req.body;

    try {
        // Verifique se o email e o token são válidos
        const isEmailValid = isValidEmail(email);
        const isTokenValid = isValidToken(email, token); // Função para validar o token

        if (!isEmailValid || !isTokenValid) {
            console.error('Email ou token inválido.');
            return res.status(400).send('Email ou token inválido.');
        }

        // Atualize a senha do usuário com a nova senha (você precisa implementar isso)
        // Por exemplo: updateUserPassword(email, novaSenha);

        console.log('Senha redefinida com sucesso.');

        // Redirecione o usuário para a página de login (ou outra página de sua escolha)
        res.redirect('/login.html'); // Substitua pelo caminho da página de login
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        return res.status(500).send('Erro interno do servidor');
    }
});

// Função para verificar o formato do email (substitua isso pela validação adequada)
function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@pecenergia\.com\.br$/; // Adapte o padrão de acordo com a validação desejada
    return emailPattern.test(email);
}

// Função para validar o token (você precisa implementar isso)
function isValidToken(email, token) {
    // Implemente a lógica para validar o token com base no email
    // Por exemplo, você pode verificar se o token corresponde ao email em uma base de dados
    // Se for válido, retorne true; caso contrário, retorne false.
    // Aqui, estou apenas retornando true para fins de demonstração.
    return true;
}

// Função para enviar email com o token de redefinição de senha
async function sendPasswordResetEmail(email, token) {
    // Configuração do email
    const mailOptions = {
        from: 'eric.salge@pecenergia.com.br',
        to: email,
        subject: 'Redefinição de Senha',
        text: `Seu token de redefinição de senha é: ${token}`
    };

    // Envia o email
    await transporter.sendMail(mailOptions);
}

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
