import {Node} from "../node"


export class API extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "API"
    }
}