import {Node} from "../node"


export class Filter extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "filter"
    }
}