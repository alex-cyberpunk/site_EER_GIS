use('adminGISAPP');
const handleUserType=[{
  "Comercial Fundiario": {
    "mapaPedidos":{
        "printIntersect":false,
        "tipoResponsavel":['Responsavel_Comercial'],
        "whereClause":'Responsavel_Comercial={user} AND ( Justificativa IS NULL OR Aprovacao = "Aprovado")'
      },
      "formsPedidos":{
        "TiposOperacao":['Edicao','Inutilizacao'],
        "visibleFields":['area_code','Proprietario_principal','Imovel','Matricula','Status']
      },
      "tablePedidos":{
        "lockFields":['Projeto','Responsavel_Topografia','Responsavel_Comercial','TipodeOperacaonabase','Aprovacao'],
        "visibleFields":['area_code','Proprietario_principal','Imovel','Matricula','Status'],
        "whereClause":'Responsavel_Comercial={user} AND ( Justificativa IS NULL OR Aprovacao = "Aprovado")'

      },
      "contagemPedidos":{
        "pedidosTopografia":{
          "Title":"Pedidos em espera de análise da Topografia",
          "whereClause":'Responsavel_Topografia={user} AND ( Justificativa IS NULL )',
        }
      },
      "contagemPedidos":{
        "pedidosResources":{
          "Title":"Pedidos em espera de análise do Resources",
          "whereClause":'Justificativa IS NOT NULL',
        }
      }
   }},


  {"Topografia": {
    "mapaPedidos":{
        "printIntersect":true,
        "tipoResponsavel":['Responsavel_Topografia'],
        "whereClause":'Responsavel_Topografia={user} AND ( Justificativa IS NULL OR Aprovacao = "Aprovado")'

      },
      "formsPedidos":{
        "TiposOperacao":['Edicao','Inclusao'],
        "visibleFields":['area_code','Proprietario_principal','Imovel','Matricula','Status']
      },
      "tablePedidos":{
        "lockFields":['Projeto','Responsavel_Topografia','Responsavel_Comercial','TipodeOperacaonabase'],
        "visibleFields":['Proprietario_principal','Responsavel_Comercial','Projeto','Responsavel_Topografia','Aprovacao','Status','Imovel','Matricula','area_code'],
        "whereClause":'Responsavel_Topografia={user} AND ( Justificativa IS NULL OR Aprovacao = "Aprovado")'
        
      },
      "contagemPedidos":{
        "pedidosTopografia":{
          "Title":"Pedidos em espera de análise da Topografia",
          "whereClause":'Responsavel_Topografia={user} AND ( Justificativa IS NULL )',
        }
      }

    }},
  
  {"Lider Fundiario": {
   "mapaPedidos":{
       "printIntersect":false,
     },
     "tablePedidos":{
      "lockFields":['Projeto','Responsavel_Topografia','Responsavel_Comercial','TipodeOperacaonabase','Aprovacao'],
     }     
  }},
  {"Resources":{
   "mapaPedidos":{
       "printIntersect":false,
       "tipoResponsavel":[]
     },
     "tablePedidos":{
      "visibleFields":['Justificativa','Aprovacao'],
      "lockFields":[],
    },
    "contagemPedidos":{
      "pedidosResources":{
        "Title":"Pedidos em espera de análise do Resources",
        "whereClause":'Justificativa IS NOT NULL',
      }
    } 
  }
}
         
]

db.getCollection('controlComponents').insertMany(handleUserType);




