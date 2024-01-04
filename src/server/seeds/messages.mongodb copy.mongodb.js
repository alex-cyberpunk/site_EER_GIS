// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('adminGISAPP');
const messages =[
    {
        "messageType": "novoUsuario",
        "subject": "Seja bem-vindo à aplicação de gestão de propriedades da área de GIS",
"body": "Seu usuário foi criado com sucesso. Após o administrador obter as informações sobre os projetos pelos quais o(a) senhor(a) é responsável e atualizá-los na aplicação, o acesso à aplicação será liberado."
 }
]
  


// Create a new document in the collection.
db.getCollection('emailTemplates').insertMany(messages);