import {Node} from "../node"


export class Map extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "map"
    }
}