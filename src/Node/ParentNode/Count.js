import {Node} from "../node"


export class Count extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "count"
    }
}