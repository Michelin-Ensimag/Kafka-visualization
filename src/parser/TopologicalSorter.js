import { StateStore } from "../Node/ParentNode/StateStore.js";

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

        // Get the number of nodes per subtopology number
        let subtopologyCount = new Map();
        for (const node of graph) {
                const subtopology = node.getTopology();
                if (!subtopologyCount.has(subtopology)) {
                    subtopologyCount.set(subtopology, 0);
                }
                subtopologyCount.set(subtopology, subtopologyCount.get(subtopology) + 1);
        }

        // initialize a map of nodes to their subtopology numbers that are waiting to be treated
        let nodesToProcess = new Map();
        for (const node of graph) {
                const subtopology = node.getTopology();
                if (!nodesToProcess.has(subtopology)) {
                    nodesToProcess.set(subtopology, []);
                }
        }
        
        // Find all nodes with zero in-degree
        let lowestSubtopology = Math.min(...Array.from(inDegree.keys()).map(node => node.getTopology()));
        console.log("lowestSubtopology", lowestSubtopology);
        for (const [node, degree] of inDegree.entries()) {
            console.log(degree, node.getTopology(), node.getName());
            if (degree === 0 && node.getTopology() === lowestSubtopology) {
                queue.push(node);
            }
            else if (degree === 0) {
                // add the node to the nodesToProcess map
                if (nodesToProcess.has(node.getTopology())) {
                    nodesToProcess.get(node.getTopology()).push(node);
                }
            }
        }

        // Topological sorting and distance tracking
        let sortedNodes = [];
        let distances = new Map();

        // Initialize all distances to 0
        for (let node of inDegree.keys()) {
            distances.set(node, 0);
        }

        let previousSubtopologyMax = 0;

        while (queue.length > 0) {
            let current = queue.shift();
            //decrease the number of nodes to process for the subtopology
            subtopologyCount.set(current.getTopology(), subtopologyCount.get(current.getTopology()) - 1);

            sortedNodes.push(current);
            distances.set(current, Math.max(distances.get(current), previousSubtopologyMax+1));
            // Process neighbors
            for (let neighbor of current.getNeighbors()) {
                // Update distance
                const max = Math.max(distances.get(neighbor), distances.get(current) + 1, previousSubtopologyMax+1);
                console.log("max", max);
                distances.set(neighbor, max);

                // Decrement in-degree
                inDegree.set(neighbor, inDegree.get(neighbor) - 1);

                // If in-degree becomes zero, add to queue
                if (inDegree.get(neighbor) === 0) {
                    // push only if the same topology
                    if (neighbor.getTopology() === current.getTopology()) {
                        queue.push(neighbor);
                    }
                    else{
                        // add the node to the nodesToProcess map
                        if (nodesToProcess.has(neighbor.getTopology())) {
                            nodesToProcess.get(neighbor.getTopology()).push(neighbor);
                        }
                    }
                }
            }
            console.log("subtopologyCount", subtopologyCount);
            //if all the nodes of a current subtopology are processed, we can process the nodes of the next subtopology
            if (subtopologyCount.get(current.getTopology()) === 0 && nodesToProcess.has(current.getTopology()+1)) {
                // process the nodes of the next subtopology (suppose que la topologie suivante est a l'index +1)
                previousSubtopologyMax = distances.get(current);
                console.log("previousSubtopologyMax", previousSubtopologyMax);
                for (const node of nodesToProcess.get(current.getTopology()+1)) {
                    queue.push(node);
                }
                // clear the nodes to process for the current subtopology
                nodesToProcess.set(current.getTopology()+1, []);
            }
            // si la queue est vide et qu'il y a des noeuds a traiter, on les ajoute a la queue
            if (queue.length === 0 && nodesToProcess.has(current.getTopology())) {
            }
            if (queue.length === 0 && nodesToProcess.has(current.getTopology()+1)) {
                console.log("queue.length === 0 && nodesToProcess.has(current.getTopology()+1)");
                for (const node of nodesToProcess.get(current.getTopology()+1)) {
                    queue.push(node);
                }
                nodesToProcess.set(current.getTopology()+1, []);
            }
        }
        //find the node that havent been processed
        for(let node of graph){
            if(!sortedNodes.includes(node)){
                console.log("node not processed", node.getName(),node);
            }
        }

        // Check if all nodes were processed (no cycles)
        // if (sortedNodes.length !== inDegree.size) {
        //     throw new Error("Graph contains a cycle");
        // }
        console.log("sortedNodes.length", sortedNodes.length, "inDegree.size", inDegree.size);
        
        

        // Post-process StateStore nodes
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
}

export { TopologicalSorter };