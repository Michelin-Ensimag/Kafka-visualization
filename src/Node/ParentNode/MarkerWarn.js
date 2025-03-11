import {Node} from "../node"


export class MarkerWarn extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Marker Warn"
    }
}