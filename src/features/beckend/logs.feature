# language: pt

Funcionalidade: Salvar Logs da aplicacao 
  Eu como administrador do sistema GIS desejo que seja rastreado as atividades dos usuarios no sistema.
  A lista de atividades seriam :
    - Login do usuario na aplicacao
    - Logout do usuario na aplicacao
    - Quando um usario manda um pedido pelo formulario , resgistrando o tipo de pedido e o usuario que fez o pedido
    - Quando o usuario reprova ou aprova um pedido , registrando o tipo de pedido e o usuario que fez a acao
    
  E possiveis erros e inconsistencias do sistema.   
  Cenário: Logar no sistema
    Dado que estou na página de login
    Quando eu preencher o campo "email" com "