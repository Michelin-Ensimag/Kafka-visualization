import { TopologicalSorter } from './TopologicalSorter.js';
import { ArrowGenerator } from "./ArrowGenerator.js";

export function createExcalidrawJSON(graph) {
    let elements = [];
    const result = TopologicalSorter.topologicalSort(graph);

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
    let horizontalSpacing = 80;
    let verticalSpacing = 100;

    let currentX = baseX;
    // Placer les noeuds
    for (let distance of sortedDistances) {
        let nodesAtDistance = nodesByDistance.get(distance);

        // Pour centrer verticalement quand il y a plusieurs noeuds
        let totalHeight = (nodesAtDistance.length - 1) * verticalSpacing;
        let startY = baseY - totalHeight / 2;

        let maxWidth = 0;

        for (let i = 0; i < nodesAtDistance.length; i++) {
            let current = nodesAtDistance[i];

            let x = currentX;
            let y = startY + i * verticalSpacing;

            current.generateJson(x, y);
            maxWidth = Math.max(maxWidth, current.getElementsWidth());
        }
        currentX += maxWidth + horizontalSpacing;
    }

    // Créer les flèches
    for (let node of result.sortedNodes) {
        for (let neighbor of node.getNeighbors()) {
            // Créer une flèche entre les noeuds
            let arrowsPointsStart = node.getBoundaryPoints();
            let arrowsPointsStop = neighbor.getBoundaryPoints();
            let start = arrowsPointsStart.rightPoint; // Point de départ (middle right du rectangle)
            let end = arrowsPointsStop.leftPoint; // Point d'arrivée (middle left du rectangle)
            
            //console.log("test id")
            //console.log(node.getNodeIdForArrow())
            //console.log(neighbor.getNodeIdForArrow())
            let arrowElement = ArrowGenerator.createArrowJsonWithBindings(start, end, node.getNodeIdForArrow(), neighbor.getNodeIdForArrow());

            // Ajouter la flèche aux boundElements des noeuds
            addBoundedElement(node.getContainerElement(), arrowElement);
            addBoundedElement(neighbor.getContainerElement(), arrowElement);
            // Ajouter la flèche aux éléments
            elements.push(arrowElement);
        }
    }

    for (let node of result.sortedNodes) {
        elements.push(...node.getJson());
    }
    return elements;
}

export function addBoundedElement(nodeElement, arrowElement) {
    if (nodeElement) {
        if (!nodeElement.boundElements) {
            nodeElement.boundElements = [];
        }
        nodeElement.boundElements.push({
            id: arrowElement.id,
            type: 'arrow',
        });
    } else {
        console.error("nodeElement is null or undefined. Cannot set boundElements.");
    }
}

