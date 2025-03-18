import {Node} from "../node"


export class Punctuator extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Punctuator"
    }
}