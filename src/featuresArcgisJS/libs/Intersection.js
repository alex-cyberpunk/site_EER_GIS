/// flowJustify deveria fazer parte dessa classe
import  {queryFeature} from '../Consultas.js' 
import FeatureLoader from "./loadFeature.js";
import * as projection from "@arcgis/core/geometry/projection.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import { callAlert } from '../../pages/sharedComponents/SucessMessage.js';


class Intersection {
  constructor(GeometryEngine=geometryEngine) {
    if(GeometryEngine){
      this.geometryEngine = GeometryEngine;
    }
  }
  //Convert date to string for fields in date format
  async #convertToDate(timestamp){
    const data = new Date(timestamp);

    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const hora = data.getHours().toString().padStart(2, '0');
    const minuto = data.getMinutes().toString().padStart(2, '0');
    const segundo = data.getSeconds().toString().padStart(2, '0');

    const dataFormatada = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
    return dataFormatada;
  }
  /**
   * Verifica se uma geometria intersecta com um Conjunto de geometrias 1->N
   * Retornando as geometrias que intersectam com area e as chaves que foram passadas
   * @param {object} featureData - Array de geometrias no formato feature Layer (attributes, geometry)
   * @param {object} feat - Geometria no formato feature Layer (attributes, geometry)
   * @param {Array} chaves - Chaves de feat
   * @param {Array} chavesIntersect - Chaves de featureData
  */
  async verifyIntersect1ToN(feat, featureData, chaves = null, chavesIntersect = null) {
    // feat é 1
    // featureData é N
    try {
      const intersectingFeatures = [];

      const data = featureData;
      // Nos casos que nao procura interseccoes a prop pode nao ter area_code
      let Geom;
      if (data) {
        //console.log("data", data);
        data.forEach(async(feature) => {
          let intersection =  this.geometryEngine.intersect(feature.geometry, feat.geometry);
          if(feature.attributes.area_code==="PROP-SGR-0058") 
          {
            const geom=feature.geometry;

            console.log("intersection", intersection)};
          if (intersection) {
            let area = this.geometryEngine.planarArea(intersection, "hectares");
            let attributes = {};
            for (let key of chaves) {
              if (feat.attributes.hasOwnProperty(key)) {
                attributes[key] = feat.attributes[key];
              }
            }
            let variable;
            for (let keyIntersect of chavesIntersect) {
              if (feature.attributes.hasOwnProperty(keyIntersect)) {
                if (chaves.includes(keyIntersect)) variable = `${keyIntersect}_intersect`;
                else variable = keyIntersect;
                attributes[variable] = feature.attributes[keyIntersect];
              }
            }
            attributes.areaPlanar = area;
            intersectingFeatures.push(attributes);
          }
        });
      }

      return intersectingFeatures;
    } catch (error) {
      console.error("Ocorreu um erro ao resolver a promise:", error);
      console.log("Verifique se não há erros de topologia no seu polígono");
      return [];
    }
  }
  /**
   * Verifica se uma geometria intersecta com um Conjunto de geometrias N->N
   * E necessario um objectId para cada geometria para nao comparar com ela mesma
   * @param {object} props - Geometria no formato feature Layer (attributes, geometry)
   * @param {object} propIntersect - Geometria no formato feature Layer (attributes, geometry)
   * @param {Array} chaves - Chaves de props
   * @param {Array} chavesIntersect - Chaves de propIntersect
  */
  async verifyIntersectNToN(props, propIntersect,  chaves, chavesIntersect) {
    let intersectingFeatures = [];
    let equalfeatures;
    // If the same object, its necessary to eliminate the same object of the feature when analise
    if (propIntersect === props) equalfeatures = true;
    else equalfeatures = false;
    
    props.forEach((prop) => {
      if (equalfeatures) propIntersect = props.filter((item) => item.objectId != prop.objectId);
      const results = this.verifyIntersect1ToN(prop, propIntersect, chaves, chavesIntersect);
      if (results.length > 0) {
        results.forEach((itemIntersect, index) => {
          // Input attrbutes in the key
          let attributes = {};
          for (let chave in itemIntersect) {
            attributes[chave] = itemIntersect[chave];
          }
          intersectingFeatures.push(attributes);
        });
      }
    });
    // If equal , eliminate the same object of the json
    if (equalfeatures) {
      const combinacoesUnicas = new Set();

      const itensNaoDuplicados = [];

      for (const item of intersectingFeatures) {
        const areaCode = item.area_code;
        const areaCodeIntersect = item.area_code_intersect;
        const combinacao1 = `${areaCode}-${areaCodeIntersect}`;
        const combinacao2 = `${areaCodeIntersect}-${areaCode}`;

        // Verifique se ambas as combinações já foram vistas
        if (!combinacoesUnicas[combinacao1] && !combinacoesUnicas[combinacao2]) {
          // Se ambas as combinações não foram vistas, adicione-as ao objeto de combinações únicas e ao array de itens não duplicados
          combinacoesUnicas[combinacao1] = true;
          combinacoesUnicas[combinacao2] = true;
          itensNaoDuplicados.push(item);
        }
      }

      return itensNaoDuplicados;
    }
    return intersectingFeatures;
  }
  /**
   * Verifica se uma geometria intersecta com um Conjunto de geometrias 1->N com os layers dos projetos
   * @param {object} featureData - Array de geometrias no formato feature Layer (attributes, geometry)
   * @param {[object]} polygonGraphics - Array Geometria no formato feature Layer (attributes, geometry)
   * @param {string} urlprojeto - url do projeto
   * @param {Array} layerIds - layerIds do projeto 
   * @param {Array} keyIntersect - Chaves principal do layer
   * @param {number} wkid - wkid da geometria
  */
  async verifyIntersectProjects(feat, urlProjeto, layerIds,keyIntersect,wkid=102100) {
    callAlert(`verificando Interseccao...`, "Alert", "Waiting");
    
    if(wkid!==102100) {
      let outSpatialReference = new SpatialReference({
        wkid: 102100,
      });
      const promises = feat.map(async (graphic) => {
        const projectedGeometry = this.projection.project(graphic.geometry, outSpatialReference);
        graphic.geometry = projectedGeometry;
      });
    }
    
    
    const featureDataPromises = layerIds.map((layerId) => {
      retornaListAreaCode(this.appManager.Projetos[this.projeto].url, true, layerId).
      then(async (propsProjetos) => {
        return propsProjetos
      })
    });
    const featureDataList = await Promise.all(featureDataPromises);

    const intersectPromises = featureDataList
      .filter((featureData) => featureData.length > 0)
      .map((featureData) => this.verifyIntersect1ToN(graphic.geometry, featureData,"numPedido" ,keyIntersect));

    if (intersectPromises.length === 0) {
      return false;
    } else {
      const results = await Promise.all(intersectPromises);
      return results.some((result) => result.length > 0);
    }
  }
  
  
}

export default Intersection;