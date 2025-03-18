import {Node} from "../node"


export class StoretypeRDB extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Store Type RocksDB"
    }
}