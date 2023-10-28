import React, { useState, useEffect } from "react";
import  esriConfig  from "@arcgis/core/config.js";
import { initialize, checkCurrentStatus, signIn, signOut, fetchUser ,fetchPortal} from './data/oauth.js';
import Portal from "@arcgis/core/portal/Portal.js";
import PageForms from "./pages/formsPage.js";
import MapaPedidos from "./pages/MapsPages.js"
import Sheet from "./components/Sheet.js";
import Header from "./components/Header.js";
import Login from "./components/Login.js";
import{lockFieldsTable,loadLayer,loadTable,returnProjetos} from "./data/Consultas.js"
import { Route, Routes, BrowserRouter ,Link ,Switch} from 'react-router-dom';


import { setAssetPath } from "@esri/calcite-components/dist/components";
import Footer from "./components/Footer.js";
setAssetPath("https://cdn.jsdelivr.net/npm/@esri/calcite-components/dist/calcite/assets");



const APP_ID = "kHuc6FJazayMCHNW";
const portal = new Portal({url:"https://eerpec.maps.arcgis.com"});

function App() {
  // esriConfig.apiKey = "AAPK29b7e2a6d72e4940a8b4cc3d37fe8a5eYtRUY7j4kPPdDyWJIlMCeDfEVObtacAycPJozmfdUnk2eY42xwbWyIH-dA_GA-oC";
  esriConfig.assetsPath = './assets';

  const [user, setUser] = useState(null);
  const [portal,setPortal] = useState(null);
  const[userPromise,setUserPromise]=useState(null);

  const[userApp,setUserApp]=useState(null);
  
  
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
        const portal = await fetchPortal();
        console.log(user);
        setUser(user);
        setPortal(portal);
        
        
      }
    }

    if(!user){initializeUser();}
    
    /*
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      console.log("valor armazenado")
      console.log(storedUser);
      setUserApp(JSON.parse(storedUser));     
    }
    */
    
    
  }, []);


  return (
    <BrowserRouter>
      <Sheet></Sheet>
      <Routes>
      <Route
          path="/mapa"
          element={
            user && userApp ? (
              <>
                <Header userApp={userApp} />
                <MapaPedidos Portal={portal} userApp={userApp} />
              </>
            ) : (
              // Renderize algo caso as condições não sejam atendidas, se necessário
              null
            )
          }
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