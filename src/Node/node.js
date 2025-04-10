import { renderToString } from "react-dom/server";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import { generateDictionary } from "@/parser/dictionary";
import {v4 as uuidv4} from 'uuid';

export class Node {

    constructor(label, node = false) {
        this.label = label;
        this.neighbors = new Set();
        this.json = {};
        this.leftContainerElement = {}
        this.rightContainerElement = {}
        this.isFullNode =node;
    }

    isStateStore(){
        return false;
    }
    
    getName(){
        return "Default";
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
        let dictionary = generateDictionary();
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
            if (element.isDeleted || element.type==="text") return; // Skip deleted elements

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
            // Check if the element itself has an ID, and assign a new one if not already done
            if (element.id && !idMap.has(element.id)) {
                idMap.set(element.id, generateNewId());
            }
    
            // Check if the groupIds exist and update them with new IDs if necessary
            if (element.groupIds && Array.isArray(element.groupIds)) {
                element.groupIds.forEach((groupId) => {
                    if (groupId && !idMap.has(groupId)) {
                        idMap.set(groupId, generateNewId());
                    }
                });
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
    

    getElementsWidth() {
        let elements = this.json
        if (!elements || elements.length === 0) return 0;

        // Initialize min and max X values
        let minX = Infinity;
        let maxX = -Infinity;

        // Iterate through elements to find the horizontal span
        elements.forEach((element) => {
            if (element.isDeleted) return; // Skip deleted elements

            const xLeft = element.x;
            const xRight = element.x + element.width;

            // Update min and max X
            minX = Math.min(minX, xLeft);
            maxX = Math.max(maxX, xRight);
        });

        // If no valid elements were found, return 0
        if (minX === Infinity || maxX === -Infinity) return 0;

        // Calculate and return the total width
        return maxX - minX;
    }

    getNodeIdForLeftmost() {
        // Assuming `this.json` contains the array of elements
        let elem = this.json;
    
        // Filter the elements to find only ellipses or rectangles
        let shapes = elem.filter(e => e.type === 'ellipse' || e.type === 'rectangle'); // Adjust 'rect' if needed
    
        if (shapes.length === 0) {
            this.rightContainerElement = null; // If no shapes are found, set containerElement to null
            return null;
        }
    
        // Find the shape with the leftmost point (smallest x coordinate)
        let leftmostShape = shapes.reduce((leftShape, currentShape) => {
            // Compare the leftmost point of each shape (x position)
            return currentShape.x < leftShape.x ? currentShape : leftShape;
        });
    
        // Set this.containerElement to the leftmost shape element
        this.rightContainerElement = leftmostShape;
    
        // Return the ID of the leftmost shape
        return leftmostShape.id;
    }

    getNodeIdForRightmost() {
        // Assuming `this.json` contains the array of elements
        let elem = this.json;
    
        // Filter the elements to find only ellipses or rectangles
        let shapes = elem.filter(e => e.type === 'ellipse' || e.type === 'rectangle'); // Adjust 'rect' if needed
    
        if (shapes.length === 0) {
            this.leftContainerElement = null; // If no shapes are found, set containerElement to null
            return null;
        }
    
        // Find the shape with the rightmost point (largest x + width)
        let rightmostShape = shapes.reduce((rightShape, currentShape) => {
            // Compare the rightmost point of each shape (x + width)
            return (currentShape.x + currentShape.width) > (rightShape.x + rightShape.width) ? currentShape : rightShape;
        });
    
        // Set this.containerElement to the rightmost shape element
        this.leftContainerElement = rightmostShape;
    
        // Return the ID of the rightmost shape
        return rightmostShape.id;
    }

    getContainerElement(){
        return this.containerElement
    }

    getRigthContainerElement(){
        return this.rightContainerElement
    }

    getLeftContainerElement(){
        return this.leftContainerElement
    }

    setName(){
        if(!this.isFullNode) return;
        for (let i = 0; i < this.json.length; i++) {
            let elem = this.json[i];
            //console.log(elem,elem.type)
            if (elem.type === "text" &&( elem.originalText == "Default" || elem.text == "Default")) {
                elem.text = this.label;
                elem.originalText = this.label;
                elem.width = elem.originalText.length*8;
            }
        }
    }
}

export class KStreamSourceNode extends Node {
    constructor(label) {
        super(label);
    }

    getName(){
        return "KStream"
    }

    generateJson(x, y) {
        super.generateJson(x, y);
        return this.json;
    }
}