import {Node} from "../node"


export class ForEach extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "foreach"
    }
}