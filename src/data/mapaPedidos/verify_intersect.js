import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import  {returnProjetos,retornaListAreaCode} from '../Consultas.js'
import { callAlert } from "../../components/SucessMessage.js"
import axios from 'axios';

//import {sendMessageWithTemplate} from "../email/sendEmail.js"
function findIntersect(geometry, featureData,chave) {
  try {
    const intersectingFeatures = [];
    
    const data =  featureData;
    
    if (data) {
      console.log(data)
      data.forEach((feature) => {
          if (geometryEngine.intersect(feature.geometry, geometry)) {
            console.log("o feature e :")
            console.log(geometry)
            switch(chave){
              case 'linha_code':
                intersectingFeatures.push({
                  linha_code: feature.linha_code,
                });
                console.log(intersectingFeatures)
              break;  
              case 'area_code':
                intersectingFeatures.push({
                  area_code: feature.area_code,
                });
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
                      axios.post('http://localhost:3001/enviarEmail', {values:{area_code:newAreaCode,Projeto:nomeProjeto},userId:2,key:"areaAprovadaTopografia"})
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
 

export {printIntersection,findIntersect};