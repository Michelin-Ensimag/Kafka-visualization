import {Node} from "../node"


export class Process extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "process"
    }
}