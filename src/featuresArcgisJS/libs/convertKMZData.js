import { kml } from "@tmcw/togeojson";



class KmlConverter {
  constructor(kmlFile) {
    this.kmlFile = kmlFile;
    this.reader = new FileReader();
  }

  convertToGeoJson() {
    return new Promise((resolve, reject) => {
      this.reader.onload = (event) => {
        const xmlStr = event.target.result;
        let geoJson = kml(new DOMParser().parseFromString(xmlStr, "text/xml"));
        const coordenadas3D = geoJson.features[0].geometry.coordinates;
        geoJson = coordenadas3D.map(coordenadas => coordenadas.map(coordenada => coordenada.slice(0, 2)));
        resolve(geoJson);
      };

      this.reader.onerror = (error) => {
        reject(error);
      };

      this.reader.readAsText(this.kmlFile);
    });
  }
}

module.exports = KmlConverter;
