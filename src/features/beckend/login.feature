# language: pt

Funcionalidade: login no site
  Como um usuário
  Eu quero entrar no site
  Para que eu possa acessar as funcionalidades do arcgis online

  Cenario: login com sucesso
    Dado que eu estou na pagina de login
    Quando eu preencher os campos de login e senha
    E clicar no botao de login
    Entao eu devo obter um token de acesso JWT , nesse token devem conter encriptado o meu usuario, tipo de usario , 
    data de expiracao , o id do usuario , as informacoes para acesso na aplicacao ( como paginas que o usuario tem acesso , projetos que o usuario tem acesso , etc) 
    alem de um token do arcgis online para acesso a api do arcgis online de forma a poder modificar,Visualizar e insirir os dados do usuario do arcgis online 