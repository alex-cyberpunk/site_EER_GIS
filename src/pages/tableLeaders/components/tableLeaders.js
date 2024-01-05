import { useRef, useState,useEffect } from 'react';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import FeatureTable from "@arcgis/core/widgets/FeatureTable.js";
import { jwtDecode as jwt_decode } from 'jwt-decode';
import Table from '../../sharedComponents/Table';
import "@esri/calcite-components/dist/calcite/calcite.css";
import "@esri/calcite-components/dist/components/calcite-button";
import "@esri/calcite-components/dist/components/calcite-dropdown";
import "@esri/calcite-components/dist/components/calcite-dropdown-item";
import "@esri/calcite-components/dist/components/calcite-dropdown-group";
import { featureLayerToKML ,featureLayerToSHP} from '../../../featuresArcgisJS/exportData/generateKML';
import {verificaIntersections} from '../../../featuresArcgisJS/verifyIntersect.js';
import './tableLeaders.modules.css';

function TableLeaders({ Projetos ,userApp,appManager}) {
  const [table, setTable] = useState(null);
  const [tableReference, setTableReference] = useState(null);
  const [view,setView] = useState(null);
  const [project, setProject] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [currentKey, setCurrentKey] = useState(0);
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    console.log(selectedValues);
    document.documentElement.style.setProperty('--table-div-top', '12rem'); // replace 'new value' with the value you want
    document.documentElement.style.setProperty('--table-div-left', '0'); 
  }, [project,table,tableReference]);

  const comboboxRef = useRef(null);

  useEffect(() => {
    const combobox = comboboxRef.current;
    const handleComboboxChange = (event) => {
      console.log('handleCombobox called', event);
      const selectedItems = event.detail;
      debugger
    };

    if (combobox) {
      combobox.addEventListener('calciteComboboxChange', handleComboboxChange);
    }

    return () => {
      if (combobox) {
        combobox.removeEventListener('calciteComboboxChange', handleComboboxChange);
      }
    };
  }, []);

  const handleCombobox = (event) => {
    console.log('handleCombobox called', event);
  
    // Get the selected items from the event detail
    const selectedItems = event.detail;
  
    // Map the selected items to their values
    const selectedValues = selectedItems.map(item => item.value);
  
    // Update the state with the new selected values
    setSelectedValues(selectedValues);
  };

  const handleComboboxChange = (projeto,layer) => {
    //Choose the feature layer to display
    let featureLayer=Projetos[projeto]
    featureLayer.layerId=Projetos[projeto][layer].layerId;
    featureLayer.fields=Projetos[projeto][layer].fields;
    featureLayer.visibleFields=Projetos[projeto][layer].visibleFields;
    featureLayer.lockFields=Projetos[projeto][layer].lockFields;
    //debugger
    setProject(featureLayer);
    setProjectName(projeto)
    console.log(Projetos[projeto]);
    setCurrentKey(currentKey + 1);
  };
  
  const exportDataKML = (project,projectName,table) => {
    let visibleColumns = project.Areas.visibleFields
    if(table.grid.columns){
      const columns = table.grid.columns;
      const visibleColumns = Object.values(columns.items)
      .filter(item => !item.hidden)
      .map(item => item.field.name);

      if(table.highlightIds) featureLayerToKML(project,projectName,visibleColumns,table.highlightIds.items);
      else featureLayerToKML(project,projectName,visibleColumns,table);
    
    }
    else {
      if(table.highlightIds) featureLayerToKML(project,projectName,visibleColumns,table.highlightIds.items);
      else featureLayerToKML(project,projectName,visibleColumns,table);
    }
      }

  const exportDataSHP = (project,projectName,table) => {
    console.log(project);
    const token = localStorage.getItem('jwt');
    if(token){
      let decoded = jwt_decode(token);
      
      let visibleColumns = project.Areas.visibleFields
      if(table.grid.columns){
        const columns = table.grid.columns;
        const visibleColumns = Object.values(columns.items)
        .filter(item => !item.hidden)
        .map(item => item.field.name);

        if(table.highlightIds) featureLayerToSHP(project,projectName,decoded.token,visibleColumns,table.highlightIds.items);
        else featureLayerToSHP(project,projectName,decoded.token,visibleColumns);
      }
      else {
        if(table.highlightIds) featureLayerToSHP(project,projectName,decoded.token,visibleColumns,table.highlightIds.items);
        else featureLayerToSHP(project,projectName,decoded.token,visibleColumns);
      }

      
      
      
    } 
    
  }
  const exportIntersection = (project,projectName,appManager,layerId,layerIdIntersect) => {
    console.log(project);
    const token = localStorage.getItem('jwt');
    if(token){
      let decoded = jwt_decode(token);
      
      verificaIntersections([projectName],appManager,layerId,layerIdIntersect,['aero_code'],['area_code']);
    } 
    
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '800px' }}>

      <calcite-dropdown width="m" style={{ marginRight: '10px' }}>
        <calcite-button slot="trigger" className="custom-button">Projetos</calcite-button>
        <calcite-dropdown-group group-title="Projetos">
          {Object.entries(Projetos).map(([key, projeto]) => (
            <calcite-dropdown-item value={key} onClick={() => handleComboboxChange(key,'Areas')}>
              {key}
            </calcite-dropdown-item>
          ))}
        </calcite-dropdown-group>
      </calcite-dropdown>
      
      <calcite-dropdown width="m" style={{ marginRight: '10px' }}>
        <calcite-button slot="trigger" className="custom-button">Exportar</calcite-button>
        <calcite-dropdown-group group-title="Exportar">
          <calcite-dropdown-item value="KML" onClick={() => exportDataKML(project,projectName,tableReference)}>Exportar para kml</calcite-dropdown-item>
          <calcite-dropdown-item value="SHP" onClick={() => exportDataSHP(project,projectName,tableReference)}>Exportar para shp</calcite-dropdown-item>
        </calcite-dropdown-group>
      </calcite-dropdown>

      <calcite-dropdown width="l" style={{ marginRight: '10px' }}> 
        <calcite-button slot="trigger" className="custom-button">Interseccoes</calcite-button>
        <calcite-dropdown-group group-title="Interseccoes">
          <calcite-dropdown-item value="0" onClick={() => exportIntersection(project,projectName,appManager,0,3)}>Aeros vs Areas</calcite-dropdown-item>
          <calcite-dropdown-item value="1" onClick={() => exportIntersection(project,projectName,appManager,0,1)}>Aeros vs BUffers Aeros</calcite-dropdown-item>
          <calcite-dropdown-item value="2" onClick={() => exportIntersection(project,projectName,appManager,3,3)}>Areas vs Areas</calcite-dropdown-item>
          <calcite-dropdown-item value="3" onClick={() => exportIntersection(project,projectName,appManager,3,1)}>Areas vs BUffers Aeros</calcite-dropdown-item>  
          <calcite-dropdown-item value="4" onClick={() => exportIntersection(project,projectName,appManager,3,1)}>Areas vs BUffers Solar</calcite-dropdown-item>    
        </calcite-dropdown-group>
      </calcite-dropdown>

      <calcite-combobox placeholder="Selecione Campos de Interseccao" width="m" 
  style={{ marginRight: '10px' ,width: '600px'}} 
  ref={comboboxRef}>
  
  <calcite-combobox-item-group label="Aeros">
    <calcite-combobox-item value="aero_code" text-label="aero_code"></calcite-combobox-item>
  </calcite-combobox-item-group>

  <calcite-combobox-item-group label="Areas">
    <calcite-combobox-item value="area_code" text-label="area_code"></calcite-combobox-item>
  </calcite-combobox-item-group>

  <calcite-combobox-item-group label="Buffers Aeros">
      <calcite-combobox-item value="linha_code" text-label="buffer_code"></calcite-combobox-item>
  </calcite-combobox-item-group>
  
  <calcite-combobox-item-group label="Buffers Solar">
      <calcite-combobox-item value="linha_code" text-label="buffer_code"></calcite-combobox-item>
  </calcite-combobox-item-group>
</calcite-combobox>          


      </div>
      {project && (
            <Table  view={view}  
                    userApp={userApp} 
                    table={table} 
                    setTable={setTable} 
                    tableLoad={project}
                    key={currentKey}
                    appManager={appManager}
                    justTable={true}
                    setTableReference={setTableReference}/>

            )}
          </div>
  );
      }

export default TableLeaders;


/*
            <calcite-dropdown-item value="Intersection" onClick={() => exportIntersection(project,projectName,appManager)}>Exportar Interseccoes</calcite-dropdown-item>  


      */