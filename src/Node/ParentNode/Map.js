import {Node} from "../node"


export class Map extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        //console.log("MapValues")
        return "map"
    }
}