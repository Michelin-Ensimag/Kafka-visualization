import React, { useRef, useState,useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

const App = () =>{
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
          x: 100.50390625,
          y: 93.67578125,
          strokeColor: "#c92a2a",
          backgroundColor: "transparent",
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
        viewBackgroundColor: "#edf2ff",
      },
    };
    excalidrawAPI.updateScene(sceneData);
  };
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  return (
    <div className="flex flex-row w-full" >
      <div>

        <p style={{ fontSize: "16px" }}>Enter kafka topology </p>
        <textarea ></textarea>
        <button className="custom-button" onClick={updateScene}>
          Update Scene
        </button>
      </div>
      <div className="h-[800px] w-[800px]">

        <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)} />
      </div>
    </div>
  );
}
export default App
