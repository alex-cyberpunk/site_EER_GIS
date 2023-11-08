import React,{ useRef,useEffect,useState } from "react";
import { loadTableDiv} from "../../featuresArcgisJS/mapaPedidos/index.js";
import './Table.css'


function Table({ Portal, view ,table, setTable,userApp}) {
  const tableDiv = useRef(null);
  const [isTableVisible, setTableVisibility] = useState(true);
  useEffect(() => {
    if (tableDiv.current) {
          if (table === null) {         
            loadTableDiv(tableDiv.current, view, Portal,userApp).then((loadedTable) => {
              setTable(loadedTable);
              console.log("table")
              console.log(Portal);
            });
          };
          
      
      
    }
  }, [tableDiv, view, Portal,userApp]);

  return (
    <div>
      <div className="tableDiv" ref={tableDiv}></div>
    </div>
  );
}

export default Table;

