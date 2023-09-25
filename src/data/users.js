//Montar a Estrutura das paginas e de colunas de acordo com o user

async function handleUserType(userType) { 
    const dropdownMap=({})//returnProjetos(portal)
    const dropdownTable=dropdownMap
    let mapaPedidos,tableGPD,forms;
    switch (userType) { 
      case 'Topografia':
          //load .html of page 01

          //Mapa de exibicao          
          mapaPedidos={
            id_mapa_painel_aprovacao:"967a2d2c37c74e26b5b8eb93375cad76",
            lockFields:['Responsavel_Topografia','Responsavel_Comercial','TipodeOperacaonabase'],
            IdLayer:[3],
            hiddenFields:['ID_APROVACAO','OBJECTID','ID_Creator','ID_Editor','GlobalID','Creator','Editor','CreationDate','Shape__Area','Shape__Length','GlobalID'],
            dropdownMap:dropdownMap,
            printIntersect:true,
            tipoResponsavel:['Responsavel_Topografia']
          }
          forms={
            id_mapa_painel_aprovacao:"967a2d2c37c74e26b5b8eb93375cad76",
            TiposOperacao:['Edicao','Inclusao'],
            visibleFields:['area_code','Proprietario_principal','Imovel','Matricula','Status']
          }
          //load .html page 02
          //Table GPD
          tableGPD={
            IdTable:[3],
            lockFields:['Proprietario_principal','Imovel','area_code'],
            hiddenFields:['OBJECTID','ID_Creator','ID_Editor','GloblaID','CreationDate','Shape__Area','Shape__Length','GlobalID']
          } 
        break;
      case 'Comercial Fundiario':
          //load .html of page 01
          
          //Mapa de exibicao
          mapaPedidos={
            id_mapa_painel_aprovacao:"967a2d2c37c74e26b5b8eb93375cad76",
            lockFields:['Responsavel_Topografia','Responsavel_Comercial','TipodeOperacaonabase','Aprovacao'],
            IdLayer:[3],
            hiddenFields:['ID_APROVACAO','OBJECTID','ID_Creator','ID_Editor','GloblaID','CreationDate','Shape__Area','Shape__Lenght'],
            dropdownMap:dropdownMap,
            printIntersect:false,
            tipoResponsavel:['Responsavel_Comercial']
          }
          forms={
            id_mapa_painel_aprovacao:"967a2d2c37c74e26b5b8eb93375cad76",
            TiposOperacao:['Edicao','Inutilizacao'],
            visibleFields:['area_code','Proprietario_principal','Imovel','Matricula','Status']
          }
          //load .html page 02
          //Table GPD
          tableGPD={
            IdTable:[3],
            lockFields:['Proprietario_principal','Imovel','area_code'],
            hiddenFields:['OBJECTID','ID_Creator','ID_Editor','GloblaID','CreationDate','Shape__Area','Shape__Lenght']
          }
          
        break;
      case 'Engenharia':
        //load .html of page 01

          mapaPedidos={
            IdLayer:[0,1,2]
          }

          //load .html page 02
          tableGPD={
            IdTable:[0],
            hiddenFields:['OBJECTID','ID_Creator','ID_Editor','GloblaID','CreationDate','Shape__Area','Shape__Lenght']
          }
        break;
      
        //Luis
      default:
        
        //load .html of page 01
        
        //Mapa de exibicao
        //Pedidos  
        mapaPedidos={
          id_mapa_painel_aprovacao:"967a2d2c37c74e26b5b8eb93375cad76",
          IdLayer:[0,1,2,3],
          lockFields:[],
          dropdownMap:dropdownMap,
          printIntersect:false,
          tipoResponsavel:[],
          hiddenFields:['OBJECTID','ID_Creator','Editor','ID_Editor','GlobalID','CreationDate','Shape__Area','Shape__Lenght','Matricula','Responsavel_Topografia','Responsavel_Comercial','TipodeOperacaonabase','Status','Creator','EditDate','Imovel','Proprietario_principal']

        }
        //load .html page 02
        //Table GPD
        tableGPD={
          IdTable:[1],
          dropdownTable:dropdownMap.TM,
          hiddenFields:['OBJECTID','ID_Creator','ID_Editor','GloblaID','CreationDate','Shape__Area','Shape__Lenght']

        }
        break;
    }
    return {Mapa:mapaPedidos,Table:tableGPD,Forms:forms};
}

export { handleUserType };