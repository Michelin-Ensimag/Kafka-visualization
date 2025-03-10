import {Node} from "../node"


export class MapValues extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "mapValues"
    }
}