import {Node} from "../node"

export class TopicDefault extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Topic Default"
    }
}