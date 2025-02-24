import jsonLibrary from "./assets/kafka-streams-topology-design.json"
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

export default () => {
    let dictionary = {};
    console.log(jsonLibrary["libraryItems"])
    // Loop through all libraryItems to build the dictionary
    jsonLibrary["libraryItems"].forEach(item => {
      dictionary[item["name"]] = item["elements"];
    });
    
    console.log(dictionary);
    let res = []
    for(let cle in dictionary){
        
        for(let key in dictionary[cle]){
          let elem = dictionary[cle][key]
          let elem_temp = convertToExcalidrawElements([elem])[0]
          console.log("cle :", elem)
          if(elem["type"]==="text"){
            elem["baseline"] = elem_temp["baseline"]
          }
        }
        res.push(...dictionary[cle])
    }
    // let test = dictionary["flatMap"]
    // test[5] = convertToExcalidrawElements([test[5]])[0]
    // res.push(...test)
    return res;
  };
  