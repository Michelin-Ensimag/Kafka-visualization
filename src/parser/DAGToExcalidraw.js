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

    // Paramètres de placement
    let baseX = 50;
    let baseY = 50;
    let horizontalSpacing = 80;
    let verticalSpacing = 100;
    let xtop=-Infinity;
    let ytop=-Infinity;
    let xbottom=Infinity;
    let ybottom=Infinity;
    let xtopTopology=-Infinity;
    let ytopTopology=-Infinity;
    let xbottomTopology=Infinity;
    let ybottomTopology=Infinity;
    let currentX = baseX;
    let currentSub=null;
    let topologyNode=null
    // Placer les noeuds
    console.log("Début dessin");
    for (let distance of sortedDistances) {

        let nodesAtDistance = nodesByDistance.get(distance);

        // Pour centrer verticalement quand il y a plusieurs noeuds, cependant, petit changement dans le cas des noeud (Sub)Topology, que l'on ne compte pas
        let totalHeight=-1;
        for (let i=0;i< nodesAtDistance.length;i++){
            let current=nodesAtDistance[i];
            if ((current.getName()!='Topology'&&current.getName()!='Sub-topology')){
                totalHeight+=1;
            }
        }
        console.log(totalHeight,nodesAtDistance.length)
        totalHeight = totalHeight * verticalSpacing;
        let startY = baseY - totalHeight / 2;
        let verticalOffset=0
        let maxWidth = 0;
        for (let i = 0; i < nodesAtDistance.length; i++) {

            let current = nodesAtDistance[i];
            console.log(current.getName(),current.label);
            if(current.getName()=="Sub-topology"){
                if(currentSub==null){
                    currentSub=current;
                    console.log(currentSub.label, currentSub.getName());
                }
                else{
                    console.log(currentSub.label, currentSub.getName());
                    currentSub.generateJson(xtop,ytop,xbottom,ybottom);
                    elements.push(...currentSub.getJson());
                    console.log("Dessin ST", xtop, ytop, xbottom, ybottom);
                    xtop=-Infinity;
                    ytop=-Infinity;
                    xbottom=Infinity;
                    ybottom=Infinity;
                    currentSub=current;
                }
                verticalOffset+=1
            }
            else if (current.getName()=="Topology"){
                topologyNode=current;
                verticalOffset+=1
            }
            else{      
                let x = currentX;
                let y = startY + (i-(verticalOffset)) * verticalSpacing;
                //Maj des boundaries de la sub-topology
                current.generateJson(x, y);
                if(current!=null&&(current.getName()!='Topic Advanced'&&current.getName()!='State Store')){
                    xtop=(xtop==-Infinity ?  x: Math.min(x-10,xtop));
                    ytop=(ytop==-Infinity ?  y: Math.min(y-10,ytop));
                    xbottom=(xbottom==Infinity ?  x: Math.max(x+current.getJson()[0].width+20,xbottom));
                    ybottom=(ybottom==Infinity ?  y: Math.max(y+current.getJson()[0].height+20,ybottom));
                }

                if (current!=null&&(current.getName()!='Topology'&&current.getName()!='Sub-topology')){
                    xtopTopology=(xtopTopology==-Infinity ?  x: Math.min(x-50,xtopTopology));
                    ytopTopology=(ytopTopology==-Infinity ?  y: Math.min(y-50,ytopTopology));
                    xbottomTopology=(xbottomTopology==Infinity ?  x: Math.max(x+current.getJson()[0].width+60,xbottomTopology));
                    ybottomTopology=(ybottomTopology==Infinity ?  y: Math.max(y+current.getJson()[0].height+60,ybottomTopology));
                }
                console.log("Dessin pas une ST",x,y);
                console.log ("Nouvelles coordonnées", xtop, ytop, xbottom, ybottom);
                maxWidth = Math.max(maxWidth, current.getElementsWidth());}

        }
        currentX += maxWidth + horizontalSpacing;
    }
    // currentSub.generateJson(xtop,ytop,xtop+300,ytop+150);
    // elements.push(...currentSub.getJson());

    currentSub.generateJson(xtop,ytop,xbottom,ybottom);
    topologyNode.generateJson(xtopTopology, ytopTopology, xbottomTopology, ybottomTopology)
    elements.push(...currentSub.getJson());
    console.log("Dessin ST");

    // Créer les flèches
    for (let node of result.sortedNodes) {
        if (node.getName()!='Sub-topology'&&node.getName()!="Topology"){
            for (let neighbor of node.getNeighbors()) {
                if(neighbor.getName()!="Sub-topology"&&neighbor.getName()!="Topology"){ 
                    console.log("Fleche vers", neighbor.getName());// Créer une flèche entre les noeuds
                    let arrowsPointsStart = node.getBoundaryPoints();
                    let arrowsPointsStop = neighbor.getBoundaryPoints();
                    let start = arrowsPointsStart.rightPoint; // Point de départ (middle right du rectangle)
                    let end = arrowsPointsStop.leftPoint; // Point d'arrivée (middle left du rectangle)
                    
                    //console.log("test id")
                    //console.log(node.getNodeIdForArrow())
                    //console.log(neighbor.getNodeIdForArrow())
                    let arrowElement = ArrowGenerator.createArrowJsonWithBindings(start, end, node.getNodeIdForLeftmost(), neighbor.getNodeIdForRightmost());
        
                    // Ajouter la flèche aux boundElements des noeuds
                    // addBoundedElement(node.getContainerElement(), arrowElement);
                    // addBoundedElement(neighbor.getContainerElement(), arrowElement);
                    // Ajouter la flèche aux éléments
                    elements.push(arrowElement);}
            }
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

