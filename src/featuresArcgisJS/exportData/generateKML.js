import {loadLayer} from '../Consultas.js';
import tokml from 'tokml';
import * as projection from "@arcgis/core/geometry/projection.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import axios from 'axios';

function styles(status){
  let colors;
  
  switch (status) {
  case 'MAPEADO COM DOCUMENTOS':
    colors = {'lineStyle':{'width': '2', 'color': "ffffffff"}, 'polyStyle':{'color':'660055ff'}}
  
    break;
  case 'MAPEADO SEM DOCUMENTOS':
    colors = {'lineStyle':{'width': '2', 'color': "ffffffff"}, 'polyStyle':{'color':'6600ffff'}}
    
    break;
  case 'ÁREAS CTG':
    colors = {'lineStyle':{'width': '2', 'color': "ffffffff"}, 'polyStyle':{'color':'ccffffff'}}
    
    break;
  case 'CONTRATADO SEM MATRÍCULA':
    colors = {'lineStyle':{'width': '2', 'color': "ffffffff"}, 'polyStyle':{'color':'66ffff00'}}
    
    break;
  case 'PROTOCOLADO CORREDOR DE VENTOS':
    colors = {'lineStyle':{'width': '2', 'color': "ffffffff"}, 'polyStyle':{'color':'66ffcf30'}}
    
    break;
  case 'CONTRATADO COM MATRÍCULA EM NOME DE 3º':
    colors = {'lineStyle':{'width': '2', 'color': "ffffffff"}, 'polyStyle':{'color':'66ffa855'}}
    
    break;
  case 'CONTRATADO COM MATRÍCULA EM NOME DO PROPRIETÁRIO':
    colors = {'lineStyle':{'width': '2', 'color': "ffffffff"}, 'polyStyle':{'color':'66ff0000'}}
    
    break;
  case 'CONTRATADO COM MATRÍCULA E COM GEO INCRA':
    colors = {'lineStyle':{'width': '2', 'color': "ffffffff"}, 'polyStyle':{'color':'66ff00aa'}}
    
    break;
  case 'CONTRATADO COM MATRÍCULA RETIFICADA E COM GEO INCRA':
    colors = {'lineStyle':{'width': '2', 'color': "ffffffff"}, 'polyStyle':{'color':'667f00aa'}}
    
    break;
  case 'REGULARIZADO':
    colors = {'lineStyle':{'width': '2', 'color': 'ffffffff'}, 'polyStyle':{'color':'6600aa00'}}
    
    break;
  case 'REGULARIZADO PADRÃO INTERNACIONAL':
    colors = {'lineStyle':{'width': '2', 'color': 'ffffffff'}, 'polyStyle':{'color':'6600aa00'}}
    
    break;
  }
  
  return colors;  
}


async function featureLayerToGeoJSON(featureLayer,outFields,objectIds) {
  const query = featureLayer.createQuery();
  
  query.outFields = outFields;
  if(objectIds) {query.objectIds= objectIds};

  const featureSet = await featureLayer.queryFeatures(query);
  const features = featureSet.features;
  
  let outSpatialReference = new SpatialReference({
    wkid: 4326
  });

  features.forEach(feature => {
    feature.geometry=projection.project(feature.geometry, outSpatialReference)
  });
  
  const geojson = {
    type: "FeatureCollection",
    features: features.map(feature => ({
      name: feature.attributes.area_code, // Make sure area_code is not undefined
      type: "Feature",
      geometry: {
        type: 'Polygon', // this should be "Point", "LineString", or "Polygon"
        coordinates:  feature.geometry.rings // use rings for polygons
      },
      properties: {
        ...feature.attributes,
      }
    }))
  };
  
  return geojson;
}

function createFolders(folders, geojson){
  let kml = '<?xml version="1.0" encoding="UTF-8"?>';
  kml += '<kml xmlns="http://www.opengis.net/kml/2.2">';
  kml += '<Document>';

  folders.forEach((folder, index) => {
    let style = styles(folder.toUpperCase());
    kml += `<Style id="style${index}"><LineStyle><color>${style.lineStyle.color}</color><width>${style.lineStyle.width}</width></LineStyle>`;
    kml += `<PolyStyle><color>${style.polyStyle.color}</color></PolyStyle></Style>`;
    
    kml += `<Folder><name>${folder}</name>`;
    
    let placemarks = createPlacemarksForFolder(folder, geojson, `#style${index}`);
    kml += placemarks;
    
    kml += `</Folder>`;
  });

  // End of the KML file
  kml += '</Document>';
  kml += '</kml>';
  
  return kml;
}

function createPlacemarksForFolder(folder, geojson, styleUrl) {
  let placemarks = '';

  geojson.features.forEach(feature => {
    if (feature.properties.Status === folder) {
      placemarks += `<Placemark>`;
      placemarks += `<styleUrl>${styleUrl}</styleUrl>`;
      placemarks += `<name>${feature.name}</name>`;
      
      // Start of the description
      placemarks += `<description><![CDATA[`;
      
      // Add each property to the description
      for (let key in feature.properties) {
        placemarks += `<b>${key}:</b> ${feature.properties[key]}<br>`;
      }
      
      // End of the description
      placemarks += `]]></description>`;
      
      placemarks += `<Polygon><outerBoundaryIs><LinearRing><coordinates>`;
      // Format the coordinates as a whitespace-separated list of longitude,latitude,altitude tuples
      feature.geometry.coordinates[0].forEach(coord => {
        placemarks += `${coord[0]},${coord[1]},0 `;
      });
      placemarks += `</coordinates></LinearRing></outerBoundaryIs></Polygon>`;
      placemarks += `</Placemark>`;
    }
  });

  return placemarks;
}

async function featureLayerToKML(layer,projeto,visibleColumns,objectIds=null) {
  const featureLayer = await loadLayer(null, layer.url, layer.IdLayer);
  //debugger
  const geojson = await featureLayerToGeoJSON(featureLayer,visibleColumns,objectIds);
  
  let uniqueStatusValues = new Set();
  let folders;

  geojson.features.forEach(feature => {
    uniqueStatusValues.add(feature.properties.Status);
  });
  // Convert the Set back to an Array
  folders = Array.from(uniqueStatusValues);
  
  let kml;
  kml = createFolders(folders,geojson);
  
  // Create a Blob from the KML data
  let blob = new Blob([kml], {type: 'application/vnd.google-earth.kml+xml'});
  
  let url = URL.createObjectURL(blob);
  let link = document.createElement('a');
  link.href = url;
  link.download = `${projeto}.kml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return blob;
}

async function featureLayerToSHP(layer,projeto,token,outFields,objectIds=null) {
  //debugger
  axios.post('http://localhost:3002/generateSHP', { layer ,token:token.token,projeto:projeto,objectIds,outFields:outFields}, { responseType: 'arraybuffer' })
  .then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${projeto}.zip`);
    document.body.appendChild(link);
    link.click();
  })
  .catch((error) => {
    console.error(error);
  });

}

export {featureLayerToKML,featureLayerToSHP}