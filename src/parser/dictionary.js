import kstdlibJSON from "../assets/kafka-streams-topology-design.json"
import { DefaultNode } from "../Node/ParentNode/DefaultNode.js"
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
let dictionary = {}

export function generateDictionary(){
    if(Object.keys(dictionary).length === 0){
        
        kstdlibJSON["libraryItems"].forEach(item => {
            dictionary[item["name"]] = item["elements"];
        });
        dictionary["Default"] = DefaultNode;
        for (let cle in dictionary) {
            for (let key in dictionary[cle]) {
                let elem = dictionary[cle][key]
                let elem_temp = convertToExcalidrawElements([elem])[0]
                if (elem["type"] === "text") {
                    elem["baseline"] = elem_temp["baseline"]
                }
            }
        }
    }
    return dictionary;
}