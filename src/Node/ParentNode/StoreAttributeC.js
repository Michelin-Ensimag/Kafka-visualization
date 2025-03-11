import {Node} from "../node"


export class StoreAttributeC extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Store Attribute Cached"
    }
}