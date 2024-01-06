import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import FeatureForm from "@arcgis/core/widgets/FeatureForm.js"

/**
 * Load a feature layer in map, 
*/

class FeatureLoader {
    constructor({ map = null, tableDiv = null, formDiv = null } = {}) {
        this.map = map;
        this.tableDiv = tableDiv;
        this.formDiv = formDiv;
    }
    loadLayer(url, layerID,appManager=null) {
      return new Promise((resolve, reject) => {
        const featureLayer = new FeatureLayer({
          url: url,
          outFields: ["*"],
          layerId: layerID,
          definitionExpression: "1=1"
        });
        if(appManager){
          featureLayer.load().then(() => {
            this.deleteaAndFilterFields(featureLayer, appManager);      
            resolve(featureLayer);
            }).catch((error) => {
              reject(error);
            });  
        }
        
      });
    }
    
    loadLayerInMap(url, layerID) {
      this.loadLayer(url, layerID).
      then((featureLayer) => {
      if (this.map) {
        featureLayer.visible = false;
        this.map.add(featureLayer, 0);
      }
      });
    }  
    loadTable(featureLayer, view,appManager) {
      return new Promise((resolve, reject) => {
        this.deleteaAndFilterFields(featureLayer, appManager);
        const featureTable = new FeatureTable({
            view: view,
            layer: featureLayer,
            multiSortEnabled: true,
            editingEnabled: true,
            container: this.tableDiv,
            visibleElements: {
              header: true,
              menu: true,  
              selectionColumn: true,
              menuItems: {
                clearSelection: true,
                deleteSelection: true,
                refreshData: true,
                toggleColumns: true,
                selectedRecordsShowAllToggle: true,
                selectedRecordsShowSelectedToggle: true,
                zoomToSelection: true
              },
              columnMenus: true
            }         
          });
  
          resolve(featureTable);
        }).catch((error) => {
          reject(error);
        });
      }
  
    loadForms(featureLayer) {
      return new Promise((resolve, reject) => {
        featureLayer.load().then(() => {
          const form = new FeatureForm({
            container: this.formDiv,
            layer: featureLayer,
            title: "Atualizacao de props",
            description: "Atualizacao de props"
          });
  
          resolve(form);
        }).catch((error) => {
          reject(error);
        });
      });
    }
  }

module.exports = FeatureLoader;