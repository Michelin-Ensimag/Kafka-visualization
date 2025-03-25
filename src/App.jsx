import React, { useRef, useState, useEffect } from "react";
import { Excalidraw, WelcomeScreen } from "@excalidraw/excalidraw";
import { Moon } from "./assets/moon";
import { Sun } from "./assets/sun";
import ExcalidrawLogo from "./assets/ks-logo.jsx";
import kstdlibJSON from "./assets/kafka-streams-topology-design.json"
import { convertTopoToGraph } from "./parser/parser.js";
import { createExcalidrawJSON } from "./parser/DAGToExcalidraw.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button"

const App = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [text, setText] = useState('');
  const [excalidrawLibrary] = useState(null);

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
    console.log('onSubmit', text);
    let topos = convertTopoToGraph(text);
    console.log("convert topo", topos);
    let elements = createExcalidrawJSON(topos)
    console.log("json", elements);
    let sceneData = {
      elements,
      appState: {
        viewBackgroundColor: "#ffffff",
      },
      libraryItems: excalidrawLibrary
    };
    excalidrawAPI.resetScene();
    excalidrawAPI.updateScene(sceneData);
  };

  const handlePaste = (event) => {
    console.log('onPaste', text);
    convertTopoToGraph(text);
  };

  return (
    <div className="flex flex-col w-full flex-grow h-full bg-white dark:bg-[#161616] md:flex-row" >
      <div className="flex-1 p-8 border-r flex flex-col gap-2 max-h-[40vh] md:max-h-[100vh] h-[40vh] md:h-auto">
        <h1 className="text-xl dark:text-white"> KAFKA VISUALISATION</h1>
        <p className="mt-4 dark:text-white">Enter kafka topology : </p>
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
        <div>

          <button className="border p-1 dark:text-white hover:dark:bg-gray-800 rounded-md cursor-pointer hover:bg-gray-100" onClick={toggleTheme} >
            {localStorage.theme === "light" ? <Sun width="18" height="18" /> : <Moon width="18" height="18 " />}
          </button>
          <AlertDialog>
            <AlertDialogTrigger><Button>Open</Button> </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>


      <div className="h-[60vh] w-[100vw] md:h-[100vh] md:w-[80vw]">

        <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)} theme={theme} initialData={{ libraryItems: kstdlibJSON["libraryItems"] }}>
          <WelcomeScreen >
            <WelcomeScreen.Center>
              <WelcomeScreen.Center.Logo>
                <ExcalidrawLogo size="large" withText={true} />
              </WelcomeScreen.Center.Logo>
            </WelcomeScreen.Center>
          </WelcomeScreen>
        </Excalidraw>
      </div>
    </div>
  );
}
export default App;
