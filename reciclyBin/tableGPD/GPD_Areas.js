function addCondtionalDropdown(featureTable,dropdown){
    // Adiciona um listener pra drop-down de status
    featureTable.when(() => {
        setTimeout(() => {
          const grid = featureTable.container.querySelector("vaadin-grid");
          grid?.addEventListener("cell-activate", (e) => {
            const selected = e.detail.model.selected;
            const feature = e.detail.model.item.feature;
            //console.log(feature.attributes)
            conditionStatus(feature.attributes,dropdown,featureTable)
            //selected ? featureTable.deselectRows(feature) : featureTable.selectRows(feature);
           });
        },100);
      });
    
    
}

function queryFilter(featureTable){
     

}

async function filterValues(featureTable) {
    const column = 'Status'; // Pegar valor do select
    const value = 'Mapeado sem documentos'; // Pegar valor do select
  
    // Crie a expressão de filtro
    const expression = `${column} = '${value}'`;
    console.log(expression);
  
    // Aplique a expressão de filtro à camada da feature table
    featureTable.layer.definitionExpression = expression;
  
    // Opcionalmente, você pode chamar refresh() para atualizar a tabela após aplicar o filtro
    await featureTable.refresh();
  }
  
  // Chame a função filterValues com a sua feature table como argumento
  // Exemplo de uso: filterValues(suaFeatureTable);
  

function conditionStatus(values,dropdown,featureTable){
    dropdown.codedValues=[]
    if(!values.Matricula || !values.Contrato){
        dropdown.codedValues=[
        { name: "Contratado com Matrícula Retificada e com Geo INCRA", code: "CMR_INCRA" },
        { name: "Contratado com Matrícula e com Geo INCRA", code: "CM_INCRA" },
        { name: "Contratado com Matrícula em nome do proprietário", code: "CM" },
        { name: "Contratado com Matrícula em nome de 3º", code: "CM3" },
        { name: "Regularizado", code: "Regularizado" },
        { name: "Regularizado", code: "Regularizado_PI" },
        { name: "Áreas CTG", code: "Areas_Concorrente" }
    ]
    }
    if(values.Matricula || !values.Contrato){
        dropdown.codedValues=[
            { name: "Mapeado sem documentos", code: "MSD" },
            { name: "Mapeado com documentos", code: "MCD" }
        ]
    }
    if(!values.Matricula || values.Contrato){
        dropdown.codedValues=[
            { name: "Protocolado Corredor de Ventos", code: "Protocolado" },
            { name: "Contratado sem Matrícula", code: "CSM" }
        ]
    }

    featureTable.layer.fields[5].domain=dropdown

}

export { conditionStatus ,filterValues,queryFilter,addCondtionalDropdown};