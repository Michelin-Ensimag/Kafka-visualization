import {Node} from "../node"

export class StateStore extends Node{
    constructor(label) {
        super(label);
    }

    isStateStore(){
        return true;
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
                let old_width = elem.width;
                elem.width = elem.originalText.length*10.5;
                elem.x = elem.x-elem.width/2 + old_width/2;
            }
        }
    }
}