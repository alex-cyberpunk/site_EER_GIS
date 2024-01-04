import{lockFieldsTable,loadFeatlyr,loadFeatbl} from "../src/data/Consultas.js"
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Editor from "@arcgis/core/widgets/Editor.js";

import {printIntersection} from '../src/data/mapaPedidos/verify_intersect.js'

import Portal from "@arcgis/core/portal/Portal.js";

const portal = new Portal("https://eerpec.maps.arcgis.com");

function toggleFeatureTable(tableVisible) {
     
    if (!tableVisible) {
        labelText.innerHTML = "Show feature Table";
        mapDiv.style.bottom = "0%";
        mapDiv.style.height = "100%"; 
  
    } else {
        labelText.innerHTML = "Hide feature Table";       
        mapDiv.style.bottom = "50%";
        mapDiv.style.height = "50%";
    }
  }
  
function initializeSketch(view,layer,mapaPedidos,portal) {
    const editor = new Editor({
    view: view
    //editableItems
    });

    // Add the widget to the view
    view.ui.add(editor, "top-left");
    if(mapaPedidos.printIntersect){
    setOutputMessagesVisible(true);
    mapDiv.appendChild(outputMessagesDiv);
    printIntersection(layer,portal,outputMessagesDiv)
    }
    

}

function loadResponsavel(featureLayer,selected){
    if (mapaPedidos.tipoResponsavel.length > 0) {
        const tipoResponsavel = mapaPedidos.tipoResponsavel[0];
        featureLayer.definitionExpression = `${tipoResponsavel} = ${selected}`; // Verifique se o valor de tipoResponsavel é válido.
      }
} 

function loadMapPedidos(view,map,mapaPedidos,selected) {
//view.ui.add(new Legend({ view: view }), "bottom-left");//adiciona legenda
                    
view.when(() => {

loadFeatlyr(map,mapaPedidos.itemId,0).
    then(featureLayer=>{
      featureLayer.load().then(() => {
        if(mapaPedidos.tipoResponsavel.length>0){
            featureLayer.definitionExpression = "1=0"
        }
        initializeSketch(view,featureLayer,mapaPedidos,portal);
        loadFeatbl(tableDiv,HiddenFields,featureLayer).
        then(featureTable=>{
            lockFieldsTable(featureTable,mapaPedidos.hiddenFields,featureLayer)
            mainDiv.style.display = "block";//adiciona o item de slide a pagina
            //view.ui.add(document.getElementById("mainDiv"), "top-left");
            let selectedFeature,featureLayer,id;
            // Watch for the popup's visible property. Once it is true, clear the current table selection and select the corresponding table row from the popup
            reactiveUtils.watch(
            () => view.popup.viewModel?.active,
            () => {
                selectedFeature = view.popup.selectedFeature;
                if (selectedFeature !== null && view.popup.visible !== false) {
                featureTable.highlightIds.removeAll();
                featureTable.highlightIds.add(view.popup.selectedFeature.attributes.OBJECTID);
                id = selectedFeature.getObjectId();
                }
            }
            );
        });
      });
  }); 
    
});

}


export { loadMapPedidos ,toggleFeatureTable};

