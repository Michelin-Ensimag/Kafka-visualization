import {Node} from "../node"


export class ReduceAggregate extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "reduce/aggregate"
    }
}