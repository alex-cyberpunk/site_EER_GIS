import React from 'react';
import { createRoot } from 'react-dom/client';

import "@esri/calcite-components/dist/components/calcite-alert";
import "@esri/calcite-components/dist/components/calcite-shell";

function callAlert(title,idElement,typeAlert){
  const root = createRoot(document.getElementById(idElement));
  if(typeAlert==='Warning'){
    root.render(<AlertMessage Title={title} />  );
    setTimeout(() => {
      if (root.isMounted) {
        root.unmount();
      }
    }, 10000);
  }
  if(typeAlert==='Sucess'){
    root.render(<SucessMessage Title={title} />  );
    setTimeout(() => {
      if (root.isMounted) {
        root.unmount();
      }
    }, 30000);
  }
}

function SucessMessage({Title}) {
  return (
    <div>
            
        <calcite-alert kind="success" open icon="check-layer" label="2010 County Census Report saved">
            <div slot="title">{Title}</div>
            <div slot="message">
                Propriedade <b>.kmz</b> foi adicionada no mapa
            </div>
        </calcite-alert>
    </div>
  );
}

function AlertMessage({Title}) {
  return (
    <div>
            
          <calcite-alert kind="danger"   open icon= "Danger alert">
          <div slot="title">{Title}</div>
          </calcite-alert>
    </div>
  );
}

export default SucessMessage;
export { AlertMessage ,callAlert};