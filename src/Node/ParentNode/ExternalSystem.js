import {Node} from "../node"


export class ExternalSystem extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "External System"
    }
}