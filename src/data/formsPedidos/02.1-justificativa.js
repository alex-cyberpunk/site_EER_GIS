import  {retornaListAreaCode} from '../Consultas.js' 
import * as projection from "@arcgis/core/geometry/projection.js";
import {findIntersect} from '../mapaPedidos/verify_intersect.js'
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";


async function verifyAprovacao(polygonGraphics, update, portal) {
  let outSpatialReference = new SpatialReference({
    wkid: 102100
  });

  const promises = polygonGraphics.map(async graphic => {
    const projectedGeometry = projection.project(graphic.geometry, outSpatialReference);
    graphic.geometry = projectedGeometry;

    //Faz Intersect com buffers solares e eolicos
    const [featureData1, featureData2] = await Promise.all([
      retornaListAreaCode(portal, true, update.Projeto, 1),
      retornaListAreaCode(portal, true, update.Projeto, 2)
    ]);

    const intersectPromises = [];

    if (featureData1.length > 0) {
      intersectPromises.push(findIntersect(graphic.geometry, featureData1, 'linha_code'));
    }
    if (featureData2.length > 0) {
      intersectPromises.push(findIntersect(graphic.geometry, featureData2, 'linha_code'));
    }

    if (intersectPromises.length === 0) {
      return false;
    } else {
      const results = await Promise.all(intersectPromises);
      return results.some(result => result.length > 0);
    }
  });

  const results = await Promise.all(promises);
  return results.some(result => result);
}



export { verifyAprovacao};