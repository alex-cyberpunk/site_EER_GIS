import React from 'react';
import "@esri/calcite-components/dist/components/calcite-menu";
import "@esri/calcite-components/dist/components/calcite-sheet";
import "@esri/calcite-components/dist/components/calcite-flow";
import { useNavigate } from 'react-router-dom';

function Sheet() {
    const navigate = useNavigate();
  return (
    <div>
            
            <calcite-sheet label="" position="inline-end" display-mode="float" id="example-sheet">
        <calcite-panel closable heading="" id="example-panel">
        
        <calcite-list>
            <calcite-list-item label="Ajuda" description="Duvida sobre como usar a ferramenta? Veja nossos tutoriais." >
                <calcite-action slot="actions-end" icon="question" text="Ajuda"></calcite-action>
            </calcite-list-item>
        </calcite-list>

            <calcite-segmented-control width="full">
            <calcite-segmented-control-item
                checked
                value="Mudar de Conta"
                onClick={() => {
                    localStorage.removeItem('user');
                    navigate("/");
                }}
                ></calcite-segmented-control-item>
                <calcite-segmented-control-item
                value="Sair da Conta"
                onClick={() => {
                    localStorage.removeItem('user');
                    navigate("/");
                }}
                ></calcite-segmented-control-item>
                
                </calcite-segmented-control>
                

        </calcite-panel>
    </calcite-sheet>
    </div>
  );
}

export default Sheet;

/*<calcite-list-item label="Fale Conosco" description="Nos relate duvidas , problemas .">
                <calcite-action slot="actions-end" icon="envelope" text="Fale Conosco"></calcite-action>
            </calcite-list-item>*/