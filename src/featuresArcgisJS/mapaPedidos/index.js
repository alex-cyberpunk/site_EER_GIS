import Portal from "@arcgis/core/portal/Portal.js";
import {loadLayer,deleteFields} from "../Consultas.js" 
import { mapWidgets} from "./widgetsArcgis.js"
import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";


function loadMapa(mapDiv,portal,userApp,appManager,isChecked) {
  const map = new ArcGISMap({
    basemap: "gray-vector"
  });

  const view = new MapView({
    map:map,
    container: mapDiv,
    center: [-55.9671, -15.7939], // Coordenadas aproximadas do centro do Brasil
    zoom: 4,
    //layers: [graphicsLayer],
    popup: {
      defaultPopupTemplateEnabled: true,
      dockEnabled: true,
      dockOptions: {
        buttonEnabled: false,
        breakpoint: false
      }
    }
  });
    
    Object.values(appManager.Projetos).forEach(function (projeto) {
      loadLayer(map, projeto.url, projeto.Areas.layerId)
    });
  
  //areasProjetos(map,appManager.Projetos)
  return new Promise((resolve, reject) => {
      loadLayer(map, appManager.mapaPedidos.url, 0).
      then((featureLayer) => {
        
        featureLayer.load().then(() => {
          if(appManager.mapaPedidos.hasOwnProperty('whereClause')) {

            let replacedQuery = appManager.mapaPedidos.whereClause.replace(/{/g, "'");
            replacedQuery = replacedQuery.replace(/}/g, "'");
            replacedQuery = replacedQuery.replace(/user/g, userApp.userName);
            replacedQuery = replacedQuery.replace(/"/g, "'");
            featureLayer.definitionExpression =replacedQuery;
          }
          if(appManager.mapaPedidos.hasOwnProperty('fields'))  deleteFields(featureLayer, appManager.mapaPedidos.fields);
          mapWidgets(view,featureLayer,appManager,isChecked,userApp)
        resolve(view);
        }); 

      })
      .catch((error) => {
        reject(error);
        console.error("Erro ao carregar formulários e camada:", error);
      });
  });
}

export  {loadMapa};