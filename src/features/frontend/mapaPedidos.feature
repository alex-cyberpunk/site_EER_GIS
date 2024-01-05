# language: pt
Funcionalidade: Manipulação de View

  Cenário: Uso pela Topografia
    Dado que a tabela com os pedidos foi carregada
    Quando o usuario da Topografia Editar com o widget Editor e salvar a geometria do feature
    Entao deve se verificar se o feature se sobrepoe com os features da tabela de pedido e do projeto analisado
    Caso se sobreponha , deve aparecer uma popup sinalizando o tipo de sopreposicao
    Caso nao se sobreponha , o item deve receber a sinalizacao de 'Verificado GIS' no campo Analise
    permitindo que seja aprovado para o Lider Topografia
    Quando o usario da topografia usar o botao de aprovacao no painel
    Entao o item no mapa de pedidos deve receber a sinalizacao 'Lider Topografia' no campo Analise
    Quando o usario da topografia usar o botao de reprovacao no painel
    Entao o item no mapa de pedidos deve receber a sinalizacao 'Rejeitado' no campo Analise 
    e deve ser inserido no mapa de recusados
    

  Cenário: Uso pelo Lider da Topografia
    Quando o usario Lider da topografia usar o botao de aprovacao no painel
    Entao o item no mapa de pedidos deve receber a sinalizacao 'Aprovado' no campo Analise 
    e deve ser inserido no mapa do projeto (Inclusao) ou ser excluido (Inutilização) ou editado(Edicao)
    Quando o usario Lider da topografia usar o botao de reprovacao no painel
    Entao o item no mapa de pedidos deve receber a sinalizacao 'Topografia' no campo Analise 
    retornando ao usuario da topografia que mandou o pedido
    
