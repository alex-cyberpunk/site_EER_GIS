import LayerEditor from  '../../libs//updateData.js'
import axios from 'axios';

jest.mock('axios');

describe('LayerEditor', () => {
  let layerEditor;
  let data;
  let user;
  const applyEdits = jest.fn().mockImplementation((edits) => {
    switch (edits) {
    case editsResult.hasOwnProperty('updateResults'):
      return {
        updateResults: edits.updateFeatures.map((edit, index) => ({
          objectId: index + 1,
          globalId: `globalId${index + 1}`,
          success: true
        })),
      };
    
    case editsResult.hasOwnProperty('addResults'):
      return {
        addResults: edits.addFeatures.map((edit, index) => ({
          objectId: index + 1,
          globalId: `globalId${index + 1}`,
          success: true
        })),
      };
    
    case editsResult.hasOwnProperty('deleteResults'):
      return {
        deleteResults: edits.deleteFeatures.map((edit, index) => ({
          objectId: index + 1,
          globalId: `globalId${index + 1}`,
          success: true
        })),
      };
    default:
      return {
        error: {
            code: 400,
            extendedCode: -2147207418,
            message: "Unable to complete operation.",
            details: [
              "Violated attribute constraint rule. [Error No: -1, ]",
              "Operation rolled back."
            ]
          }
      };
    }  
  });  
  beforeEach(async () => {
    data= await readFile('./src/featuresArcgisJS/__tests__/mocks/userApps/comercialFund.json', 'utf8');
    //usertype Comercial Fundiario
    user = JSON.parse(data);
    //Mock axios
    axios.post.mockReset();
  });


  it('should add polygon to Pedidos, call email with 3 users ids and send an log ', async () => {
    // Arrange
    const edits = [{}]; 
    layerEditor = new LayerEditor(
        edits, // editfeature
        'http://featurelayer-pedidos.com', // generic url 
        1, // generic layerId
        'add', // operation
        user.userId, // userId
        true, // sendEmail
        true, // sendLog
      );
    // Act  
    const objectId=await layerEditor.editFeatures(edits);
    // Assert
    expect(objectId).toEqual([1]);
    expect(axios.post).toHaveBeenCalledTimes(2);
    
  });

  it('should add polygon to project delete from the Pedidos map , call email with 3 users ids and send an log ', async () => {
    // Arrange
    const edits = [{}]; 
    layerEditor = new LayerEditor(
        edits, // editfeature
        'http://featurelayer-projeto.com', // generic url 
        1, // generic layerId
        'add', // operation
        user.userId, // userId
        true, // sendEmail
        true, // sendLog
      );
    // Act  
    const objectId=await layerEditor.editFeatures(edits);
    if(objectId){
        layerEditor.operation = 'delete';
        layerEditor.url = 'http://featurelayer-pedidos.com';
        layerEditor.layerId = 1;
        layerEditor.sendLog = true;
        layerEditor.sendEmail = false;
        const objectId=await layerEditor.editFeatures(edits);
        expect(objectId).toEqual([1]);
        expect(axios.post).toHaveBeenCalledTimes(1);
    }
    // Assert
    expect(objectId).toEqual([1]);
    expect(axios.post).toHaveBeenCalledTimes(2);  
    
  });

});