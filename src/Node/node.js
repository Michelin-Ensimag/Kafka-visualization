export class Node {
    constructor(label) {
        this.label = label;
        this.neighbors = new Set();
    }

    addNeighbor(node) {
        this.neighbors.add(node);
    }

    getNeighbors() {
        return Array.from(this.neighbors);
    }
}

export class KStreamSourceNode extends Node {
    constructor(label) {
        super(label);
    }
}