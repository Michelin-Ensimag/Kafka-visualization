import {Node} from "../node"


export class MarkerSuccess extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Marker Success"
    }
}