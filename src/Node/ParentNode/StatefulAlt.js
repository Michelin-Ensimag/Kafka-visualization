import {Node} from "../node"


export class StatefulAlt extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "stateful (alt)"
    }
}