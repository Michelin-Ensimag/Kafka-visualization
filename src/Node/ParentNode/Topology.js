import {Node} from "../node"
import kstdlibJSON from "../../assets/kafka-streams-topology-design.json"
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import { generateDictionary } from "@/parser/dictionary";

export class Topology extends Node{
    constructor(label) {
        super(label);
        this.dictionary=`
            {
      "status": "published",
      "elements": [
        {
          "type": "rectangle",
          "version": 3811,
          "versionNonce": 1569308878,
          "index": "b20",
          "isDeleted": false,
          "id": "EFs-2QAaN_FT-bkQ_J-oT",
          "fillStyle": "hachure",
          "strokeWidth": 1,
          "strokeStyle": "dotted",
          "roughness": 1,
          "opacity": 100,
          "angle": 0,
          "x": 626.8121659250137,
          "y": -954.4510270056235,
          "strokeColor": "#1e1e1e",
          "backgroundColor": "#a5d8ff",
          "width": 128.6611521458508,
          "height": 80.20311940181645,
          "seed": 494589070,
          "groupIds": [
            "eOFzIQKKeDpcodThkG8--"
          ],
          "frameId": null,
          "roundness": null,
          "boundElements": [],
          "updated": 1725726737571,
          "link": null,
          "locked": false
        },
        {
          "type": "text",
          "version": 1117,
          "versionNonce": 1770650386,
          "index": "b21",
          "isDeleted": false,
          "id": "yy4fLca8Tmoy2i4tcGEU0",
          "fillStyle": "hachure",
          "strokeWidth": 1,
          "strokeStyle": "dotted",
          "roughness": 1,
          "opacity": 100,
          "angle": 0,
          "x": 691.2594329341009, 
          "y": -947.1882781971253,
          "strokeColor": "#000000",
          "backgroundColor": "#transparent",
          "width": 54.35993957519531,
          "height": 25,
          "seed": 1485640398,
          "groupIds": [
            "eOFzIQKKeDpcodThkG8--"
          ],
          "frameId": null,
          "roundness": null,
          "boundElements": [],
          "updated": 1725726737571,
          "link": null,
          "locked": false,
          "fontSize": 20,
          "fontFamily": 1,
          "text": "sub-0",
          "textAlign": "left",
          "verticalAlign": "top",
          "containerId": null,
          "originalText": "sub-0",
          "autoResize": true,
          "lineHeight": 1.25
        }
      ],
      "id": "So0FniZVbWsmRfnRonS7X",
      "created": 1725727302952,
      "name": "Sub-topology"
    }
          `;
    }

    getName(){
        return "Topology"
    }

    generateJson(xtop, ytop,xbottom,ybottom){
        let start=Date.now();
        let dictionary = generateDictionary();
                
        this.json =  this.updateElementIds( this.repositionElements(dictionary[this.getName()], xtop, ytop,xbottom-xtop,ybottom-ytop));        
        
        let elem = this.json
        if (elem["type"] === "text") {
            elem["baseline"] = elem_temp["baseline"]
        }
        console.log(Date.now()-start);
        console.log(this.json)
        return this.json
            }


    repositionElements(elements, newX, newY,newWidth,newHeight) {
        // Créer une copie profonde du tableau pour éviter de modifier l'original
        const newElements = JSON.parse(JSON.stringify(elements));

        // Si le mode est relatif, calculer le décalage à partir du premier élément
        let offsetX = 0;
        let offsetY = 0;

        if ( newElements.length > 0) {
            // Trouver les coordonnées minimales pour calculer le décalage
            const minX = Math.min(...newElements.map(elem => elem.x || 0));
            const minY = Math.min(...newElements.map(elem => elem.y || 0));

            offsetX = newX - minX;
            offsetY = newY - minY;
        }

        // Repositionner chaque élément
        for (let i = 0; i < newElements.length; i++) {
            const elem = newElements[i];

            if (elem.x !== undefined && elem.y !== undefined) {
                elem.x += offsetX;
                elem.y += offsetY;
            }
                elem.width= newWidth;
                elem.height=newHeight;
        
            if (elem.type =="text"){
                elem.text="Topology";
                elem.originalText="Topology";
                elem.height =25;
                elem.width=150;
            }
        }
        
        return newElements;
    }
}