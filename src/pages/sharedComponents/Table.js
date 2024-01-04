import React,{ useRef,useEffect,useState } from "react";
import { loadTableDiv} from "../../featuresArcgisJS/tablePedidos/index.js";
import './Table.modules.css'


function Table({ view ,userApp,table,setTable,tableLoad,appManager,justTable=false,setTableReference=null}) {
  let tableDiv = useRef(null);
  
  useEffect(() => {
    if (tableDiv.current) {
          if (table === null) {
            tableDiv.current.innerHTML = "";          
            loadTableDiv(tableDiv.current, view, userApp,tableLoad,appManager,justTable).
            then((loadedTable) => {
              if(setTableReference) setTableReference(loadedTable);
              else setTable(loadedTable);
            });
          };
    }
  }, [tableDiv, view,userApp,table,justTable]);

  return (
    <div>
      <div className="tableDiv" ref={tableDiv}></div>
    </div>
  );
}

export default Table;

