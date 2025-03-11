import {Node} from "../node"


export class KeyValueRecord extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Key-Value Record"
    }
}