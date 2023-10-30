import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView"

var mapDiv = document.createElement("div");

const itemID="967a2d2c37c74e26b5b8eb93375cad76" 
const map = new ArcGISMap({
    basemap: "gray-vector"
  });
const view = new MapView({
map:map,
container: mapDiv,
center: [-55.9671, -15.7939], // Coordenadas aproximadas do centro do Brasil
zoom: 4,
//layers: [graphicsLayer],
popup: {
    defaultPopupTemplateEnabled: true,
    dockEnabled: true,
    dockOptions: {
    buttonEnabled: false,
    breakpoint: false
    }
}
});


const adds=[{  "geometry":
    {
    "rings":
    [[[-38.4434538956639,-9.07133705545406],
    [-38.4504496894324,-9.09338394522013],
    [-38.4506663612823,-9.09337374176779],
    [-38.4436549494043,-9.07136514927273],
    [-38.4373119559629,-9.05705946222431],
    [-38.4372886940886,-9.05703825041346],
    [-38.4371137247292,-9.05710154519007],
    [-38.4434538956639,-9.07133705545406]]],
    "spatialReference": { "wkid": 4326 }},
    "attributes":
    {
    "Proprietario_principal":"Teste",
    "Matricula":"1234",
    "Projeto":"SGR",
    "Status":"MSD",
    "Responsavel_Topografia":"Bruno",
    "Responsavel_Comercial":"Comercial Fund - Bruno"
    }
}]

async function returnItemID(){
    return itemID;
}
async function returnMap(){
    return map;
}

async function returnView(){
    return view;
}


module.exports ={returnView,returnItemID}