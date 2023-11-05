import Portal from "@arcgis/core/portal/Portal.js";
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";
//import reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import Editor from "@arcgis/core/widgets/Editor.js";

async function initializeSketch(view) {
      const editor = new Editor({
        view: view
      });
  
      // Add the widget to the view
      view.ui.add(editor, "top-right");
  }

async function loadPedidos(view,map){


    let selectedFeature, id,featureLayer;

    // Obtenha a referência ao dropdown e ao botão
    const responsavelDropdown = document.getElementById("responsavelSelect"); // Alterado para "responsavelSelect"
    const filterButton = document.getElementById("filterButton"); // Alterado para "filterButton"
    
    // Ouça o evento de clique no botão "Filtrar"
    filterButton.addEventListener("click", function () {
        // Obtenha o valor selecionado no dropdown
        const selectedResponsavel = responsavelDropdown.value;
        // Verifique se um responsável foi selecionado
        if (selectedResponsavel) {
        // Oculte o seletor de responsável e mostre o mapa
        document.getElementById("filterDiv").style.display = "none"; // Alterado para "filterDiv"
        //document.getElementById("viewDiv").style.display = "block";
    
        loadApp(selectedResponsavel)
        }
    });
    async function loadApp(selectedResponsavel) {
        const graphicsLayer = new GraphicsLayer();
    
    const template_popup = {
    // autocasts as new PopupTemplate()
    title: "{Aprovacao}",
    content: [
    {
    // It is also possible to set the fieldInfos outside of the content
    // directly in the popupTemplate. If no fieldInfos is specifically set
    // in the content, it defaults to whatever may be set within the popupTemplate.
    type: "fields",
    fieldInfos: [
    {
        fieldName: "erro",
        label: "erro"
    },
    {
        fieldName: "Responsavel",
        label: "Responsavel"
    },
    {
        fieldName: "TipodeOperacaonabase",
        label: "Tipo de Operacao"
    },
    {
        fieldName: "Aprovacao",
        label: "Aprovacao"
    },
    {
        fieldName: "Estornado",
        label: "Estornado"
    }
    ]
    }
    ]
    };     
    //view.ui.add(new Legend({ view: view }), "bottom-left");//adiciona legenda
    
    // inicializa o feature layer
    console.log(selectedResponsavel)
    featureLayer = new FeatureLayer({
    url: "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/Pedidos_TESTE/FeatureServer/0",
    outFields: ["*"],
    title: "Mapa de Pedidos"
    });
    featureLayer.popupTemplate =template_popup
    featureLayer.definitionExpression = `Responsavel = '${selectedResponsavel}'`;//define as linhas que o topografo pode editar
        map.add(featureLayer,0);
        
    // When view is ready, find feature layer and set title and outFields
    view.when(() => {

        // Get references to div elements for toggling table visibility
        const appContainer = document.getElementById("appContainer");
        const tableContainer = document.getElementById("tableContainer");
        const tableDiv = document.getElementById("tableDiv");
    
    // Create FeatureTable
    const featureTable = new FeatureTable({
    view: view, // make sure to pass in view in order for selection to work
    layer: featureLayer,
    multiSortEnabled: true, // set this to true to enable sorting on multiple columns
    editingEnabled: true,
    tableTemplate: {
    // autocast to TableTemplate
    columnTemplates: [
    // takes an array of GroupColumnTemplate and FieldColumnTemplate
    {
    // autocast to GroupColumnTemplate
    type: "group",
    label: "Pedidos",
    columnTemplates: [
        {
        type: "field",
        fieldName: "erro",
        label: "erro"
        },
        {
        type: "field",
        fieldName: "Responsavel",
        label: "Responsavel"
        },
        {
        type: "field",
        fieldName: "TipodeOperacaonabase",
        label: "Tipo de Operacao"
        },
        {
        type: "field",
        fieldName: "Aprovacao",
        label: "Aprovacao"
        },
        {
        type: "field",
        fieldName: "Estornado",
        label: "Estornado"
        }
    ]
    }
    ]
    },
    container: document.getElementById("tableDiv")
    });
    appContainer.removeChild(tableContainer)
    mainDiv.style.display = "block";//adiciona o item de slide a pagina
    // Add toggle visibility slider
    view.ui.add(document.getElementById("mainDiv"), "top-left");
    view.when(() => {
    initializeSketch(view);
    });
    
        // Get reference to div elements
        const checkboxEle = document.getElementById("checkboxId");
        const labelText = document.getElementById("labelText");
    
        // Listen for when toggle is changed, call toggleFeatureTable function
        checkboxEle.onchange = () => {
        toggleFeatureTable();
        };
        
        function toggleFeatureTable() {
         
        if (!checkboxEle.checked) {
            appContainer.removeChild(tableContainer);
            labelText.innerHTML = "Show feature Table";
            viewDiv.style.bottom = "0%";
            viewDiv.style.height = "100%"; 
 
        } else {
            appContainer.appendChild(tableContainer);
            labelText.innerHTML = "Hide feature Table";
             
            viewDiv.style.bottom = "50%";
            viewDiv.style.height = "50%";
        }
    

        }
    
        // Watch for the popup's visible property. Once it is true, clear the current table selection and select the corresponding table row from the popup
        reactiveUtils.watch(
        () => view.popup.viewModel?.active,
        () => {
            selectedFeature = view.popup.selectedFeature;
            if (selectedFeature !== null && view.popup.visible !== false) {
            featureTable.highlightIds.removeAll();
            featureTable.highlightIds.add(view.popup.selectedFeature.attributes.OBJECTID);
            id = selectedFeature.getObjectId();
            }
        }
        );
        
    });
    }
    
}
export { loadPedidos };