var https = require('follow-redirects').https;
const FormData = require('form-data');
const querystring = require('querystring');
var request = require('request');
const repository = require('../repository/repository.js');
const { queryFeatures } = require('@esri/arcgis-rest-feature-layer');

const shpwrite = require('shp-write');

function generateTokenGIS(User,expiration) {
  let jsonData = User;
  jsonData.f = 'json';
  jsonData.client = 'referer';
  jsonData.referer = 'arcgis.com';
  jsonData.expiration = expiration

  var options = {
    'method': 'POST',
    'url': 'https://www.arcgis.com/sharing/rest/generateToken',
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: jsonData
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) reject(error);
      else resolve(JSON.parse(body));
    });
  });
}


async function featureLayerToSHP(layer) {
  const geojson = await featureLayerToGeoJSON(layer.url, layer.IdLayer, layer.visibleFields);
  
   return geojson;
}

async function featureLayerToGeoJSON(url, layerId, token,outFields,objectIds=null) {
  const query = {
    outFields: outFields,
    where: "1=1",
    outSR: 4326,
    token: token  // add the token to the query parameters
  };
  if(objectIds) query.objectIds = objectIds;
  console.log(`${url}/${layerId}`, query);
  try {
    const response = await queryFeatures({ url: `${url}/${layerId}`, params: query });
    const features = response.features;      
    //console.log(features)
    const geojson = {
      type: "FeatureCollection",
      features: features.map(feature => ({
        type: "Feature",
        geometry: {
          type: 'Polygon', // this should be "Point", "LineString", or "Polygon"
          coordinates:  feature.geometry.rings // use rings for polygons
        },
        properties: {
          ...feature.attributes,
        },
      }))
    };
    //console.log(JSON.stringify(geojson, null, 2));
    //console.log('geojson')
    return geojson;
  } catch (error) {
    console.error('Error querying features:', error);
    throw error;  // re-throw the error so it can be handled elsewhere
  }
}

async function applyEdits(edits,url) {
  const User= await repository.arcgisUser()
  const token = generateTokenGIS(User,'0.5')
  let jsonData = edits;
  jsonData.f = 'json';
  jsonData.returnEditResults = true;

  var options = {
    'method': 'POST',
    'url': `${url}/applyEdits?token=${token}`,
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: jsonData
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) reject(error);
      else resolve(JSON.parse(body));
    });
  });
}

async function generateKML(url,layerId,layersOptions) {
  /**
   * https://developers.arcgis.com/rest/services-reference/enterprise/generate-kml.htm
   */
  const User = await repository.arcgisUser();
  const token = await generateTokenGIS(User, '5')
  const tokenGIS = token.token;
  console.log(tokenGIS)
  let jsonData = {};
  jsonData.f = 'json';
  jsonData.layers = `layers= ${layerId}`; // format "layers: 1,2,3"
  jsonData.layersOptions = layersOptions; // separateImage
  jsonData.docName = 'Test Name';

  var options = {
    'method': 'POST',
    'url': `${url}?token=${tokenGIS}/generateKml`,
    'headers': {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: jsonData
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) reject(error);
      else resolve(JSON.parse(body));
    });
  });
}


module.exports={
  generateTokenGIS,
  applyEdits,
  featureLayerToGeoJSON
}