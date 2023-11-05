import esriConfig from "@arcgis/core/config.js";
import WebMap from "@arcgis/core/WebMap.js";
import MapView from "@arcgis/core/views/MapView.js";
import Layer from "@arcgis/core/layers/Layer.js";
import PortalItem from "@arcgis/core/portal/PortalItem.js";
import * as intl from "@arcgis/core/intl.js";
import * as promiseUtils from "@arcgis/core/core/promiseUtils.js";
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";
import Portal from "@arcgis/core/portal/Portal.js";
import Expand from "@arcgis/core/widgets/Expand.js";


async function loadProjetos(view,map){
  // pop
  const template_popup = {
    // autocasts as new PopupTemplate()
    title: "{area_code}",
    content: [
    {
      // It is also possible to set the fieldInfos outside of the content
      // directly in the popupTemplate. If no fieldInfos is specifically set
      // in the content, it defaults to whatever may be set within the popupTemplate.
      type: "fields",
      fieldInfos: [
        {
          fieldName: "area_code",
          label: "area_code"
        },
        {
          fieldName: "DOC1",
          label: "DOC1"
        },
        {
          fieldName: "DOC2",
          label: "DOC2"
        }
      ]
    }
    ]
    };

    
    
        /************************************************************
         * Creates a template to display Portal Item Information.
         * Any values enclosed in "{}" will be parsed with properties
         * from an object using the utility method esri/intl::substitute
         ************************************************************/
        const template =
          '<div data-itemid="{id}" class="card block" draggable="true">' +
          '<figure class="card-image-wrap"><img class="card-image" src="{thumbnailUrl}" alt="Card Thumbnail">' +
          '<figcaption class="card-image-caption">{title}</figcaption>' +
          "</figure>" +
          '<div class="card-content">' +
          "<ul>" +
          "<li>Published Date:</li>" +
          "{created}" +
          "<li>Owner:</li>" +
          "{owner}" +
          "</ul>" +
          "</div>" +
          "</div>";
        // Array of Portal Items for Layers!
        /*const layerItems = [
          "f535a6242eca4f6bad8405be9e41aba4", // brewery locations
          "48c86debf28a401c8858d714cf85e859" // accidental deaths
        ];*/
        const layerItems = [
          "0bae5c1c3cbe4b179e9b13a329d9fda5","967a2d2c37c74e26b5b8eb93375cad76","ba9d9059140845f0800876add239877d"
        ];// MUDE O ID DOS FEATURES LAYERS
        /************************************************************
         * Creates a new WebMap instance. A WebMap must reference
         * a PortalItem ID that represents a WebMap saved to
         * arcgis.com or an on-premise portal.
         *
         * To load a WebMap from an on-premise portal, set the portal
         * url with esriConfig.portalUrl.
         ************************************************************/
        
        
        /************************************************************
         * Set the WebMap instance to the map property in a MapView.
         ************************************************************/
        
        const currentYear = new Date().getFullYear();
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 7)// adiciona uma semana pra ter o mesmo passo
        
        // time slider widget initialization
        const timeSlider = new TimeSlider({
          container: "timeSlider",
          view: view,
          timeVisible: true, // show the time stamps on the timeslider
          loop: true,
            fullTimeExtent: {
              start: new Date(currentYear, 0, 1),
              end: currentDate
            },
            playRate: 2000,
            stops: {
              interval: {
                value: 1,
                unit: "weeks"
              }
            }
        });
        
        /************************************************************
         * Wait for the MapView to finish loading and create an array
         * of PortalItems.
         ************************************************************/
        view.when(() => {
          
          const portal = new Portal("https://eerpec.maps.arcgis.com");
          //portal.authMode = "anonymous";
          const portalItems = layerItems.map((itemid) => {
            /************************************************************
             * We want to load the PortalItem right away so that we can
             * read the data, such as "id", "owner", "title", and "created".
             * This does not load the Layer itself, but returns a Promise.
             ************************************************************/
            return new PortalItem({
              id: itemid,
              portal: portal
            }).load();
          });
          /************************************************************
           * Use promiseUtils.eachAlways to wait for all of the
           * PortalItem Promises to complete loading.
           ************************************************************/
          promiseUtils.eachAlways(portalItems).then((items) => {
            /************************************************************
             * Create a DocumentFragment to hold our list elements
             * until we are ready to add them to the page.
             ************************************************************/
            const docFrag = document.createDocumentFragment();
            items.map((result) => {
              const item = result.value;
              /************************************************************
               * Use esri/intl::substitute will create a new string
               * using properties from the PortalItem.
               ************************************************************/
              const card = intl.substitute(template, item);
              /************************************************************
               * Create a "div" element to hold the new string from the
               * template and get the new node from that element to append
               * it to the DocumentFragment.
               ************************************************************/
              const elem = document.createElement("div");
              elem.innerHTML = card;
              // This is a technique to turn a DOM string to a DOM element.
              const target = elem.firstChild;
              docFrag.appendChild(target);
              /************************************************************
               * Listen for the "dragstart" event on the list item.
               ************************************************************/
              target.addEventListener("dragstart", (event) => {
                /************************************************************
                 * Get the data attribute from the element and pass it along
                 * as the data being transferred in the drag event.
                 ************************************************************/
                const id = event.currentTarget.getAttribute("data-itemid");
                event.dataTransfer.setData("text", id);
              });
            });
            /************************************************************
             * Append the list item to the page.
             ************************************************************/
            document.querySelector(".cards-list").appendChild(docFrag);
            /************************************************************
             * Listen for "drop" and "dragover" events on the container
             * of the View.
             ************************************************************/
            
            view.container.addEventListener("dragover", (event) => {
              event.preventDefault();
              /************************************************************
               * On "dragover", you need to specify the dropEffect to drop
               * items to an element while dragging.
               ************************************************************/
              event.dataTransfer.dropEffect = "copy";
            });
            view.container.addEventListener("drop", (event) => {
              event.preventDefault();
              /************************************************************
               * Element has been dropped into container. Get the "id"
               * that was transferred and find it in the item list.
               ************************************************************/
              const id = event.dataTransfer.getData("text");
              const resultItem = items.find((x) => {
                return x.value.id === id;
              });
              const item = resultItem.value;
              /************************************************************
               * If the item is a Layer item, create a Layer using
               * Layer.fromPortalItem.
               ************************************************************/
              if (item && item.isLayer) {
                Layer.fromPortalItem({
                  portalItem: item
                }).then((layer) => {
                  /************************************************************
                   * Add the layer to the map and zoom to its extent.
                   ************************************************************/
                  layer.popupTemplate =template_popup
                  map.add(layer);
                  
                  view.extent = item.extent;
                });
              }
            });
          });
        });
        // Seleciona o botão e o conteúdo do painel
        const toggleButton = document.getElementById("toggleButton");
        const panelContent = document.getElementById("panelContent");

        toggleButton.addEventListener("click", () => {
          // Alterna a visibilidade do painel
          if (panelContent.style.display === "none") {
            panelContent.style.display = "block";
            viewDiv.style.left = "15%"; // Move a visualização 300px para a direita
            tableDiv.style.left = "15%";
            tableDiv.style.width = '85%';
          } else {
            panelContent.style.display = "none";
            viewDiv.style.left = "0"; // Volta a visualização para a posição original
            tableDiv.style.left = "0";
          }
        });
        
        view.ui.add(toggleButton, "bottom-left");
        //view.ui.add(panelContent, "bottom-left");
        
}
    
export { loadProjetos };