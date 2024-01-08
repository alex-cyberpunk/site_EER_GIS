# language: pt
#form.js
Funcionalidade: Manipulação de Formulários
  Eu como usuario do GIS quero um formulario de pedidos 
	no qual eu faca pedidos de Inclusao de propriedades , Edicao de poligonos existentes
	e Inutilizacao de areas que nao estaram mais na base de dados do fundiario. 
	   
  Cenário: Formulário de Inclusão
    Dado que o formulário contem os campos Projeto,Proprietario,Matricula, Status ,Justificativa com apenas o campo Justificativa trancado
    Quando o usuário tentar enviar o formulário sem preencher os campos obrigatórios ou sem enviar um KML válido
    Então um alerta deve ser mostrado indicando os campos obrigatórios que devem ser preenchidos com as mensagens de erro Projeto , Proprietario_principal , Status e Matricula
      |Projeto || Proprietario_principal || Status || Matricula ||
      |'SGR'   || ''                     || ''     || ''        ||
    Quando o usario insere um KML válido se a propriedade está fora dos buffers
    Então o campo Justificativa deve ser desbloqueado e se tornar campo obrigatório para ser preenchido
    E envia uma Justificativa junto ao pedido para a Topografia
    

 Cenário: Formulário de Edição
     Dado um formulário de Edicao com os campos Projeto ,area_code , Proprietario_principal,Status 
     Quando o usuário tenta enviar o formulário sem preencher os campos obrigatórios
     Então um alerta deve ser mostrado indicando os campos obrigatórios que devem ser preenchidos com as mensagens de erro Projeto , Proprietario_principal , Status e Matricula 
      |Projeto || Proprietario_principal || Status || Matricula ||
      |'SGR'   || ''                     || ''     || ''        || 
     Dado que o usuario escolheu um area_code do dropdown 
     Então  Formulário deve ter os campos Proprietario_principal e Status preenchido com as informacoes correspondente do area_code selecionado  
     Quando o usuario enviar os dados com os valores corretamente preenchidos
     Então deve ser verificado se o usuario enviou ou nao um kmz .Se nao enviou entao considere o poligono da base ,avise ao usuario com um alerta apropriado para cada caso.  
 Cenário: Formulário de Inutilização
     Dado um formulário de Inutilizacao com os campos Projeto ,area_code 
     Quando o usuário tenta enviar o formulário sem preencher os campos obrigatórios
     Então um alerta deve ser mostrado indicando os campos obrigatórios que devem ser preenchidos com as mensagens de erro Projeto , Proprietario_principal , Status e Matricula 
      |Projeto || area_code ||
      |'SGR'   || ''        || 
     Dado o usuário enviou o pedido com a solicitacao correta
     Então o usuário deve ser notificado e o pedido deve conter o poligono correspondente na base  