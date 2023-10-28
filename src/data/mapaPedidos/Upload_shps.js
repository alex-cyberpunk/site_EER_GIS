import Expand from "@arcgis/core/widgets/Expand.js";
import request from "@arcgis/core/request.js";
import Field from "@arcgis/core/layers/support/Field.js";
import Graphic from "@arcgis/core/Graphic.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";


async function loadShp(view,map){
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

      function generateFeatureCollection (fileName) {
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
            addShapefileToMap(response.data.featureCollection);
          })
          .catch(errorHandler);
      }

      function errorHandler (error) {
        document.getElementById('upload-status').innerHTML =
        "<p style='color:red;max-width: 500px;'>" + error.message + "</p>";
      }

      function addShapefileToMap (featureCollection) {
        // add the shapefile to the map and zoom to the feature collection extent
        // if you want to persist the feature collection when you reload browser, you could store the
        // collection in local storage by serializing the layer using featureLayer.toJson()
        // see the 'Feature Collection in Local Storage' sample for an example of how to work with local storage
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
          // associate the feature with the popup on click to enable highlight and zoom to
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

    }

export { loadShp};