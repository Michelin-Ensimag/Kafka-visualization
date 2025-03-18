import {Node} from "../node"

export class TopicAdvanced extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Topic Advanced"
    }

    generateJson(x, y) {
        super.generateJson(x, y);
        for (let i = 0; i < this.json.length; i++) {
            let elem = this.json[i];

            if (elem.type === "text" ) {
                elem.text = this.label;
                elem.originalText = this.label;
            }
        }
    }
}