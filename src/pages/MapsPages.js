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
import CustomToggleButton from '../components/customWidget.js';
import Footer from "../components/Footer.js";

import { createRoot } from 'react-dom/client';


import Mapa from '../components/Mapa.js'
import Table from '../components/Table.js'

function MapaPedidos({ Portal ,userApp}) {
  console.log("Mapa")
  const mapDiv = useRef(null);
  const tableDiv = useRef(null);
  const buttonDivRef = useRef(null);
  const [table, setTable] = useState(null);

  const [view, setView] = useState(null);
  const [lyrLoaded, setLyrLoaded] = useState(null);
  const [isTableVisible, setTableVisibility] = useState(true);
  const [userAppData, setUserAppData] = useState(null);

      

  return (
    <div>
        <Mapa Portal={Portal} view={view} setView={setView} userApp={userApp} />
          {view && (
            <Table Portal={Portal} view={view} table={table} setTable={setTable} userApp={userApp}/>
          )}
    </div>
  );
  }

export default MapaPedidos;