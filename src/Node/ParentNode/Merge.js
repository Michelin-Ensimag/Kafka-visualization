import {Node} from "../node"


export class Merge extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "merge"
    }
}