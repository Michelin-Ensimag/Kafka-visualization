import {Node} from "../node"


export class Peek extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "peek"
    }
}