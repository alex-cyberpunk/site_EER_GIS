import React,{ useRef,useEffect,useState } from "react";
import { loadMapa,loadTableDiv} from "../data/mapaPedidos/index.js";
import {mapWidgets} from "../data/mapaPedidos/widgetsArcgis.js"
import { toggleFeatureTable} from "../data/mapaPedidos/Mapa_pedidos.js";
import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView"
import  esriConfig  from "@arcgis/core/config.js";
import{lockFieldsTable,loadLayer,loadTable,returnProjetos} from "../data/Consultas.js"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Widget from "@arcgis/core/widgets/Widget.js";
import ReactDOM from 'react-dom/client';
import CustomToggleButton from './customWidget.js';

import { createRoot } from 'react-dom/client';

import './mapaPedidos.css'
function Mapa({ Portal ,view, setView,userApp}) {
  const mapDiv = useRef(null);
  const boxDivRef = useRef(null);
  const [lyrLoaded, setLyrLoaded] = useState(false);
  
  useEffect(() => {
    if (mapDiv.current && !view) {
      
            console.log(userApp)
            // Atualize o estado com o valor da promessa quando ela for resolvida
            loadMapa(mapDiv.current, Portal,userApp)
            .then((view) => {
              setLyrLoaded(true);
              setView(view);

                    });
          
    
    }
  
}, [mapDiv, view, lyrLoaded,userApp]);


  return (
    <div>
      <div id="Alert"></div>
      <div className="mapDiv" ref={mapDiv} ></div>      
      <div id="instructions" class="esri-widget">
    <b>Instruções para aprovar uma área</b><br />
    1. Selecione o item da tabela e dê um zoom nele clicando no canto superior direito da tabela.<br />
    2. Dê zoom no item.<br />
    3. Clique no ícone de lápis. Isso expandirá uma caixa de edição. Clique em "Selecionar."<br />
    4. No modo edição, clique no polígono desejado e modifique como desejar.<br />
    5. Um clique move o polígono, dois cliques permitem mover os pontos.<br />
    6. Clique em "atualizar" e aguarde a mensagem.<br />
    7. Caso a área seja recusada, aparecerão as áreas que intersectam. Caso seja aprovada, será emitido um novo "area_code." e a area sera inserida na base<br />
</div>

    </div>  
  );
  }

export default Mapa;


/**/