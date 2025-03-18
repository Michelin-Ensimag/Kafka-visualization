import {Node} from "../node"


export class SubTopology extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Sub-topology";
    }
}