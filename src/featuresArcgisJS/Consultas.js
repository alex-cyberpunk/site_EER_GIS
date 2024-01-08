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

/**
 * Query a feature layer by a field value
*/
async function queryFeature(featureLayer,whereClause,objectIds=null,returnGeometry=false,outFields= ["*"]) {
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

async function retornaListAreaCode(url, geometria, layerId,whereClause='1=1') {
  const featureLoader = new FeatureLoader();
  const featureLayer = await featureLoader.loadLayer(this.url, this.layerId);
  queryByFieldValue(featureLayer,whereClause,null,returnGeometry=geometria,outFields= [key])

}
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
          queryFeature,
          retornaListAreaCode};