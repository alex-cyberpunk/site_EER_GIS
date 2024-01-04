import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";
import Portal from "@arcgis/core/portal/Portal.js";
import Expand from "@arcgis/core/widgets/Expand.js";
import Feature from "@arcgis/core/widgets/Feature.js";

import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import LayerList from "@arcgis/core/widgets/LayerList";
import Legend from "@arcgis/core/widgets/Legend.js";
import Editor from "@arcgis/core/widgets/Editor.js";
import { printIntersection } from "../verifyIntersect.js";
import Fullscreen from "@arcgis/core/widgets/Fullscreen.js";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion.js";
import {loadShp} from "./widgetUploadSHPS.js";

function fullScreen(view){
  const full = new Fullscreen({
    view: view
  });
  view.ui.add(full, "top-right");
}
function coordinatesConversion(view){
  let ccWidget = new CoordinateConversion({
    view: view
  });
  
  // Adds widget in the bottom left corner of the view
  view.ui.add(ccWidget, "bottom-right");
}
function createLayerList(view){
  const layerList = new LayerList({
    view: view,
    // executes for each ListItem in the LayerList
    //listItemCreatedFunction: defineActions
  });
  let lyrListExpand
  lyrListExpand = new Expand({
    view: view,
    content: layerList,
    icon: "show-multiple-layers-at-a-time"
  });
  view.ui.add(lyrListExpand, "top-right");
}
function addLegend(view){
  const legend = new Expand({
    content: new Legend({
      view: view,
      style: "card" // other styles include 'classic'
    }),
    view: view,
    expanded: true
  });
  view.ui.add(legend, "top-right");
}
function baseMaps(view){
  const basemapGallery = new BasemapGallery({
    view: view,
    container: document.createElement("div")
  });

 
  let  lyrListExpand
  const bgExpand = new Expand({
    view: view,
    content: basemapGallery
  });
  // close the expand whenever a basemap is selected
  basemapGallery.watch("activeBasemap", () => {
    const mobileSize = view.heightBreakpoint === "xsmall" || view.widthBreakpoint === "xsmall";

    if (mobileSize) {
      bgExpand.collapse();
    }
  });
  view.ui.add(bgExpand, "top-right");
}


function infoTip(view){
  const sampleInstructions = document.getElementById("instructions");
  let instructionsExpand = new Expand({
    expandIcon: "question",
    expandTooltip: "How to use this sample",
    expanded: true,
    view: view,
    content: sampleInstructions
  });
  view.ui.add(instructionsExpand, "top-right")
}  
function initializeSketch(view,Layer) {
  /*
  const editor = new Editor({
  view: view,
  //editableItems
  attributeUpdatesEnabled: false,
  addEnabled: false,
  deleteEnabled: false
  });
  console.log("elementos visiveis")
  console.log(editor.visibleElements)
  editor.visibleElements = {
    enabledToggle:true,
    createFeaturesSection: false,
    sketchTooltipControls: false,
    snappingControls: true,
    snappingControlsElements: {
      featureEnabledToggle: false, // removes "Feature to feature" toggle
      layerList: false // removes Snapping layers list
    }
  }
  const snappingControls = new SnappingControls({
    view: view,
    snappingOptions: editor.snappingOptions  // set the Editor's snappingOptions property
  });
  const EditorExpand = new Expand({
    view: view,
    content: editor,
    icon: "edit-geometry",
    expandTooltip: "How to use this sample",
    expanded: true,
    content:
    <b>Instructions</b> <br />
      <b>Click</b> the <b>blue polygon</b> graphic. <br />
      Rotate, scale, move or reshape the graphic. <br />
      <br />
      Update operation can only be completed if the graphic does not intersect
      school buffers and is inside the boundary
      polygon.
  });
  view.ui.add(snappingControls, "top-left"); // adds the SnappingControls widget to the view
  view.ui.add(EditorExpand, "top-right");
  
  const graphicsLayer = new GraphicsLayer();
  let sketch = new Sketch({
    layer: layer,
    view: view
  });

  sketch.visibleElements = {
    createTools: {
      point: true,
      circle: false,
      point:false,
      polyline:true
    },
    selectionTools:{
      "lasso-selection": false
    },
    settingsMenu: false
  }
  const sampleInstructions = document.getElementById("instructions");
  */
  console.log(view.map.layers.title)

  const layerInfos=[]

  view.map.layers.forEach(function(layer){
    if(layer.title === Layer.title){
        layerInfos.push({
          layer: layer,
          enabled: true,
        });
    } else {
      layerInfos.push({
        layer: layer,
        enabled: false,
      });
    }
    });     


  const editor = new Editor({
    view: view,
    layerInfos: layerInfos,
    attributeUpdatesEnabled: false,
    addEnabled: false,
    deleteEnabled: false,
    visibleElements : {
      undoRedoButtons:true,
    }
    });
    console.log("elementos do editor")
    console.log(editor)
  const EditorExpand = new Expand({
    view: view,
    content: editor,
    icon: "edit-geometry"   
  });
 
  view.ui.add(EditorExpand, "top-right");

  return editor;
  
}
function createProjetoBox(view){
  const graphic = {
    popupTemplate: {
      content: "Projeto"
    }
  };
  
  const feature = new Feature({
    graphic: graphic,
    map: view.map,
    spatialReference: view.spatialReference
  });
  view.ui.add(feature, "bottom-left");

  return feature;
}
function mapWidgets(view,layer,appManager,isChecked,userApp){
  createLayerList(view);   
  //addLegend(view);
  baseMaps(view);
  fullScreen(view);
  loadShp(view,view.map,isChecked,userApp,appManager)
  coordinatesConversion(view);
  const feature=createProjetoBox(view);
  let editor = initializeSketch(view,layer);
  if(appManager.mapaPedidos.printIntersect){
    //infoTip(view)
    printIntersection(editor,layer,appManager)
  }
   
   
}

function timeSlider(view){
  const currentYear = new Date().getFullYear();
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 7)// adiciona uma semana pra ter o mesmo passo
        
        // time slider widget initialization
        const timeSlider = new TimeSlider({
          container: "timeSlider",
          view: view,
          timeVisible: true, // show the time stamps on the timeslider
          loop: true,
            fullTimeExtent: {
              start: new Date(currentYear, 0, 1),
              end: currentDate
            },
            playRate: 2000,
            stops: {
              interval: {
                value: 1,
                unit: "weeks"
              }
            }
        });
}

    
export { mapWidgets };