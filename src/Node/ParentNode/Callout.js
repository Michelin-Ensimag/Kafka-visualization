import {Node} from "../node"


export class Callout extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Callout"
    }
}