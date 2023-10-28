import{lockFieldsTable,loadLayer,loadTable,view,findFeatLyr,retornaListAreaCode,returnProjetos,findField,hideFieldsTable} from "../Consultas.js"
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import {printIntersection} from './verify_intersect.js'
import Portal from "@arcgis/core/portal/Portal.js";
import Feature from "@arcgis/core/widgets/Feature.js";
import {findIntersect} from "./verify_intersect.js"

/*
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

*/

/*
function loadResponsavel(featureLayer,selected){
    if (mapaPedidos.tipoResponsavel.length > 0) {
        const tipoResponsavel = mapaPedidos.tipoResponsavel[0];
        featureLayer.definitionExpression = `${tipoResponsavel} = ${selected}`; // Verifique se o valor de tipoResponsavel é válido.
      }
} 

*/
function projetoBox(feature,projeto,map){
    console.log(projeto)
    const Graphic = {
      popupTemplate: {
        content: projeto
      }
    };
    findFeatLyr(map,projeto).
    then((featLyr)=>{
      featLyr.visibile=true
    });
    feature.graphic=Graphic;
      
}

/*
function displayIntersection(portal, selectedFeature) {
  return new Promise((resolve, reject) => {
    let geometryFeature = selectedFeature.geometry;
    let nomeProjeto = selectedFeature.attributes.Projeto;
    console.log(nomeProjeto)
    console.log(geometryFeature)
    retornaListAreaCode(portal, true, nomeProjeto, 3)
      .then((props) => {
        const results = findIntersect(geometryFeature, props, 'area_code');
        console.log(props)
        console.log(geometryFeature)
        console.log(results)
        console.log("avaliando resultados")
        if (results.length > 0) {
          resolve(true); // Indica que ocorreu interseção
        } else {
          resolve(false)
        }
      })
      .catch((error) => {
        reject(error); // Se ocorrer um erro durante o processamento
      });
  });
} 
function drawWarningShape(selectedFeature,portal){
  let validSymbol,invalidSymbol
  console.log("props select Fetaure")
  console.log(selectedFeature)

  let symbol=selectedFeature.layer.renderer.symbol
  if(symbol){
    console.log(symbol.color)  
  }
  
  console.log(selectedFeature.attributes)
  function createSymbol(color, style, width, outlineColor) {
    return {
      type: "simple-fill",
      style: style,
      color: color,
      outline: {
        color: outlineColor,
        width: width
      }
    };
  }
  invalidSymbol = createSymbol([255, 0, 0], "diagonal-cross", 4, [255, 0, 0]);
  validSymbol = createSymbol([0, 170, 255, 0.8], "solid", 2, [255, 255, 255]);
  displayIntersection(portal, selectedFeature)
  .then((insterect)=>{
    if(insterect){
      console.log("simbolo antes")
      console.log(selectedFeature.symbol)
      selectedFeature.layer.renderer.symbol=invalidSymbol
    }
    else{selectedFeature.layer.renderer.symbol=validSymbol} 
  })
  
  

}


*/
function loadMapPedidos(view, mapaPedidos, featureLayer, tableDiv, portal) {
  return new Promise(async (resolve) => {
    view.when(() => {
      const graphic = {
        popupTemplate: {
          content: "Projeto"
        }
      };
  
      // Provide graphic to a new instance of a Feature widget
      const feature = new Feature({
        graphic: graphic,
        map: view.map,
        spatialReference: view.spatialReference
      });
  
      view.ui.add(feature, "top-right");
      featureLayer.load().then(() => {
        loadTable(tableDiv, featureLayer, view).then((featureTable) => {
          hideFieldsTable(featureTable, mapaPedidos.visibleFields);
          lockFieldsTable(featureTable, mapaPedidos.lockFields, false);
          /*
          returnProjetos(portal, mapaPedidos.user).then(function (itemInfo) {
            var layerItems = Object.keys(itemInfo);
            const arrayDeProjetos = layerItems.map((item) => ({ name: item, code: item }));

            findField(featureTable, 'Projeto').then((field) => {
              field.domain.codedValues = arrayDeProjetos;
            });

          });
          
          */  
          
          let selectedFeature, id;
          reactiveUtils.watch(
            () => view.popup.viewModel?.active,
            () => {
              selectedFeature = view.popup.selectedFeature;
              if (selectedFeature !== null && view.popup.visible !== false) {
                featureTable.highlightIds.removeAll();
                featureTable.highlightIds.add(view.popup.selectedFeature.attributes.OBJECTID);
                id = selectedFeature.getObjectId();
                projetoBox(feature,view.popup.selectedFeature.attributes.Projeto,view.map)
                //drawWarningShape(selectedFeature,portal)
              }
            }
          );

          // Resolva a promessa com a featureTable
          resolve(featureTable);
        });
      });
    });
  });
}



export { loadMapPedidos};

