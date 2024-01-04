//Montar a Estrutura das paginas e de colunas de acordo com o user

function handleUserType(user) { 
    const dropdownMap=({})//returnProjetos(portal)
    let mapaPedidos,tableGPD,forms;
    return new Promise((resolve, reject) => {
    const userType=user.userType
      
      console.log(userType)
      switch (userType) { 
        case 'Topografia':
            //load .html of page 01
            console.log(userType)
            //Mapa de exibicao          
            mapaPedidos={
              userId:user._id,
              user:user.userName,
              id_mapa_painel_aprovacao:"967a2d2c37c74e26b5b8eb93375cad76",
              lockFields:['Projeto','Responsavel_Topografia','Responsavel_Comercial','TipodeOperacaonabase'],
              IdLayer:[3],
              hiddenFields:['ID_APROVACAO','OBJECTID','ID_Creator','ID_Editor','GlobalID','Creator','Editor','CreationDate','Shape__Area','Shape__Length','GlobalID'],
              dropdownMap:dropdownMap,
              printIntersect:true,
              visibleFields:['Proprietario_principal','Responsavel_Comercial','Projeto','Responsavel_Topografia','Aprovacao','Status','Imovel','Matricula','area_code'],
              tipoResponsavel:['Responsavel_Topografia']
            }
            forms={
              userId:user._id,
              user:user.userName,
              id_mapa_painel_aprovacao:"967a2d2c37c74e26b5b8eb93375cad76",
              TiposOperacao:['Edicao','Inclusao'],
              visibleFields:['area_code','Proprietario_principal','Imovel','Matricula','Status']
            }
            //load .html page 02
            //Table GPD
            tableGPD={
              user:user,
              IdTable:[3],
              lockFields:['Proprietario_principal','Imovel','area_code'],
              hiddenFields:['OBJECTID','ID_Creator','ID_Editor','GloblaID','CreationDate','Shape__Area','Shape__Length','GlobalID']
            } 
          break;
        case 'Comercial Fundiario':
            //load .html of page 01
            
            //Mapa de exibicao
            mapaPedidos={
              userId:user._id,
              user:user.userName,
              id_mapa_painel_aprovacao:"967a2d2c37c74e26b5b8eb93375cad76",
              lockFields:['Projeto','Responsavel_Topografia','Responsavel_Comercial','TipodeOperacaonabase','Aprovacao'],
              IdLayer:[3],
              hiddenFields:['ID_APROVACAO','OBJECTID','ID_Creator','ID_Editor','GloblaID','CreationDate','Shape__Area','Shape__Lenght'],
              visibleFields:['Proprietario_principal','Responsavel_Comercial','Responsavel_Topografia','Aprovacao','Status','Imovel','Matricula','area_code'],
              dropdownMap:dropdownMap,
              printIntersect:false,
              tipoResponsavel:['Responsavel_Comercial']
            }
            forms={
              userId:user._id,
              user:user.userName,
              id_mapa_painel_aprovacao:"967a2d2c37c74e26b5b8eb93375cad76",
              TiposOperacao:['Edicao','Inutilizacao'],
              visibleFields:['area_code','Proprietario_principal','Imovel','Matricula','Status']
            }
            //load .html page 02
            //Table GPD
            tableGPD={
              user:user,
              IdTable:[3],
              lockFields:['Proprietario_principal','Imovel','area_code'],
              hiddenFields:['OBJECTID','ID_Creator','ID_Editor','GloblaID','CreationDate','Shape__Area','Shape__Lenght']
            }
            
          break;
        case 'Lider Fundiario':
          mapaPedidos={
            userId:user._id,
            user:user.userName,
            id_mapa_painel_aprovacao:"967a2d2c37c74e26b5b8eb93375cad76",
            lockFields:['Projeto','Responsavel_Topografia','Responsavel_Comercial','TipodeOperacaonabase','Aprovacao'],
            IdLayer:[3],
            hiddenFields:['ID_APROVACAO','OBJECTID','ID_Creator','ID_Editor','GloblaID','CreationDate','Shape__Area','Shape__Lenght'],
            visibleFields:['Proprietario_principal','Responsavel_Comercial','Responsavel_Topografia','Aprovacao','Status','Imovel','Matricula','area_code'],
            dropdownMap:dropdownMap,
            printIntersect:false,
            tipoResponsavel:['Responsavel_Comercial']
          } 
          //REsources
        case 'Resources':
          
          //load .html of page 01
          
          //Mapa de exibicao
          //Pedidos  
          mapaPedidos={
            id_mapa_painel_aprovacao:"967a2d2c37c74e26b5b8eb93375cad76",
            IdLayer:[0,1,2,3],
            lockFields:[],
            visibleFields:['Justificativa','Aprovacao'],
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
      resolve({Mapa:mapaPedidos,Table:tableGPD,Forms:forms});  
      });
    
    
}

export { handleUserType };