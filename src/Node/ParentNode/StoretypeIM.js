import {Node} from "../node"


export class StoretypeIM extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Store Type InMemory"
    }
}