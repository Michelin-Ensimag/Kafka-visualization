import {Node} from "../node"


export class Split extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "split"
    }
}