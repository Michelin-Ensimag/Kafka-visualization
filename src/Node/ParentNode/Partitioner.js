import {Node} from "../node"


export class Partitioner extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Partitioner"
    }
}