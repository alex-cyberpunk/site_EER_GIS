import React,{ useRef,useState } from "react";
import Mapa from './components/Mapa.js'
import Table from '../sharedComponents/Table.js'

function MapaPedidos({ Portal ,userApp}) {
  console.log("Mapa")
  const mapDiv = useRef(null);
  const tableDiv = useRef(null);
  const buttonDivRef = useRef(null);
  const [table, setTable] = useState(null);

  const [view, setView] = useState(null);

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