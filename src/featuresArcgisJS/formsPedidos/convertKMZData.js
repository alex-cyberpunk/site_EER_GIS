import { kml } from "@tmcw/togeojson";


function readFile (){
  
}

function convertKmlToGeoJson(kmlFile) {
    const reader = new FileReader();
  
    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        const xmlStr = event.target.result;
        const geoJson = kml(new DOMParser().parseFromString(xmlStr, "text/xml"));
        resolve(geoJson);
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsText(kmlFile);
    });
  }

 

function convert2D(geojsonkml){
  // para kml ele tem 3 axis
  const coordenadas3D = geojsonkml.features[0].geometry.coordinates;
  console.log(coordenadas3D)
  function converterCoordenadas3DPara2D(coordenadas3D) {
    return coordenadas3D.map(coordenadas => coordenadas.map(coordenada => coordenada.slice(0, 2)));
  }
  
  // Aplicar a conversão
  const coordenadas2D = converterCoordenadas3DPara2D(coordenadas3D);

  return coordenadas2D
}


export { convertKmlToGeoJson ,convert2D};
