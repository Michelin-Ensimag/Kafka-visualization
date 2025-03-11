import {Node} from "../node"


export class FlatMap extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "flatMap"
    }
}