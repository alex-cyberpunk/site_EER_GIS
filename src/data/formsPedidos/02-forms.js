import FeatureForm from "@arcgis/core/widgets/FeatureForm.js"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import Portal from "@arcgis/core/portal/Portal.js";
import  {returnProjetos,retornaListAreaCode,returnEditFeatures} from '../../Consultas.js' 
import {convertKmlToGeoJson,convert2D} from './01-convert-kmz-data.js'
function verify_updates(){
  /*
            // Loop through updated attributes and assign
            // the updated values to feature attributes.
            Object.keys(updated).forEach((name) => {
                editFeature.attributes[name] = updated[name];
            });
    
            // Setup the applyEdits parameter with updates.
            const edits = {
                updateFeatures: [editFeature]
            };
            //applyAttributeUpdates(edits);
            
            */  
    
            /*view.ui.add("update", "top-right");
            view.ui.add("info", {
              position: "top-left",
              index: 1
            })*/
  // Call FeatureLayer.applyEdits() with specified params.
  function applyAttributeUpdates(params) {
    document.getElementById("btnUpdate").style.cursor = "progress";
    featureLayer
      .applyEdits(params)
      .then((editsResult) => {
        if (editsResult.addFeatureResults.length > 0) {
          const objectId = editsResult.addFeatureResults[0].objectId;
          selectFeature(objectId);
        }
        document.getElementById("btnUpdate").style.cursor = "pointer";
      })
      .catch((error) => {
        console.log("===============================================");
        console.error(
          "[ applyEdits ] FAILURE: ",
          error.code,
          error.name,
          error.message
        );
        console.log("error = ", error);
        document.getElementById("btnUpdate").style.cursor = "pointer";
      });
  }

}

function createpopups(values){
    console.log(values)
    switch(values){
      case Object.keys(values).length === 0:
        alert("Por favor, envie uma propriedade em .kmz que contenha apenas um poligono.");
        return;
      case (!values.Proprietario_principal || !values.Imovel || !values.Projeto || !values.area_code):
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      case( values.Status==='MCD' && !values.Matricula ):
          alert("Caso o status seja Mapeado com Documentos o campo de Matricula deve ser preenchido.");
          return;
      case(!values.justify==='PRECISA DE jusTIfivac'):
      alert("Essa propriedade precisa de uma justificativa.");
      return;
}
}
function hiddeFields(feartureForms,visibleFields,featureLayer){
  featureLayer.when(() => {

    feartureForms.layer.fields.forEach((field) => {
        if (!visibleFields.includes(field.name)) {
          field.visible = false;
        }
      });
    });
}
function lockFieldsTable(featureTable,lockFields,featureLayer,lock){
  featureLayer.when(() => {

      featureTable.layer.fields.forEach((field) => {
          if (lockFields.includes(field.name)) {
            field.editable = lock;
          }
        });
      });
}
function formsType(type,form,featureLayer){
  const portal = new Portal("https://eerpec.maps.arcgis.com");

  returnProjetos(portal,true).then(function (itemInfo) {
    var layerItems = Object.keys(itemInfo); 
    const arrayDeProjetos = layerItems.map(item => ({ name: item, code: item }));
    //Drop-down Projeto
    console.log(arrayDeProjetos)
    form.layer.fields[4].domain.codedValues=arrayDeProjetos        
  });
  switch(type){
    case 'Edicao' || 'Inutilizacao':
      
      let currentProjetoValue = form.getValues().Projeto;
      form.visibleFields=['Projeto','area_code']
      console.log(form.visibleFields)
      hiddeFields(form,form.visibleFields,featureLayer);
      form.on("value-change", function (event) {
      //Drop down area_code
      form.layer.fields[19].domain.codedValues=[]  
      const updatedProjetoValue = form.getValues().Projeto;

      // Verifica se o valor do campo 'Projeto' mudou
      if (currentProjetoValue !== updatedProjetoValue) {
          retornaListAreaCode(portal, false, updatedProjetoValue,3).
          then(function(result){
              var layerItems = result; 
              const arrayDeAreaListCode = layerItems.map(item => ({ name: item, code: item }));
              form.layer.fields[12].domain.codedValues=arrayDeAreaListCode 
          })
          
      }

      // Atualize o valor atual do campo 'Projeto' para o novo valor
      currentProjetoValue = updatedProjetoValue;
      });
    case 'Inclusao':
      form.visibleFields=['Projeto','Proprietario_principal','Imovel','Matricula','Status','Justificativa']
      console.log(form.visibleFields)
      hiddeFields(form,form.visibleFields,featureLayer);
      lockFieldsTable(form,['Justificativa'],featureLayer,false)
      const fileInput = document.getElementById("fileInput");
      let selectedFile = null;
      fileInput.addEventListener("change", function (event) {
        // Atualize a variável 'selectedFile' quando um arquivo for selecionado.
        selectedFile = event.target.files[0];
      });
  }

}
function createFomrs(formulario){
      const portal = new Portal("https://eerpec.maps.arcgis.com");
      let highlight, editFeature;

      const featureLayer = new FeatureLayer({
              portalItem: {
                id: formulario.id_mapa_painel_aprovacao
              },
              outFields: ['*']
            });
        featureLayer.load().then(() => {
          // Add a new feature form with grouped fields
          const form = new FeatureForm({
            container: "form",
            //groupDisplay: "sequential", // only display one group at a time
            layer: featureLayer,
            title:"Atualizacao de bases",
            description:"Atualizacao de bases"
          });

        formsType('Inclusao',form,featureLayer)  
        
        // Listen to the feature form's submit event.
        form.on("submit", () => {
            // Grab updated attributes from the form.
            const updated = form.getValues();
            createpopups(updated);

            if (selectedFile) {
                convertKmlToGeoJson(selectedFile)
                .then((geoJsonString) => {
                console.log(geoJsonString)
                if(geoJsonString.features.length==1){
                  coordenadas2D=convert2D(geoJsonString)
                  addEdits=returnEditFeatures(updated,coordenadas2D)
                  if(verifyAprovacao(addEdits.addFeatures)){
                    applyEditsToLayer(addEdits); 
                  }
                  else{
                    createpopups({justify:'PRECISA DE jusTIfivac'})
                    lockFieldsTable(form,['Justificativa'],featureLayer,true)
                  }
      
                }
                else{
                    createpopups({});
                }      
                //document.getElementById("output").innerText = geoJsonString;
                })
                .catch((error) => {
                console.error("Erro na conversão:", error);
                });
                
                console.log("Arquivo selecionado:", selectedFile.name);
            }
            else{
                createpopups({});
            }    
        });
        document.getElementById("btnUpdate").onclick = () => {
          // Fires feature form's submit event.
          form.submit();
        };
        });
          
            
  }
  
  export { createFomrs };