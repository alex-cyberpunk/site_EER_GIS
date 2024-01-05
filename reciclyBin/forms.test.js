describe('createpopups', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it.todo('should call callAlert with correct parameters when kml is empty string', () => {
      createpopups({ kml: '' }, 'Inclusao');
      expect(callAlert).toHaveBeenCalledWith("O KML não deve conter mais de uma propriedade. Por favor, verifique.", 'Alert', 'Warning');
    });
  
    it.todo('should call callAlert with correct parameters when kml is a single space', () => {
      createpopups({ kml: ' ' }, 'Inclusao');
      expect(callAlert).toHaveBeenCalledWith("Por favor insira um kml.", 'Alert', 'Warning');
    });
  
    it.todo('should call callAlert with correct parameters when Projeto is not present', () => {
      createpopups({}, 'Inclusao');
      expect(callAlert).toHaveBeenCalledWith("Por favor, preencha o campo Projeto.", 'Alert', 'Warning');
    });
  
    it.todo('should call callAlert with correct parameters when Proprietario_principal is not present', () => {
      createpopups({ Projeto: 'Projeto' }, 'Inclusao');
      expect(callAlert).toHaveBeenCalledWith("Por favor, preencha o campo Proprietario principal.", 'Alert', 'Warning');
    });
  });
  
  describe('writeAreaCodes', () => {});
  describe('formtypes', () => {
    it.todo('should hide correct fields for Edicao and call writeAreaCodes', () => {});
    it.todo('should hide correct fields for Inutilizacao and call writeAreaCodes', () => {});
  
    it.todo('should hide correct fields for Inclusao and unlock Justicativa', () => {});
    it.todo('should hide correct fields for Base call writeAreaCodes and populate forms', () => {});
  
  });
  
  describe('restaurarForm', () => {
    it.todo('should return forms to the Initial State',()=>{})
  });
  
  describe('Insertions', () => {
    it.todo('should execute insertInutilizacao', () => {
    });
    it.todo('should execute insertEdition', () => {});
       
  })
  
  describe('verifyAprovacao', () => {
    it.todo('should return false for of buffer ', () => {})
    it.todo('should return true for in the buffer ', () => {})
  });
  
  describe('verifyBuffers', () => {});
  
  describe('convert kml to arcgis format', () => {
    it.todo('should convert kml to geojson', () => {});
    it.todo('should convert 3D to 2D', () => {});
  });
  
  // Import the required modules
  // Import the required modules
  import * as forms from './forms'; // Replace with the actual path to forms.js
  import * as convertKMZData from './convertKMZData'; // Replace with the actual path to convertKMZData.js
  import * as Consultas from '../Consultas'; // Replace with the actual path to Consultas.js
  
  // Define the happy path
  describe.todo('handleSubmit', async () => {
    // Create the mock objects
    const selectedFile = 'mockSelectedFile';
    const form = { getValues: jest.fn().mockReturnValue({}) };
    const tipo_forms = 'mockTipoForms';
    const userApp = { userType: 'mockUserType', userName: 'mockUserName', userId: 'mockUserId' };
    const appManager = { Projetos: { mockProjeto: { Areas: { Topografia: 'mockTopografia', ID_Topografia: 'mockIDTopografia' } } } };
  
    // Mock the functions
    jest.spyOn(forms, 'createpopups').mockImplementation(() => true);
    jest.spyOn(forms, 'insertInutilizacao').mockImplementation(() => {});
    jest.spyOn(convertKMZData, 'convertKmlToGeoJson').mockImplementation(() => Promise.resolve({ features: [{}] }));
    jest.spyOn(convertKMZData, 'convert2D').mockImplementation(() => {});
    jest.spyOn(Consultas, 'returnEditFeatures').mockImplementation(() => Promise.resolve({}));
    jest.spyOn(forms, 'verifyBuffers').mockImplementation(() => {});
    jest.spyOn(forms, 'insertEdition').mockImplementation(() => {});
  
    // Call the function with the mock objects
    await forms.handleSubmit.todo(selectedFile, form, tipo_forms, userApp, appManager);
  
    // Add assertions to check if the function behaved as expected
    // For example, you can check if form.getValues was called:
    expect(form.getValues).toHaveBeenCalled();
    // Add more assertions as needed
  });