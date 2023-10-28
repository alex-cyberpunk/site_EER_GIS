axios = require('axios')

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
  
module.export= sendMessageWithTemplate;  