import {Node} from "../node"


export class Join extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "join"
    }
}