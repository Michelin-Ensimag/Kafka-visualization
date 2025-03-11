import {Node} from "../node"


export class Topology extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Topology"
    }
}