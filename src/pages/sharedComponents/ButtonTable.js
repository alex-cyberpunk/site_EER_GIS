import React, { useEffect } from 'react';
import '@esri/calcite-components/dist/components/calcite-button';
import { addPropProjeto ,removePropTable} from '../../featuresArcgisJS/tablePedidos/approveProps';
import { loadLayer } from '../../featuresArcgisJS/Consultas.js';

import './Panel.css';

function ButtonsTable({ userApp, table,setTable, appManager,tableLoad,setTableLoad}) {  
  const handleApprove = (table) => {
    loadLayer(null, tableLoad.url, tableLoad.IdLayer)
      .then((featureLayer) => {
        if (tableLoad.IdLayer===0) addPropProjeto(table, featureLayer, userApp, appManager);
      })      
  }
  const handleDisapprove = (table) => {
    loadLayer(null, tableLoad.url, tableLoad.IdLayer)
      .then((featureLayer) => {
        if (tableLoad.IdLayer===0) removePropTable(table, featureLayer, userApp, appManager);
      })
  }
  const changeTable = (tableLoad) => {
    
    setTable(null)
    return {
      ...tableLoad,
      IdLayer: tableLoad.IdLayer === 0 ? 1 : 0,
    };
  };
  const handleTableChange = (tableLoad) => {
    const newTable = changeTable(tableLoad);
    setTableLoad(newTable);
  };

  return (
    <div className='panel'>
        <calcite-shell-panel slot="panel-start" position="start" id="shell-panel-start">
            <calcite-action-bar slot="action-bar">
            <calcite-action-group>
              <calcite-action text="Mudar Tabela pedidos em andamento/recusados" icon="table" title="Mudar Tabela" onClick={() => handleTableChange(tableLoad)}></calcite-action>
              <calcite-action id="btn" text="Aprovar propriedades" icon="check-circle" title="Aprovar props" onClick={() => handleApprove(table)}></calcite-action>
              <calcite-action id="btnDisapprover" text="Reprovar propriedades" icon="x-circle" title="Reprovar props" onClick={() => handleDisapprove(table)}></calcite-action></calcite-action-group>
            </calcite-action-bar>
        </calcite-shell-panel>
        
            
    </div>
    );
}

export default ButtonsTable;




/*

 <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <calcite-button id="btn" appearance="solid" class="custom-button">Aprovar props</calcite-button>
            <calcite-button id="btnDisapprover" appearance="solid" class="custom-button">Reprovar props</calcite-button>
            <calcite-dropdown width="m">
                <calcite-button slot="trigger">Projetos</calcite-button>
                <calcite-dropdown-group group-title="Projetos">
                {Object.entries(Projetos).map(([key, projeto]) => (
                    <calcite-dropdown-item value={key} onClick={() => handleComboboxChange(key)}>
                    {key}
                    </calcite-dropdown-item>
                ))}
                </calcite-dropdown-group>
            </calcite-dropdown>
        </div>
    
    </div>


*/