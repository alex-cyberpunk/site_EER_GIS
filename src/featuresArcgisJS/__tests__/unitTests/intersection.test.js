

jest.mock('../../../pages/sharedComponents/SucessMessage.js', () => ({
  callAlert: jest.fn(),
}));

jest.mock('@arcgis/core/geometry/SpatialReference.js', () => {
  return jest.fn().mockImplementation(() => {
    return { wkid: 102100 };
  });
});
jest.mock('../../Consultas.js', () => {
  const fs = require('fs');
  const path = require('path');
  return {
    retornaListAreaCode: jest.fn((url, bool, layerId) => {
      let path_,key;
        switch(layerId){
          case 0:
            path = '../mocks/features/Feature_layers/Aeros.json';
            key = 'aero_code';
            break;
          case 1:  
            path = '../mocks/features/Feature_layers/Linhas_UFV.json';
            key = 'linha_code';
            break;
          case 2: 
            path = '../mocks/features/Feature_layers/Linhas_EOL.json';
            key = 'linha_code';
            break;
          case 3:
            path = '../mocks/features/Feature_layers/Areas.json';
            key = 'area_code';
            break;
        }
      const jsonPath = path.resolve(__dirname,path_);
      const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      //Mark flags in the desired features
      jsonData.featureCollection.layers[0].featureSet.features.map(feature => {
        if (feature.attributes.area_code === 'PROP-SGR-0058') {
          feature.geometry = 'PROP-SGR-0058';
        }
        if(feature.attributes[key] === 'EOL-VCH-003') {
          feature.geometry = 'EOL-VCH-003';
        }
        return feature;
      });  
    })
  };
});

import Intersection from "../../libs/Intersection.js";
import { readFile } from 'fs/promises';
import {describe, expect, test, beforeAll,todo} from '@jest/globals';


describe("Intersection", () => {
  
    let polygonGraphics;
    let intersection;
    beforeAll(async () => {
        // Mock the geometryEngine module
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
        // Mock the projection function
        const projectionMock = {
          project: jest.fn().mockImplementation((graphic, outSpatialReference) => {
            return graphic;
          })
        };
        intersection = new Intersection(geometryEngineMock);
        const data = await readFile('./src/featuresArcgisJS/__tests__/mocks/coordinates/NAO-intersecta-featureLayer.json', 'utf8');
        const coordinates = JSON.parse(data);
        
        //Intesecta a prop PROP-SGR-0067
        polygonGraphics = {
                            attributes: {
                                          numPedido: 1,
                                          Proprietario: "Joao"
                                        },
                            geometry: {
                                          type: "Polygon",
                                          coordinates:coordinates[0],
                                          outSpatialReference: {
                                                  wkid: 4326,
                                        }
                            }};                                              

    
                          });
    
    test('verifyIntersect1ToN', async () => {
      
        // Arrange
        const chaves = ["numPedido"];
        const chavesIntersect = ["area_code"];
        const data = await readFile('src/featuresArcgisJS/__tests__/mocks/features/Feature_layers/Areas.json', 'utf8');
        const props = JSON.parse(data);
        
        // Act
        //Make an array with only the feature that has the area_code "PROP-SGR-0058"
        const filteredFeatures = props.features.
                                filter(feature => 
                                feature.attributes.
                                area_code === "PROP-SGR-0058");
        
        filteredFeatures.forEach(feature => {
                                  if (feature.attributes.area_code === "PROP-SGR-0058") {
                                      feature.geometry = "PROP-SGR-0058";
                                  }});
        
        const result = await intersection.
                              verifyIntersect1ToN(polygonGraphics, 
                                            props.features, 
                                            chaves, 
                                            chavesIntersect);
            

        const resultIntersection={
            "area_code": "PROP-SGR-0058",
            "numPedido": 1,
            "areaPlanar": 2
        }    
        // Assert
        expect(result).toEqual([resultIntersection]);
            
    },30000);
    
    describe("verifyIntersectProjects",  () => {
      
      test("should return false because there is no intersection", async () => {
        //In this simultaion the feature PROP-SGR-0058 does not intersect with any feature of the Aeros layer
        // Act
        const result = await intersection.
                              verifyIntersectProjects(
                                [polygonGraphics], 
                                'http://services6.arcgis.com/9kR1D0L6Y5TzrTfj',
                                [0],
                                'aero_code',
                                102100)
        
        // Assert
        expect(callAlert).toHaveBeenCalledWith(`verificando Interseccao...`, "Alert", 'Warning');
        expect(Consultas.retornaListAreaCode.mock.calls.length).toBe(1);
        expect(result).toEqual(false);
        
      });
      
      test("should return true because there is intersection", async () => {
        //In this simultaion the feature PROP-SGR-0058 intersects with the feature PROP-VCH-0003 of the Linhas Aeros layer
        const result = await intersection.
                              verifyIntersectProjects(
                                [polygonGraphics], 
                                'http://services6.arcgis.com/9kR1D0L6Y5TzrTfj',
                                [1,2],
                                'linha_code',
                                102100)
        // Assert
        expect(callAlert).toHaveBeenCalledWith(`verificando Interseccao...`, "Alert", 'Warning');
        expect(Consultas.retornaListAreaCode.mock.calls.length).toBe(2);
        expect(result).toEqual(true);
      });
    
    })
})

