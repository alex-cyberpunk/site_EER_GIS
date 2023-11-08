import React,{ useRef,useEffect } from "react";
import { loadMapa} from "../../data/mapaPedidos/index.js";
import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Home from "@arcgis/core/widgets/Home";
import  esriConfig  from "@arcgis/core/config.js";

import './mapaPedidos.css'
function MapaPedidos({featureLayer}) {
  const mapDiv = useRef(null);
  const tableDiv = useRef(null);
  const checkboxRef = useRef(null);
  const labelTextRef = useRef(null);
  
  const [tableVisible, setTableVisible] = useState(true);
  const [outputMessagesVisible, setOutputMessagesVisible] = useState(false);

  esriConfig.assetsPath = './assets'; 
  esriConfig.apiKey = "AAPK717961b8dc434cd0b93be5efbd67159bOFfnxYJaL_eJv_dRaq6zu5KbYzNPuxQZ_KOKyfe8aB6GNFQ5-7i8lJg44tKpXH0E";

  // Required: Set this property to insure assets resolve correctly.
  useEffect(() => {
      //const viewDiv = useRef(null);
      
      if(mapDiv.current){
        const map = new ArcGISMap({
          basemap: "gray-vector"
        });
        const home = new Home();

        console.log("O MAPA E:")
        console.log(map)
        const view = new MapView({
          map,
          container: mapDiv.current,
          center: [-42.7772, -11.4347], // Coordenadas aproximadas de Gentio do Ouro
          zoom: 11,
          popup: {
            defaultPopupTemplateEnabled: true,
            dockEnabled: true,
            dockOptions: {
              buttonEnabled: false,
              breakpoint: false
            }
        }
        });
        
         

      loadMapa(view,map,featureLayer)

      }
      
    
  }, []);
  const toggleFeatureTable = () => {
    setTableVisible(!tableVisible);
  };
  const handleCheckboxChange = () => {
    toggleFeatureTable();
  };

  return (
    <div>

      <div className="mapDiv" ref={mapDiv}></div>
      {tableVisible && <div className="tableDiv" ref={tableDiv}></div>}
      {outputMessagesVisible && <div className="tableDiv" ref={outputMessagesDiv}></div>}
      <div
        id="mainDiv"
        className="esri-widget"
        style={{ display: "none" }}
        title="Mostra/esconde tabela"
      >
        <label className="switch">
          <input
            id="checkboxId"
            type="checkbox"
            ref={checkboxRef}
            defaultChecked={true}
            onChange={handleCheckboxChange}
          />
          <span className="slider round"></span>
        </label>
        <label className="labelText" ref={labelTextRef} id="labelText">
          Hide feature table
        </label>
      </div>
    </div>  
  );
}

export default MapaPedidos;
/*
<div>
      <div className="mapDiv" ref={mapDiv}></div>;
      <div id="tableContainer" className="container">
        <div id="tableDiv"></div>
      </div>

      <div id="mainDiv" className="esri-widget" style={{ display: "none" }} title="Mostra/esconde tabela">
        <label className="switch">
          <input id="checkboxId" type="checkbox" checked={true} />
          <span className="slider round"></span>
        </label>
        <label className="labelText" id="labelText">Hide feature table</label>
      </div>
    </div>
*/