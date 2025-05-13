import React, { useRef, useState, useEffect } from "react";
import { Excalidraw, WelcomeScreen } from "@excalidraw/excalidraw";
import { Moon } from "./assets/moon";
import { Sun } from "./assets/sun";
import logo from "./assets/ks-logo.js";
import kstdlibJSON from "./assets/kafka-streams-topology-design.json"
import { convertTopoToGraph } from "./parser/parser.js";
import { createExcalidrawJSON } from "./parser/DAGToExcalidraw.js";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
const App = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [text, setText] = useState('');
  const [excalidrawLibrary] = useState(null);
  const [checkedTopo, setCheckedTopo] = useState(true);
  const [checkedSubTopo, setCheckedSubTopo] = useState(true);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.body.style.backgroundColor = "#000000"
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  const onSubmit = (event) => {
    event.preventDefault();
    let start=Date.now();
    let topos = convertTopoToGraph(text);
    let elements = createExcalidrawJSON(topos, checkedTopo, checkedSubTopo);
    let sceneData = {
      elements,
      appState: {
        viewBackgroundColor: "#ffffff",
      },
      libraryItems: excalidrawLibrary
    };
    excalidrawAPI.resetScene();
    excalidrawAPI.updateScene(sceneData);
    console.log(Date.now()-start);
  };

  let firstClick = true;
  const removeLogo = () => {
    let newElements = excalidrawAPI.getSceneElements()
    if (firstClick && newElements[14].type == "text" && newElements[14].text == "STD-VISUALIZATION") {
      excalidrawAPI.resetScene();
      firstClick = false;
    }
  }
  
  return (
    <div className="flex flex-col w-full flex-grow h-full bg-white dark:bg-[#161616] md:flex-row" >
      <div className="flex-1 p-8 border-r flex flex-col gap-2 max-h-[40vh] md:max-h-[100vh] h-[40vh] md:h-auto">
        <h1 className="text-xl dark:text-white"> KAFKA STREAM VISUALIZATION</h1>
        <p className="mt-4 dark:text-white">Enter kafka topology .describe() : </p>
        <textarea id="topo"
          className="flex h-[40vh] md:h-auto md:min-h-[20vh] md:max-h-[60vh] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
        dark:text-white resize-none md:resize-y"  placeholder="Paste your kafka topology here"
          onChange={(e) => setText(e.target.value)}
          value={text}
        >
        </textarea>
        <button className="border dark:text-white hover:dark:bg-gray-800 p-1 rounded-md cursor-pointer hover:bg-gray-100" onClick={onSubmit}>
          Update Scene
        </button>
        <div className="flex items-center">
          <Checkbox id="showTopo" className="mr-2" defaultChecked onCheckedChange={setCheckedTopo}/>
          <label htmlFor="showTopo" className="text-sm dark:text-white">Draw Topologie background</label>
          <Checkbox id="showSubTopo" className="mr-2" defaultChecked onCheckedChange={setCheckedSubTopo}/>
          <label htmlFor="showSubTopo" className="text-sm dark:text-white">Draw Sub-Topologies background</label>
        </div>

        <div className="flex items-center">

          <button className="border p-1 mr-2 dark:text-white hover:dark:bg-gray-800 rounded-md cursor-pointer hover:bg-gray-100" onClick={toggleTheme} >
            {theme === "light" ? <Sun width="18" height="18" /> : <Moon width="18" height="18 " />}
          </button>
          <AlertDialog>
            <AlertDialogTrigger className={"cursor-pointer"} variant={theme} asChild>
              <Button className={"border cursor-pointer"} variant={theme}>View More</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>We are happy to share to you this new tool</AlertDialogTitle>
                <AlertDialogDescription>
                  The idea of the project was imagined by <a className="underline text-blue-500" href="https://blogit.michelin.io/">Michelin</a> and developped by <a className="underline text-blue-500" href="">Ensimag</a> students.
                  Indeed before this tool, the kafka topologies were hard to visualize (<a className="underline text-blue-500" href="https://github.com/zz85/kafka-streams-viz/">zz85</a> ;-) )  and we wanted to make it easier for you.
                </AlertDialogDescription>
                <AlertDialogTitle>Open Source</AlertDialogTitle>
                <AlertDialogDescription>
                  Like the new Michelin Policy we like to work for a better society. This tool is open source and you can find it on <a className="underline text-blue-500" href="https://github.com/Michelin-Ensimag/Kafka-visualization">Github</a> under the Apache 2.0 License.
                </AlertDialogDescription>
                <AlertDialogTitle>Developpers</AlertDialogTitle>
                <AlertDialogDescription>
                  <a className="underline text-blue-500" href="https://euzeby.com/">R4ph3uz</a>, <a className="underline text-blue-500" href="https://github.com/Ashilion">Hugo</a>, Raphael, <a className="underline text-blue-500" href="https://github.com/dydyhg">Dylan</a>.
                  Special Thanks for <span className="font-semibold"> Sebastien Viale</span> from Michelin.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>


      <div className="h-[60vh] w-[100vw] md:h-[100vh] md:w-[80vw]" onClick={removeLogo}>

        <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)} theme={theme} initialData={{
          elements: logo,
          libraryItems: [{
            "status": "published",
            "elements": logo,
            "id": "lW5TH_vxqSiJaRi-f0u_y",
            "created": 1743110086,
            "name": "Ks-Logo"
          }, ...kstdlibJSON["libraryItems"]]
        }}>
        </Excalidraw>
      </div>
    </div>
  );
}
export default App;
