import {Node} from "../node"


export class Stateful extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "stateful"
    }
}