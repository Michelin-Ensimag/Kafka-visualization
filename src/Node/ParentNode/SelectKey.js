import {Node} from "../node"

export class SelectKey extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "selectKey"
    }
}