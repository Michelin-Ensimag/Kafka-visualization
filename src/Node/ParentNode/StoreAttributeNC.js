import {Node} from "../node"


export class StoreAttributeNC extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Store Attribute Not Cached"
    }
}