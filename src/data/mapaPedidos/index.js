//Montar a Estrutura das paginas e de colunas de acordo com o user
//import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o CSS do Bootstrap (se já não o fez)
//import 'bootstrap/dist/js/bootstrap.min.js';   // Importa o JavaScript do Bootstrap

import {loadMapPedidos} from './Mapa_pedidos.js'; 
import Portal from "@arcgis/core/portal/Portal.js";
//import  '../../components/mapaPedidos.css';
import {loadLayer,returnProjetos} from "../Consultas.js" 
import { mapWidgets} from "./widgetsArcgis.js"
//import { returnProjetos } from '../pages/Consultas.js';
import {handleUserType} from '../users.js'
import {returnUsertype,returnUser} from '../login_arcgis.js'
import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView"

function loadTableDiv(tableDiv,view,portal,user){
  let Manager;

  return new Promise((resolve, reject) => {
    handleUserType(user)
      .then((appManager) => {
        Manager=appManager
        return loadLayer(null, appManager.Mapa.id_mapa_painel_aprovacao, 0);
      })
      .then((featureLayer) => {
        featureLayer.load().then(() => {
        loadMapPedidos(view,Manager.Mapa,featureLayer,tableDiv,portal).
        then((table)=>{ resolve(table);
        })
        
        }); 

      })
      .catch((error) => {
        reject(error);
        console.error("Erro ao carregar formulários e camada:", error);
      });
  });
}
function loadMapa(mapDiv,portal,userApp) {
  const map = new ArcGISMap({
    basemap: "gray-vector"
  });

  console.log("O MAPA E:")
  console.log(map)
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

  let Manager;

  return new Promise((resolve, reject) => {
    handleUserType(userApp)
      .then((appManager) => {
        Manager=appManager
        areasProjetos(portal,Manager.Mapa.user,map)
        return loadLayer(map, appManager.Mapa.id_mapa_painel_aprovacao, 0);
      })
      .then((featureLayer) => {
        featureLayer.load().then(() => {
        if (Manager.Mapa.tipoResponsavel.length > 0) {
          featureLayer.definitionExpression = `${Manager.Mapa.tipoResponsavel[0]} = '${Manager.Mapa.user}' AND ( Justificativa IS NULL OR Aprovacao = 'Aprovado')`;
        }
        //temporario
        else
        {
          featureLayer.definitionExpression = 'Justificativa IS NOT NULL' ;

        }  
        mapWidgets(view,featureLayer,Manager.Mapa)
        resolve(view);
        }); 

      })
      .catch((error) => {
        reject(error);
        console.error("Erro ao carregar formulários e camada:", error);
      });
  });
}
async function areasProjetos(portal,user,mapa){
  returnProjetos(portal,user).then(function (itemInfo) {
    Object.keys(itemInfo).forEach(function (key) {
      const id = itemInfo[key];
      loadLayer(mapa, id, 3).then((featureLayer)=>{
        featureLayer.visible=false;
      })      
    });
    
  });
}
export  {loadMapa,loadTableDiv};