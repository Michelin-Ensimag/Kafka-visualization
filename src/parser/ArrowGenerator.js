/**
 * Class to create an arrow and associate it with start and end nodes
 * This allows the arrow to stay connected to the nodes when they are moved manually in Excalidraw
 * Note: You also need to add code in the nodes to indicate they are connected to the arrow:
 * addBoundedElement() in DAGToExcalidraw
 */
export class ArrowGenerator {
    /**
     * Creates a basic arrow JSON object
     * @param {Object} start - Starting point with x and y properties
     * @param {Object} end - Ending point with x and y properties
     * @returns {Object} Arrow JSON object
     */
    static createArrowJson(start, end) {
        const arrow = {};

        arrow.type = "arrow";
        arrow.version = 2;
        arrow.versionNonce = Math.abs(crypto.randomUUID().split('-').join(''));
        arrow.isDeleted = false;
        arrow.id = crypto.randomUUID();
        arrow.fillStyle = "hachure";
        arrow.strokeWidth = 1;
        arrow.strokeStyle = "solid";
        arrow.roughness = 1;
        arrow.opacity = 100;
        arrow.angle = 0;
        arrow.x = start.x;
        arrow.y = start.y;
        arrow.strokeColor = "#000000";
        arrow.backgroundColor = "transparent";
        arrow.width = Math.abs(end.x - start.x);
        arrow.height = Math.abs(end.y - start.y);
        arrow.seed = Math.abs(crypto.randomUUID().split('-').join(''));
        arrow.groupIds = [];

        const roundness = {
            type: 2
        };
        arrow.roundness = roundness;

        arrow.boundElements = null;

        const points = [
            [0, 0],
            [end.x - start.x, end.y - start.y]
        ];
        arrow.points = points;

        return arrow;
    }

    /**
     * Creates an arrow JSON object with bindings to start and end elements
     * @param {Object} start - Starting point with x and y properties
     * @param {Object} end - Ending point with x and y properties
     * @param {string} idStart - ID of the start element
     * @param {string} idEnd - ID of the end element
     * @returns {Object} Arrow JSON object with bindings
     */
    static createArrowJsonWithBindings(start, end, idStart, idEnd) {
        const arrow = this.createArrowJson(start, end);

        const startBinding = {
            elementId: idStart,
            focus: 0,
            gap: 1,
        };

        const endBinding = {
            elementId: idEnd,
            focus: 0,
            gap: 6
        };

        arrow.startBinding = startBinding;
        arrow.endBinding = endBinding;

        return arrow;
    }
}