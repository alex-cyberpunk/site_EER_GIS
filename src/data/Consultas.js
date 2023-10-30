import PortalItem from "@arcgis/core/portal/PortalItem.js";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";
import FeatureForm from "@arcgis/core/widgets/FeatureForm.js"

// Load itens (Layers,Tables ,Forms )
function loadLayer(map, itemID, layerID) {
  return new Promise((resolve, reject) => {
    const featureLayer = new FeatureLayer({
      portalItem: {
        id: itemID
      },
      outFields: ["*"],
      layerId: layerID,
      definitionExpression: "1=1"
    });

    if (map) {
      featureLayer.visible=false;
      map.add(featureLayer, 0);
    }
    console.log(itemID)
    console.log(featureLayer)
    console.log("antes")
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
        container: tableDiv
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
function retornaListAreaCode(portal, geometria, nomeDoMapa, IdLayer) {
  return returnProjetos(portal,null).then(function (layerItems) {
    // Encontre o ID do item correspondente ao nome do mapa
    const itemId = layerItems[nomeDoMapa];

    if (!itemId) {
      console.log(`O mapa com o nome ${nomeDoMapa} não foi encontrado.`);
      return []; // Retorna uma lista vazia, pois o mapa não foi encontrado
    }

    const portalItem = new PortalItem({
      id: itemId,
      portal: portal
    });
    // Carregue o PortalItem
      const field_area_code_layer = new FeatureLayer({
        portalItem: {
          id: itemId
        },
        layerId: IdLayer, // Suponho que você queira a camada com índice 3
        outFields: ["area_code"],
        geometry: geometria
      });

      // Query para obter os valores do campo 'area_code'
      return field_area_code_layer.queryFeatures().then(function (result) {
        const areaCodeList = result.features.map(function (feature) {
          if (geometria) {
            if (IdLayer === 3) {
              return {
                area_code: feature.attributes.area_code,
                geometry: feature.geometry.toJSON() // Converte a geometria em JSON
              };
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
        console.log(field)
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
      console.log("maps")
      console.log(map)
      map.layers.forEach((layer) => {
        console.log(layer.title)
        console.log(searchLayer)
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
    console.log(portal)       
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
  function returnEditFeatures(update,coordenadas2D) {
    // ESPERA UM FORMATO RINGS , ATRIBUTES DE ENTRADA
    
    let graphics = [];
    let graphic;
    const attributes = {};
    for (let i = 0; i < 1; i++) {
      

      for (let chave in update) {
        if (update.hasOwnProperty(chave)) {
          if (chave !== 'rings') {
            attributes[chave] = update[chave];
          }
        }
      }

      graphic = new Graphic({
        geometry: {
          type: 'polygon',
          rings: update.rings,
          spatialReference: { wkid: 4326 } // 4326 para kml
        },
        attributes: attributes
      });

      graphics.push(graphic);
    }


    const addEdits = {
              addFeatures: graphics
            }
    return addEdits

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


    console.log(data)
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

    const addEdits = {
              addFeatures: graphics
            }
    return addEdits

  }

  function applyEditsToLayerHttp(){
    //Solicatao http do user creator
  }

// Edits Feature layers
  function applyEditsToLayer(edits,item_id) {
    const featureLayer = new FeatureLayer({
      portalItem: {
        id: item_id
      },
      outFields: ["*"],
      title: "Mapa de Pedidos"
      });
      featureLayer
      .applyEdits(edits)
      /*
      .then((results) => {
        // if edits were removed
        if (results.deleteFeatureResults.length > 0){
          console.log(
            results.deleteFeatureResults.length,
            "features have been removed"
          );
          //addBtn.disabled = false;
          //removeBtn.disabled = true;
        }
        // if features were added - call queryFeatures to return
        //    newly added graphics
        if (results.addFeatureResults.length > 0){
          const objectIds = [];
          results.addFeatureResults.forEach((item) => {
            objectIds.push(item.objectId);
  
          });
          // query the newly added features from the layer
          featureLayer
            .queryFeatures({
              objectIds: objectIds
            })
            .then((results) => {
              console.log(
                results.features.length,
                "features have been added."
              );
              //addBtn.disabled = true;
              //removeBtn.disabled = false;
            })
        }
    })
    .catch((error) => {
      console.error();
    });
      */
      
  }
  export { returnProjetos, retornaListAreaCode,returnEditFeatures,applyEditsToLayer,loadLayer,loadTable,loadForms,findField,hideFields,lockFieldsTable,hideFieldsTable,findFeatLyr};