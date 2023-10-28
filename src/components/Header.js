import React, { useEffect, useRef ,useState} from "react";
import { Route, Routes, BrowserRouter ,Link ,Switch} from 'react-router-dom';

import "@esri/calcite-components/dist/calcite/calcite.css";
import "@esri/calcite-components/dist/components/calcite-navigation";
import "@esri/calcite-components/dist/components/calcite-menu";
import "@esri/calcite-components/dist/components/calcite-menu-item";
import "@esri/calcite-components/dist/components/calcite-navigation-user";
import "@esri/calcite-components/dist/components/calcite-navigation-logo";
import "@esri/calcite-components/dist/components/calcite-notice";

import "./Header.css"


function Header({userApp}) {
  console.log("header")
  console.log(userApp)
  

  

    const openSheet = () =>{
        const sheet = document.getElementById("example-sheet");
        const panel = document.getElementById("example-panel");
    
        sheet.open = true;
        panel.closed = false;
    
        panel?.addEventListener("calcitePanelClose", function() {
          sheet.open = false;
      });
      }
      return (
        <div>
          <calcite-navigation slot="header">
          <calcite-navigation-logo slot="logo" heading="Engeform Energia Renovável"
            description="GIS & Resources" thumbnail="http://www.engeform.com.br/wp-content/uploads/2021/03/logoene.png">
            </calcite-navigation-logo>
            <calcite-menu slot="content-end">
              <Link to="/pageForms">
                <calcite-menu-item text="Painel de Pedidos" icon-start="form-elements" text-enabled></calcite-menu-item>
              </Link>
              <Link to="/mapa">
                <calcite-menu-item text="Mapa de Pedidos" icon-start="map" text-enabled></calcite-menu-item>
              </Link>
            </calcite-menu>
            <calcite-navigation-user
              slot="user"
              full-name={userApp ? userApp.userType : ''}
              username={userApp ? userApp.userName : ''}
              onClick={() => openSheet()}
            ></calcite-navigation-user>
          </calcite-navigation>
        </div>
      );
    
    
    

}

export default Header;