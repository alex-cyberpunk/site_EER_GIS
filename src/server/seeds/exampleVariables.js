userApp={
    _id: {
      "$oid": "654acdfbbb0046942ed8f865"
    },
    userId: 2,
    userName: "Bruno",//"Bruno"
    userType: "Topografia",//"Topografia"
    email: "alex.matias@pecenergia.com.br"
  }

  const appManager={
    "mapaPedidos":{
        "idItem":"967a2d2c37c74e26b5b8eb93375cad76",
        "url":"https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/Pedidos_TESTE/FeatureServer/",
        "IdLayer":[0],
        "editor":true,
        "tipoResponsavel":['Responsavel_Topografia'],

      },
      "formsPedidos":{
        "idItem":"967a2d2c37c74e26b5b8eb93375cad76",
        "url":"https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/Pedidos_TESTE/FeatureServer/",
        "IdLayer":[0],
        "TiposOperacao":['Edicao','Inclusao'],
        "visibleFields":['area_code','Proprietario_principal','Imovel','Matricula','Status'],
        "tipoResponsavel":['Responsavel_Comercial'],
        "user": "Bruno"
      },
      "tablePedidos":{
        "idItem":"967a2d2c37c74e26b5b8eb93375cad76",
        "url":"https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/Pedidos_TESTE/FeatureServer/",
        "IdLayer":[0],
        "lockFields":['Projeto','Responsavel_Topografia','Responsavel_Comercial','TipodeOperacaonabase'],
        "visibleFields":['Proprietario_principal','Responsavel_Comercial','Projeto','Responsavel_Topografia','Aprovacao_Lider_Topografia','Status','Imovel','Matricula','area_code'],
        "definitionExpression":'Responsavel_Topografia={user} AND ( Justificativa IS NULL)'                      
      },
      "contagemPedidos":{
        "pedidosTopografia":{
          "Title":"Pedidos em espera de análise da Topografia",
          "query": `Responsavel_Topografia={user} AND Analise='Topografia'`,
        }
      },
      //montado dinamicamente com as informacoes do db
      "Projetos":{
        "SSB":{
            "idItem":"2f480bf5cc0c49138352727449f3b949",
            "url":"https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/BRE/FeatureServer/",
            "IdLayer":[3],
            "visibleFields":['area_code','Proprietario_principal','Imovel','Matricula','Status'],
            "lockFields":['area_code','Proprietario_principal','Imovel','Matricula','Status']
            
          },
        "CUN":{
            "idItem":"f5cbc5e53f7a4b8dae7a5856e7f8769e",
            "url":"https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/CUN/FeatureServer/",
            "IdLayer":[3],
            "visibleFields":['area_code','Proprietario_principal','Imovel','Matricula','Status'],
            "lockFields":['area_code','Proprietario_principal','Imovel','Matricula','Status']
        },
        "ESV":{
            "idItem":"91ee685c035b452a99015ed497a4a8d2",
            "url":"https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/ESV/FeatureServer/",
            "IdLayer":[3],
            "visibleFields":['area_code','Proprietario_principal','Imovel','Matricula','Status'],
            "lockFields":['area_code','Proprietario_principal','Imovel','Matricula','Status']
        },
        "ALG":{
            "idItem":"e7a453b379f04abf87234a5db923cb0e",
            "url":"https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/JAG/FeatureServer/",
            "IdLayer":[3],
            "visibleFields":['area_code','Proprietario_principal','Imovel','Matricula','Status'],
            "lockFields":['area_code','Proprietario_principal','Imovel','Matricula','Status']
        },
        "SGR":{
          "idItem":"ff1beab5be6b4496a83986e2c5c1be66",
          "url":"https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SGR_Testes/FeatureServer/",
          "IdLayer":[3],
          "visibleFields":['area_code','Proprietario_principal','Imovel','Matricula','Status'],
          "lockFields":['area_code','Proprietario_principal','Imovel','Matricula','Status'],
          "Responsavel_Topografia":'Bruno'
      }
      }
    };