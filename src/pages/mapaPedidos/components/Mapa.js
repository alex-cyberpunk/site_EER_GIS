import React,{ useRef,useEffect,useState } from "react";
import { loadMapa} from "../../../featuresArcgisJS/mapaPedidos/index.js";

import './mapaPedidos.css'
function Mapa({ Portal ,view, setView,userApp,appManager,setLoading}) {
  const mapDiv = useRef(null);
  const [lyrLoaded, setLyrLoaded] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    console.log(event.target.checked);
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    if (mapDiv.current && !view) {
        loadMapa(mapDiv.current, Portal,userApp,appManager,isChecked)
        .then((view) => {
          setLyrLoaded(true);
          setView(view);
          //if(view) setLoading(false);
        });
    }
}, [mapDiv, view, lyrLoaded,userApp,isChecked]);

return (
  <div>
  <div id="Alert"></div>
  <div className="mapDiv" ref={mapDiv}></div>
  <div id="mainWindow" style={{backgroundColor: 'white'}}>
    <div>
      <div style={{paddingLeft: '4px'}}>
      <div>
          
        </div>
          <p>Adicione um shapefile zipado ao mapa.</p>
          <p>E possivel adicionar SHPs para visualizacao e como pedidos de Edicao.</p>                
          <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
          <label>Inserir SHP como Props de edicao</label>
          <form encType="multipart/form-data" method="post" id="uploadForm">
          <div className="field">
            <label className="file-upload">
              <input type="file" name="file" id="inFile" />
            </label>
          </div>
        </form>
        <span className="file-upload-status" style={{opacity: 1}} id="upload-status"></span>
        <div id="fileInfo"> </div>
        
      </div>
    </div>
  </div>         
</div>  
);
  }

export default Mapa;


/*
<div id="instructions" class="esri-widget">
      {userApp.userType === 'Topografia'? (
        <div>
          <b>Instruções para aprovar uma área</b><br />
          1. Selecione o item da tabela e dê um zoom nele clicando no canto superior direito da tabela.<br />
          2. Dê zoom no item.<br />
          3. Clique no ícone de lápis. Isso expandirá uma caixa de edição. Clique em "Selecionar."<br />
          4. No modo edição, clique no polígono desejado e modifique como desejar.<br />
          5. Um clique move o polígono, dois cliques permitem mover os pontos.<br />
          6. Clique em "atualizar" e aguarde a mensagem.<br />
          7. Caso a área seja recusada, aparecerão as áreas que intersectam. Caso seja aprovada, será emitido um novo "area_code." e a area sera inserida na base<br />
        </div>
        ) : null}
*/