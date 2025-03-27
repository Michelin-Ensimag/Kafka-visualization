import {Node} from "../node"


export class None extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "none"
    }
}