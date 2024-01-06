

jest.mock('../../../pages/sharedComponents/SucessMessage.js', () => ({
  callAlert: jest.fn(),
}));

jest.mock('@arcgis/core/geometry/SpatialReference.js', () => {
  return jest.fn().mockImplementation(() => {
    return { wkid: 102100 };
  });
});



import * as Consultas from '../../Consultas.js'
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
        intersection = new Intersection(projectionMock,geometryEngineMock);
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
      
      jest.spyOn(Consultas, 'queryFeature').mockImplementation(
        async (featureLayer, whereClause, layerId) => {
        let path;
        switch(layerId){
          case 0:
            path = 'src/featuresArcgisJS/__tests__/mocks/features/Feature_layers/Aeros.json';
            break;
          case 1:  
            path = 'src/featuresArcgisJS/__tests__/mocks/features/Feature_layers/Linhas_UFV.json';
            break;
          case 2: 
            path = 'src/featuresArcgisJS/__tests__/mocks/features/Feature_layers/Linhas_EOL.json';
            break;
          case 3:
            path = 'src/featuresArcgisJS/__tests__/mocks/features/Feature_layers/Areas.json';
            break;
        }
        const data = await readFile(path, 'utf8');
        const props = JSON.parse(data);
        return props.features;
      });

      jest.spyOn(feature, 'loadLayer').mockImplementation(
        async (urlProjeto, layerId) => {
        return new Promise((resolve, reject) => {
          resolve(true)
        })
      });
  
      test("should return false because there is no intersection", async () => {

        // Arrange
        const data = await readFile('src/featuresArcgisJS/__tests__/mocks/features/Feature_layers/Areas.json', 'utf8');
        const props = JSON.parse(data);
        
        // Act
        const result = await intersection.
                              verifyIntersectProjects(
                                [polygonGraphics], 
                                'http://services6.arcgis.com/9kR1D0L6Y5TzrTfj',
                                [1,2])
            
        // Assert
        expect(callAlert).toHaveBeenCalledWith(`verificando Interseccao...`, "Alert", 'Warning');
        expect(result).toEqual(false);
        
      });
      
      test("should return true because there is intersection", async () => {

        // Arrange
        const data = await readFile('src/featuresArcgisJS/__tests__/mocks/features/Feature_layers/Linhas_EOL.json', 'utf8');
        const props = JSON.parse(data);
        
        // Act
        const filteredFeatures = props.features.filter(feature => feature.attributes.linha_code === "EOL-VCH-003");
        filteredFeatures.forEach(feature => {
          if (feature.attributes.linha_code === "EOL-VCH-003") {
            feature.geometry = "EOL-VCH-003";
          }
        });
        
        const result = await intersection.
                              verifyIntersectProjects(
                                [polygonGraphics], 
                                'http://services6.arcgis.com/9kR1D0L6Y5TzrTfj',
                                [1,2])
        // Assert
        expect(callAlert).toHaveBeenCalledWith(`verificando Interseccao...`, "Alert", 'Warning');
        expect(result).toEqual(true);
      });
    
    })  

})    