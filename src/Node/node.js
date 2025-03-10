export class Node {
    constructor(label) {
        this.label = label;
        this.neighbors = new Set();
        this.json = {};
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

    generateJson(x, y) {
        console.log('generateJson not implemented for this Node');
    }

}

export class KStreamSourceNode extends Node {
    constructor(label) {
        super(label);
    }
}