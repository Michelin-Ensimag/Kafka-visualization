import {Node} from "../node"

export class TopicSimple extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Topic Simple"
    }
}