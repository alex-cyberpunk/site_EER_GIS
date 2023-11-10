import React, { useState, useEffect } from "react";
import  esriConfig  from "@arcgis/core/config.js";
import { initialize, checkCurrentStatus, signIn, signOut, fetchUser ,fetchPortal} from './featuresArcgisJS/oauth.js';
import PageForms from "./pages/painelPedidos/formsPage.js";
import MapaPedidos from "./pages/mapaPedidos/MapsPages.js"
import Sheet from "./pages/sharedComponents/Sheet.js";
import Header from "./pages/sharedComponents/Header.js";
import Login from "./pages/login/Login.js";
import { Route, Routes, BrowserRouter ,Link ,Switch} from 'react-router-dom';
import {verificaIntersections} from './featuresArcgisJS/mapaPedidos/verifyIntersect.js' 

import axios from 'axios';
import { setAssetPath } from "@esri/calcite-components/dist/components";
import Footer from "./pages/sharedComponents/Footer.js";


//Import temporarios pra testes
import {generateFeatureCollection} from "./featuresArcgisJS/mapaPedidos/widgetUploadEdits.js"

setAssetPath("https://cdn.jsdelivr.net/npm/@esri/calcite-components/dist/calcite/assets");


//const portal = new Portal({url:"https://eerpec.maps.arcgis.com"});

function App() {

  esriConfig.assetsPath = './assets';
  const [user, setUser] = useState(null);
  const [portal,setPortal] = useState(null);
  const[userApp,setUserApp]=useState(null);
  

  /**
   * Possivel chamada de API para obter informacoes do usuario
   *axios.get('http://localhost:3002/userInfo').
   *then(userInfo => {setUserApp(userInfo)}) 
   * 
  */
   //axios.get('http://localhost:3002/userInfo').then(userInfo => {setUserApp(userInfo)})//Checa infos no react

  useEffect(() => {
    async function initializeUser() {
      const oauthInfo = initialize('kHuc6FJazayMCHNW');
      
      let credential =  await checkCurrentStatus(oauthInfo);
      if (!credential) {
        // signin
        credential = await signIn(oauthInfo);
        console.log('sign in', credential);
      }
    
      if (credential) {
        const user = await fetchUser();
        const portal = await fetchPortal();
        //console.log(user);
        setUser(user);
        setPortal(portal);
        //verificaIntersections(portal)
        
        //generateFeatureCollection('/src/featuresArcgisJS/mapaPedidos/shps/BRE - Copia.zip')
      }
    }

    if(!user){initializeUser();}
    
  }, []);


  return (
    <BrowserRouter>
      <Sheet></Sheet>
      <Routes>
      <Route
          path="/mapa"
          element={
            user  ? (
              
                <>
                <Header userApp={userApp} />
                <MapaPedidos Portal={portal} userApp={userApp} />
              </>
              
              
            ) : (
              // Renderize algo caso as condições não sejam atendidas, se necessário
              null
            )
          }
          /*
          
          element={
            user && userApp ? (
              user.userType==='Topografia'(
                <>
                <Header userApp={userApp} />
                <MapaPedidos Portal={portal} userApp={userApp} />
              </>
              )
              
            ) : (
              // Renderize algo caso as condições não sejam atendidas, se necessário
              null
            )
          }
          */
          
        />
        <Route
            path="/pageForms"
            element={
              user && userApp ? (
                <>
                  <Header userApp={userApp} />
                  <PageForms Portal={portal} userApp={userApp} setUserApp={setUserApp}/>
                  <Footer />
                </>
              ) : null
            }
          />
        <Route element={user && <Login setUserApp={setUserApp}/>} path="/"  />
      </Routes>
</BrowserRouter>



  );
}

export default App;

/*{user && <Forms Tipo='Inclusao'  Portal={portal}/>} */
/**/