import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import  {returnProjetos,retornaListAreaCode} from '../Consultas.js'

async function findIntersect(geometry, featureData) {
  try {
    const intersectingFeatures = [];
    
    const data = await featureData;
    
    if (data) {
      data.forEach((feature) => {
        if (geometryEngine.intersect(feature.geometry, geometry)) {
          // A geometria atual intersecta com a geometria especificada
          intersectingFeatures.push({
            area_code: feature.area_code,
            // Adicione outras propriedades aqui conforme necessário
          });
        }
      });
    }
    
    return intersectingFeatures;
  } catch (error) {
    console.error('Ocorreu um erro ao resolver a promise:', error);
    console.log("Verifique se não há erros de topologia no seu polígono");
    return [];
  }
}

//implementar painel de mudancas :
function displayMessage(info,outputMessages) {
  outputMessages.innerHTML += info;
  outputMessages.scrollTop = outputMessages.scrollHeight;
}
// Função para limpar mensagens
function clearMessage(outputMessages) {
  outputMessages.innerHTML = ''; // Define o conteúdo como vazio para remover todas as mensagens
}

function printIntersection(layer,portal,outputMessagesDiv){
  clearMessage(outputMessagesDiv);
  layer.on("edits", function (event) {
      if (event.updatedFeatures.length > 0) {
          const objectIds = [];
          event.updatedFeatures.forEach((item) => { 
                           
              objectIds.push(item.objectId);
          });
          displayMessage(objectIds)
          layer
          .queryFeatures({
              objectIds: objectIds,
              returnGeometry: true,
              outFields: ["*"]
          })
          .then((results) => {

              const geometryFeature = results.features[0].geometry; // Isso obtém o ID da feature
              const nomeProjeto=results.features[0].attributes.Projeto;
              console.log(geometryFeature)
              var Props = retornaListAreaCode(portal, true, nomeProjeto,3)
              Props.then((results)=>{
                  const intersectingItems=findIntersect(geometryFeature, results);
                  intersectingItems.then((results)=>{
                      if(results.length>0){
                          results.forEach((itemIntersect, index) => {
                              console.log(itemIntersect);
                              displayMessage(`A Ultima propriedade que foi salva, intersecta a propriedade da base: ${itemIntersect.area_code}`,outputMessagesDiv);
                              });
                      }
                      else{
                          //Adiciona na base
                          displayMessage(`A Ultima propriedade que esperava Edicao Foi adicionada na base pois nao havia Inteseccoes `,outputMessagesDiv);
                      }    
                  })
                      
              })
              
          });
          
              
          
        }
    });
    
}
 

export {printIntersection};