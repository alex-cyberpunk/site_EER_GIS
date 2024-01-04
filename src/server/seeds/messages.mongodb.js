// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('adminGISAPP');
const messages =[
    {   "messageType":"redefinirSenha",
        "subject": "Redefinição de Senha",
        "body": `Você está recebendo isso porque você (ou alguém) solicitou a redefinição da senha para sua conta.\n\nPor favor, clique no link a seguir, ou cole-o no seu navegador para completar o processo:\n\nhttp://localhost:3000/resetPassword/{token}\n\nSe você não solicitou isso, por favor, ignore este email e sua senha permanecerá inalterada.\n`   },
    { 
    "messageType":"areaNovaTopografia",
    "subject": "Propriedade nova no fluxo de aprovacao - numero de Pedido: {numPedido}",
    "body": "Uma propriedade nova foi adicionada no fluxo de aprovacao de areas por {responsavelComercial} e espera aprovacao de {responsavelTopografia} ."
    },
    {
    "messageType":"areaNovaResources",
    "subject": "Propriedade nova no fluxo de aprovacao - numero de Pedido: {numPedido}",
    "body": "Uma propriedade nova foi adicionada no fluxo de aprovacao de areas por {responsavelComercial} e precisa de aprovacao da area Resources"
    },
    {   
        "messageType":"areaAprovadaTopografia",
        "subject": "Propriedade aprovada no fluxo de aprovacao - numero de Pedido: {numPedido}",
        "body": "Uma propriedade nova foi adicionada na base {Projeto} por {responsavelTopografia} e solicitado por {responsavelComercial}"
      },
       {"messageType":"areaReprovadaResources",
        "subject": "Uma propriedade foi Reprovada no seu fluxo de aprovacao - numero de Pedido: {numPedido}",
        "body": "Uma propriedade nova foi reprovada no fluxo de aprovacao de areas, por favor entre em contato com a area de Resources"
    },
    {   "messageType":"areaReprovadaTopografia",
        "subject": "Uma propriedade foi Reprovada no seu fluxo de aprovacao - numero de Pedido: {numPedido}",
        "body": "Uma propriedade nova foi reprovada no fluxo de aprovacao de areas, por favor entre em contato com {responsavelTopografia}"
    },
    {   "messageType":"reprovacaoLiderTopografia",
        "subject": "Uma propriedade foi Reprovada no seu fluxo de aprovacao - numero de Pedido: {numPedido}",
        "body": "Uma propriedade nova foi reprovada no fluxo de aprovacao de areas, por favor entre em contato com {liderTopografia}"
    },
    {   
        "messageType":"aprovacaoLiderTopografia",
        "subject": "Propriedade aprovada no fluxo de aprovacao - numero de Pedido: {numPedido}",
        "body": "Uma propriedade nova foi adicionada com código de área {area_code} na base {Projeto} por {liderTopografia}"
      }
]
  


// Create a new document in the collection.
db.getCollection('emailTemplates').insertMany(messages);