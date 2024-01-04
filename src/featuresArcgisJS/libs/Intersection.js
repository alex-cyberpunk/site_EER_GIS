/// flowJustify deveria fazer parte dessa classe
import  {retornaListAreaCode} from '../Consultas.js' 
import * as projection from "@arcgis/core/geometry/projection.js";
import {findIntersect} from '../verifyIntersect.js'
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";

/**
 * Verifica se uma geometria intersecta com um Conjunto de geometrias 1->N
 * Verifica se geometrias intersectam um Conjunto de geometrias N->N
*/

class Intersection {
  constructor() {}

  findIntersect(feat, featureData, chaves = null, chavesIntersect = null) {
    // feat pode ser 1 ou N
    // featureData é N
    try {
      const intersectingFeatures = [];

      const data = featureData;
      // Nos casos que nao procura interseccoes a prop pode nao ter area_code
      let Geom;
      if (data) {
        data.forEach((feature) => {
          let intersection = geometryEngine.intersect(feature.geometry, Geom);
          if (intersection) {
            let area = geometryEngine.planarArea(intersection, "hectares");
            let attributes = {};
            for (let key of chaves) {
              if (feat.hasOwnProperty(key)) {
                attributes[key] = feat[key];
              }
            }
            let variable;
            for (let keyIntersect of chavesIntersect) {
              if (feature.hasOwnProperty(keyIntersect)) {
                if (chaves.includes(keyIntersect)) variable = `${keyIntersect}_intersect`;
                else variable = keyIntersect;
                attributes[variable] = feature[keyIntersect];
              }
            }
            attributes.areaPlanar = area;
            intersectingFeatures.push(attributes);
          }
        });
      }

      return intersectingFeatures;
    } catch (error) {
      console.error("Ocorreu um erro ao resolver a promise:", error);
      console.log("Verifique se não há erros de topologia no seu polígono");
      return [];
    }
  }

  async verifyIntersect1ToN(polygonGraphics, update, projetos, codes) {
    callAlert(`verificando Interseccao...`, "Alert", "Waiting");
    let outSpatialReference = new SpatialReference({
      wkid: 102100,
    });

    const promises = polygonGraphics.map(async (graphic) => {
      const projectedGeometry = projection.project(graphic.geometry, outSpatialReference);
      graphic.geometry = projectedGeometry;
    });

    const featureDataPromises = codes.map((code) =>
      retornaListAreaCode(projetos, true, update.Projeto, code)
    );
    const featureDataList = await Promise.all(featureDataPromises);

    const intersectPromises = featureDataList
      .filter((featureData) => featureData.length > 0)
      .map((featureData) => this.findIntersect(graphic.geometry, featureData, "linha_code"));

    if (intersectPromises.length === 0) {
      return false;
    } else {
      const results = await Promise.all(intersectPromises);
      return results.some((result) => result.length > 0);
    }
  }

  async verifyIntersectNToN(polygonGraphics, update, projetos, codes) {
    let intersectingFeatures = [];
    let equalfeatures;
    if (propIntersect === props) equalfeatures = true;
    else equalfeatures = false;
    props.forEach((prop) => {
      // If equal , eliminate the same object of the json
      // debugger
      if (equalfeatures) propIntersect = props.filter((item) => item.objectId != prop.objectId);
      const results = this.findIntersect(prop, propIntersect, "intersections", chaves, chavesIntersect);
      if (results.length > 0) {
        // debugger
        results.forEach((itemIntersect, index) => {
          // Input attrbutes in the key
          let attributes = {};
          for (let chave in itemIntersect) {
            attributes[chave] = itemIntersect[chave];
          }

          intersectingFeatures.push(attributes);
        });
      }
    });
    if (equalfeatures) {
      // Elimina duplicatas
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
    return intersectingFeatures;
  }
}


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