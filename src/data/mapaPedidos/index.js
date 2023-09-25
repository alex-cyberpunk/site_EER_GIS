//Montar a Estrutura das paginas e de colunas de acordo com o user
//import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o CSS do Bootstrap (se já não o fez)
//import 'bootstrap/dist/js/bootstrap.min.js';   // Importa o JavaScript do Bootstrap

import {loadMapPedidos} from './02-mapa_pedidos.js'; 
import Portal from "@arcgis/core/portal/Portal.js";
import  '../../components/mapaPedidos.css';

//import { returnProjetos } from '../pages/Consultas.js';
import {handleUserType} from '../users.js'
import {returnUsertype} from '../login_arcgis.js'


function loadMapa(view,map,featureLayer){
  //Cada user tem o seu map/view    
  returnUsertype().then(userType=>{
    handleUserType(userType).then(appManager=>{
      loadMapPedidos(view,map,appManager.Mapa,"Bruno",featureLayer)
    });
  });
}

export  {loadMapa};
  
 

