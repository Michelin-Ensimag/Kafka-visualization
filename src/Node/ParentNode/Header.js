import {Node} from "../node"


export class Header extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "header"
    }
}