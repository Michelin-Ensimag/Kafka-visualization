import jsonLibrary from "./assets/kafka-streams-topology-design.json"

export default () => {
    let dictionary = {};
    console.log(jsonLibrary["libraryItems"])
    // Loop through all libraryItems to build the dictionary
    jsonLibrary["libraryItems"].forEach(item => {
      dictionary[item["name"]] = item["elements"];
    });
  
    console.log(dictionary);
    let res = []
    // for(let cle in dictionary){
    //     res.push(...dictionary[cle])
    // }
    let test = dictionary["flatMap"]
    test[5]["baseline"] = 30
    res.push(...test)
    return res;
  };
  