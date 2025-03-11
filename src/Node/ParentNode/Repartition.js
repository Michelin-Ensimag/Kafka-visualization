import {Node} from "../node"


export class Repartition extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "repartition"
    }
}