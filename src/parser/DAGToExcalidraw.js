import { TopologicalSorter } from './TopologicalSorter.js';
import { ArrowGenerator } from "./ArrowGenerator.js";
import { node } from 'globals';

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

    // Paramètres de placement pour les noeuds
    let baseX = 50;
    let baseY = 50;
    let horizontalSpacing = 80;
    let verticalSpacing = 100;

    //Coordonnées pour les sub-topologies
    let xtop = -Infinity;
    let ytop = -Infinity;
    let xbottom = Infinity;
    let ybottom = Infinity;

    //Coordonnées pour la topology
    let xtopTopology = -Infinity;
    let ytopTopology = -Infinity;
    let xbottomTopology = Infinity;
    let ybottomTopology = Infinity;

    //Variables utilisées actuellement lors du passage en boucle
    let currentX = baseX;
    let currentSub = null;
    let topologyNode = null
    // Placer les noeuds
    for (let distance of sortedDistances) {

        let nodesAtDistance = nodesByDistance.get(distance);

        // Pour centrer verticalement quand il y a plusieurs noeuds, cependant, petit changement dans le cas des noeud (Sub)Topology, que l'on ne compte pas
        let totalHeight = -1;
        for (let i = 0; i < nodesAtDistance.length; i++) {
            let current = nodesAtDistance[i];
            if ((current.getName() != 'Topology' && current.getName() != 'Sub-topology')) {
                totalHeight += 1;
            }
        }
        totalHeight = totalHeight * verticalSpacing;
        let startY = baseY - totalHeight / 2;
        let verticalOffset = 0
        let maxWidth = 0;
        for (let i = 0; i < nodesAtDistance.length; i++) {

            let current = nodesAtDistance[i];
            if (current.getName() == "Sub-topology") {
                if (currentSub == null) {
                    currentSub = current;
                }
                else {
                    currentSub.generateJson(xtop, ytop, xbottom, ybottom);
                    xtop = -Infinity;
                    ytop = -Infinity;
                    xbottom = Infinity;
                    ybottom = Infinity;
                    currentSub = current;
                }
                verticalOffset += 1
            }
            else if (current.getName() == "Topology") {
                topologyNode = current;
                verticalOffset += 1
            }
            else {
                let x = currentX;
                let y = startY + (i - (verticalOffset)) * verticalSpacing;
                //Maj des boundaries de la sub-topology
                current.generateJson(x, y);
                let point = current.getBottomRightCorner();

                //Maj coordonnées sub-topology
                if (current != null && (current.getName() != 'Topic Advanced' && current.getName() != 'State Store')) {
                    xtop = (xtop == -Infinity ? x-10 : Math.min(x - 10, xtop));
                    ytop = (ytop == -Infinity ? y-10 : Math.min(y - 10, ytop));
                    xbottom = (xbottom == Infinity ? x+10 : Math.max(point.x+10, xbottom));
                    ybottom = (ybottom == Infinity ? y+10 : Math.max(point.y+10, ybottom));
                }

                //Maj coordonéées topology
                if (current != null && (current.getName() != 'Topology' && current.getName() != 'Sub-topology')) {
                    xtopTopology = (xtopTopology == -Infinity ? x-30 : Math.min(x - 30, xtopTopology));
                    ytopTopology = (ytopTopology == -Infinity ? y-30 : Math.min(y - 30, ytopTopology));
                    xbottomTopology = (xbottomTopology == Infinity ? x+30 : Math.max(point.x+30, xbottomTopology));
                    ybottomTopology = (ybottomTopology == Infinity ? y+30 : Math.max(point.y+30, ybottomTopology));
                }
                maxWidth = Math.max(maxWidth, current.getElementsWidth());
            }
            current.setName();
        }
        currentX += maxWidth + horizontalSpacing;
    }

    currentSub.generateJson(xtop, ytop, xbottom, ybottom);
    topologyNode.generateJson(xtopTopology, ytopTopology, xbottomTopology, ybottomTopology);


    // Créer les flèches
    
    for (let node of result.sortedNodes) {
        if ((node.getName() == 'Topology' || node.getName() == 'Sub-topology')) {
            elements.push(...node.getJson());
        }
        
    }
    for (let node of result.sortedNodes) {
        if (node.getName() != 'Sub-topology' && node.getName() != "Topology") {
            for (let neighbor of node.getNeighbors()) {
                if (neighbor.getName() != "Sub-topology" && neighbor.getName() != "Topology") {
                    let arrowElement;
                    let arrowsPointsStart = node.getBoundaryPoints();
                    let arrowsPointsStop = neighbor.getBoundaryPoints();
                    if (node.isStateStore()) {
                        let start = arrowsPointsStart.bottomPoint; // Point de départ (middle right du rectangle)
                        let end = arrowsPointsStop.topPoint; // Point d'arrivée (middle left du rectangle)

                        arrowElement = ArrowGenerator.createArrowJsonWithBindings(start, end, node.getNodeIdForBottomMost(), neighbor.getNodeIdForTopMost(), true);
                        
                        // Ajouter la flèche aux boundElements des noeuds (state store Left // neighbor right ) 
                        addBoundedElement(node.getLeftContainerElement(), arrowElement);
                        addBoundedElement(neighbor.getRigthContainerElement(), arrowElement);
                    }
                    else {
                        let start = arrowsPointsStart.rightPoint; // Point de départ (middle right du rectangle)
                        let end = arrowsPointsStop.leftPoint; // Point d'arrivée (middle left du rectangle)

                        arrowElement = ArrowGenerator.createArrowJsonWithBindings(start, end, node.getNodeIdForLeftmost(), neighbor.getNodeIdForRightmost());
                        
                        // Ajouter la flèche aux boundElements des noeuds (right point of the current node / left point of neighbor )
                        addBoundedElement(node.getRigthContainerElement(), arrowElement);
                        addBoundedElement(neighbor.getLeftContainerElement(), arrowElement);
                        // Ajouter la flèche aux éléments
                    }
                    elements.push(arrowElement);
                }
            }
        }
    }
    for (let node of result.sortedNodes) {
        if ((node.getName() != 'Topology' && node.getName() != 'Sub-topology')) {
            elements.push(...node.getJson());
        }
        
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

