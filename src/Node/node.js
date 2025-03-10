export class Node {
    constructor(label) {
        this.label = label;
        this.neighbors = new Set();
        this.json = {};
        this.rectangle = {};
    }

    addNeighbor(node) {
        this.neighbors.add(node);
    }

    getNeighbors() {
        return Array.from(this.neighbors);
    }

    getJson() {
        return this.json;
    }

}

export class KStreamSourceNode extends Node {
    constructor(label) {
        super(label);
    }
}