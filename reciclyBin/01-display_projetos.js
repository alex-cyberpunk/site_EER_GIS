import esriConfig from "@arcgis/core/config.js";
import WebMap from "@arcgis/core/WebMap.js";
import MapView from "@arcgis/core/views/MapView.js";
import Layer from "@arcgis/core/layers/Layer.js";
import PortalItem from "@arcgis/core/portal/PortalItem.js";
import * as intl from "@arcgis/core/intl.js";
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";
import Portal from "@arcgis/core/portal/Portal.js";
import Expand from "@arcgis/core/widgets/Expand.js";

import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";



import  {returnProjetos} from '../src/data/Consultas.js' 

function timeSlider(view){
  const currentYear = new Date().getFullYear();
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 7)// adiciona uma semana pra ter o mesmo passo
        
        // time slider widget initialization
        const timeSlider = new TimeSlider({
          container: "timeSlider",
          view: view,
          timeVisible: true, // show the time stamps on the timeslider
          loop: true,
            fullTimeExtent: {
              start: new Date(currentYear, 0, 1),
              end: currentDate
            },
            playRate: 2000,
            stops: {
              interval: {
                value: 1,
                unit: "weeks"
              }
            }
        });
}

async function loadProjetos(view,map,id_projeto,LayerID){
      view.when(() => {
      const portal = new Portal("https://eerpec.maps.arcgis.com");
      //returnProjetos(portal)
      returnProjetos(portal,true).then(function (itemInfo) {
        var layerItems = Object.values(itemInfo); 
      //portal.authMode = "anonymous";
      const portalItems = layerItems.map((itemid) => {
        featureLayer = new FeatureLayer({
          portalItem: {
            id: itemId
          },
          outFields: ["*"],
          layerId:LayerID,
          definitionExpression: "1=1"
        }); 
      featureLayer.load().then(() => {
                map.add(layer);
                
                view.extent = item.extent;
              });
          });
        });
      });
 
        
        
        
}
    
export { loadProjetos };