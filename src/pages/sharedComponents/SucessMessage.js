import React from 'react';
import { createRoot } from 'react-dom/client';
import "@esri/calcite-components/dist/components/calcite-alert";
import "@esri/calcite-components/dist/components/calcite-shell";

const roots = new Map();

function callAlert(title, idElement, typeAlert) {
  let root = roots.get(idElement);

  let Component;
  let timeout;

  switch(typeAlert) {
    case 'Warning':
      Component = AlertMessage;
      timeout = 30000;
      break;
    case 'Success':
      Component = SucessMessage;
      timeout = 30000;
      break;
    case 'Waiting':
      Component = WaitingMessage;
      timeout = 30000; // Set the timeout for 'Waiting' type
      break;
    default:
      console.error('Invalid typeAlert');
      return;
  }

  let isUnmounted = false;

  const closeAlert = () => {
    if (root._internalRoot) {
      root.unmount();
    }
  };
  

  if (!root) {
    root = createRoot(document.getElementById(idElement));
    roots.set(idElement, root);
    
  }

  if(root){
    
    if(root._internalRoot){
      closeAlert();
      root = createRoot(document.getElementById(idElement));
      roots.set(idElement, root);
      root.render(<Component Title={title} onClosed={closeAlert}/>);
    }
    else{
      
      root = createRoot(document.getElementById(idElement));
      roots.set(idElement, root);
      root.render(<Component Title={title} onClosed={closeAlert}/>);
    }
  
    const timeoutId = setTimeout(closeAlert, timeout);
  }
  
}
function SucessMessage({Title,onClosed}) {
  console.log(Title)  
  return (
    <div>
            
        <calcite-alert kind="success" open icon="check-layer" onClose={onClosed}>
            <div slot="title">{Title}</div>
        </calcite-alert>
    </div>
  );
}

function AlertMessage({Title,onClosed}) {
  return (
    <div>
            
          <calcite-alert kind="danger"  open icon= "exclamation-mark-triangle" onClose={onClosed}>
          <div slot="title">{Title}</div>
          </calcite-alert>
    </div>
  );
}
 function WaitingMessage({Title,onClosed}) {
  return (
    <div>
          <calcite-alert open icon="clock" scale="l" onClose={onClosed}>
            <div slot="title">{Title}</div>
            <calcite-action scale="l" icon="follow" text="Track" text-enabled slot="actions-end"></calcite-action>
          </calcite-alert>  
    </div>
  );
}
export default SucessMessage;
export { AlertMessage ,callAlert};

/*
<div slot="message">
                Propriedade <b>.kmz</b> foi adicionada no mapa
            </div>

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



*/