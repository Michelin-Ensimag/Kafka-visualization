import {Node} from "../node"


export class Record extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Record"
    }
}