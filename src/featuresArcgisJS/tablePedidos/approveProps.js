import  {retornaListAreaCode,loadLayer,applyEditsToLayer} from '../Consultas.js'
import { callAlert } from "../../pages/sharedComponents/SucessMessage.js"
import axios from 'axios';  
import LayerEditor from '../libs/LayerEditor.js'

//Create an new area_code for the polygon
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
          queryFeature(layer, "1=1", objectIds, ["*"]).
          then(async(results) => {
              results.features.forEach((feature) => {
                const geometryFeature = feature.geometry; 
                const nomeProjeto=feature.attributes.Projeto;
                editfeature=feature;
                  
                //Primeiro verifica se Topografia verificou a interseccao
                if(userType==='Topografia' && editfeature.attributes.Analise==='Topografia')
                  {callAlert(` Propriedade precisa ter interseccoes verificadas `,'Alert','Warning');}
                else{
                  editfeature.attributes.Analise=Analise;
                  
                  if(userType==='Lider Topografia'){
                    
                    layerId=3;//Areas
                    //Only the 'Lider Topografia" can, add, update or exclude areas  
                    let features;
                    switch(editfeature.attributes.TipodeOperacaonabase){
                      
                      case 'Inclusao':
                        retornaNovaAreaCode(nomeProjeto,layerId, appManager.Projetos).
                        then((newAreaCode)=>{
                          features=editfeature;
                          features.attributes.area_code=newAreaCode;
                          features.attributes.numPedido=editfeature.attributes.OBJECTID;
                          delete features.attributes.GlobalID;
                          url=appManager.Projetos[nomeProjeto].url;
                          const layerEditorClass = new LayerEditor(
                            url, // url
                            layerId, // layerId
                            userId, // userId
                            true, // sendEmail
                            true, // sendLog
                            axios // axios
                          );
                          layerEditorClass.editFeatures(features, 
                                                        'add',
                                                        key,
                                                        {action:"Inserir",featureLayer:nomeProjeto,userId:userId});  
                        })  
                      
                        break;
                      case 'Edicao':
                        url=appManager.Projetos[nomeProjeto].url;
                        const where = "area_code = '" + editfeature.attributes.area_code + "'"; // Add this line
                        retornaListAreaCode(this.url, true, 3,where).
                        then( async(props) => {  
                          features = props.features;
                          features[0].geometry=editfeature.geometry;
                          
                          const layerEditorClass = new LayerEditor(
                              url, // url
                              layerId, // layerId
                              userId, // userId
                              true, // sendEmail
                              true, // sendLog
                              axios // axios
                            );
                            layerEditorClass.editFeatures(features, 
                                                          'update',
                                                          key,
                                                          {action:"Editar",featureLayer:nomeProjeto,userId:userId});  
  
                        
                        })
                        break;
                      case 'Inutilizacao':
                        url=appManager.Projetos[nomeProjeto].url;
                      retornaListAreaCode(this.url, true, 3,where).
                      then( async(props) => {  
                        features = props.features;
                        features[0].geometry=editfeature.geometry;
                        editsToLayer(features,url,layerId,key,userId,
                                                    "delete",appManager.mapaPedidos.url,0,features)
                      })
                      const layerEditorClass = new LayerEditor(
                        url, // url
                        layerId, // layerId
                        userId, // userId
                        true, // sendEmail
                        true, // sendLog
                        axios // axios
                      );
                      layerEditorClass.editFeatures(features, 
                                                    'remove',
                                                    key,
                                                    {action:"pedido concluido",featureLayer:'Pedidos',userId:userId,geometry:features.geometry});  
    
                    }
                    const layerEditorClass = new LayerEditor(
                      appManager.mapaPedidos.url, // url
                      0, // layerId
                      userId, // userId
                      false, // sendEmail
                      true, // sendLog
                      axios // axios
                    );
                    layerEditorClass.editFeatures(features, 
                                                  'remove',
                                                  key,
                                                  {action:"Excluir",featureLayer:nomeProjeto,userId:userId,geometry:editfeature.geometry});  
                  
                  }  
                    
                  else {
                    //Make modifications in Pedidos
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