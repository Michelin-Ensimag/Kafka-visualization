import {Node} from "../node"


export class Repartitioned extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "repartitioned"
    }
}