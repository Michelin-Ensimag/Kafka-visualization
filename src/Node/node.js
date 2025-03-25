import { renderToString } from "react-dom/server";
import kstdlibJSON from "../assets/kafka-streams-topology-design.json"
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import {v4 as uuidv4} from 'uuid';

export class Node {

    constructor(label) {
        this.label = label;
        this.neighbors = new Set();
        this.json = {};
        this.containerElement = {}
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

    //TODO changer de place le dictionnaire
    generateJson(x, y) {
        let dictionary = {};
        kstdlibJSON["libraryItems"].forEach(item => {
            dictionary[item["name"]] = item["elements"];
        });
        dictionary["Default"] = [{
          "type": "ellipse",
          "version": 3742,
          "versionNonce": 1784336503,
          "isDeleted": false,
          "id": "sGH3CUZ3-g2AApfZCECcc",
          "fillStyle": "solid",
          "strokeWidth": 2,
          "strokeStyle": "solid",
          "roughness": 1,
          "opacity": 100,
          "angle": 0,
          "x": 399.6456402227618,
          "y": 355.64564022276187,
          "strokeColor": "#1e1e1e",
          "backgroundColor": "#ffffff",
          "width": 60.70871955447628,
          "height": 60.70871955447628,
          "seed": 1963978199,
          "groupIds": [
            "EYiaaF4ELMNOYkgcaEjz5"
          ],
          "frameId": null,
          "roundness": {
            "type": 2
          },
          "boundElements": [],
          "updated": 1742906993920,
          "link": null,
          "locked": false
        },
        {
          "type": "text",
          "version": 2870,
          "versionNonce": 433182329,
          "isDeleted": false,
          "id": "r03udux5ypjjwUfcRrqdg",
          "fillStyle": "solid",
          "strokeWidth": 1,
          "strokeStyle": "dotted",
          "roughness": 1,
          "opacity": 100,
          "angle": 0,
          "x": 415.96395204110604,
          "y": 374.4369831458885,
          "strokeColor": "#1e1e1e",
          "backgroundColor": "transparent",
          "width": 27.950000762939453,
          "height": 25,
          "seed": 715266807,
          "groupIds": [
            "EYiaaF4ELMNOYkgcaEjz5"
          ],
          "frameId": null,
          "roundness": null,
          "boundElements": [],
          "updated": 1742906993920,
          "link": null,
          "locked": false,
          "fontSize": 20,
          "fontFamily": 1,
          "text": "???",
          "textAlign": "center",
          "verticalAlign": "top",
          "containerId": null,
          "originalText": "???",
          "lineHeight": 1.25,
          "baseline": 18
        },
        {
          "id": "mxR1pOHSOhqILYk4-_Xv6",
          "type": "text",
          "x": 392,
          "y": 423,
          "width": 77.51667022705078,
          "height": 25,
          "angle": 0,
          "strokeColor": "#1e1e1e",
          "backgroundColor": "transparent",
          "fillStyle": "solid",
          "strokeWidth": 2,
          "strokeStyle": "solid",
          "roughness": 1,
          "opacity": 100,
          "groupIds": [
            "EYiaaF4ELMNOYkgcaEjz5"
          ],
          "frameId": null,
          "roundness": null,
          "seed": 239501497,
          "version": 106,
          "versionNonce": 95922583,
          "isDeleted": false,
          "boundElements": null,
          "updated": 1742906993920,
          "link": null,
          "locked": false,
          "text": "Default ",
          "fontSize": 20,
          "fontFamily": 1,
          "textAlign": "left",
          "verticalAlign": "top",
          "baseline": 18,
          "containerId": null,
          "originalText": "Default ",
          "lineHeight": 1.25
        }]
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

    getNodeIdForArrow() {
        // Assuming `this.json` contains the array of elements (like in the structure you shared)
        let elem = this.json;
    
        // Filter the elements to find only ellipses or rectangles
        let shapes = elem.filter(e => e.type === 'ellipse' || e.type === 'rect'); // Adjust 'rect' if needed
    
        if (shapes.length === 0) {
            this.containerElement = null; // If no ellipses or rectangles are found, set containerElement to null
            return null;
        }
    
        // Find the shape with the largest area (width * height)
        let largestShape = shapes.reduce((maxShape, currentShape) => {
            let maxArea = maxShape.width * maxShape.height;
            let currentArea = currentShape.width * currentShape.height;
    
            // Compare areas and return the one with the larger area
            return currentArea > maxArea ? currentShape : maxShape;
        });
    
        // Set this.containerElement to the largest shape element
        this.containerElement = largestShape;
    
        // Return the ID of the largest shape
        return largestShape.id;
    }
    

    getContainerElement(){
        return this.containerElement
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
        console.log(this.label, this.json)
        return this.json;
    }
}