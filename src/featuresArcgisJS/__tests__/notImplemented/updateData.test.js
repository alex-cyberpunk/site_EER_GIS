import LayerEditor from  '../../libs/updateData.js'
import FeatureLoader from '../../libs/loadFeature.js';
import { readFile } from 'fs/promises';

jest.mock('../../libs/loadFeature.js', () => {
  const applyEdits = jest.fn().mockImplementation((edits) => {
    return new Promise((resolve, reject) => {
      if (edits.hasOwnProperty('updateFeatures')) {
        resolve({
          updateFeatureResults: edits.updateFeatures.map((edit, index) => ({
            objectId: index + 1,
            globalId: `globalId${index + 1}`,
            success: true
          })),
        });
      } else if (edits.hasOwnProperty('addFeatures')) {
        resolve({
          addFeatureResults: edits.addFeatures.map((edit, index) => ({
            objectId: index + 1,
            globalId: `globalId${index + 1}`,
            success: true
          })),
        });
      } else if (edits.hasOwnProperty('deleteFeatures')) {
        resolve({
          deleteFeatureResults: edits.deleteFeatures.map((edit, index) => ({
            objectId: index + 1,
            globalId: `globalId${index + 1}`,
            success: true
          })),
        });
      } else {
        reject({
          error: {
            code: 400,
            extendedCode: -2147207418,
            message: "Unable to complete operation.",
            details: [
              "Violated attribute constraint rule. [Error No: -1, ]",
              "Operation rolled back."
            ]
          }
        });
      }
    });
  });

  return jest.fn().mockImplementation(() => {
    return {
      loadLayer: jest.fn().mockResolvedValue({
        applyEdits: applyEdits
      })
    };
  });
});


jest.mock('axios');
//jest.setTimeout(10000);


describe('LayerEditor', () => {
  let layerEditor,data,user,coordinates,mockAxios;
    
  beforeEach(async () => {    
    //Mock applyEdits
    data= await readFile('./src/featuresArcgisJS/__tests__/mocks/userApps/comercialFund.json', 'utf8');
    //usertype Comercial Fundiario
    user = JSON.parse(data);
    //Mock axios
    
    mockAxios = {
      post: jest.fn((url, data) => {
        switch (url) {
          case 'http://localhost:3002/enviarEmail':
            return Promise.resolve({data: {response: true}});
          case 'http://localhost:3002/logReport':
            return Promise.resolve({data: {response: 13131}});
          default:
            return Promise.reject(new Error('Not found'));
        }
      }),
    };
    data = await readFile('./src/featuresArcgisJS/__tests__/mocks/coordinates/NAO-intersecta-featureLayer.json', 'utf8');
    coordinates = JSON.parse(data);
  });


  it('should add polygon to Pedidos, call email with 3 users ids and send an log ', async () => {
    // Arrange
    const edits = {
                      attributes: {
                                    numPedido: 1,
                                    Proprietario: "Joao"
                                  },
                      geometry: {
                                    type: "Polygon",
                                    coordinates:coordinates[0],
                                    outSpatialReference: {
                                            wkid: 4326,
                                },
                      },
                    }; 
    layerEditor = new LayerEditor(
        edits, // editfeature
        'http://featurelayer-pedidos.com', // generic url 
        1, // generic layerId
        'add', // operation
        user.userId, // userId
        true, // sendEmail
        true, // sendLog
        mockAxios
      );
    
    // Act  
    const objectId=await layerEditor.editFeatures(edits);
    // Assert
    expect(objectId).toEqual([1]);
    expect(axios.post).toHaveBeenCalledTimes(2);
    
  },30000);

  it('should add polygon to project delete from the Pedidos map , call email with 3 users ids and send an log ', async () => {
    // Arrange
    const edits = {
      attributes: {
                    numPedido: 1,
                    Proprietario: "Joao"
                  },
      geometry: {
                    type: "Polygon",
                    coordinates:coordinates[0],
                    outSpatialReference: {
                            wkid: 4326,
                },
      },
    };  
    layerEditor = new LayerEditor(
        edits, // editfeature
        'http://featurelayer-projeto.com', // generic url 
        1, // generic layerId
        'add', // operation
        user.userId, // userId
        true, // sendEmail
        true, // sendLog
      );
    layerEditor.axios = mockAxios;
    // Act  
    const objectId=await layerEditor.editFeatures(edits);
    if(objectId){
        layerEditor.operation = 'delete';
        layerEditor.url = 'http://featurelayer-pedidos.com';
        layerEditor.layerId = 1;
        layerEditor.sendLog = true;
        layerEditor.sendEmail = false;
        layerEditor.axios = mockAxios;
        const objectId=await layerEditor.editFeatures(edits);
        expect(objectId).toEqual([1]);
        expect(axios.post).toHaveBeenCalledTimes(1);
    }
    // Assert
    expect(objectId).toEqual([1]);
    expect(axios.post).toHaveBeenCalledTimes(2);  
    
  },30000);

});