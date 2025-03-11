import {Node} from "../node"


export class KStream extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "KStream"
    }
}