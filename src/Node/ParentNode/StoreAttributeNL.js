import {Node} from "../node"


export class StoreAttributeNL extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Store Attribute Not Logged"
    }
}