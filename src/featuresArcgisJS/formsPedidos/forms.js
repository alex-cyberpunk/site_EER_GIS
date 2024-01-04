import  {loadLayer,returnProjetos,retornaListAreaCode,returnEditFeatures,applyEditsToLayer,findField,hideFields,lockFieldsTable} from '../Consultas'
import {convertKmlToGeoJson,convert2D} from './convertKMZData.js'
import {verifyAprovacao} from "./flowJustifity.js"
import * as projection from "@arcgis/core/geometry/projection.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
//import {sendMessageWithTemplate} from '../email/sendEmail.js' 
import axios from 'axios';
import { callAlert } from '../../pages/sharedComponents/SucessMessage';

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
//Insere os poligonos no feature layer e notifica os usuarios
function insertPolygon(addEdits,appManager,form,updated,userApp,key,url){
  applyEditsToLayer(addEdits, appManager.formsPedidos.url,0,"add")
      .then((results) => {  
        if (results) { 
          callAlert('Propriedade kml inserida no mapa','Alert','Success');
          axios.post('http://localhost:3002/enviarEmail', 
          {values:{ 
            numPedido:results,
            responsavelTopografia:updated.Responsavel_Topografia,
            responsavelComercial:updated[appManager.formsPedidos.tipoResponsavel]},
            userIds:[userApp.userId],key:key}).
          then(teste => {
            console.log(teste)
            //resgister action in log
            axios.post('http://localhost:3002/logReport',
            {json:{
              userId:userApp.userId,
              userName:userApp.userName,
              featureLayer:"Mapa Pedidos",
              action:"Inserir",
              ObjectID:results,
            }}).
            then(log=>{
              console.log(log)
            })
            restauraCampos(form,results,url,true)
          })
        }
          
      });
}
async function insertEdition(addEdits,appManager,form,updated,userApp){
  let key;
  if(userApp.userType==='Topografia'){
    key = "areaEdicaoTopografia"
  }

  else{key = "areaEdicaoComercial"}
  let url=appManager.formsPedidos.url;
  insertPolygon(addEdits,appManager,form,updated,userApp,key,url)
}
function insertInutilizacao(updatedAreaCodeValue, nomeProjeto, appManager, updated, form, userApp) {
  let addEdits;

  retornaListAreaCode(appManager.Projetos, true, nomeProjeto, 3)
    .then(async (props) => { // Make this function async
      
      for (let key in props) {
        if (props[key].area_code === updatedAreaCodeValue) {
          updated.area_code = props[key].area_code;
          updated.Projeto = nomeProjeto;

          let outSpatialReference = new SpatialReference({
            wkid: 4326
          });
          props[key].geometry = projection.project(props[key].geometry, outSpatialReference)
          
          updated.rings = props[key].geometry.rings;

          addEdits = await returnEditFeatures([updated], null) // Now you can use await here
          
        }
      }
    })
    .then(() => {
      let url = appManager.formsPedidos.url;
      insertPolygon(addEdits, appManager, form, updated, userApp, "areaInutilizacaoTopografia", url)
    });

}

//Aguarda a execucao da verificacao de interseccao com buffers
async function verifyBuffers(projetos,addEdits,updated,appManager,form,userApp) {
  const isAprovado = await verifyAprovacao(addEdits, updated, projetos);
  let edit,key;
  findField(form,'Justificativa').then((field)=>{
    
    const Field=field
    edit=field.editable
    
    if (isAprovado || edit) {
      
      if(edit){
        key="areaNovaResources"
        addEdits[0].attributes.Analise="Resources"
        let url=appManager.formsPedidos.url;
        insertPolygon(addEdits,appManager,form,updated,userApp,key,url)
      }
      else{
        key="areaNovaTopografia"
        addEdits[0].attributes.Analise="Topografia"
        let url=appManager.formsPedidos.url;
        insertPolygon(addEdits,appManager,form,updated,userApp,key,url)
      }          

    } else {
      callAlert("Essa propriedade precisa de uma justificativa para prosseguir",'Alert','Warning');
      lockFieldsTable(form, ['Justificativa'], true);
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

    //Verifica se os campos obrigatorios foram preenchidos
    if(createpopups(updated,tipo_forms)){
        updated.TipodeOperacaonabase=tipo_forms
        //Preenche os campos de responsavel de acordo com o tipo de usuario 
        updated.Responsavel_Topografia=appManager.Projetos[updated.Projeto].Areas.Topografia 
        updated.ID_Responsavel_Topografia=appManager.Projetos[updated.Projeto].Areas.ID_Topografia 
        
        if(userApp.userType==='Comercial Fundiario'){
          updated.Responsavel_Comercial=userApp.userName
          updated.ID_Responsavel_Comercial=userApp.userId
        }
        
        //O campo de inutilizacao nao possui geometria
        if(tipo_forms==='Inutilizacao'){
          //debugger
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
              const coordenadas2D=convert2D(geoJsonString)
              debugger
              updated.rings=coordenadas2D;
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
          else{
            //Caso nao selecione um arquivo para edicao 
            //if(tipo_forms=='Edicao') insertInutilizacao(updated.area_code,updated.Projeto,appManager,updated,form,userApp)
            createpopups({kml:' '},tipo_forms);
          }
        }      
    }
    
    
    

}
  
  export { handleSubmit,
          formsType,
          createpopups,
          insertInutilizacao,
          verifyBuffers,
          insertEdition};