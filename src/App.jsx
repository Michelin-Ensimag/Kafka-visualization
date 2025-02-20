import React, { useRef, useState,useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { Moon } from "./assets/moon";
import {Sun} from "./assets/sun";
import { kstdLibLocal } from "./assets/kstd-few";


const App = () =>{
  const [kstdLib, setkstdLib] = useState(null);

  function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (obj1 == null || typeof obj1 != "object" ||
      obj2 == null || typeof obj2 != "object")
      return false;

  let keysA = Object.keys(obj1), keysB = Object.keys(obj2);
  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
      if (!keysB.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}


  useEffect(() => {
    // Fetch the JSON file from the public directory
    fetch(`/Kafka-visualization/kafka-streams-topology-design.excalidrawlib`)
      .then((response) => response.json())
      .then((jsonData) => {
        console.log("trouvé : ",jsonData["libraryItems"])
        console.log("interessant : ",kstdLibLocal)
        console.log(Object.prototype.toString.call(jsonData["libraryItems"]));
        console.log(Object.prototype.toString.call(kstdLibLocal));
        console.log(JSON.stringify(kstdLibLocal) === JSON.stringify(jsonData["libraryItems"]));
        console.log(kstdLibLocal == jsonData["libraryItems"])
        console.log("equality array",arraysEqual(kstdLibLocal, jsonData["libraryItems"]))
        console.log("deep",deepEqual(kstdLibLocal, jsonData["libraryItems"]))
        // Store the JSON data in a constant
        setkstdLib(JSON.stringify(jsonData["libraryItems"]));
      })
      .catch((error) => {
        console.error('Error fetching the JSON file:', error);
      });
  }, []);

  const updateScene = () => {
    const sceneData = {
      elements: [
        {
          type: "rectangle",
          version: 141,
          versionNonce: 361174001,
          isDeleted: false,
          id: "oDVXy8D6rom3H1-LLH2-f",
          fillStyle: "hachure",
          strokeWidth: 1,
          strokeStyle: "solid",
          roughness: 1,
          opacity: 100,
          angle: 0,
          x: 200,
          y: 200,
          strokeColor: "#c92a2a",
          backgroundColor: "reds",
          width: 186.47265625,
          height: 141.9765625,
          seed: 1968410350,
          groupIds: [],
          boundElements: null,
          locked: false,
          link: null,
          updated: 1,
          roundness: {
            type: 3,
            value: 32,
          },
          
        },
      ],
      appState: {
        viewBackgroundColor: "#ffffff",
      },
      libraryItems: excalidrawLibrary
    };
    excalidrawAPI.updateScene(sceneData);
  };
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [excalidrawLibrary] = useState(null);

  useEffect(()=>{
      localStorage.setItem('theme',theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.body.style.backgroundColor = "#000000"
  },[theme])

  const toggleTheme = ()=>{
    setTheme(theme === 'light' ? 'dark':'light');
}

  return (
      <div className="flex flex-col w-full flex-grow h-full bg-white dark:bg-[#161616] md:flex-row" >
        <div className="flex-1 p-8 border-r flex flex-col gap-2 max-h-[40vh] md:max-h-[100vh] h-[40vh] md:h-auto">
          <h1 className="text-xl dark:text-white"> KAFKA VISUALISATION</h1>
          <p className="mt-4 dark:text-white">Enter kafka topology : </p>
          <textarea 
            className="flex h-[30vh] md:h-auto md:min-h-[600px] md:max-h-[800px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
            dark:text-white resize-none md:resize-y" >

          </textarea>
          <button className="border dark:text-white hover:dark:bg-gray-800 p-1 rounded-md cursor-pointer hover:bg-gray-100" onClick={updateScene}>
            Update Scene
          </button>
        <div>

          <button className="border p-1 dark:text-white hover:dark:bg-gray-800 rounded-md cursor-pointer hover:bg-gray-100" onClick={toggleTheme} >
            {localStorage.theme==="light"? <Sun width="18" height="18" />:<Moon width="18" height="18 "/> }
            </button>
          </div>
        </div>

        <div className="h-[60vh] w-[100vw] md:h-[100vh] md:w-[80vw]">

          <Excalidraw initialData={{libraryItems: kstdLibLocal}} excalidrawAPI={(api) => setExcalidrawAPI(api)} theme={theme} />
        </div>
      </div>
  );
}
export default App;
