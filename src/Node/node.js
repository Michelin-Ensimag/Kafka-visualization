import { renderToString } from "react-dom/server";
import kstdlibJSON from "../assets/kafka-streams-topology-design.json"
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";

export class Node {

    constructor(label) {
        this.label = label;
        this.neighbors = new Set();
        this.json = {};
    }

    getName(){
        return "mapValues";
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

    //TODO changer de place le dictionnaire
    generateJson(x, y) {
        let dictionary = {};
        kstdlibJSON["libraryItems"].forEach(item => {
            dictionary[item["name"]] = item["elements"];
        });
        // console.log('generateJson not implemented for this Node', dictionary);
        for (let cle in dictionary) {
            for (let key in dictionary[cle]) {
                let elem = dictionary[cle][key]
                let elem_temp = convertToExcalidrawElements([elem])[0]
                if (elem["type"] === "text") {
                    elem["baseline"] = elem_temp["baseline"]
                }
            }
        }
        this.json =  this.updateElementIds( this.repositionElements(dictionary[this.getName()], x, y))
        return this.json

    }

    repositionElements(elements, newX, newY) {
        // Créer une copie profonde du tableau pour éviter de modifier l'original
        const newElements = JSON.parse(JSON.stringify(elements));

        // Si le mode est relatif, calculer le décalage à partir du premier élément
        let offsetX = 0;
        let offsetY = 0;

        if ( newElements.length > 0) {
            // Trouver les coordonnées minimales pour calculer le décalage
            const minX = Math.min(...newElements.map(elem => elem.x || 0));
            const minY = Math.min(...newElements.map(elem => elem.y || 0));

            offsetX = newX - minX;
            offsetY = newY - minY;
        }

        // Repositionner chaque élément
        for (let i = 0; i < newElements.length; i++) {
            const elem = newElements[i];

            if (elem.x !== undefined && elem.y !== undefined) {
                elem.x += offsetX;
                elem.y += offsetY;
            }
        }
        
        return newElements;
    }

    getBoundaryPoints() {
        if (!this.json || this.json.length === 0) {
            return { leftPoint: { x: 0, y: 0 }, rightPoint: { x: 0, y: 0 } };
        }

        // Initialize min/max values
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;

        // Iterate through this.json to find boundaries
        this.json.forEach((element) => {
            if (element.isDeleted) return; // Skip deleted elements

            const xLeft = element.x;
            const xRight = element.x + element.width;
            const yTop = element.y;
            const yBottom = element.y + element.height;

            // Update min/max X and Y
            minX = Math.min(minX, xLeft);
            maxX = Math.max(maxX, xRight);
            minY = Math.min(minY, yTop);
            maxY = Math.max(maxY, yBottom);
        });
        // Calculate middle Y-coordinate
        const middleY = minY + (maxY - minY) / 2;

        // Return the two points
        return {
            leftPoint: { x: minX, y: middleY },
            rightPoint: { x: maxX, y: middleY }
        };
    }


    updateElementIds(elements) {
        if (!elements || elements.length === 0) return elements;

        // Map to track old IDs to new IDs
        const idMap = new Map();

        // Function to generate a new unique ID
        const generateNewId = () => {
            return 'id_' + Math.random().toString(36).substr(2, 9); // Simple random ID
        };

        // First pass: Assign new IDs to each element and build the mapping
        elements.forEach((element) => {
            if (element.id && !idMap.has(element.id)) {
                idMap.set(element.id, generateNewId());
            }
        });

        // Deep clone the elements to avoid mutating the original array
        const updatedElements = JSON.parse(JSON.stringify(elements));

        // Second pass: Update all ID references
        updatedElements.forEach((element) => {
            // Update the element's own ID
            if (element.id && idMap.has(element.id)) {
                element.id = idMap.get(element.id);
            }

            // Update references in groupIds
            if (element.groupIds && Array.isArray(element.groupIds)) {
                element.groupIds = element.groupIds.map((groupId) =>
                    idMap.has(groupId) ? idMap.get(groupId) : groupId
                );
            }

            // Update references in boundElements
            if (element.boundElements && Array.isArray(element.boundElements)) {
                element.boundElements = element.boundElements.map((bound) => {
                    if (bound.id && idMap.has(bound.id)) {
                        return { ...bound, id: idMap.get(bound.id) };
                    }
                    return bound;
                });
            }

            // Update containerId if it exists
            if (element.containerId && idMap.has(element.containerId)) {
                element.containerId = idMap.get(element.containerId);
            }

            // Update frameId if it exists
            if (element.frameId && idMap.has(element.frameId)) {
                element.frameId = idMap.get(element.frameId);
            }
        });

        return updatedElements;
    }
}

export class KStreamSourceNode extends Node {
    constructor(label) {
        super(label);
    }

    getName(){
        return "KStream"
    }
}