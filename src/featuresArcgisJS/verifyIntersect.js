import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import  {retornaListAreaCode,returnUpdateFeatures,applyEditsToLayer} from './Consultas.js'
import { callAlert } from "../pages/sharedComponents/SucessMessage.js"

//import handleEdits from "../../../reciclyBin/tableGPD/approveProps.js"
//import {sendMessageWithTemplate} from "../email/sendEmail.js"
function findIntersect(feat, featureData,chave,chaves=null,chavesIntersect=null) {
  try {
    const intersectingFeatures = [];
    
    const data =  featureData;
    
    //Nos casos que nao procura interseccoes a prop pode nao ter area_code
    let Geom;
    let area_code_intersect,CreationDate_intersect,EditDate_intersect;

    if(chave==='intersections'){
      Geom=feat.geometry
      area_code_intersect=feat.area_code
      CreationDate_intersect=feat.CreationDate
      EditDate_intersect=feat.EditDate
    }
    else{ Geom=feat} //apenas geometria na requisicao

    if (data) {
      //console.log(data)
      data.forEach((feature) => {
        //debugger
          if (geometryEngine.intersect(feature.geometry, Geom)) {
            switch(chave){
              case 'linha_code':
                intersectingFeatures.push({
                  linha_code: feature.linha_code,
                });
                //console.log(intersectingFeatures)
              break;  
              case 'area_code':
                intersectingFeatures.push({
                  area_code: feature.area_code,
                });
              case 'intersections':
                let intersection=geometryEngine.intersect(feature.geometry, Geom)
                let area = geometryEngine.planarArea(intersection, "hectares");
                
                let attributes={}
                for (let key of chaves) {
                  //debugger
                  if (feat.hasOwnProperty(key)) {
                    attributes[key] = feat[key];
                  }
                }
                
                let variable;
                for (let keyIntersect of chavesIntersect) {
                  //debugger
                  if (feature.hasOwnProperty(keyIntersect)) {
                    if(chaves.includes(keyIntersect)) variable=`${keyIntersect}_intersect`;
                    else variable = keyIntersect  
                    attributes[variable] = feature[keyIntersect];
                  }
                }
                attributes.areaPlanar=area
                intersectingFeatures.push(attributes);
                
                //debugger  
              break;    
              
            }            
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


function printIntersection(editor,layer,appManager){
  //displayMessage('Aguardando a analise de interseccao com outras propriedades...',feature);
  function handleEdits (event) {
    callAlert(`Esperando verificação...`,'Alert','Waiting');
    let editfeature = null;
    if (event.updatedFeatures.length > 0) {
        const objectIds = [];
        event.updatedFeatures.forEach((item) => {               
            objectIds.push(item.objectId);
        });
        layer
        .queryFeatures({
            objectIds: objectIds,
            returnGeometry: true,
            outFields: ["*"]
        })
        .then((results) => {
            const geometryFeature = results.features[0].geometry; // Isso obtém o ID da feature
            const nomeProjeto=results.features[0].attributes.Projeto;
            editfeature=results.features[0];
            retornaListAreaCode(appManager.Projetos, true, nomeProjeto,3).then((props)=>{
              const results = findIntersect(geometryFeature, props, 'area_code');
              if(results.length>0){
                var string =`Intersecta a(s) propriedade(s) de ${nomeProjeto}:\n`;
                  results.forEach((itemIntersect, index) => {
                      console.log(itemIntersect);
                      string = string.concat(`${itemIntersect.area_code};`)
                      });
                      callAlert(string,'Alert','Warning');
              }
              else{
                    editfeature.attributes.Analise='Verificado GIS';
                    if(editfeature.attributes.erro) editfeature.attributes.erro='';
                    if(editfeature.attributes.intersect) editfeature.attributes.intersect='';
                    applyEditsToLayer(editfeature, 
                      appManager.mapaPedidos.url,0)
                    .then((results) => {
                      if(results)
                        callAlert(` Propriedade sem interseccos`,'Alert','Success');
                    })
                }    
              })
             });
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
    const props = await retornaListAreaCode(appManager.Projetos, true, nomeProjeto,layerId);

    if(layerIdIntersect!==layerId) propIntersect = await retornaListAreaCode(appManager.Projetos, true, nomeProjeto,layerIdIntersect);
  
    props.forEach((prop) => {
      //If equal , eliminate the same object of the json
      //debugger
      if(layerIdIntersect===layerId) propIntersect=props.filter(item=>item.area_code!=prop.area_code);
      const results = findIntersect(prop, propIntersect, 'intersections',chaves,chavesIntersect);
      if (results.length > 0) {
        //debugger
          results.forEach((itemIntersect, index) => {
              //Input attrbutes in the key
              let attributes = {};
              for (let chave in itemIntersect) {
                  attributes[chave] = itemIntersect[chave];
              }
              
              intersectingFeatures.push(attributes);
          });
      } 
    });
  }
  if(layerIdIntersect===layerId){
    // Elimina duplicatas
    debugger
    const combinacoesUnicas = new Set();

    const itensNaoDuplicados = [];

    for (const item of intersectingFeatures) {
      const areaCode = item.area_code;
      const areaCodeIntersect = item.area_code_intersect;
      const combinacao1 = `${areaCode}-${areaCodeIntersect}`;
      const combinacao2 = `${areaCodeIntersect}-${areaCode}`;

      // Verifique se ambas as combinações já foram vistas
      if (!combinacoesUnicas[combinacao1] && !combinacoesUnicas[combinacao2]) {
        // Se ambas as combinações não foram vistas, adicione-as ao objeto de combinações únicas e ao array de itens não duplicados
        combinacoesUnicas[combinacao1] = true;
        combinacoesUnicas[combinacao2] = true;
        itensNaoDuplicados.push(item);
      }
    }

  return itensNaoDuplicados;  
  }
  else  return intersectingFeatures;
  
}


async function verificaIntersections(projetos,appManager,layerId,layerIdIntersect,chaves,chavesIntersect) {
  const intersectingFeatures = await  findIntersections(appManager,projetos,layerId,layerIdIntersect,chaves,chavesIntersect)
  function jsonToCsv(jsonData) {
    if (jsonData.length === 0) {
      return '';
    }
  
    const keys = Object.keys(jsonData[0]);
    const csvRows = jsonData.map(row => keys.map(key => row[key]).join(','));
    csvRows.unshift(keys.join(',')); // Add the headers at the start of the array
  
    return csvRows.join('\n');
  }

    const csv = jsonToCsv(intersectingFeatures);

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'interseccoes.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  
}

 

export {printIntersection,findIntersect,verificaIntersections};