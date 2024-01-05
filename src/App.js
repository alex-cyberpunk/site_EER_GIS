import React, { useState, useEffect } from "react";
import  esriConfig  from "@arcgis/core/config.js";
import PageForms from "./pages/painelPedidos/formsPage.js";
import MapaPedidos from "./pages/mapaPedidos/MapsPages.js"
import Sheet from "./pages/sharedComponents/Sheet.js";
import Header from "./pages/sharedComponents/Header.js";
import AuthComponent from "./pages/singUp/Auth.js";
import AuthVerify from "./pages/singUp/AuthVerify.js";
import AppManager from "./pages/singUp/AppManager.js";
import PageLeaders from "./pages/tableLeaders/LeadersPage.js";
import Loader from "./pages/sharedComponents/Loader.js";
import ErrorBoundary from "./ErrorBoundary.js";

import { Route, Routes, BrowserRouter ,Link ,Switch} from 'react-router-dom';


import { setAssetPath } from "@esri/calcite-components/dist/components";
import Footer from "./pages/sharedComponents/Footer.js";
import logout from "./pages/singUp/action.js";

setAssetPath("https://cdn.jsdelivr.net/npm/@esri/calcite-components/dist/calcite/assets");
//const portal = new Portal({url:"https://eerpec.maps.arcgis.com"});

function App() {
  const [loading, setLoading] = useState(false);

  esriConfig.assetsPath = './assets';
  const [user, setUser] = useState(null);
  const [portal,setPortal] = useState(null);
  const[userApp,setUserApp]=useState(null);
  const[appManager,setAppManager]=useState(null);
  const [Token ,setTokenJWT]=useState(null);
  const [TokenGIS ,setTokenGIS]=useState(null);
  const [isUrlsProcessed, setIsUrlsProcessed] = useState(false);
  useEffect(() => {
    console.log('AppManager useEffect',isUrlsProcessed);
  }, [isUrlsProcessed, userApp]);
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <Sheet></Sheet>
      <AuthVerify/>
      <AppManager setUserApp={setUserApp} 
                  setAppManager={setAppManager} 
                  setTokenJWT={setTokenJWT} 
                  Token={Token}
                  setTokenGIS={setTokenGIS} 
                  appManager={appManager} 
                  userApp={userApp}
                  setIsUrlsProcessed={setIsUrlsProcessed}
                  isUrlsProcessed={isUrlsProcessed}
                  setUser={setUser}
                  user={user}
                  />
      <Routes>
      <Route path="/*" element={<AuthComponent
                                  Token={Token}   
                                  setUserApp={setUserApp} 
                                  setTokenJWT={setTokenJWT} 
                                  setAppManager={setAppManager}/>} />
      <Route
          path="/mapa"
          element={
            
            isUrlsProcessed && userApp ? (
                  <>
                    <Header userApp={userApp} />
                    <MapaPedidos 
                        Portal={portal} 
                        userApp={userApp}
                        appManager={appManager}
                        setLoading={setLoading}
                        loading={loading} 
                      />
                    
                  </>
              ) : null 
          }
          
        />
        <Route path="/consultas" 
              element={
                <>
                <Header userApp={userApp} />
                <PageLeaders  appManager={appManager} />
                </>
                
              } /> 
        <Route
            path="/pageForms"
            element={
              isUrlsProcessed && userApp ? (
                userApp.userType === 'Comercial Fundiario' || userApp.userType === 'Topografia' ? (
                <>
                  <Header userApp={userApp} />
                  <PageForms  Portal={portal} 
                              userApp={userApp} 
                              setUserApp={setUserApp}
                              appManager={appManager}/>
                  <Footer />
                </>
                 ) : null
              ) : null
            }
          />
        </Routes>
  </BrowserRouter>
  </ErrorBoundary>
  );
}

export default App;

/*<Route path="/pageLeaders" 
              element={
                <>
                <Header userApp={userApp} />
                <PageLeaders appManager={appManager} />
                </>
                
              } /> */