import Intersection from "../../libs/Intersection";
import { readFile } from 'fs/promises';
import {describe, expect, test, beforeAll,todo} from '@jest/globals';

describe("Intersection", () => {
    let polygonGraphics;
    
    const mockGeometryEngine = {
        intersect: jest.fn().mockImplementation((featureGeometry, geometry) => {
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
        planarArea: jest.fn().mockReturnValue(2),
      };   

    beforeAll(async () => {
        const data = await readFile('./src/featuresArcgisJS/__tests__/mocks/coordinates/NAO-intersecta-featureLayer.json', 'utf8');
        const coordinates = JSON.parse(data);
        //Intesecta a prop PROP-SGR-0067
        polygonGraphics = {
                            attributes: {
                              numPedido: 1,
                              Proprietario: "Joao"},
                            geometry: {
                            type: "Polygon",
                            coordinates:coordinates[0],
                            outSpatialReference: {
                                    wkid: 4326,
                            }
                            }};                                              

    });
    
    test('findIntersect', async () => {
        // Arrange
        const chaves = ["numPedido"];
        const chavesIntersect = ["area_code"];
        const intersection = new Intersection(mockGeometryEngine);
        const data = await readFile('src/featuresArcgisJS/__tests__/mocks/features/Feature_layers/Areas.json', 'utf8');
        const props = JSON.parse(data);
        
        // Act
        //Make an array with only the feature that has the area_code "PROP-SGR-0058"
        const filteredFeatures = props.features.filter(feature => feature.attributes.area_code === "PROP-SGR-0058");
        filteredFeatures.forEach(feature => {
        if (feature.attributes.area_code === "PROP-SGR-0058") {
            feature.geometry = "PROP-SGR-0058";
        }
        });
        
        const result = await intersection.
        findIntersect(polygonGraphics, 
            props.features, chaves, chavesIntersect);
            

        const resultIntersection={
            "area_code": "PROP-SGR-0058",
            "numPedido": 1,
            "areaPlanar": 2
        }    
        // Assert

        expect(result).toEqual([resultIntersection]);
            
    },30000);
    test.todo("verifyIntersectNToN", async () => {
      
      it("should return false because there is no intersection", async () => {
        // Arrange
        const intersection = new Intersection(mockGeometryEngine);
        const data = await readFile('src/featuresArcgisJS/__tests__/mocks/features/Feature_layers/Areas.json', 'utf8');
        const props = JSON.parse(data);
        
        // Act
        //Make an array with only the feature that has the area_code "PROP-SGR-0058"
        const filteredFeatures = props.features.filter(feature => feature.attributes.area_code === "PROP-SGR-0058");
        
        const result = await intersection.
        verifyIntersect1ToN(polygonGraphics, 
            props.features, chaves, chavesIntersect);
            
          
        // Assert

        expect(result).toEqual(false);

    })
    
    it("should return false because there is intersection", async () => {
      // Arrange
      const intersection = new Intersection(mockGeometryEngine);
      const data = await readFile('src/featuresArcgisJS/__tests__/mocks/features/Feature_layers/Areas.json', 'utf8');
      const props = JSON.parse(data);
      
      // Act
      const filteredFeatures = props.features.filter(feature => feature.attributes.area_code === "PROP-SGR-0058");
      filteredFeatures.forEach(feature => {
      if (feature.attributes.linha_code === "EOL-VCH-003") {
          feature.geometry = "EOL-VCH-003";
      }
      });
      //sss
      //sss
      const result = await intersection.
      verifyIntersect1ToN(polygonGraphics, 
          props.features, chaves, chavesIntersect);
      // Assert

      expect(result).toEqual(true);
    })
    })  

})    