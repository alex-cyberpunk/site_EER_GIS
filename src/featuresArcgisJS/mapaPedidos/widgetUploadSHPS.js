import Expand from "@arcgis/core/widgets/Expand.js";
import request from "@arcgis/core/request.js";
import Field from "@arcgis/core/layers/support/Field.js";
import Graphic from "@arcgis/core/Graphic.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import { returnEditFeatures ,retornaListAreaCode} from "../Consultas.js";
import { findIntersect } from "../verifyIntersect.js";

function addShapefileToMap (featureCollection,map,view) {
  let sourceGraphics = [];

  const layers = featureCollection.layers.map((layer) => {

    const graphics = layer.featureSet.features.map((feature) => {
      return Graphic.fromJSON(feature);
    })
    sourceGraphics = sourceGraphics.concat(graphics);
    const featureLayer = new FeatureLayer({
      objectIdField: "FID",
      source: graphics,
      fields: layer.layerDefinition.fields.map((field) => {
      return Field.fromJSON(field);
      })
    });
    return featureLayer;
    });
  map.addMany(layers);
  view.goTo(sourceGraphics)
  .catch((error) => {
    if (error.name != "AbortError"){
      console.error(error);
    }
  });

  document.getElementById('upload-status').innerHTML = "";
}

async function generateFieldIntersection(feature,projeto,propsPedidos,propsProjetos){
    
    //Verify if area_code has the pattener PROP-XXX-NNNN
    const pattern = /^PROP-[A-Z]{3}-\d{4}$/;
    if(pattern.test(feature.attributes.area_code)){
      const pattern = /^PROP-([A-Z]{3})-\d{4}$/;
      //Verify if area_code has the same project
      const match = feature.attributes.area_code.match(pattern);
      if(match[1]!==projeto){
        feature.attributes.erro='Projeto difere area_code'
      }
      else {
        //Verify if has intersection with the Projetct
        const results = findIntersect(feature.geometry, propsProjetos, 'area_code');
        let index = results.findIndex(obj => obj.area_code === feature.attributes.area_code);
        if (index !== -1) {let removedObject = results.splice(index, 1)[0];}
        if(results.length>0){
          feature.attributes.erro='O layer Intersect com o projeto'
          feature.attributes.interseccoes=JSON.stringify(results);
        }
      }
      
    }
          
    //Verify if area_code has the pattener PROP-XXX-NNNN
    else  {
      feature.attributes.erro='Fora do Padrao PROP-XXX-NNNN'
    }
    //Verify if has intersection with the Layer itself
    
    const resultsPedidos = findIntersect(feature.geometry, propsPedidos, 'area_code');
    if(resultsPedidos.length>0){
      feature.attributes.erro='O layer se auto-intersecta'
      feature.attributes.interseccoes=JSON.stringify(resultsPedidos);
    }

    if(!feature.attributes.erro) feature.attributes.Analise='Verificado GIS';  
    else feature.attributes.Analise='Topografia';
  }


async function loadShp(view,map,isChecked,userApp,appManager){
      const portalUrl = "https://www.arcgis.com"
      document.getElementById("uploadForm").addEventListener("change", (event) => {
        const fileName = event.target.value.toLowerCase();

        if (fileName.indexOf(".zip") !== -1) {//is file a zip - if not notify user
          generateFeatureCollection(fileName);
        }
        else {
          document.getElementById('upload-status').innerHTML = '<p style="color:red">Add shapefile as .zip file</p>';
        }
      });

      const fileForm = document.getElementById("mainWindow");

      const expand = new Expand({
        expandIcon: "upload",
        view: view,
        content: fileForm
      });

      view.ui.add(expand, "bottom-right");

      async function generateFeatureCollection (fileName) {
        let name = fileName.split(".");
        // Chrome adds c:fakepath to the value - we need to remove it
        name = name[0].replace("c:\\fakepath\\", '');

        document.getElementById('upload-status').innerHTML = '<b>Loading </b>' + name;

        // define the input params for generate see the rest doc for details
        // https://developers.arcgis.com/rest/users-groups-and-items/generate.htm
        const params = {
          'name': name,
          'targetSR': view.spatialReference,
          'maxRecordCount': 1000,
          'enforceInputFileSizeLimit': true,
          'enforceOutputJsonSizeLimit': true
        };

        // generalize features to 10 meters for better performance
        params.generalize = true;
        params.maxAllowableOffset = 10;
        params.reducePrecision = true;
        params.numberOfDigitsAfterDecimal = 0;

        const myContent = {
          'filetype': 'shapefile',
          'publishParameters': JSON.stringify(params),
          'f': 'json',
        };

        // use the REST generate operation to generate a feature collection from the zipped shapefile
        request(portalUrl + '/sharing/rest/content/features/generate', {
          query: myContent,
          body: document.getElementById('uploadForm'),
          responseType: 'json'
        })
        .then((response) => {
            const layerName = response.data.featureCollection.layers[0].layerDefinition.name;
            document.getElementById('upload-status').innerHTML = '<b>Loaded: </b>' + layerName;
            //debugger
            let isChecked_=false;
            //console.log(response.data.featureCollection.layers[0].featureSet.features)
            if(isChecked_){
              console.log('')
              
              let feat;
              let addFeatures=[];
              let hasAreaCode = response.data.featureCollection.layers[0].layerDefinition.fields.some(field => field.name === 'area_code');              debugger
              if (hasAreaCode) {
                let projeto='SGR'
                const propsPedidos=response.data.featureCollection.layers[0].featureSet.features;
                retornaListAreaCode(appManager.Projetos, true, projeto,3).
                then(async (propsProjetos)=>{
                  let features = response.data.featureCollection.layers[0].featureSet.features.map(feature => {
                    feature.attributes.Responsavel_Topografia = userApp.userName;
                    feature.attributes.Responsavel_Topografia_ID = userApp.userId;
                    feature.attributes.TipoDeOperacaoNaBase = 'Edicao';
                    generateFieldIntersection(feature, projeto, propsPedidos, propsProjetos);
                    feature.rings = feature.geometry.rings;
                    return feature;
                  });
                  
                  let feat = await returnEditFeatures(features, null, features[0].geometry.spatialReference);
                  addFeatures = addFeatures.concat(feat);
                  //debugger
    
                })
                              } else {
                console.log('No layers have the name area_code');
              }
              
              
            }
            else addShapefileToMap(response.data.featureCollection,map,view);
            
          })
          .catch(errorHandler);
      }

      function errorHandler (error) {
        document.getElementById('upload-status').innerHTML =
        "<p style='color:red;max-width: 500px;'>" + error.message + "</p>";
      }

      

    }

export { loadShp};