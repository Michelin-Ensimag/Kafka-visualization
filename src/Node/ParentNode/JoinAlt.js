import {Node} from "../node"


export class JoinAlt extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "join (alt)"
    }
}