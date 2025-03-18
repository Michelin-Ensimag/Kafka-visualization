import {Node} from "../node"


export class RepartitionedAlt extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "repartitioned (alt)"
    }
}