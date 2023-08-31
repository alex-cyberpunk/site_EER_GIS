//import 'cross-fetch/dist/node-polyfill.js'
//import 'abort-controller/polyfill.js'
import Map from "@arcgis/core/Map.js";

import esriConfig from "@arcgis/core/config.js";
import MapView from "@arcgis/core/views/MapView.js";
import PortalItem from "@arcgis/core/portal/PortalItem.js";
// intl from "@arcgis/core/intl.js";
//import promiseUtils from "@arcgis/core/core/promiseUtils.js";


import { initialize, checkCurrentStatus, signIn, signOut, fetchUser } from './oauth.js';
import {loadPedidos} from './02-mapa_pedidos.js';
import {loadProjetos} from './01-display_projetos.js'
import  {loadShp} from './03-upload_shps.js' 

import  './style.css';

const APP_ID = import.meta.env.VITE_APP_ID;
const APIKEY= import.meta.env.APIKEY;
console.log("comecou")
loadApp()   
async function loadMap() {
  esriConfig.apiKey = APIKEY;
  const map = new Map({
      basemap: "dark-gray-vector"
  });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-42.7772, -11.4347], // Coordenadas aproximadas de Gentio do Ouro
        zoom: 11,
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
    
    view.ui.add(btnAuth, 'top-right');
  
    btnAuth.addEventListener('click', () => {
      signOut();
    });

    loadPedidos(view,map)
    loadProjetos(view,map)
    loadShp(view,map)
  }

  async function loadApp() {
    const oauthInfo = initialize(APP_ID);
    let credential = await checkCurrentStatus(oauthInfo);
  
    if (!credential) {
      // signin
      credential = await signIn(oauthInfo);
      console.log('sign in', credential);
    }
  
    if (credential) {
      loadMap();
      const user = await fetchUser();
      console.log('User', user);
      btnAuth.innerText = `Log Out ${user.username}`;
    }
  }
  
