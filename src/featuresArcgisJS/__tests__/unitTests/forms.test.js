// Import necessary libraries
import { defineFeature, loadFeature } from 'jest-cucumber';
import fs from 'fs';
import path from 'path';
import  { createpopups } from './forms'; // replace './forms' with the actual path to your forms.js file
import { handleSubmit } from './forms.js';
import { callAlert } from '../../pages/sharedComponents/SucessMessage';

// Mock the callAlert function
jest.mock('../../pages/sharedComponents/SucessMessage', () => ({
  callAlert: jest.fn(),
}));



const createMockFeatureForm = (fields) => {
  return {
    fields: fields,
    getValues: jest.fn(),
  };
};
const painelPedidos = loadFeature('./src/features/frontend/painelPedidos.feature');

// Define the feature
defineFeature(painelPedidos, (test) => {
  test('Formulário de Inclusão', ({ given, when, then,and }) => {
    const userApp = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.', '..', '__files__', 'userApps', 'comercialFund.json'), 'utf8'));
    const appManager = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.', '..', '__files__', 'appManager', 'comercialFund.json'), 'utf8'));
    const SGR = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.', '..', '__files__', 'projeto','SGR.json'), 'utf8'));
    let mockFeatureForm;

    given('que o formulário contem os campos Projeto,Proprietario,Matricula, Status ,Justificativa com apenas o campo Justificativa trancado', () => {
      // Initialize form
      const fields=[
        { name: 'Projeto', editable: true },
        { name: 'Proprietario_Principal', editable: true },
        { name: 'Matricula', editable: true },
        { name: 'Status', editable: true },
        { name: 'Justificativa', editable: false }
      ];
      mockFeatureForm = createMockFeatureForm(fields);
      jest.doMock('@arcgis/core/widgets/FeatureForm', () => {
        return jest.fn(() => mockFeatureForm);
      });
    });

    when('o usuário tenta enviar o formulário sem preencher os campos obrigatórios ou sem enviar um KML válido', () => {
      // Simulate form submission
      // Read the file and parse its contents
      
      mockFeatureForm.getValues.mockReturnValue({
        // Add the properties that you expect to be in the updated object
        Projeto: 'SGR',
        Proprietario_Principal: '',
        Matricula: '',
        Status: '',
      });
   
    });

    then('um alerta deve ser mostrado indicando os campos obrigatórios que devem ser preenchidos com as mensagens de erro Projeto , Proprietario_principal , Status e Matricula', () => {
      handleSubmit('',mockFeatureForm,'Inclusao',userApp,appManager)
      expect(callAlert).toHaveBeenCalledWith('Por favor, preencha o campo Proprietario principal.', "Alert", 'Warning');
    });
    
    when('o usario insere um KML válido se a propriedade está fora dos buffers', () => {
      
    });

    then('o campo Justificativa deve ser desbloqueado e se tornar campo obrigatório', () => {
      // Implement this step
    });

    and('envia uma Justificativa junto pedido a Topografia', () => {
      // Implement this step
    });
    
  });
  
});



