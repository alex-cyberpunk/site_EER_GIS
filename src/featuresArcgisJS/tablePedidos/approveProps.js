import  {retornaListAreaCode,loadLayer,applyEditsToLayer} from '../Consultas.js'
import { callAlert } from "../../pages/sharedComponents/SucessMessage.js"
import axios from 'axios';  

async function retornaNovaAreaCode(nomeProjeto,layerId, projetos) {
  let newAreaCode;
  queryFeature(featureLayer,whereClause,returnGeometry=false,outFields= ["*"])
    .then((props)=>{
    if(props){
      let maxNumber = 0;
        for (const obj of props) {
            if (obj.area_code && typeof obj.area_code === 'string') {
              const matches = obj.area_code.match(/\d+$/);
                if (matches) {
                    const number = parseInt(matches[0], 10);
                    if (!isNaN(number) && number > maxNumber) {
                        maxNumber = number;
                    }
                }
            }
        }
        maxNumber++;
        const formattedNumber = maxNumber.toString().padStart(4, '0');
        newAreaCode = `PROP-${projeto}-${formattedNumber}`;
        }
    
      else {
        newAreaCode = `PROP-${projeto}-0001`;
      }   
    return newAreaCode;
  
  })
    
    
  }
  

  
function handleApprove (objectIds,layer,appManager,userId,key,userType,Analise) {
      if (objectIds.length > 0){
          callAlert(`Esperando verificação...`,'Alert','Waiting');
          let editfeature,url,layerId;  
          layer
          .queryFeatures({
              objectIds: objectIds,
              returnGeometry: true,
              outFields: ["*"]
          })
          .then((results) => {
            console.log('resultados do query')
              results.features.forEach((feature) => {
                const geometryFeature = feature.geometry; 
                const nomeProjeto=feature.attributes.Projeto;
                editfeature=feature;
                  
                //Primeiro verifica se Topografia verificou a interseccao
                if(userType==='Topografia' && editfeature.attributes.Analise==='Topografia')
                  {callAlert(` Propriedade precisa ter interseccoes verificadas `,'Alert','Warning');}
                else{
                  console.log('entrou no else')
                  editfeature.attributes.Analise=Analise;
                  //debugger
                  //Apenas o lider da topografia pode aprovar a area ou seja criar o area_code
                  if(userType==='Lider Topografia'){
                    
                    layerId=3;
                    
                    //Operacao de Inclusao
                    if(editfeature.attributes.TipodeOperacaonabase==='Inclusao'){
                        retornaNovaAreaCode(nomeProjeto,layerId, appManager.Projetos).
                        then((newAreaCode)=>{
                          editfeature.attributes.area_code=newAreaCode;
                          editfeature.attributes.numPedido=editfeature.attributes.OBJECTID;
                          //delete editfeature.attributes.OBJECTID;
                          delete editfeature.attributes.GlobalID;
                          url=appManager.Projetos[nomeProjeto].url;
                          editsToLayer([editfeature],url,layerId,key,userId,
                            {action:"Inserir",featureLayer:nomeProjeto,userId:userId},
                            "add",appManager.mapaPedidos.url,0,[editfeature])
                        })  
                      
                    }
                    //Operacao de Edicao
                    else if (editfeature.attributes.TipodeOperacaonabase==='Edicao'){
                      url=appManager.Projetos[nomeProjeto].url;
                      loadLayer(null, url, layerId).then( async(featureLayer) => {
                        const query = featureLayer.createQuery();
                        query.where = "area_code = '" + editfeature.attributes.area_code + "'"; // Add this line
                        const featureSet = await featureLayer.queryFeatures(query);
                        const features = featureSet.features;
                        features[0].geometry=editfeature.geometry;
                        editsToLayer(features[0],url,layerId,key,userId,
                          {action:"Editar",featureLayer:nomeProjeto,userId:userId},
                          "update",appManager.mapaPedidos.url,0,features)
                      
                      })
                      
                    }
                    //Operacao de Inutilizacao
                    else if (editfeature.attributes.TipodeOperacaonabase==='Inutilizacao'){
                      url=appManager.Projetos[nomeProjeto].url;
                      loadLayer(null, url, layerId).then( async(featureLayer) => {
                        const query = featureLayer.createQuery();
                        query.where = "area_code = '" + editfeature.attributes.area_code + "'"; // Add this line
                        const featureSet = await featureLayer.queryFeatures(query);
                        const features = featureSet.features;
                        features[0].geometry=editfeature.geometry;
                        editsToLayer(features,url,layerId,key,userId,
                          {action:"Excluir",featureLayer:nomeProjeto,userId:userId,geometry:editfeature.geometry},
                          "delete",appManager.mapaPedidos.url,0,features)
                      
                      })
                    }
                    
                  }
                  else {
                    url = appManager.mapaPedidos.url;
                    layerId=0;
                    editsToLayer(editfeature, url,layerId,key,userId,
                      {action:"Aprovar",featureLayer:"Mapa Pedidos",userId:userId},
                      "update")
                  }
                     
                }
                
              });
              
            });
            }
  
}


function approveAreas(objectIds,layer,userApp,appManager){
  let key,Analise;
  switch(userApp.userType){

  case 'Resources':
    key='areaNovaResources';
    Analise='Topografia'
    //Add waiting for Topografia
    break;

  case 'Topografia':
    key='areaAprovadaTopografia';
    Analise='Lider Topografia'
    //Add waiting for Lider Topografia
    break;
  
  case 'Lider Topografia':
    key = 'aprovacaoLiderTopografia';
    Analise = 'Concluido';
    // Add area_code to inclusion
    // Add prop to Map
    break;
  }
  handleApprove(objectIds, layer, appManager, userApp.userId, key, userApp.userType,Analise);
}


function addPropProjeto(featureTable,layer,userApp,appManager) {
  featureTable.when().then(() => {
  approveAreas(featureTable.highlightIds.items,layer,userApp,appManager)
  });
}

// reprovacao
function handleReprove (objectIds,layer,appManager,userId,key,userType,Analise) {
    if (objectIds.length > 0)///verify object 
    
    {callAlert(`Esperando verificação...`,'Alert','Waiting');
    let editfeature,url,layerId,operation;  
    layer
    .queryFeatures({
        objectIds: objectIds,
        returnGeometry: true,
        outFields: ["*"]
    })
    .then((results) => {
        // Talvez um for each aqui
        results.features.forEach((feature) => {
          
          const geometryFeature = feature.geometry; 
          const nomeProjeto=feature.attributes.Projeto;
          editfeature=feature;
          editfeature.attributes.Analise=Analise;
          if(userType==='Topografia' || userType==='Resources'){
            url = appManager.mapaPedidos.url;
            layerId=1;
            editfeature.attributes.Autor=userType;
            editfeature.attributes.ID_Autor=userId;
            editsToLayer([editfeature],url,layerId,key,userId,
              {action:"Reprovado",featureLayer:"Mapa Pedidos",userId:userId},
              "add",appManager.mapaPedidos.url,0,[editfeature])

          }
          else {
            url = appManager.mapaPedidos.url;
            layerId=0;
            editsToLayer(editfeature, url,layerId,key,userId,
              {action:"Revisao",featureLayer:"Mapa Pedidos",userId:userId},
              "update")
          }
        });
        
      });
      }

}


function reproveAreas(objectIds,layer,userApp,appManager){
  let key,Analise;
  switch(userApp.userType){

  case 'Resources':
    key='areaReprovadaResources';
    Analise='Reprovado'
    //Add waiting for Topografia
    break;

  case 'Topografia':
    key='areaReprovadaTopografia';
    Analise='Reprovado';
    //Add waiting for Lider Topografia
    break;
  
  case 'Lider Topografia':
    key = 'areaReprovadaLiderTopografia';
    Analise = 'Topografia';
    // Add area_code to inclusion
    // Add prop to Map
    break;
  }
  handleReprove(objectIds, layer, appManager, userApp.userId, key, userApp.userType,Analise);
}


function removePropTable(featureTable,layer,userApp,appManager) {
  featureTable.when().then(() => {
    reproveAreas(featureTable.highlightIds.items,layer,userApp,appManager)
  });
}


export {addPropProjeto,removePropTable} 