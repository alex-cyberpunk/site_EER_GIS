import Expand from "@arcgis/core/widgets/Expand.js";
import request from "@arcgis/core/request.js";
import Field from "@arcgis/core/layers/support/Field.js";
import Graphic from "@arcgis/core/Graphic.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import { retornaListAreaCode } from "../Consultas.js";
import createFeature from "./createFeatures.js";
import Intersection from "./Intersection.js";


class loadSHPinFeaturelayer {
  constructor(view, map, userApp, appManager,projeto,Documents) {
    this.view = view;
    this.map = map;
    this.userApp = userApp;
    this.appManager = appManager;
    this.projeto = projeto;
    if(Documents) this.Document = Documents;
    else this.Document = document;
  }

  #addShapefileToMap(featureCollection, map) {
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
    this.view.goTo(sourceGraphics)
      .catch((error) => {
        if (error.name != "AbortError") {
          console.error(error);
        }
      });

    this.Document.getElementById('upload-status').innerHTML = "";
  }

  async #generateFeaturesFromSHP(featureCollection) {
    let addFeatures = [];
    let addFeat;
    let hasAreaCode = featureCollection.layers[0].layerDefinition.fields.some(field => field.name === 'area_code');
    if (hasAreaCode) {
      const propsPedidos = featureCollection.layers[0].featureSet.features;
      retornaListAreaCode(this.appManager.Projetos[this.projeto].url, true, 3).
        then(async (propsProjetos) => {
          featureCollection.layers[0].featureSet.features.map(feature => {
            addFeat={attributes:{   area_code : feature.attributes.area_code,
                                    Responsavel_Topografia: this.userApp.userName,
                                    Responsavel_Topografia_ID: this.userApp.userId,
                                    TipoDeOperacaoNaBase : 'Edicao' },
                      geometry : feature.geometry}            
            generateFieldIntersection(addFeat, this.projeto, propsPedidos, propsProjetos);
            addFeatures.push(addFeat);
          });   
        })
      
      return(addFeatures);  
      //ApplyEdits


    }
    else {
      console.log('No layers have the name area_code');
    }

    async function generateFieldIntersection(feature, projeto, propsPedidos, propsProjetos) {
      //Construction of an geojson with the error of intersection for orientation to topography
      const intersection = new Intersection();
      //Verify if area_code has the pattener PROP-XXX-NNNN
      const pattern = /^PROP-[A-Z]{3}-\d{4}$/;
      if (pattern.test(feature.attributes.area_code)) {
        const pattern = /^PROP-([A-Z]{3})-\d{4}$/;
        //Verify if area_code has the same project
        const match = feature.attributes.area_code.match(pattern);
        if (match[1] !== projeto) {
          feature.attributes.erro = 'Projeto difere area_code'
        }
        else {
          //Verify if has intersection with the Project Layer
          let propsProjetoAnalisis = propsProjetos.filter(obj => obj.attributes.area_code !== feature.attributes.area_code);
          let results = intersection.verifyIntersect1ToN(feature.geometry, propsProjetoAnalisis, ['area_code'],['area_code']);
          results = results.filter(obj => obj.area_code !== obj.area_code_intersect);
          results = results.map(obj => obj.area_code_intersect.toString());         
          if (results.length > 0) {
            feature.attributes.erro = 'O layer Intersecta com o projeto'
            feature.attributes.interseccoes = results;
          }
        }

      }

      //Verify if area_code has the pattener PROP-XXX-NNNN
      else {
        feature.attributes.erro = 'Fora do Padrao PROP-XXX-NNNN'
      }
      //Verify if has intersection with the Layer itself
      let propsPedidosAnalisis = propsPedidos.filter(obj => obj.attributes.area_code !== feature.attributes.area_code);
      let resultsPedidos = await intersection.verifyIntersect1ToN(feature.geometry, propsPedidosAnalisis, ['area_code'],['area_code']);
      resultsPedidos = resultsPedidos.map(obj => obj.area_code_intersect.toString());
      if (resultsPedidos.length > 0) {
        feature.attributes.erro = 'O layer se auto-intersecta'
        feature.attributes.interseccoes = resultsPedidos;
      }

      if (!feature.attributes.erro) feature.attributes.Analise = 'Verificado GIS';
      else feature.attributes.Analise = 'Topografia';
    }
  }

  async #generateFeatureCollection(fileName, portalUrl = "https://www.arcgis.com") {
      let name = fileName.split(".");
      // Chrome adds c:fakepath to the value - we need to remove it
      name = name[0].replace("c:\\fakepath\\", '');

      this.Document.getElementById('upload-status').innerHTML = '<b>Loading </b>' + name;


      // define the input params for generate see the rest doc for details
      // https://developers.arcgis.com/rest/users-groups-and-items/generate.htm
      const params = {
        'name': name,
        'targetSR': this.view.spatialReference,
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
      return request(portalUrl + '/sharing/rest/content/features/generate', {
        query: myContent,
        body: this.Document.getElementById('uploadForm'),
        responseType: 'json'
      })
        .then((response) => {
          const layerName = response.data.featureCollection.layers[0].layerDefinition.name;
          this.Document.getElementById('upload-status').innerHTML = '<b>Loaded: </b>' + layerName;
          return response
        })
        .catch(errorHandler);


      function errorHandler(error) {
        this.Document.getElementById('upload-status').innerHTML =
          "<p style='color:red;max-width: 500px;'>" + error.message + "</p>";
      }
  }
    
  loadShp() {
    return new Promise((resolve, reject) => {
      this.Document.getElementById("uploadForm").addEventListener("change", async(event) => {
        const fileName = event.target.value.toLowerCase();
  
        if (fileName.indexOf(".zip") !== -1) {
          try {
            const response = await this.#generateFeatureCollection(fileName);
            let result;
            if(this.isChecked) {
              result = await this.#generateFeaturesFromSHP(response.data.featureCollection);
            } else {
              this.#addShapefileToMap(response.data.featureCollection,this.map,this.view);
            }
            resolve(result);
          } catch (error) {
            reject(error);
          }
        } else {
          this.Document.getElementById('upload-status').innerHTML = '<p style="color:red">Add shapefile as .zip file</p>';
          reject(new Error('Invalid file type'));
        }
      });
  
      const fileForm = this.Document.getElementById("mainWindow");
  
      const expand = new Expand({
        expandIcon: "upload",
        view: this.view,
        content: fileForm
      });  
      this.view.ui.add(expand, "bottom-right");
    });
  } 
}

    
export default loadSHPinFeaturelayer;