# language: pt
#form.js
Funcionalidade: Manipulação de Formulários

  Cenário: Formulário de Inclusão
    Dado que o formulário contem os campos Projeto,Proprietario,Matricula, Status ,Justificativa com apenas o campo Justificativa trancado
    Quando o usuário tenta enviar o formulário sem preencher os campos obrigatórios ou sem enviar um KML válido
    Então um alerta deve ser mostrado indicando os campos obrigatórios que devem ser preenchidos com as mensagens de erro Projeto , Proprietario_principal , Status e Matricula
      |Projeto || Proprietario_principal || Status || Matricula ||
      |'SGR'   || ''                     || ''     || ''        ||
    Quando o usario insere um KML válido se a propriedade está fora dos buffers
    Então o campo Justificativa deve ser desbloqueado e se tornar campo obrigatório
    E envia uma Justificativa junto pedido a Topografia
    

# Cenário: Formulário de Edição
#     Dado que o formulário está inicialmente bloqueado, exceto para o campo Justificativa
#     Quando o usuário tenta enviar o formulário sem preencher os campos obrigatórios ou sem enviar um KML válido
#     Dado que o formulário deve preencher o dropdown de area_code do projeto selecionado
#     E o formulário deve sinalizar quando os campos obrigatórios não estão preenchidos
#     E o formulário deve sinalizar quando o KML não contém apenas uma propriedade
#     E o formulário deve sinalizar quando o KML não foi inserido
#     E o formulário deve retornar ao seu estado inicial quando inserido com sucesso
#     E os campos obrigatórios são Projeto e area_code

# Cenário: Formulário de Inutilização
#     Dado que o formulário está inicialmente bloqueado, exceto para o campo Justificativa
#     Quando o usuário tenta enviar o formulário sem preencher os campos obrigatórios
#     Então um alerta deve ser mostrado indicando os campos obrigatórios devem ser preenchidos com as mensagens de erro