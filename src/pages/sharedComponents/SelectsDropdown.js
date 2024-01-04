import React from 'react';
import { createRoot } from 'react-dom/client';

import "@esri/calcite-components/dist/components/calcite-alert";
import "@esri/calcite-components/dist/components/calcite-shell";


function SelectDropDown({ projects, areas }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <calcite-dropdown width="m">
          <calcite-button slot="trigger">Projeto</calcite-button>
          <calcite-dropdown-group group-title="Projects">
            {projects.map((project, index) => (
              <calcite-dropdown-item key={index}>{project}</calcite-dropdown-item>
            ))}
          </calcite-dropdown-group>
        </calcite-dropdown>
        <calcite-dropdown width="m">
          <calcite-button slot="trigger">Codigo de area</calcite-button>
          <calcite-dropdown-group group-title="Area Codes">
            {areas.map((area, index) => (
              <calcite-dropdown-item key={index}>{area}</calcite-dropdown-item>
            ))}
          </calcite-dropdown-group>
        </calcite-dropdown>
      </div>
    </div>
  );
}

export default SelectDropDown;