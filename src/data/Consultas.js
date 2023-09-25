import PortalItem from "@arcgis/core/portal/PortalItem.js";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Graphic from "@arcgis/core/Graphic.js";

function lockFieldsTable(featureTable,lockFields,featureLayer){
  featureLayer.when(() => {

      featureTable.layer.fields.forEach((field) => {
          if (lockFields.includes(field.name)) {
            field.editable = false;
          }
        });
      });
}

function loadFeatlyr(map,itemID,layerID){
  const featureLayer = new FeatureLayer({
      portalItem: {
        id: itemID
      },
      outFields: ["*"],
      layerId: layerID,
      definitionExpression: "1=1"
    });
    if(map!={}){map.add(featureLayer, 0);}
    return featureLayer;  
}
function loadFeatbl(tableDiv,HiddenFields,featureLayer){
  const featureTable = new FeatureTable({
    view: view, 
    layer: featureLayer,
    multiSortEnabled: true, 
    editingEnabled: true,
    hiddenFields:HiddenFields,
    container: tableDiv
});
return featureTable;
}
function retornaListAreaCode(portal, geometria, nomeDoMapa, IdLayer) {
  return returnProjetos(portal).then(function (layerItems) {
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

// funcao que faz o query dos features layer baseados nas tags Projetos e GPD
function returnProjetos(portal) {
    var queryParams = new PortalQueryParams({
      query: 'tags:GPD AND Projetos'
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
  }
  export { returnProjetos, retornaListAreaCode,returnEditFeatures,applyEditsToLayer,loadFeatbl,loadFeatlyr,lockFieldsTable};