import {loadTablePedidos} from './createTablePedidos.js'; 
import Portal from "@arcgis/core/portal/Portal.js";
import {deleteFields, loadLayer} from "../Consultas.js" 


function loadTableDiv(tableDiv,view,userApp,table,appManager,justTable=false){

  return new Promise((resolve, reject) => {
      loadLayer(null, table.url, table.layerId)
      .then((featureLayer) => {
        featureLayer.load().then(() => {
          if(table.hasOwnProperty('whereClause')) {
            let replacedQuery = table.whereClause.replace(/{/g, "'");
            replacedQuery = replacedQuery.replace(/}/g, "'");
            replacedQuery = replacedQuery.replace(/user/g, userApp.userName);
            replacedQuery = replacedQuery.replace(/"/g, "'");

            featureLayer.definitionExpression =replacedQuery;
          }
          if(table.hasOwnProperty('fields'))  deleteFields(featureLayer, table.fields);
          loadTablePedidos(view,table,featureLayer,tableDiv,userApp,appManager,justTable).
        then((table)=>{
          console.log("table loaded"); 
          resolve(table);
        })
        
        }); 

      })
      .catch((error) => {
        reject(error);
        console.error("Erro ao carregar formulários e camada:", error);
      });
  });
}
export  {loadTableDiv};