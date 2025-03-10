import { TopologicalSorter } from './TopologicalSorter.js';

export function createExcalidrawJSON(startNode) {
    let elements = [];
    const result = TopologicalSorter.topologicalSort(startNode);

    // Grouper les noeuds selon leurs distances
    let nodesByDistance = new Map();
    for (const node of result.sortedNodes) {
        const distance = result.distances.get(node);
        if (!nodesByDistance.has(distance)) {
            nodesByDistance.set(distance, []);
        }
        nodesByDistance.get(distance).push(node);
    }

    // Trier les distances
    let sortedDistances = Array.from(nodesByDistance.keys()).sort((a, b) => a - b);

    // Paramètres de placement
    let baseX = 50;
    let baseY = 50;
    let horizontalSpacing = 150;
    let verticalSpacing = 100;

    // Placer les noeuds
    for (let distance of sortedDistances) {
        let nodesAtDistance = nodesByDistance.get(distance);

        // Pour centrer verticalement quand il y a plusieurs noeuds
        let totalHeight = (nodesAtDistance.length - 1) * verticalSpacing;
        let startY = baseY - totalHeight / 2;

        for (let i = 0; i < nodesAtDistance.length; i++) {
            let current = nodesAtDistance[i];

            let x = baseX + distance * horizontalSpacing;
            let y = startY + i * verticalSpacing;

            current.generateJson(x, y);
        }
    }

    // Créer les flèches
    // for (let node of result.sortedNodes) {
    //     for (let neighbor of node.getNeighbors()) {
    //         // Créer une flèche entre les noeuds
    //         let start = node.getRectangle().middleRight; // Point de départ (middle right du rectangle)
    //         let end = neighbor.getRectangle().middleLeft; // Point d'arrivée (middle left du rectangle)
    //         let arrowElement = ArrowGenerator.createArrowJson(start, end, node.id, neighbor.id);

            // Ajouter la flèche aux boundElements des noeuds
            DAGToExcalidraw.addBoundedElement(node.getJson(), arrowElement);
            DAGToExcalidraw.addBoundedElement(neighbor.getJson(), arrowElement);
            // Ajouter la flèche aux éléments
            elements.push(arrowElement);
        }
    }

    for (let node of result.sortedNodes) {
        for (let obj of node.getAllJsonElements()) {
            elements.push(obj);
        }
    }
    return elements;
}

export function addBoundedElement(nodeElement, arrowElement) {
    if (!nodeElement.boundElements) {
        nodeElement.boundElements = [];
    }
    nodeElement.boundElements.push({
        id: arrowElement.id,
        type: 'arrow'
    });
}

