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
import request from "@arcgis/core/request.js";
import Intersection from "../../libs/Intersection.js";
import createFeature from "../../libs/createFeatures.js";
import {retornaListAreaCode} from "../../Consultas.js";
import { readFile } from 'fs/promises';
import { user } from 'dojo/_base/url';

jest.mock('@arcgis/core/widgets/Expand.js');
jest.mock('../../Consultas.js');
jest.mock('../../libs/Intersection.js');
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

describe('loadSHPinFeaturelayer', () => {
  let instance,props,featureCollection,Areas,data,mockTarget;

  beforeEach(async() => {
    //Arrange
    instance = new loadSHPinFeaturelayer('view',map,userApp,appManager);
    //Mock featurelayer
    data = await readFile('src/featuresArcgisJS/__tests__/mocks/features/Feature_layers/Areas.json', 'utf8');
    const props = JSON.parse(data);

    mockTarget = {
        getElementById: jest.fn().mockImplementation((id) => {
          if (id === 'uploadForm') {
            return {
              addEventListener: jest.fn((event, callback) => {
                if (event === 'change') {
                  // Replace the behavior of the callback function here
                  callback = async () => {
                    // Mock implementation
                  };
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
    

    //Select the features that intersect with the polygon
    let filteredFeatures = props.features.
                                filter(feature => 
                                feature.attributes.
                                area_code === "PROP-SGR-0058");
        
    filteredFeatures.forEach(feature => {
                                if (feature.attributes.area_code === "PROP-SGR-0058") {
                                    feature.geometry = "PROP-SGR-0058";
                                }});
    
    data = await readFile('./src/featuresArcgisJS/__tests__/mocks/features/response.data-request-widgetSHP.json', 'utf8');
    const featureCollection = JSON.parse(data);
    jest.doMock('@arcgis/core/request.js', () => {
        return jest.fn().mockImplementation((url, options) => {
            if (url.contains('/sharing/rest/content/features/generate') && options.responseType === 'json') {
                return Promise.resolve({
                    data: {
                        featureCollection: {featureCollection}
                    }
                });
            }
        });
    });   
                                                            

    Intersection.mockClear();

    const geometryEngineMock = {
        intersect: jest.fn((featureGeometry) => {
        switch (featureGeometry) {
            case "PROP-SGR-0058":
            return true;
            case "PROP-SGR-0067":
            return true;
            case "EOL-VCH-003":
            return true;
            default:
            return false;
        }
        }),
        planarArea: jest.fn().mockReturnValue(2)
    };

    const intersection = new Intersection(null,geometryEngineMock);

    Intersection.mockImplementation(() => {
        return intersection;
    });
    
    retornaListAreaCode.mockReturnValue(Areas);

    instance.addShapefileToMap = jest.fn();
  });

  it('should call addShapefileToMap when isChecked is false', async () => {
    instance.isChecked = false;
    await instance.loadShp(mockTarget);
    expect(instance.addShapefileToMap).toHaveBeenCalled();
  });

  it('should not call addShapefileToMap when isChecked is true', async () => {
    instance.isChecked = true;
    await instance.loadShp(mockTarget);
    expect(instance.addShapefileToMap).not.toHaveBeenCalled();
  });

  // Add more tests as needed
});