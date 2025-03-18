import {Node} from "../node"


export class InlineNote extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Inline Note"
    }
}