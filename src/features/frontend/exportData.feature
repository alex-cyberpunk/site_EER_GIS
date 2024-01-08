# language: pt
# language:pt
# generateData

Funcionalidade : Exportar arquivos para o usuario do fundiario
    Eu como usuario GIS quero ser capaz de exportar os features de um feature layer 
    selecionado do arcgis online para o formato shapefile e kmz para que eu 
    possa usa-los em outros softwares.
    E alem disso visualizar as informacoes numa tabela antes de exportar os arquivos, 
    para que eu possa verificar se os dados estao corretos.
    E tambem exportar os dados de sobreposicao de poligonos para que eu como topografo
    possa verificar se as sobreposicoes sao justificadas.

    Cenário:Exportar arquivos para o usuario do fundiario
        Dado que eu esteja logado na aplicacao GIS
        E tenha um feature layer selecionado
        Quando eu clicar no botao exportar
        Entao eu devo ver uma tabela com os dados do feature layer
        E um botao para exportar os dados para shapefile
        E um botao para exportar os dados para kmz
    Cenário: Exportar sobreposicoes de poligonos
        Dad que eu esteja logado na aplicacao GIS
        E tenha um feature layer selecionado
        E tiver selecionado os campos de exportacao de cada feature layer
        Quando eu clicar no botao exportar
        Entao eu devo ver uma tabela com os dados do feature layer no formato .csv
        E com as chaves principais de cada feature layer (area_code ,linha_code, Aero_code)
            ||area_code     ||linha_code        ||Aero_code               ||
            ||codigo de area||codigo dos buffers||codigo dos aerogeradores||
        E com as chaves selecionadas
        E com a area de sobreposicao de cada feature        