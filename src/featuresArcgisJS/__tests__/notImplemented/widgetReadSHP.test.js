//Mock verifyIntersect1ToN switch by featureData
//Mock loadLayer return Areas.json (its not the same as the one in .shp)
//Mock request(portalUrl + '/sharing/rest/content/features/generate', {
    //query: myContent,
    //body: document.getElementById('uploadForm'),
    //responseType: 'json'
  //}) by the one in mocks/featureCollection.json

//Mock addShapefileToMap and just see if call it (this function dont need test)
//Mock returnEditFeatures
//Mock retornaListAreaCode 

import loadSHPinFeaturelayer from '../../libs/widgetUploadSHP.js';
import { readFile } from 'fs/promises';

jest.mock('../../Consultas.js', () => {
  const fs = require('fs');
  const path = require('path');

  const jsonPath = path.resolve(__dirname, '../mocks/features/Feature_layers/Areas.json');
    
  //Flag in the PROP-SGR-0058
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
   jsonData.features.map(feature => {
    if (feature.attributes.area_code === 'PROP-SGR-0058') {
      feature.geometry = 'PROP-SGR-0058';
    }
    return feature;
  });
  return {
    retornaListAreaCode: jest.fn((url, bool, num) => {
      console.log("url", url);
      if (bool === true && num === 3) {
        return Promise.resolve(jsonData.features);
      } else {
        return Promise.reject(new Error('Invalid arguments'));
      }
    })
  };
});
jest.mock('../../../pages/sharedComponents/SucessMessage.js', () => ({
    callAlert: jest.fn(),
}));
jest.mock('../../libs/createFeatures.js', () => {    
    return jest.fn().mockImplementation(async () => {
        const polygonGraphics = {
            attributes: {
                        numPedido: 1,
                        Proprietario: "Joao"
                        },
            geometry: {
                        type: "Polygon",
                        coordinates:[
                            [
                                [
                                    -38.447557842751245,
                                    -9.071857362021749
                                ],
                                [
                                    -38.4488680041521,
                                    -9.075778026611452
                                ],
                                [
                                    -38.45092077944214,
                                    -9.081991604773343
                                ],
                                [
                                    -38.45297438836876,
                                    -9.088199908224372
                                ],
                                [
                                    -38.455090311630016,
                                    -9.094602299026539
                                ],
                                [
                                    -38.459431077982394,
                                    -9.095950806322515
                                ],
                                [
                                    -38.4602023229763,
                                    -9.095402573194532
                                ],
                                [
                                    -38.457505710749096,
                                    -9.088222261585203
                                ],
                                [
                                    -38.45610312618024,
                                    -9.084456277181225
                                ],
                                [
                                    -38.451720396825976,
                                    -9.072549832644368
                                ],
                                [
                                    -38.4535466547306,
                                    -9.072660512322582
                                ],
                                [
                                    -38.44882416726454,
                                    -9.061875586055754
                                ],
                                [
                                    -38.44964921325915,
                                    -9.06111079223529
                                ],
                                [
                                    -38.44803241642763,
                                    -9.059371574037261
                                ],
                                [
                                    -38.44867697650861,
                                    -9.058765223580004
                                ],
                                [
                                    -38.447323391445245,
                                    -9.05750590974042
                                ],
                                [
                                    -38.44660359117101,
                                    -9.05709928038536
                                ],
                                [
                                    -38.44593499846123,
                                    -9.05673407711318
                                ],
                                [
                                    -38.443744143128875,
                                    -9.061478760598966
                                ],
                                [
                                    -38.447557842751245,
                                    -9.071857362021749
                                ]
                            ]
                        ],
                        outSpatialReference: {
                                wkid: 4326,
                        }
            }};
        return {
        returnEditFeatures: jest.fn().mockReturnValue([polygonGraphics])
        }
    })
});
jest.mock('@arcgis/core/widgets/Expand.js', () => {
    return jest.fn().mockImplementation(() => {
      return {
        expandIcon: 'upload',
        view: {},
        content: {},
      };
    });
});
jest.mock('@arcgis/core/request.js', () => {
  const fs = require('fs');
  const path = require('path');
  
  const jsonPath = path.resolve(__dirname, '../mocks/features/response.data-request-widgetSHP.json');
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
   jsonData.featureCollection.layers[0].featureSet.features.map(feature => {
    if (feature.attributes.area_code === 'PROP-JAG-0574') {
      feature.geometry = 'PROP-JAG-0574';
    }
    if(feature.attributes.area_code === 'PROP-JAG-0415') {
      feature.geometry = 'PROP-JAG-0415';
    }
    if(feature.attributes.area_code === 'PROP-JAG-0359') {
      feature.geometry = 'PROP-JAG-0359';
    }
    return feature;
  });

  return jest.fn().mockImplementation((url, options) => {
    if(typeof url==='string'){
      if (url.includes('/sharing/rest/content/features/generate') && options.responseType === 'json') {
        return Promise.resolve({data: jsonData});
      } else {
        return Promise.reject(new Error('Invalid URL or options'));
      }
    }
    else{
      return Promise.resolve({data: jsonData});
    }
    
  });
});   
jest.mock('../../libs/Intersection.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      verifyIntersect1ToN: jest.fn((geometry, featureGeometry) => {
        //console.log(featureGeometry[1].attributes);
        if (geometry === "PROP-JAG-0359" && (featureGeometry[1].attributes.area_code).includes("SGR")) {
          
          return [{
            area_code: "PROP-JAG-0359",
            areaPlanar: 2,
            area_code_intersect: "PROP-SGR-0058"
          }];
        }
        if (geometry === "PROP-JAG-0415" && (featureGeometry[1].attributes.area_code).includes("JAG")) {
          //Simulate if the feature intersect with himself
          let hasPropJag0415 = featureGeometry.some(obj => obj.attributes.area_code === 'PROP-JAG-0415');

          if (hasPropJag0415) {
            return [{
              area_code: "PROP-JAG-0415",
              areaPlanar: 2,
              area_code_intersect: "PROP-JAG-0574"
            },
            {
              area_code: "PROP-JAG-0415",
              areaPlanar: 2,
              area_code_intersect: "PROP-JAG-0415"
            }];
          }  
          else{
          return [{
            area_code: "PROP-JAG-0415",
            areaPlanar: 2,
            area_code_intersect: "PROP-JAG-0574"
          }];
        }
        }
        if (geometry === "PROP-JAG-0574" && (featureGeometry[1].attributes.area_code).includes("JAG")) {
          return [{
            area_code: "PROP-JAG-0574",
            areaPlanar: 2,
            area_code_intersect: "PROP-JAG-0415"
          }];
        }
        else return [];
      })
    };
  });
});

describe('loadSHPinFeaturelayer', () => {
  let instance,props,featureCollection,Areas,data,mockTarget;

  beforeEach(async() => {
    //Arrange

    //usertype Comercial Fundiario
    data= await readFile('./src/featuresArcgisJS/__tests__/mocks/userApps/comercialFund.json', 'utf8');
    const user = JSON.parse(data);
    
    data= await readFile('./src/featuresArcgisJS/__tests__/mocks/appManager/comercialFund.json', 'utf8');
    const appManager = JSON.parse(data);


    data = await readFile('src/featuresArcgisJS/__tests__/mocks/map.json', 'utf8');
    const mockMap=JSON.parse(data);
    
    const mockView = {
        spatialReference: {},         
        ui: {
          add: jest.fn(),
        },
    };
    mockTarget = {
      getElementById: jest.fn().mockImplementation((id) => {
        if (id === 'uploadForm') {
          return {
            addEventListener: jest.fn((event, callback) => {
              if (event === 'change') {
                // Call the callback function with a mock event object
                callback({ target: { value: 'ALG.zip' } });
              }
            }),
          };
        } else if (id === 'upload-status') {
          return {
            innerHTML: '',
          };
        } else if (id === 'mainWindow') {
          return {};
        } else {
          return null;
        }
      }),
    };  
    instance = new loadSHPinFeaturelayer(mockView,
                                          mockMap,
                                          user,
                                          appManager,
                                          'JAG',
                                          mockTarget);

    instance.addShapefileToMap = jest.fn();

    });

  it('should not call addShapefileToMap when isChecked is true', async () => {
    instance.isChecked = true;
    const featuresResult = await instance.loadShp();
    console.log("featuresResult", featuresResult);
    
    //In This simulations, the features that intersect with the project are:
    //PROP-JAG-0359 and PROP-SGR-0058 in the analaysis project
    //PROP-JAG-0415 and PROP-JAG-0574 of himself
    //PROP-JAG-0415 and PROP-JAG-0415 of himself , expected to not be in the final result
      
    expect(featuresResult[1].attributes.area_code).toEqual('PROP-JAG-0359');
    expect(featuresResult[1].attributes.erro).toEqual('O layer Intersecta com o projeto');
    expect(featuresResult[1].attributes.interseccoes).
    toEqual(["PROP-SGR-0058"])

    expect(featuresResult[457].attributes.area_code).toEqual('PROP-JAG-0415');
    expect(featuresResult[457].attributes.erro).toEqual('O layer se auto-intersecta');
    expect(featuresResult[457].attributes.interseccoes).
    toEqual(["PROP-JAG-0574"])

    expect(featuresResult[654].geometry).toEqual('PROP-JAG-0574');
    expect(featuresResult[654].attributes.erro).toEqual('O layer se auto-intersecta');
    expect(featuresResult[654].attributes.interseccoes).
    toEqual(["PROP-JAG-0415"])

  });

  
});