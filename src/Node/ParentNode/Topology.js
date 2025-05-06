import {Node} from "../node"
import kstdlibJSON from "../../assets/kafka-streams-topology-design.json"
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import { generateDictionary } from "@/parser/dictionary";

export class Topology extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Topology"
    }

    generateJson(xtop, ytop,xbottom,ybottom){
        let dictionary = generateDictionary();
                
                this.json =  this.updateElementIds( this.repositionElements(dictionary[this.getName()], xtop, ytop,xbottom-xtop,ybottom-ytop));        
                
                let elem = this.json
                if (elem["type"] === "text") {
                    elem["baseline"] = elem_temp["baseline"]
                }
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
                console.log(elem.text, elem.originalText,this.label);
                elem.height =25;
                elem.width=150;
            }
        }
        
        return newElements;
    }
}