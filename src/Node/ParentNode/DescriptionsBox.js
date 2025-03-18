import {Node} from "../node"


export class DescriptionsBox extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Descriptions box"
    }
}