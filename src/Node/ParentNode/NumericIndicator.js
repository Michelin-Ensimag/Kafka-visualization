import {Node} from "../node"


export class NumericIndicator extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Numeric Indicator"
    }
}