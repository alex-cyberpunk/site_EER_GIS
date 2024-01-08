# language: pt
Funcionalidade: Mandar emails 
    Eu como membro do planejamento desejo que a aplicacao mande emails para os usuarios em situacoes especificas.
    Como ao inserir um pedido no feature layer de pedidos , para lembrar o usuario de que ele tem um pedido pendente...

Cenario: Mandar email com um template inserido no banco de dados
    Dado que eu tenho um template de email no banco de dados
    Quando eu chamar o metodo de mandar email com um certa chave de template
    Entao o email deve ser enviado com o template inserido no corpo do email

