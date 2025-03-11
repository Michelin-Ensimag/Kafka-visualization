import {Node} from "../node"


export class KVRecordTypes extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Key-Value Record Typed"
    }
}