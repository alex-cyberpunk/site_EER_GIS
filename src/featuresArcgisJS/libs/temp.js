
//Funcoes para refatorar
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import  {retornaListAreaCode,returnUpdateFeatures,applyEditsToLayer} from './Consultas.js'
import { callAlert } from "../pages/sharedComponents/SucessMessage.js"



function printIntersection(editor,layer,appManager){
  //displayMessage('Aguardando a analise de interseccao com outras propriedades...',feature);
  function handleEdits (event) {
    let editfeature = null;
    if (event.updatedFeatures.length > 0) {
        const objectIds = [];
        event.updatedFeatures.forEach((item) => {               
            objectIds.push(item.objectId);
        });
        queryByFieldValue_new(layer, "1=1", objectIds, ["*"])
        .then((results) => {
            const geometryFeature = results.features[0].geometry; // Isso obtém o ID da feature
            const nomeProjeto=results.features[0].attributes.Projeto;
            editfeature=results.features[0];
            verifyIntersect1N([geometryFeature], editfeature, appManager.Projetos,[3]).
            then((results)=>{
                (results)?callAlert(`Intersecta a(s) propriedade(s) de ${nomeProjeto}`,'Alert','Warning'):
                callAlert(`Propriedade sem interseccos`,'Alert','Success');
            })
            })
        }
    }

            let allowEdits = false;

            editor.viewModel.watch("state", function (state) {
              
              if (state === 'awaiting-feature-to-update') {
                allowEdits = true;
              } else {
                allowEdits = false;
              }
            });

            layer.on("edits", function(event) {
              if (allowEdits) {
                handleEdits(event);
                allowEdits = false; // Reset the flag after handling the edits
              }
            });
}

async function findIntersections(appManager,projetos,layerId,layerIdIntersect,chaves,chavesIntersect) {
  //Convert date to string
  function convertToDate(timestamp){
    const data = new Date(timestamp);

    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const hora = data.getHours().toString().padStart(2, '0');
    const minuto = data.getMinutes().toString().padStart(2, '0');
    const segundo = data.getSeconds().toString().padStart(2, '0');

    const dataFormatada = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
    return dataFormatada;
  }  

  let intersectingFeatures = [];
  let propIntersect;

  for (let nomeProjeto of projetos) {
    //Modificar retornaListAreaCode para retornar todo o objeto incluindo ObjectId
    const props = await retornaListAreaCode(appManager.Projetos, true, nomeProjeto,layerId);

    if(layerIdIntersect!==layerId) propIntersect = await retornaListAreaCode(appManager.Projetos, true, nomeProjeto,layerIdIntersect);
  
    intersectingFeatures=verifyIntersectNToN(props, propIntersect,chaves,chavesIntersect);
  }

 return intersectingFeatures;
  
}


export { verifyAprovacao};