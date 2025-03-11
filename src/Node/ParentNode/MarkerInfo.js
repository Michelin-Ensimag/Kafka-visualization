import {Node} from "../node"


export class MarkerInfo extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Marker Info"
    }
}