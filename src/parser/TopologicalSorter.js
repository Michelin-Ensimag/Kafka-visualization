import {StateStore} from "../Node/ParentNode/StateStore.js";

class TopologicalSorter {
    static topologicalSort(graph) {
        // Track in-degree (number of incoming edges) for each node
        let inDegree = new Map();
        let queue = [];

        // Compute in-degrees
        // Initialize in-degree counts for all nodes
        for (const node of graph) {
            inDegree.set(node, 0);
        }

        // Calculate in-degrees by iterating through all nodes and their neighbors
        for (const node of graph) {
            for (const neighbor of node.getNeighbors()) {
                inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
            }
        }

        // Find all nodes with zero in-degree
        for (const [node, degree] of inDegree.entries()) {
            if (degree === 0) {
                queue.push(node);
            }
        }

        // Find nodes with zero in-degree to start
        // TopologicalSorter.findZeroInDegreeNodes(inDegree, queue);

        // Topological sorting and distance tracking
        let sortedNodes = [];
        let distances = new Map();

        // Initialize all distances to 0
        for (let node of inDegree.keys()) {
            distances.set(node, 0);
        }

        while (queue.length > 0) {
            let current = queue.shift();
            sortedNodes.push(current);

            // Process neighbors
            for (let neighbor of current.getNeighbors()) {
                // Update distance
                distances.set(neighbor,
                    Math.max(distances.get(neighbor),
                        distances.get(current) + 1)
                );

                // Decrement in-degree
                inDegree.set(neighbor, inDegree.get(neighbor) - 1);

                // If in-degree becomes zero, add to queue
                if (inDegree.get(neighbor) === 0) {
                    queue.push(neighbor);
                }
            }
        }

        // Check if all nodes were processed (no cycles)
        if (sortedNodes.length !== inDegree.size) {
            throw new Error("Graph contains a cycle");
        }

        //post process to have the StateStore node to be on top of the node it is attach and not at the beginning
        for (const node of graph) {
            if (node instanceof StateStore && inDegree.get(node) === 0) {
                // StateStore with no previous nodes should match its neighbor's distance
                const neighbors = node.getNeighbors();
                if (neighbors.length > 0) {
                    // Use the minimum distance of all neighbors
                    let minNeighborDistance = Infinity;
                    for (const neighbor of neighbors) {
                        minNeighborDistance = Math.min(minNeighborDistance, distances.get(neighbor));
                    }
                    distances.set(node, minNeighborDistance);
                }
            }
        }

        return { sortedNodes, distances };
    }

    // static computeInDegrees(startNode, inDegree) {
    //     let visited = new Set();
    //     let queue = [startNode];
    //
    //     while (queue.length > 0) {
    //         let current = queue.shift();
    //
    //         if (visited.has(current)) continue;
    //         visited.add(current);
    //
    //         // Initialize in-degree if not already set
    //         if (!inDegree.has(current)) {
    //             inDegree.set(current, 0);
    //         }
    //
    //         // Process neighbors
    //         for (let neighbor of current.getNeighbors()) {
    //             inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
    //
    //             if (!visited.has(neighbor)) {
    //                 queue.push(neighbor);
    //             }
    //         }
    //     }
    // }
    //
    // static findZeroInDegreeNodes(inDegree, queue) {
    //     for (let [node, degree] of inDegree.entries()) {
    //         if (degree === 0) {
    //             queue.push(node);
    //         }
    //     }
    // }
}
export { TopologicalSorter };
