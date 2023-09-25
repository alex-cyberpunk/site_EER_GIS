import React, { useState, useEffect } from "react";
import Login from './components/Login.js';
//import { loadApp } from "./data/login_arcgis.js";
import  esriConfig  from "@arcgis/core/config.js";
import { initialize, checkCurrentStatus, signIn, signOut, fetchUser } from './data/oauth.js';
import Portal from "@arcgis/core/portal/Portal.js";

import Header from "./components/Header.js"

const APP_ID = "kHuc6FJazayMCHNW";
const portal = new Portal({url:"https://eerpec.maps.arcgis.com"});

function App() {
  // esriConfig.apiKey = "AAPK29b7e2a6d72e4940a8b4cc3d37fe8a5eYtRUY7j4kPPdDyWJIlMCeDfEVObtacAycPJozmfdUnk2eY42xwbWyIH-dA_GA-oC";
  esriConfig.assetsPath = './assets';

  const [user, setUser] = useState(null);
  const[featlyr,setfeatlyr]=useState(null);

  useEffect(() => {
    async function initializeUser() {
      const oauthInfo = initialize(APP_ID);
      let credential =  await checkCurrentStatus(oauthInfo);
      if (!credential) {
        // signin
        credential = await signIn(oauthInfo);
        console.log('sign in', credential);
      }
    
      if (credential) {
        const user = await fetchUser();
        setUser(user);
      }
    }

    initializeUser();
  }, []);

  return (
    <div className="App">
     {user && <Header/>}
    </div>
  );
}

export default App;

/*{user && <MapaPedidos featureLayer={featlyr}/>}*/