import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import FeatureForm from "@arcgis/core/widgets/FeatureForm.js"

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
            toggleColumns: false,
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
        outFields: ["area_code"],
        geometry: geometria
      });
      
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

function returnProjetos(portal,responsavel){
  var folderId = "c65d78d9af264926b56fd61dd1bcd1f7"; 
  var queryParameters = {
    num:1000,
    folder:{id:folderId}
  };
  console.log(responsavel)
  return new Promise((resolve, reject) => {
  portal.load().then(function() {
    let containsName;       
      portal.queryUsers({query: "username:" + portal.user.username}).
              then(function(queryResults) {
              queryResults.results[0].portal.user.fetchItems(queryParameters).
              then(function(fetchItemResult) {
                var itemInfo = {};
                console.log(fetchItemResult)  
                fetchItemResult.items.forEach(function (item) {
                if(responsavel){
                  containsName = item.categories.some(category => category.includes(responsavel));   
                  if (containsName) {
                    itemInfo[item.title] = item.id;
                  } 
                }
                else{
                  itemInfo[item.title] = item.id;
                }
                });  
                // Retornar o array de IDs
                resolve(itemInfo);
              });
              });
        
      });
  });
    
  
  

}





// funcao que faz o query dos features layer baseados nas tags Projetos e GPD
function returnProjetos_old(portal) {
    /*queryResults.results[0].fetchFolders().then(function(folders) {
        var gpdProjetosFolder = folders.find(function(folder) {
           folder.title === 'GPD_Projetos';
        });
      });*/
    var queryParams = new PortalQueryParams({
      query: 'categories: Bruno'
    });
  
    return portal.queryItems(queryParams).then(function (items) {
      // Crie um array para armazenar os IDs dos itens
      var itemInfo = {};
  
      // Iterar pelos itens e adicionar seus IDs e nomes ao objeto
      items.results.forEach(function (item) {
      itemInfo[item.title] = item.id;
      });  
      // Retornar o array de IDs
      return itemInfo;
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
///Editfeatures antigo    
function returnEditFeatures_old(update,coordenadas2D) {
    const data=[
      {
        rings: coordenadas2D,
        Projeto:update.Projeto,
        Proprietario_principal:update.Proprietario_principal,
        Imovel:update.Imovel,
        //Responsavel_Comercial_fundiario:
        area_code:update.area_code,
        Matricula:update.Matricula,
        Status:update.Status
      }
    ]
    // create an array of graphics based on the data above
    let graphics = [];
    let graphic;
    for (let i = 0; i < data.length; i++) {
      graphic = new Graphic({
        geometry: {
          type:'polygon',
          rings: data[i].rings,
          spatialReference:{"wkid":4326}//4326 para kml
        },
        attributes: {
          Projeto:data[i].Projeto,
          Matricula:data[i].Matricula,
          Proprietario_principal:data[i].Proprietario_principal,
          Imovel:data[i].Imovel,
          area_code:data[i].area_code,
          Status:data[i].Status
        }
      });
      graphics.push(graphic);
    }

    /*
      const addEdits = {
              addFeatures: graphics
            }
    */
    
    return graphics

  }
/*
function applyEditsToLayerHttp(token,data){
    //Solicatao http do user creator
    const portalUrl = "https://www.arcgis.com"
    const params = {
      'name': name,
      'targetSR': view.spatialReference,
      'maxRecordCount': 1000,
      'enforceInputFileSizeLimit': true,
      'enforceOutputJsonSizeLimit': true
    };

    const myContent = {
      'adds': JSON.stringify(data),
      'publishParameters': JSON.stringify(params),
      'f': 'json',
    };

    // use the REST generate operation to generate a feature collection from the zipped shapefile
    request(portalUrl + '/sharing/rest/content/features/generate', {
      query: myContent,
      body: document.getElementById('uploadForm'),
      responseType: 'json'
    })
    .then((response) => {
        const layerName = response.data.featureCollection.layers[0].layerDefinition.name;
        document.getElementById('upload-status').innerHTML = '<b>Loaded: </b>' + layerName;
        addShapefileToMap(response.data.featureCollection);
      
      })
      .catch(errorHandler);
  
  }

*/
async function queryByFieldValue(featureLayer,whereClause) {
  const query = {
    where: whereClause,
    outFields: ["*"],
    returnGeometry: false
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
  

// Edits Feature layers
function applyEditsToLayer(edits,url, item_id,operation='update') {
  let features;
  if(operation==='add'){features = {addFeatures: edits}}//Quando ele monta graphics
  else if(operation==='delete'){features={deleteFeatures:edits}}
  else if(operation==='update'){features={updateFeatures:[edits]}}
  
  console.log(features)
  return new Promise((resolve, reject) => {
    loadLayer(null, url, item_id).then((featureLayer) => {
      debugger
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
                  //const objectId = editsResult.updatesFeatureResults[0].objectId;
                  resolve(true);
                }
                else{
                  resolve(false);
                }
              }
              else if (operation==='update'){
                if (editsResult.updateFeatureResults.length > 0) {
                  //const objectId = editsResult.updatesFeatureResults[0].objectId;
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
  export{ returnProjetos, 
          retornaListAreaCode,
          returnEditFeatures,
          applyEditsToLayer,
          loadLayer,
          loadTable,
          loadForms,
          findField,
          hideFields,
          lockFieldsTable,
          hideFieldsTable,
          findFeatLyr,
          queryByFieldValue,
          returnUpdateFeatures};