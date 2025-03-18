import {Node} from "../node"


export class TransformValues extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "transformValues"
    }
}