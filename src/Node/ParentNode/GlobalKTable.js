import {Node} from "../node"


export class GlobalKTable extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "GlobalKTable"
    }
}