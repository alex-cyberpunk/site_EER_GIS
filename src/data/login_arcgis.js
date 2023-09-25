import { initialize, checkCurrentStatus, signIn, signOut, fetchUser } from './oauth.js';
import esriConfig from "@arcgis/core/config.js";
import Portal from "@arcgis/core/portal/Portal.js";

const APP_ID = "kHuc6FJazayMCHNW";
const APIKEY = process.env.APIKEY;


async function returnUsertype(){
  const userType='Comercial Fundiario'
  return userType
}

async function loadApp() {
  

  if (!credential) {
    // signin
    credential = await signIn(oauthInfo);
    console.log('sign in', credential);
  }

  if (credential) {
    //const portal = new Portal("https://eerpec.maps.arcgis.com");
    const user = await fetchUser();
    console.log(user)
    console.log(credential)
    return credential;
  }
}


export {loadApp,returnUsertype};
