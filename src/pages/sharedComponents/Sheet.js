import React from 'react';
import "@esri/calcite-components/dist/components/calcite-menu";
import "@esri/calcite-components/dist/components/calcite-sheet";
import "@esri/calcite-components/dist/components/calcite-flow";
import { useNavigate } from 'react-router-dom';
import './Sheet.css';
import logout from '../singUp/action';

function Sheet() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate("/");    
    }
  return (
    <div>
            
            <div className="sheet-container">
            <calcite-sheet label="" position="inline-end" display-mode="float" id="example-sheet">
            <calcite-panel closable heading="" id="example-panel">
                    
                    <calcite-block collapsible heading="Manual do usuario" description="Veja nosssos videos sobre a utilizacao da aplicacao">
                      <calcite-icon scale="s" slot="icon" icon="question"></calcite-icon>
                            
                            <calcite-list>
                    <calcite-list-item label="Manual do Formulario" 
                    description="Veja como usar o formulario para solicitar Inclusoes e Edicoes." 
                    href="http://www.google.com">
                      <calcite-link href="http://www.esri.com">An example link</calcite-link>
                    </calcite-list-item>
                    </calcite-list>
                        </calcite-block>
            <calcite-segmented-control width="full">
                <calcite-segmented-control-item
                value="Sair da Conta"
                onClick={handleLogout}
                ></calcite-segmented-control-item>
                
                </calcite-segmented-control>
                

        </calcite-panel>
    </calcite-sheet>
    </div>
    </div>
  );
}

export default Sheet;

/*<calcite-list-item label="Fale Conosco" description="Nos relate duvidas , problemas .">
                <calcite-action slot="actions-end" icon="envelope" text="Fale Conosco"></calcite-action>
            </calcite-list-item>*/