import {Node} from "../node"


export class StoretypeLRUC extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Store Type LRUCache"
    }
}