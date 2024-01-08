import  {retornaListAreaCode} from '../Consultas'
import * as projection from "@arcgis/core/geometry/projection.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js"; 
import axios from 'axios';
import { callAlert } from '../../pages/sharedComponents/SucessMessage';
import Intersection from '../libs/Intersection.js';
import  convertKmlToGeoJson  from '../libs/convertKMZData.js';
import createFeatureFromJSON from '../libs/createFeatures.js';
import LayerEditor from '../libs/updateData.js';
import FeatureLoader from '../libs/loadFeature.js';


function createpopups(values,tipo_forms) {
  let string;
  
  switch(tipo_forms){
    
    case 'Inclusao':
      if(values.hasOwnProperty('kml')){
        if(values.kml===''){
          string="O KML não deve conter mais de uma propriedade. Por favor, verifique.";
          callAlert(string, 'Alert', 'Warning');
          return;
  
        }
        if(values.kml===' '){
          string="Por favor insira um kml.";
          callAlert(string, 'Alert', 'Warning');
          return;
  
        }
      }
      else {
        if (!values.Projeto) {
          string="Por favor, preencha o campo Projeto.";
          callAlert(string, 'Alert', 'Warning');
          return;
        }
        
        if (!values.hasOwnProperty('Proprietario_principal') || !values.Proprietario_principal) {
          string="Por favor, preencha o campo Proprietario principal.";
          callAlert(string, 'Alert', 'Warning');
          return;
        }
        
        if (!values.hasOwnProperty('Status') || !values.Status) {
          console.log("slmdk cddwdd")
          string="Por favor, preencha o campo Status.";
          callAlert(string, 'Alert', 'Warning');
          return;
        }
        
        if (values.Status === 'MCD' && (!values.hasOwnProperty('Matricula') || !values.Matricula)) {
          string="Caso o status seja Mapeado com Documentos, o campo de Matrícula deve ser preenchido.";
          callAlert(string, 'Alert', 'Warning');
          return;
        }
      }

      
      break;
    case 'Edicao':
      if(values.hasOwnProperty('kml')){
        if(values.kml===''){
          string="O KML não deve conter mais de uma propriedade. Por favor, verifique.";
          callAlert(string, 'Alert', 'Warning');
          return;
  
        }
        if(values.kml===' '){
          string="Por favor insira um kml.";
          callAlert(string, 'Alert', 'Warning');
          return;
  
        }
      }
      else{
        if (!values.Projeto) {
          string="Por favor, preencha o campo Projeto.";
          callAlert(string, 'Alert', 'Warning');
          return;
        }
        if (!values.hasOwnProperty('area_code') || !values.area_code) {
          string="Por favor, preencha o campo Proprietario principal.";
          callAlert(string, 'Alert', 'Warning');
          return;
        }
        
      }
      
      
      break;
    case 'Inutilizacao':
      //Colocar pergunta antes de submeter a inutilizacao
      if (!values.Projeto) {
        string="Por favor, preencha o campo Projeto.";
        callAlert(string, 'Alert', 'Warning');
        return;
      }
      if (!values.hasOwnProperty('area_code') || !values.area_code) {
        string="Por favor, preencha o campo Proprietario principal.";
        callAlert(string, 'Alert', 'Warning');
        return;
      }
      break;
    case 'Base':
      if (!values.Proprietario_principal  || !values.Projeto || !values.area_code ) {
        string="Por favor, preencha todos os campos obrigatórios.";
        callAlert(string, 'Alert', 'Warning');
        return;
      }
      break;
    default:
      return true;
  }
  return true;
  
}
function writeAreasCodes(form,appManager){
  let currentProjetoValue = form.getValues().Projeto;
      findField(form,'area_code').then((field)=>{
        field.domain.codedValues=[]
      }); 
      form.on("value-change", function (event) { 
      const updatedProjetoValue = form.getValues().Projeto;

      // Verifica se o valor do campo 'Projeto' mudou
      if (currentProjetoValue !== updatedProjetoValue) {
        if(updatedProjetoValue)
          retornaListAreaCode(appManager.Projetos, false, updatedProjetoValue,3).
          then(function(result){
              var layerItems = result; 
              const arrayDeAreaListCode = layerItems.map(item => ({ name: item, code: item }));
              findField(form,'area_code').then((field)=>{
                field.domain.codedValues=arrayDeAreaListCode
              });
          })
          
      }

      currentProjetoValue = updatedProjetoValue;
      });
}
function formsType(type,form,appManager){
  let projetoInfo;

    var layerItems = Object.keys(appManager.Projetos); 
    const arrayDeProjetos = layerItems.map(item => ({ name: item, code: item }));
    findField(form,'Projeto').then((field)=>{
      field.domain.codedValues=arrayDeProjetos
    });

  switch(type){
    case 'Edicao': 
    form.visibleFields=['Projeto','area_code']
    hideFields(form,form.visibleFields);
    writeAreasCodes(form,appManager)
    break;
    case 'Inutilizacao':
      form.visibleFields=['Projeto','area_code']
      hideFields(form,form.visibleFields);
      writeAreasCodes(form,appManager)
      break;
    case 'Base':
      
      hideFields(form,form.visibleFields);
      writeAreasCodes(form,appManager)
      
      //Popula formulario
      let editFeature;
      let currentAreaCodeValue = form.getValues().area_code;
      //Atualiza o forms de acordo com o area_code selecionado
      form.on("value-change", function (event) { 
        const updatedAreaCodeValue = form.getValues().area_code;
        if (currentAreaCodeValue !== updatedAreaCodeValue) {
          const parcelQuery = {
            where: `area_code = '${updatedAreaCodeValue}'`,  
            outFields: ["*"],
            returnGeometry: false 
           };
           Object.keys(projetoInfo).forEach(function (key) {
            const id = projetoInfo[key];
            loadLayer(null, id, 3).then((featureLayer)=>{
              featureLayer.queryFeatures(parcelQuery)
              .then((results) => {
                if (results.features.length > 0) {
                  editFeature = results.features[0];
                  editFeature.Projeto=form.getValues().Projeto
                  editFeature.area_code=form.getValues().area_code
                  form.feature = editFeature;
                }
                }); 
            }); 
          });
          currentAreaCodeValue=updatedAreaCodeValue
          
      }
          
        });
      break
    case 'Inclusao':
      form.visibleFields=['Projeto','Proprietario_principal','Imovel','Matricula','Status','Justificativa']
      hideFields(form,form.visibleFields);
      lockFieldsTable(form,['Justificativa'],false)
      
  }

}
function restauraCampos(forms,objectIds,url,campoJustificativa=false){
  if(campoJustificativa){
    findField(forms,'Justificativa').then((field)=>{
      field.editable=false;
    })
  }
  //So como referencia para inserir os campos nulos
  loadLayer(null,url,0).then((layer) => {
    layer
    .queryFeatures({
        objectIds: [objectIds],
        returnGeometry: true,
        outFields: ["*"]
    })
    .then((results) => {
      //So como referencia para inserir os campos nulos
      let editFeature = results.features[0];
      for (const chave in editFeature) {
        editFeature[chave]=null;
      }
      forms.feature = editFeature;
    })
  });
  
  
}
async function insertEdition(addEdits,appManager,form,updated,userApp){
  let key;
  if(userApp.userType==='Topografia'){
    key = "areaEdicaoTopografia"
  }

  else{key = "areaEdicaoComercial"}
  let url=appManager.formsPedidos.url;
  const layerEditorClass = new LayerEditor(
    url, // url
    3, // layerId
    userApp.userId, // userId
    true, // sendEmail
    true, // sendLog
    axios // axios
  );
  layerEditorClass.editFeatures(addEdits, 'update');      
}
function insertInutilizacao(updatedAreaCodeValue, nomeProjeto, appManager, updated, form, userApp) {
  let addEdits;
  retornaListAreaCode(appManager.Projetos[nomeProjeto], true, 3,`area_code = ${updatedAreaCodeValue}`)      
  let url = appManager.formsPedidos.url;
  const layerEditorClass = new LayerEditor(
    appManager.formsPedidos.url, // url
    3, // layerId
    userApp.userId, // userId
    true, // sendEmail
    true, // sendLog
    axios // axios
  );
  layerEditorClass.editFeatures(addEdits, 'add',key);          
}

//Wait the verification of the intersection with teh buffers to insert the feature
async function verifyBuffers(projetos,addEdits,updated,appManager,form,userApp) {
  const intersectClass = new Intersection();
  //kmz has epsg 4326 for default
  const isAprovado = await intersectClass.verifyIntersectProjects(addEdits, appManager.Projetos, [3],'area_code',4326);
  let edit,key;
  const fieldsOperations = new FieldsOperations(form);

  fieldsOperations.findField('Justificativa').then((field)=>{
    
    const Field=field
    edit=field.editable
    
    if (isAprovado || edit) {
      
      key="areaNovaTopografia"
      addEdits[0].attributes.Analise="Topografia"
      let url=appManager.formsPedidos.url;
      const layerEditorClass = new LayerEditor(
        url, // url
        3, // layerId
        userApp.userId, // userId
        true, // sendEmail
        true, // sendLog
        axios // axios
      );
      layerEditorClass.editFeatures(addEdits, 'update',key);  
        

    } else {
      callAlert("Essa propriedade precisa de uma justificativa para prosseguir",'Alert','Warning');
      fieldsOperations.lockFieldsTable(['Justificativa'], true);
    }
  });  
}
function  handleSubmit(selectedFile,form,tipo_forms,userApp,appManager){
    let updated = form.getValues();
    
    // Define a area de Analise de acordo com o tipo de usuario
    if(userApp.userType==='Topografia'){
      updated.Analise='Lider Topografia'
    }
    else{
      updated.Analise='Topografia'
    }

    //Verify if the fields are filled
    if(createpopups(updated,tipo_forms)){

        updated.TipodeOperacaonabase=tipo_forms
        //Every Topograhic user is responsible for one project 
        updated.Responsavel_Topografia=appManager.Projetos[updated.Projeto].Areas.Topografia 
        updated.ID_Responsavel_Topografia=appManager.Projetos[updated.Projeto].Areas.ID_Topografia 
        
        if(userApp.userType==='Comercial Fundiario'){
          updated.Responsavel_Comercial=userApp.userName
          updated.ID_Responsavel_Comercial=userApp.userId
        }
        
        //O campo de inutilizacao nao possui geometria
        if(tipo_forms==='Inutilizacao'){
          insertInutilizacao(updated.area_code,updated.Projeto,appManager,updated,form,userApp)
        }
        else{
          //Vrifica se o arquivo selecionado e um kmz de uma prop so.
          if (selectedFile) {
            convertKmlToGeoJson(selectedFile)
            .then(async(geoJsonString) => {
            
            //Verifica se temos apenas uma prop no kmz
            if(geoJsonString.features.length==1){
              //converte para 3D->2D
              updated.geoemtry=geoJsonString;
              //Cria o objeto de features para inserir no feature layer
              const addEdits=  await returnEditFeatures([updated],coordenadas2D)
              if (tipo_forms==='Inclusao'){
                //Verifica se a prop esta dentro do buffer de aeros ou solar
                verifyBuffers(appManager.Projetos,addEdits,updated,appManager,form,userApp);
              }
                
              else if (tipo_forms==='Edicao'){
                insertEdition(addEdits,appManager,form,updated,userApp)
              }
                  
            }
            else{
                createpopups({kml:''},tipo_forms);
            }      
            })
            }
          else{createpopups({kml:' '},tipo_forms);}
        }      
    }
    
    
    

}
  
  export { handleSubmit,
          formsType,
          createpopups,
          insertInutilizacao,
          verifyBuffers,
          insertEdition};