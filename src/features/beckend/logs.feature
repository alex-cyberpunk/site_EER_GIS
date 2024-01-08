# language: pt

Funcionalidade: Salvar Logs da aplicacao 
  Eu como administrador do sistema GIS desejo que seja rastreado as atividades dos usuarios no sistema.
  A lista de atividades seriam :
    - Login do usuario na aplicacao
    - Logout do usuario na aplicacao
    - Quando um usario manda um pedido pelo formulario , resgistrando o tipo de pedido e o usuario que fez o pedido
    - Quando o usuario reprova ou aprova um pedido , registrando o tipo de pedido e o usuario que fez a acao e a geometria do pedido

  E possiveis erros e inconsistencias do sistema.   
  Cenário: Fiz uma acao desejada no sistema
    Dado que estou logado na aplicacao
    Quando eu faco uma acao desejada na aplicacao
    Entao o sistema deve registrar a acao no log do banco de dados.