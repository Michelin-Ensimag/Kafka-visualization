import {Node} from "../node"


export class StoreVariantRo extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Store Variant Read-only"
    }
}