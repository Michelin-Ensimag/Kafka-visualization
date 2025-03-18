import {Node} from "../node"


export class FlatMapValues extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "flatMapValues"
    }
}