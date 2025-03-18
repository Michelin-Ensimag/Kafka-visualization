import {Node} from "../node"


export class KafkaLogo extends Node{
    constructor(label) {
        super(label);
    }

    getName(){
        return "Apache Kafka Logo"
    }
}