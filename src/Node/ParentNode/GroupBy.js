import {Node} from "../node"


export class GroupBy extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "groupBy"
    }
}