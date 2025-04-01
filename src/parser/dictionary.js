import kstdlibJSON from "../assets/kafka-streams-topology-design.json"
import { DefaultNode } from "../Node/ParentNode/DefaultNode.js"

let dictionary = {}

export function generateDictionary(){
    if(Object.keys(dictionary).length === 0){
        
        kstdlibJSON["libraryItems"].forEach(item => {
            dictionary[item["name"]] = item["elements"];
        });
        dictionary["Default"] = DefaultNode;
    }
    return dictionary;
}