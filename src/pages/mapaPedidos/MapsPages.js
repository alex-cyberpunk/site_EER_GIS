import React,{ useRef,useState ,useEffect} from "react";
import Mapa from './components/Mapa.js'
import Table from '../sharedComponents/Table.js'
import ButtonTable from '../sharedComponents/ButtonTable.js'
import { use } from "chai";

function MapaPedidos({ Portal ,userApp,appManager,setLoading,loading}) {
  console.log("Mapa")
  const mapDiv = useRef(null);
  const tableDiv = useRef(null);
  const buttonDivRef = useRef(null);
  const [table, setTable] = useState(null);
  const [tableLoad, setTableLoad] = useState(appManager.tablePedidos);

  const [view, setView] = useState(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--table-div-top', '35rem'); // replace 'new value' with the value you want
    document.documentElement.style.setProperty('--table-div-left', '5%');
  }, [table]);
    
  return (
    <div>
    <Mapa mapDiv={mapDiv} 
          view={view} 
          setView={setView} 
          userApp={userApp} 
          appManager={appManager}
          setLoading={setLoading}/>
        {view && (
        <div className="container">
         <Table className="tableDiv" view={view}  userApp={userApp} table={table} setTable={setTable} tableLoad={tableLoad} appManager={appManager}/> 
         {tableLoad && (<ButtonTable className="buttonDiv" 
                    view={view} 
                    tableDiv={tableDiv}
                    buttonDivRef={buttonDivRef} 
                    userApp={userApp} 
                    table={table} 
                    setTable={setTable} 
                    tableLoad={tableLoad} 
                    setTableLoad={setTableLoad} 
                    appManager={appManager}/>)}
        </div>
    )}
    </div>
  );
  }

export default MapaPedidos;


/**/