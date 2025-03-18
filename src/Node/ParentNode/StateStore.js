import {Node} from "../node"

export class StateStore extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "State Store"
    }

    generateJson(x, y) {
        super.generateJson(x, y);
        for (let i = 0; i < this.json.length; i++) {
            let elem = this.json[i];

            if (elem.type === "text" && elem.text === "store-name") {
                elem.text = this.label;
                elem.originalText = this.label;
            }
        }
    }
}