import { initialize, checkCurrentStatus, signIn, signOut, fetchUser } from './oauth.js';
import esriConfig from "@arcgis/core/config.js";
import Portal from "@arcgis/core/portal/Portal.js";

const APP_ID = "kHuc6FJazayMCHNW";
const APIKEY = process.env.APIKEY;


async function returnUsertype(user){
  switch (user) { 
    case 'Bruno':
      return 'Topografia'
    
    case 'Comercial Fund - Bruno':
      return 'Comercial Fundiario'
  }
   
}
async function returnUser(){
  return 'Bruno'
}



export {returnUser,returnUsertype};
