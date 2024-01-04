# language: pt
Funcionalidade: Manipulação de Formulários
	Eu como usuario do GIS quero um formulario de pedidos 
	no qual eu faca pedidos de Inclusao de propriedades , Edicao de poligonos existentes
	e Inutilizacao de areas que nao estaram mais na base do fundiario. 
	 
  Cenário: Formulário de Inclusão
    Dado que o formulário contem os campos Projeto,Proprietario,Matricula, Status ,Justificativa com apenas o campo Justificativa trancado
    Quando o usuário tenta enviar o formulário sem preencher os campos obrigatórios ou sem enviar um KML válido
    Então um alerta deve ser mostrado indicando os campos obrigatórios devem ser preenchidos com as mensagens de erro
    Quando o usario insere um KML válido 
    Caso a propriedade esteja fora dos buffers
    Então o campo Justificativa deve ser desbloqueado e se tornar campo obrigatório
    E envia uma Justificativa junto do pedido a Topografia com o nome do autor do pedido e do responsavel da topografia
    Caso a propriedade esteja dentro dos buffers
    Então envia o pedido a Topografia com o nome do autor do pedido e do responsavel da topografia


  Cenário: Formulário de Edição
    Dado que o formulário está inicialmente bloqueado, exceto para o campo Justificativa
    Quando o usuário tenta enviar o formulário sem preencher os campos obrigatórios ou sem enviar um KML válido
    Dado que o formulário deve preencher o dropdown de area_code do projeto selecionado
    E o formulário deve sinalizar quando os campos obrigatórios não estão preenchidos
    E o formulário deve sinalizar quando o KML não contém apenas uma propriedade
    E o formulário deve sinalizar quando o KML não foi inserido
    E o formulário deve retornar ao seu estado inicial quando inserido com sucesso
    E os campos obrigatórios são Projeto e area_code

  Cenário: Formulário de Inutilização
    Dado que o formulário está inicialmente bloqueado, exceto para o campo Justificativa
    Quando o usuário tenta enviar o formulário sem preencher os campos obrigatórios
    Então um alerta deve ser mostrado indicando os campos obrigatórios devem ser preenchidos com as mensagens de erro
