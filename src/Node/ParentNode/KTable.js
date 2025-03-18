import {Node} from "../node"


export class KTable extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "KTable"
    }
}