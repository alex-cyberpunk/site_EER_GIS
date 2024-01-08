
//Funcoes para refatorar
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import  {queryFeature} from './Consultas.js'
import { callAlert } from "../pages/sharedComponents/SucessMessage.js"
import Intersection from "../libs/Intersection.js";
import LayerEditor from "../libs/updateData.js";

function printIntersection(editor,layer,appManager){
  
  //Condition to allow intersection verification
  let allowEdits = false;

  editor.viewModel.watch("state", function (state) {
    
    if (state === 'awaiting-feature-to-update') {
      allowEdits = true;
    } else {
      allowEdits = false;
    }
  });

  layer.on("edits", function(event) {
    if (allowEdits) {
      handleEdits(event);
      allowEdits = false; // Reset the flag after handling the edits
    }
  });
  
  
  //displayMessage('Aguardando a analise de interseccao com outras propriedades...',feature);
  const intersectClass = new Intersection();
  const layerEditorClass = new LayerEditor(appManager.Projetos[nomeProjeto].url,3,this.userApp.userId,false,false,this.axios);
  
  async function handleEdits (event) {
    let editfeature = null;
    if (event.updatedFeatures.length > 0) {
        const objectIds = [];
        event.updatedFeatures.forEach((item) => {               
          objectIds.push(item.objectId);
        });
        queryFeature(layer, "1=1", objectIds, ["*"])
        .then(async(results) => {
          const geometryFeature = results.features[0].geometry; 
          const nomeProjeto=results.features[0].attributes.Projeto;
          editfeature=results.features[0];
          const intersections=await intersectClass.verifyIntersectProjects([geometryFeature],appManager.Projetos[nomeProjeto],[3],'area_code');
          
          if(intersections.length>0) callAlert(`Intersecta a(s) propriedade(s) de ${nomeProjeto}`,'Alert','Warning');
          else {
            editfeature.attributes.Analise='Verificado GIS'
            const result=await layerEditorClass.editFeatures(editfeature,'update')
            if(result) callAlert(`Propriedade sem interseccos`,'Alert','Success');}
            
          })
        }
    }

            
}



export { printIntersection};