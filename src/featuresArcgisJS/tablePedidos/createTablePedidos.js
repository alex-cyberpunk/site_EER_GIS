import{lockFieldsTable,loadLayer,loadTable,view,findFeatLyr,hideFieldsTable} from "../Consultas.js"
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";


function projetoBox(view,projeto,map){
  //Encontra o componente que contem o grafico  
  const featureInUI = view.ui._components.find(component => component.widget && component.widget.graphic !== undefined)
    
  const Graphic = {
      popupTemplate: {
        content: projeto
      }
    };
    
    findFeatLyr(map,projeto).
    then((featLyr)=>{
      featLyr.visibile=true
    });
    featureInUI.widget.graphic=Graphic;
      
}

function loadTablePedidos(view, tableDefinition, featureLayer, tableDiv,userApp,appManager,justTable=false) {
  return new Promise(async (resolve) => {
    
    featureLayer.load().then(() => {
      loadTable(tableDiv, featureLayer, view).then((featureTable) => {
        
        hideFieldsTable(featureTable, tableDefinition.visibleFields);
        lockFieldsTable(featureTable, tableDefinition.lockFields, false);
        console.log(justTable);
        if(justTable) resolve(featureTable);
    
        if(view){
      
        view.when(() => {
            
        let selectedFeature, id;
        reactiveUtils.watch(
          () => view.popup.viewModel?.active,
          () => {
            selectedFeature = view.popup.selectedFeature;
            if (selectedFeature !== null && view.popup.visible !== false) {
              featureTable.highlightIds.removeAll();
              featureTable.highlightIds.add(view.popup.selectedFeature.attributes.OBJECTID);
              id = selectedFeature.getObjectId();
              if (view.popup.selectedFeature.attributes.hasOwnProperty('Projeto')){
                projetoBox(view,view.popup.selectedFeature.attributes.Projeto,view.map);
              } 
              
            }
          }
        );    
        resolve(featureTable);
        
      });
      }
    
        });
      });
  });
}



export { loadTablePedidos};

/*

              //drawWarningShape(selectedFeature,portal)*/