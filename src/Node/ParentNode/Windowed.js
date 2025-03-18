import {Node} from "../node"


export class Windowed extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "windowed"
    }
}