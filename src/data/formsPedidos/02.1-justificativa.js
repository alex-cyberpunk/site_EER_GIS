import FeatureForm from "@arcgis/core/widgets/FeatureForm.js"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import FormTemplate from "@arcgis/core/form/FormTemplate.js"
import Portal from "@arcgis/core/portal/Portal.js";
import  {returnProjetos,retornaListAreaCode,returnEditFeatures} from '../Consultas.js' 

const item_id="72de0af856774ccc8264745e3c0188b4"

function callJustifyForms(graphics){
      const portal = new Portal("https://eerpec.maps.arcgis.com");
      let highlight, editFeature;
  
      //docSelect = new dijit.form.ComboBox({id: "docSelect",  name: "docSelect",value: "Pick a Document",  store: store1,}, "docSelect");
      //console.log(ProjectFieldElement)
  
      const Forms={ // Autocasts to new FormTemplate
        title: "Atualizacao de bases",
        description: "Adicione uma justificativa ao pedido",
        elements: [
          {
            // Autocasts to new GroupElement
            type: "group",
            label: "Justificativa",
            description: "Adicione uma justificativa ao pedido",
            elements: [ 
            {
                type: "field",
                fieldName: "Justificativa",
                label: "Justificativa"
            }
            ]
          }
  
        ],
        expressionInfos: [
          {
            name: "alwaysHidden",
            expression: "1 == 0"
          }
        ]
      } // end of form template elements
  
      const featureLayer = new FeatureLayer({
              portalItem: {
                id: item_id
              },
              outFields: ["*"]
            });
        featureLayer.load().then(() => {
          // Add a new feature form with grouped fields
          const form = new FeatureForm({
            container: "form",
            //groupDisplay: "sequential", // only display one group at a time
            layer: featureLayer,
            formTemplate: Forms
          });
        });
        document.getElementById("btnUpdate").onclick = () => {
            // Fires feature form's submit event.
            form.submit();
          };
        
          form.on("submit", () => {
            const Justificativa = form.getValues().Justificativa;
            graphics.Justificativa=Justificativa
            const addEdits = {
                addFeatures: graphics
              }
              applyEditsToLayer(addEdits)
            });
}

function verifyAprovacao(graphics){
    //Verifica Pre-Aprovacao do poligono
    const convertedPolygon = geometryEngine.project(graphics, {
        wkid: 102100, // EPSG:3857 (Web Mercator)
      });
      
      
      const featureData1=retornaListAreaCode(portal, true, update.Projeto,1);
      const featureData2=retornaListAreaCode(portal, true, update.Projeto,2);
  
      Promise.all([
        findIntersect(convertedPolygon, featureData1),
        findIntersect(convertedPolygon, featureData2)
      ])
        .then(([result1, result2]) => {
          // Verifique se ambos os resultados têm comprimento zero
          if (result1.length === 0 && result2.length === 0) {
            // Ambas as chamadas não encontraram interseções, então chame sua função
            // ou realize alguma ação aqui
            return false;
          } 
          else{
            return true;
            // apply the edits to the layer
          }
        }); 
}


export { verifyAprovacao, callJustifyForms};