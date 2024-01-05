import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import FeatureForm from "@arcgis/core/widgets/FeatureForm.js"
import { object } from "joi";

// Load itens (Layers,Tables ,Forms )

function loadLayer(map, url, layerID) {
  return new Promise((resolve, reject) => {
    const featureLayer = new FeatureLayer({
      /*portalItem: {
        id: itemID
      }*/
      url: url,
      outFields: ["*"],
      layerId: layerID,
      definitionExpression: "1=1"
    });

    if (map) {
      featureLayer.visible=false;
      map.add(featureLayer, 0);
    }
    // Verifique se o featureLayer foi carregado com sucesso
    featureLayer.load().then(() => {
      

      resolve(featureLayer);
    }).catch((error) => {
      reject(error);
    });
  });
}
function loadTable(tableDiv, featureLayer, view) {
  return new Promise((resolve, reject) => {
    featureLayer.load().then(() => {
      const featureTable = new FeatureTable({
        view: view,
        layer: featureLayer,
        multiSortEnabled: true,
        editingEnabled: true,
        container: tableDiv,
        visibleElements: {
          header: true,
          menu: true,  
          selectionColumn: true,
          menuItems: {
            clearSelection: true,
            deleteSelection: true,
            refreshData: true,
            toggleColumns: true,
            selectedRecordsShowAllToggle: true,
            selectedRecordsShowSelectedToggle: true,
            zoomToSelection: true
          },
          columnMenus: true
        }         
      });

      resolve(featureTable);
    }).catch((error) => {
      reject(error);
    });
  });
}

function loadForms(featureLayer, formDiv) {
  return new Promise((resolve, reject) => {
    featureLayer.load().then(() => {
      const form = new FeatureForm({
        container: formDiv,
        layer: featureLayer,
        title: "Atualizacao de props",
        description: "Atualizacao de props"
      });

      resolve(form);
    }).catch((error) => {
      reject(error);
    });
  });

}

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


async function queryByFieldValue(featureLayer,whereClause,returnGeometry=false,outFields= ["*"]) {
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
function retornaListAreaCode(Projetos, geometria, nomeDoMapa, IdLayer ,returOthersattribrutes = false) {
    // Encontre o ID do item correspondente ao nome do mapa
    const url = Projetos[nomeDoMapa].url;
    
    // Carregue o PortalItem
      const field_area_code_layer = new FeatureLayer({
        /*
        portalItem: {
          id: itemId
        },
        */
        url: url,
        layerId: IdLayer, // Suponho que você queira a camada com índice 3
        outFields: ["*"],
        geometry: geometria
      });
      //console.log(JSON.stringify(field_area_code_layer))
      // Query para obter os valores do campo 'area_code'
      return field_area_code_layer.queryFeatures().then(function (result) {
        
        const areaCodeList = result.features.map(function (feature) {
          if (geometria) {
            if (IdLayer === 3) {
              
              if(returOthersattribrutes){
                
                return{
                  CreationDate:feature.attributes.CreationDate,
                  EditDate:feature.attributes.EditDate,
                  area_code: feature.attributes.area_code,
                  geometry: feature.geometry.toJSON()
                  
                }
                
              }
              else{
                return {
                  area_code: feature.attributes.area_code,
                  geometry: feature.geometry.toJSON()
                }
              }
            }
            if (IdLayer === 1 || IdLayer === 2) {
              return {
                linha_code: feature.attributes.linha_code,
                geometry: feature.geometry.toJSON() // Converte a geometria em JSON
              };
            }
            if (IdLayer === 0) {
              return {
                aero_code: feature.attributes.aero_code,
                geometry: feature.geometry.toJSON() // Converte a geometria em JSON
              };
            }
          } else {
            return feature.attributes.area_code;
          }
        });
        return areaCodeList;
      });
  
}

// Operacoes de trancamento de campos (find,hidde,lock)
//OBS : TO CONSIDERANDO QUE O FEATURELAYER JA ESTA CARREGADO
function lockFieldsTable(feat,lockFields,editable){
  feat.layer.fields.forEach((field) => {
        if (lockFields.includes(field.name)) {
          field.editable = editable;
        }
      });
}

function hideFieldsTable(feat, visibleFields) {
  feat.hiddenFields = []; // Inicialize um array vazio para hiddenFields
  feat.layer.fields.forEach((field) => {
    if (!visibleFields.includes(field.name)) {
      
      feat.hiddenFields.push(field.name);
    }
  });
}
  
function hideFields(feat,visibleFields){
feat.layer.fields.forEach((field) => {
    if (!visibleFields.includes(field.name)) {
      field.visible = false;
    }
  });
}
function findField(feat, searchField) {
return new Promise((resolve, reject) => {
    let foundField = null;
    feat.layer.fields.forEach((field) => {
      
      if (field.name === searchField) {
        foundField = field;
      }
    });

    if (foundField) {
      resolve(foundField);
    } else {
      reject(new Error("Campo não encontrado"));
    }
});
}  
function deleteFields(feat, searchFields) {
  feat.fields = feat.fields.filter(field => searchFields.includes(field.name));
}


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


  function returnUpdateFeatures(editFeature) {

    const addEdits = {
        updateFeatures: [editFeature]
    }
    return addEdits

  }


  async function returnEditFeatures(updates, coordenadas2D, wkid = { wkid: 4326 }) {
    let graphics = [];
  
    updates.forEach(update => {
      const attributes = {};
      for (let chave in update) {
        if (update.hasOwnProperty(chave)) {
          if (chave !== 'rings') {
            attributes[chave] = update[chave];
          }
        }
      }
  
      let graphic = new Graphic({
        geometry: {
          type: 'polygon',
          rings: update.rings,
          spatialReference: wkid // 4326 para kml
        },
        attributes: attributes
      });
  
      graphics.push(graphic);
    });
  
    return graphics;
}


  

// Edits Feature layers
function applyEditsToLayer(edits,url, item_id,operation='update') {
  let features;
  if(operation==='add'){features = {addFeatures: edits}}//Quando ele monta graphics
  else if(operation==='delete'){features={deleteFeatures:edits}}
  else if(operation==='update'){features={updateFeatures:[edits]}}
  
  console.log(features)
  return new Promise((resolve, reject) => {
    loadLayer(null, url, item_id).then((featureLayer) => {
      
      featureLayer
          .applyEdits(features)
          .then((editsResult) => {
            console.log("editsResult")
            console.log(editsResult)
            // Get the objectId of the newly added feature.
              // Call selectFeature function to highlight the new feature.
              if(operation==='add'){
                if (editsResult.addFeatureResults.length > 0) {
                  const objectId = editsResult.addFeatureResults[0].objectId;
                  resolve(objectId);
                }
                else{
                  resolve(null);
                }
              }
              else if(operation==='delete'){
                if (editsResult.deleteFeatureResults.length > 0) {
                  const objectId = editsResult.updatesFeatureResults[0].objectId;
                  resolve(true);
                }
                else{
                  resolve(false);
                }
              }
              else if (operation==='update'){
                if (editsResult.updateFeatureResults.length > 0) {
                  const objectId = editsResult.updatesFeatureResults[0].objectId;
                  resolve(true);
                }
                else{
                  resolve(false);
                }
          }
        })
          .catch((error) => {
              console.log("error = ", error);
              reject(error);
          });
  });
    })
      
}
  export{  retornaListAreaCode,
          returnEditFeatures,
          applyEditsToLayer,
          loadLayer,
          loadTable,
          loadForms,
          findField,
          deleteFields,
          hideFields,
          lockFieldsTable,
          hideFieldsTable,
          findFeatLyr,
          queryByFieldValue,
          returnUpdateFeatures};