import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import FeatureForm from "@arcgis/core/widgets/FeatureForm.js"
import { object } from "joi";

async function queryByFieldValue_new(featureLayer,whereClause,returnGeometry=false,outFields= ["*"]) {
  const query = {
    where: whereClause,
    outFields: outFields,
    returnGeometry: returnGeometry
  };
  if(objectIds) query.objectIds=objectIds;
  
  return featureLayer.queryFeatures(query)
    .then((results) => {
      if (results.features.length > 0) {
        return results.features;
      } else {
        return null;
      }
    });
}


async function queryFeature(featureLayer,whereClause,returnGeometry=false,outFields= ["*"]) {
  const query = {
    where: whereClause,
    outFields: outFields,
    returnGeometry: returnGeometry
  };
  
  return featureLayer.queryFeatures(query)
    .then((results) => {
      if (results.features.length > 0) {
        return results.features;
      } else {
        return null;
      }
    });
}

//*async function retornaListAreaCode_new(Projetos, geometria, nomeDoMapa, IdLayer) {*
//  // Encontre o ID do item correspondente ao nome do mapa
//  const url = Projetos[nomeDoMapa].url;
//  
//  // Carregue o PortalItem
//    const featureLayer = new FeatureLayer({
//      url: url,
//      layerId: IdLayer, // Suponho que você queira a camada com índice 3
//      outFields: ["area_code"],
//      geometry: geometria
//    });
//    const resultes=await queryByFieldValue(featureLayer,whereClause,returnGeometry=false,outFields= ["*"])
//    return resultes;
//  }
//

// Operacoes dos feature layers dos Projetos
function findFeatLyr(map, searchLayer) {
  return new Promise((resolve, reject) => {
      let foundLayer = null;
      map.layers.forEach((layer) => {
        if(layer.title){
          if ((layer.title).includes(searchLayer)) {
            foundLayer = layer;
          }
        }
      });
  
      if (foundLayer) {
        resolve(foundLayer);
      } else {
        reject(new Error("Campo não encontrado"));
      }
  });
}  



  export{ findFeatLyr,
          queryFeature};