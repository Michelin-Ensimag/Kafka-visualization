import {Node} from "../node"


export class StoreVariantV extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Store Variant Versioned"
    }
}