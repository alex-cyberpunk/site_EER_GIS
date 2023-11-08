import  {loadLayer,returnProjetos,retornaListAreaCode,returnEditFeatures,applyEditsToLayer,findField,hideFields,lockFieldsTable} from '../Consultas'
import {convertKmlToGeoJson,convert2D} from './convertKMZData.js'
import {verifyAprovacao} from "./flowJustifity.js"
import SucessMessage,{AlertMessage} from '../../pages/sharedComponents/SucessMessage'; // Importe o componente aqui.
import { createRoot } from 'react-dom/client';
//import {sendMessageWithTemplate} from '../email/sendEmail.js' 
import axios from 'axios';


function conditionStatus(values,dropdown,featureTable){
  dropdown.codedValues=[]
  if(!values.Matricula || !values.Contrato){
      dropdown.codedValues=[
      { name: "Contratado com Matrícula Retificada e com Geo INCRA", code: "CMR_INCRA" },
      { name: "Contratado com Matrícula e com Geo INCRA", code: "CM_INCRA" },
      { name: "Contratado com Matrícula em nome do proprietário", code: "CM" },
      { name: "Contratado com Matrícula em nome de 3º", code: "CM3" },
      { name: "Regularizado", code: "Regularizado" },
      { name: "Regularizado", code: "Regularizado_PI" },
      { name: "Áreas CTG", code: "Areas_Concorrente" }
  ]
  }
  if(values.Matricula || !values.Contrato){
      dropdown.codedValues=[
          { name: "Mapeado sem documentos", code: "MSD" },
          { name: "Mapeado com documentos", code: "MCD" }
      ]
  }
  if(!values.Matricula || values.Contrato){
      dropdown.codedValues=[
          { name: "Protocolado Corredor de Ventos", code: "Protocolado" },
          { name: "Contratado sem Matrícula", code: "CSM" }
      ]
  }

  featureTable.layer.fields[5].domain=dropdown

}

function callAlert(title){
  const root = createRoot(document.getElementById('sucessMessageContainer'));
  root.render(<AlertMessage Title={title} />  );
  setTimeout(() => {
    if (root.isMounted) {
      root.unmount();
    }
  }, 10000);
}

function createpopups(values,tipo_forms,alertDisplayed) {
  switch(tipo_forms){
    case 'Inclusao':
      console.log(values)
      if (Object.keys(values).length === 0) {
        //alert("Por favor, envie uma propriedade em .kmz que contenha apenas um polígono.");
        callAlert("Por favor, insira informacoes nos campos obrigatorios.")
        return;
      }
    
      if (!values.Proprietario_principal  || !values.Projeto || !values.Status) {
        //alert("Por favor, preencha todos os campos obrigatórios.");
        callAlert("Por favor, preencha todos os campos obrigatórios.")
        return;
      }
    
      if (values.Status === 'MCD' && !values.Matricula) {
        callAlert("Caso o status seja Mapeado com Documentos, o campo de Matrícula deve ser preenchido.");
        return;

      }
      /*
      if (!values.justify || values.justify.trim() === '') {
        alert("Essa propriedade precisa de uma justificativa.");
        return;
      }
      */
      
      break;
    case 'Edicao':
      if (!values.area_code  || !values.Projeto ) {
        callAlert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
      if (Object.keys(values).length === 0) {
        callAlert("Por favor, envie uma propriedade em .kmz que contenha apenas um polígono.");
        return;

      }
      break;
    case 'Inutilizacao':
      //Colocar pergunta antes de submeter a inutilizacao
      if (!values.area_code  || !values.Projeto ) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      } 
      break;
    case 'Base':
      if (!values.Proprietario_principal  || !values.Projeto || !values.area_code ) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }
      break;
    default:
      return;
  }
  
}


function writeAreasCodes(form,portal){
  let currentProjetoValue = form.getValues().Projeto;
      findField(form,'area_code').then((field)=>{
        field.domain.codedValues=[]
      }); 
      console.log(form)
      form.on("value-change", function (event) {
      
      /*
      findField(form,'area_code').then((field)=>{
        field.domain.codedValues=[]
      });
      */  
       
      const updatedProjetoValue = form.getValues().Projeto;

      // Verifica se o valor do campo 'Projeto' mudou
      if (currentProjetoValue !== updatedProjetoValue) {
          retornaListAreaCode(portal, false, updatedProjetoValue,3).
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
function formsType(type,form,user,portal){
  console.log("inicio")
  let projetoInfo;
  returnProjetos(portal,user).then(function (itemInfo) {
    var layerItems = Object.keys(itemInfo); 
    const arrayDeProjetos = layerItems.map(item => ({ name: item, code: item }));
    projetoInfo=itemInfo;
    findField(form,'Projeto').then((field)=>{
      field.domain.codedValues=arrayDeProjetos
    });

  });
  switch(type){
    case 'Edicao': 
    case 'Inutilizacao':
      form.visibleFields=['Projeto','area_code']
      hideFields(form,form.visibleFields);
      writeAreasCodes(form,portal)
      break;
    case 'Base':
      writeAreasCodes(form,portal)
      let currentAreaCodeValue = form.getValues().area_code;
      
      //Exibir campos de meses de acordo com o mes atual
      form.visibleFields=['Projeto','Proprietario_principal','Imovel','Matricula','Status','area_code']
      form.visibleFields.push('Nov','Dez');
      hideFields(form,form.visibleFields);
      let editFeature;

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
function restauraCampos(campoJustificativa,forms,update){
  campoJustificativa.editable=false;
  for (const chave in update) {
    findField(forms,chave).then((field)=>{
      field.value=null;
    }); 
  }

}

function  handleSubmit(selectedFile,form,tipo_forms,portal,appManager){
    const updated = form.getValues();

    //let alertDisplayed = false; 
    createpopups(updated,tipo_forms);

    if (selectedFile) {
        convertKmlToGeoJson(selectedFile)
        .then((geoJsonString) => {
        
        //Verifica se temos apenas uma prop no kmz
        if(geoJsonString.features.length==1){
          console.log("handlesubmit")
          console.log(appManager)
          if(appManager.Mapa.tipoResponsavel.length>0){
            if(appManager.Mapa.tipoResponsavel[0]=='Responsavel_Comercial'){
              updated.Responsavel_Comercial=appManager.Mapa.user
              updated.Responsavel_Topografia='Bruno'
              console.log(updated)
            }
          }
          //converte para 3D->2D
          const coordenadas2D=convert2D(geoJsonString)
          updated.rings=coordenadas2D;
          const addEdits=returnEditFeatures(updated,coordenadas2D)
          
          //Aguarda a execucao da verificacao de interseccao com buffers
          async function verificaEExecuta() {
            const isAprovado = await verifyAprovacao(addEdits.addFeatures, updated, portal);
            let edit;
            findField(form,'Justificativa').then((field)=>{
              edit=field.editable
              console.log(edit)
              //&& updated.Justificativa.length > 0
              if (isAprovado || edit) {
                applyEditsToLayer(addEdits, appManager.Forms.id_mapa_painel_aprovacao);
                /*alert(Propriedade adicionada);*/
                const root = createRoot(document.getElementById('sucessMessageContainer'));
                root.render(<SucessMessage Title={"Area salva no mapa"} />);
                setTimeout(() => {
                  root.unmount(); }, 10000);
                  console.log(appManager.Forms)
                  axios.post('http://localhost:3002/enviarEmail', {values:{},userId:appManager.Forms.userId,key:"areaNovaTopografia"})
                  .then(teste => {
                    console.log(teste)
                  })  
                
                //restauraCampos(field,form,updated)  
                  /*
                  sendMessageWithTemplate("areaNovaTopografia",
                  {
                    numPedido: "12345",
                    responsavelComercial: "Bruno Paiva",
                    responsavelTopografia: "Elyelso Bonfim"
                  })

                  */
                                  //root.unmount();



              } else {
                callAlert("Essa propriedade precisa de uma justificativa para prosseguir");
                lockFieldsTable(form, ['Justificativa'], true);
              }
            });  
          }
          
          verificaEExecuta();
          

        }
        else{
            createpopups({},tipo_forms);
        }      
        //document.getElementById("output").innerText = geoJsonString;
        })
        .catch((error) => {
        console.error("Erro na conversão:", error);
        });
        
        console.log("Arquivo selecionado:", selectedFile.name);
    }
    else{
        createpopups({},tipo_forms);
    }

}
  
  export { handleSubmit,formsType};