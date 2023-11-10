import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import  {retornaListAreaCode} from '../Consultas.js'
import { callAlert } from "../../pages/sharedComponents/SucessMessage.js"
import axios from 'axios';
import { saveAs } from 'file-saver'
//import {sendMessageWithTemplate} from "../email/sendEmail.js"
function findIntersect(feat, featureData,chave) {
  try {
    const intersectingFeatures = [];
    
    const data =  featureData;
    
    //Nos casos que nao procura interseccoes a prop pode nao ter area_code
    let Geom;
    let area_code_intersect,CreationDate_intersect,EditDate_intersect;

    if(chave==='intersections'){
      Geom=feat.geometry
      area_code_intersect=feat.area_code
      CreationDate_intersect=feat.CreationDate
      EditDate_intersect=feat.EditDate
    }
    else{ Geom=feat} //apenas geometria na requisicao

    if (data) {
      //console.log(data)
      data.forEach((feature) => {
        //debugger
          if (geometryEngine.intersect(feature.geometry, Geom)) {
            switch(chave){
              case 'linha_code':
                intersectingFeatures.push({
                  linha_code: feature.linha_code,
                });
                //console.log(intersectingFeatures)
              break;  
              case 'area_code':
                intersectingFeatures.push({
                  area_code: feature.area_code,
                });
              case 'intersections':
                if(feature.area_code!==area_code_intersect){
                  let intersection=geometryEngine.intersect(feature.geometry, Geom)
                  let area = geometryEngine.planarArea(intersection, "hectares");
                  if(area>2)
                    intersectingFeatures.push({
                      area_code_intersect:area_code_intersect,
                      CreationDate_intersect:CreationDate_intersect,
                      EditDate_intersect:EditDate_intersect,
                      area_code: feature.area_code,
                      CreationDate:feature.CreationDate,
                      EditDate:feature.EditDate
                    });  
                  }
                  //debugger  
                break;    
              
            }            
          }
        
        
      });
    }
    
    return intersectingFeatures;
  } catch (error) {
    console.error('Ocorreu um erro ao resolver a promise:', error);
    console.log("Verifique se não há erros de topologia no seu polígono");
    return [];
  }
}


// Função para limpar mensagens
function clearMessage(outputMessages) {
  outputMessages.innerHTML = ''; // Define o conteúdo como vazio para remover todas as mensagens
}

function displayMessage_old(info,outputMessages) {
  const Graphic = {
    popupTemplate: {
      content: info
    }
  };
  outputMessages.graphic=Graphic;
  console.log(outputMessages)
}
function displayMessage(info,idElement,tipoAlerta) {
  callAlert(info,idElement,tipoAlerta)
}

async function retornaNovaAreaCode(props, projeto) {
  let maxNumber = 0;

  // Itera sobre os objetos no JSON
  for (const obj of props) {
      if (obj.area_code && typeof obj.area_code === 'string') {
          // Extrai o número da área do código (assumindo que o número está no final)
          const matches = obj.area_code.match(/\d+$/);
          if (matches) {
              const number = parseInt(matches[0], 10);
              if (!isNaN(number) && number > maxNumber) {
                  maxNumber = number;
              }
          }
      }
  }

  // Incrementa o maior número encontrado
  maxNumber++;

  // Formate o número para ter 4 dígitos (preenchendo com zeros à esquerda)
  const formattedNumber = maxNumber.toString().padStart(4, '0');

  // Crie o novo código
  const newAreaCode = `PROP-${projeto}-${formattedNumber}`;

  return newAreaCode;
}

function printIntersection(layer,portal){
  
  layer.on("edits", function (event) {
    //displayMessage('Aguardando a analise de interseccao com outras propriedades...',feature);
      if (event.updatedFeatures.length > 0) {
          const objectIds = [];
          event.updatedFeatures.forEach((item) => { 
                           
              objectIds.push(item.objectId);
          });
          //displayMessage(objectIds)
          layer
          .queryFeatures({
              objectIds: objectIds,
              returnGeometry: true,
              outFields: ["*"]
          })
          .then((results) => {
              const geometryFeature = results.features[0].geometry; // Isso obtém o ID da feature
              const nomeProjeto=results.features[0].attributes.Projeto;
              const area_code=results.features[0].attributes.area_code
              console.log(results.features[0].attributes)
              retornaListAreaCode(portal, true, nomeProjeto,3).then((props)=>{
                const results = findIntersect(geometryFeature, props, 'area_code');
                if(results.length>0){
                  var string =`Intersecta a(s) propriedade(s) de ${nomeProjeto}:\n`;
                    results.forEach((itemIntersect, index) => {
                        console.log(itemIntersect);
                        string = string.concat(`${itemIntersect.area_code};`)
                        });
                        displayMessage(string,'Alert','Warning');
                }
                else{
                  if(!area_code){
                    retornaNovaAreaCode(props,nomeProjeto).then((newAreaCode)=>{
                      displayMessage(` Propriedade ${newAreaCode} adicionada em ${nomeProjeto}`,'Alert','Sucess');
                      axios.post('http://localhost:3002/enviarEmail', {values:{area_code:newAreaCode,Projeto:nomeProjeto},userId:2,key:"areaAprovadaTopografia"})
                          .then(teste => {
                            console.log(teste)
                          }) 
                      /*
                      sendMessageWithTemplate("areaAprovadaTopografia",
                        {
                          numPedido: "12345",
                          Projeto: nomeProjeto,
                          responsavelTopografia: "Bruno Paiva",
                          area_code:newAreaCode
                        })
                      */
                      
                    })
                  }
                  else{
                    displayMessage(` Propriedade ${results.features[0].attributes.area_code} adicionada em ${nomeProjeto}  `,'Alert','Sucess');
                    /*
                    sendMessageWithTemplate("areaAprovadaTopografia",
                        {
                          numPedido: "12345",
                          Projeto: nomeProjeto,
                          responsavelTopografia: "Bruno Paiva",
                          area_code:results.features[0].attributes.area_code
                        })
                    */
                    
                  }
                  
                }    
            
                      
              })
              
          });
          
              
          
        }
    });
    
}

function verificaIntersections(portal) {

  function convertToDate(timestamp){
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

  async function findIntersections(projetos) {
    let intersectingFeatures = [];

    for (let nomeProjeto of projetos) {
      console.log(nomeProjeto);
      const props = await retornaListAreaCode(portal, true, nomeProjeto, 3,true);

      props.forEach((prop) => {
        const results = findIntersect(prop, props, 'intersections');
        if (results.length > 0) {
          results.forEach((itemIntersect, index) => {
            intersectingFeatures.push({
              area_code_intersect:itemIntersect.area_code_intersect,
              CreationDate_intersect:convertToDate(itemIntersect.CreationDate_intersect),
              EditDate_intersect:convertToDate(itemIntersect.EditDate_intersect),
              area_code: itemIntersect.area_code,
              CreationDate:convertToDate(itemIntersect.CreationDate),
              EditDate:convertToDate(itemIntersect.EditDate),
              Projeto:nomeProjeto
            });
          });
        } 
      });
    }

    // Elimina duplicatas
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

  // Certifique-se de que você tenha uma matriz de projetos para passar para findIntersections
  const projetos= ['SSB',
  'CUN',
  'ESV',
  'ALG',
  'PAC',
  'SAL',
  'SAS',
  'SCA',
  'SCR',
  'SDJ',
  'SEC',
  'SGA',
  'SGE',
  'SGO',
  'SGW',
  'SIB',
  'SMA',
  'SPA',
  'SSE',
  'SSV',
  'STE',
  'TDV',
  'SGR',
  'ARN',
  'STA',
  'SCB',
  'OUR',
  'SVD',
  'BJL',
  'SDB',
  'SAG',
  'BXA',
  'BQR']
  findIntersections(projetos)
    .then((intersectingFeatures) => {
      const blob = new Blob([JSON.stringify(intersectingFeatures)], {
        type: 'application/json'
      });

      saveAs(blob, 'interseccoes.json');
    });
}

 

export {printIntersection,findIntersect,verificaIntersections};