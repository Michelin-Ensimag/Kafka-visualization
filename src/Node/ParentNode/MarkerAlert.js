import {Node} from "../node"


export class MarkerAlert extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Marker Alert"
    }
}