import {Node} from "../node"


export class ProcessValues extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "processValues"
    }
}