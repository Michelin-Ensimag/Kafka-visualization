import {Node} from "../node"


export class StoreAttributeL extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Store Attribute Logged"
    }
}